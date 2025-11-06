import { Review } from './review.model';
import { IReview } from './review.interface';
import { Product } from '../products/product.model';
import { Types } from 'mongoose';

const createReview = async (payload: IReview) => {
  // Check if user already reviewed this product
  const existing = await Review.findOne({
    product: payload.product,
    user: payload.user,
  });

  if (existing) {
    throw new Error('You have already reviewed this product.');
  }

  const review = await Review.create(payload);

  // Update Product rating after save
  const productId =
    typeof payload.product === 'string'
      ? new Types.ObjectId(payload.product)
      : payload.product;

  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(payload.product, {
      numReviews: stats[0].numReviews,
      ratings: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal
    });
  }

  return review;
};

const getAllReviews = async (productId?: string) => {
  const filter = productId ? { product: productId } : {};
  return await Review.find(filter)
    .populate('user', 'name email')
    .populate('product', 'title slug price');
};

const getSingleReview = async (id: string) => {
  return await Review.findById(id)
    .populate('user', 'name email')
    .populate('product', 'title slug price');
};

const updateReview = async (
  id: string,
  userId: string,
  payload: Partial<IReview>
) => {
  const review = await Review.findById(id);
  if (!review) throw new Error('Review not found.');
  if (review.user.toString() !== userId) throw new Error('Unauthorized.');

  const updated = await Review.findByIdAndUpdate(id, payload, { new: true });

  // Recalculate product rating
  const productId =
    typeof review.product === 'string'
      ? new Types.ObjectId(review.product)
      : review.product;

  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Product.findByIdAndUpdate(review.product, {
    numReviews: stats[0]?.numReviews || 0,
    ratings: stats[0]?.avgRating ? Math.round(stats[0].avgRating * 10) / 10 : 0,
  });

  return updated;
};

const deleteReview = async (id: string, userId: string, isAdmin = false) => {
  const review = await Review.findById(id);
  if (!review) throw new Error('Review not found.');

  if (!isAdmin && review.user.toString() !== userId)
    throw new Error('Unauthorized.');

  await Review.findByIdAndDelete(id);

  // Update product stats
  const productId =
    typeof review.product === 'string'
      ? new Types.ObjectId(review.product)
      : review.product;

  const stats = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Product.findByIdAndUpdate(review.product, {
    numReviews: stats[0]?.numReviews || 0,
    ratings: stats[0]?.avgRating ? Math.round(stats[0].avgRating * 10) / 10 : 0,
  });

  return { message: 'Review deleted successfully.' };
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
