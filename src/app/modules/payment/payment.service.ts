// @ts-ignore
import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../config';
import { Payment } from './payment.model';
import { Review } from '../reviews/review.model';
import { User } from '../user/user.model';
import { IPayment } from './payment.interface';

const initPayment = async (userId: string, reviewId: string) => {
  const user = await User.findById(userId);
  const review = await Review.findById(reviewId);

  if (!user || !review) {
    throw new Error('User or Review not found');
  }

  if (!review.isPremium || !review.price) {
    throw new Error('This review is not a premium review or has no price set');
  }

  const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const paymentData = {
    total_amount: review.price,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${config.backend_base_url}/payment/success?transactionId=${transactionId}`,
    fail_url: `${config.backend_base_url}/payment/fail?transactionId=${transactionId}`,
    cancel_url: `${config.backend_base_url}/payment/cancel?transactionId=${transactionId}`,
    ipn_url: `${config.backend_base_url}/payment/ipn`,
    shipping_method: 'No',
    product_name: review.title,
    product_category: review.category,
    product_profile: 'general',
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    ship_name: user.name,
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: '1000',
    ship_country: 'Bangladesh',
  };

  const sslcz = new SSLCommerzPayment(
    config.store_id,
    config.store_password,
    config.is_live
  );

  const apiResponse = await sslcz.init(paymentData);

  if (apiResponse?.GatewayPageURL) {
    // Create a pending payment record
    await Payment.create({
      transactionId,
      user: userId,
      review: reviewId,
      amount: review.price,
      status: 'pending',
    });

    return apiResponse.GatewayPageURL;
  } else {
    throw new Error('Failed to initialize payment with SSLCommerz');
  }
};

const handleSuccess = async (transactionId: string, gatewayData: any) => {
  const payment = await Payment.findOne({ transactionId });

  if (!payment) {
    throw new Error('Payment record not found');
  }

  payment.status = 'paid';
  payment.paymentGatewayData = gatewayData;
  await payment.save();

  return `${config.client_base_url}/payment/success?transactionId=${transactionId}`;
};

const handleFail = async (transactionId: string) => {
  await Payment.findOneAndUpdate({ transactionId }, { status: 'failed' });
  return `${config.client_base_url}/payment/failed?transactionId=${transactionId}`;
};

const handleCancel = async (transactionId: string) => {
  await Payment.findOneAndUpdate({ transactionId }, { status: 'cancelled' });
  return `${config.client_base_url}/payment/cancel?transactionId=${transactionId}`;
};

const getPaymentHistory = async (userId: string) => {
  return await Payment.find({ user: userId })
    .populate('review', 'title category price images')
    .sort({ createdAt: -1 });
};

const getAdminAnalytics = async () => {
  const totalEarnings = await Payment.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const popularReviews = await Payment.aggregate([
    { $match: { status: 'paid' } },
    {
      $group: {
        _id: '$review',
        count: { $sum: 1 },
        totalEarned: { $sum: '$amount' },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: '_id',
        as: 'reviewDetails',
      },
    },
    { $unwind: '$reviewDetails' },
  ]);

  return {
    totalEarnings: totalEarnings[0]?.total || 0,
    popularReviews,
  };
};

export const PaymentService = {
  initPayment,
  handleSuccess,
  handleFail,
  handleCancel,
  getPaymentHistory,
  getAdminAnalytics,
};
