import { Review } from './review.model';
import { Product } from '../products/product.model';
import { Types } from 'mongoose';

/**
 * Recalculate and update ratings for a specific product
 */
export const updateProductRating = async (
  productId: string | Types.ObjectId
) => {
  const id =
    typeof productId === 'string' ? new Types.ObjectId(productId) : productId;

  const stats = await Review.aggregate([
    { $match: { product: id } },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      numReviews: stats[0].numReviews,
      ratings: Math.round(stats[0].avgRating * 10) / 10,
    });

    return {
      productId,
      numReviews: stats[0].numReviews,
      ratings: Math.round(stats[0].avgRating * 10) / 10,
    };
  } else {
    // No reviews, set to 0
    await Product.findByIdAndUpdate(productId, {
      numReviews: 0,
      ratings: 0,
    });

    return {
      productId,
      numReviews: 0,
      ratings: 0,
    };
  }
};

/**
 * Recalculate ratings for all products
 */
export const recalculateAllProductRatings = async () => {
  const products = await Product.find({});
  const results = [];

  for (const product of products) {
    const result = await updateProductRating(product._id);
    results.push(result);
  }

  return results;
};
