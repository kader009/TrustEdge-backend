import { Review } from './review.model';
import { IReview } from './review.interface';
import { Payment } from '../payment/payment.model';

const createReview = async (payload: IReview) => {
  const review = await Review.create(payload);
  return review;
};

const getAllReviews = async (category?: string) => {
  const filter = category
    ? { category, status: 'published' }
    : { status: 'published' };

  return await Review.find(filter)
    .populate('user', 'name email image')
    .sort({ createdAt: -1 });
};

const getSingleReview = async (id: string, userId?: string) => {
  const review = await Review.findById(id).populate('user', 'name email image');

  if (!review) {
    throw new Error('Review not found');
  }

  // If review is premium, check if user has paid
  if (review.isPremium) {
    // If no userId, or if user hasn't paid, return preview
    let hasAccess = false;

    if (userId) {
      const payment = await Payment.findOne({
        user: userId,
        review: id,
        status: 'paid',
      });
      if (payment) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return {
        ...review.toObject(),
        description: review.description.substring(0, 100) + '...',
        isPreview: true,
      };
    }
  }

  return review;
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
  return updated;
};

const deleteReview = async (id: string, userId: string, isAdmin = false) => {
  const review = await Review.findById(id);
  if (!review) throw new Error('Review not found.');

  if (!isAdmin && review.user.toString() !== userId)
    throw new Error('Unauthorized.');

  await Review.findByIdAndDelete(id);

  return { message: 'Review deleted successfully.' };
};

// ==================== ADMIN MODERATION ====================

// Get pending reviews (awaiting approval)
const getPendingReviews = async () => {
  return await Review.find({ status: 'pending' })
    .populate('user', 'name email image')
    .sort({ createdAt: -1 });
};

// Approve a review (pending → published)
const approveReview = async (id: string) => {
  const updated = await Review.findByIdAndUpdate(
    id,
    { status: 'published', moderationReason: undefined },
    { new: true }
  );

  if (!updated) {
    throw new Error('Review not found');
  }

  return updated.populate('user', 'name email');
};

// Unpublish a review (published → unpublished)
const unpublishReview = async (id: string, reason: string) => {
  if (!reason || reason.trim().length === 0) {
    throw new Error('Moderation reason is required');
  }

  const updated = await Review.findByIdAndUpdate(
    id,
    { status: 'unpublished', moderationReason: reason },
    { new: true }
  );

  if (!updated) {
    throw new Error('Review not found');
  }

  return updated.populate('user', 'name email');
};

// Get reviews by status
const getReviewsByStatus = async (status: string) => {
  return await Review.find({ status })
    .populate('user', 'name email image')
    .sort({ createdAt: -1 });
};

// ==================== SEARCH & FILTER ====================

interface SearchFilterOptions {
  keyword?: string;
  category?: string;
  rating?: number;
  status?: 'pending' | 'published' | 'unpublished';
  isPremium?: boolean;
  sort?: 'date' | 'rating' | 'votes';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

const searchAndFilterReviews = async (options: SearchFilterOptions) => {
  const {
    keyword,
    category,
    rating,
    status = 'published', // Default: only show published reviews
    isPremium,
    sort = 'date',
    order = 'desc',
    page = 1,
    limit = 10,
  } = options;

  // Build filter query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: any = { status };

  // Text search
  if (keyword) {
    filter.$text = { $search: keyword };
  }

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Filter by rating
  if (rating) {
    filter.rating = rating;
  }

  // Filter by premium status
  if (isPremium !== undefined) {
    filter.isPremium = isPremium;
  }

  // Build sort object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortObj: any = {};
  switch (sort) {
    case 'date':
      sortObj.createdAt = order === 'asc' ? 1 : -1;
      break;
    case 'rating':
      sortObj.rating = order === 'asc' ? 1 : -1;
      break;
    case 'votes':
      // Sort by net votes (upvotes - downvotes)
      sortObj.upvoteCount = order === 'asc' ? 1 : -1;
      break;
    default:
      sortObj.createdAt = -1;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get reviews with population
  const reviews = await Review.find(filter)
    .populate('user', 'name email image')
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const total = await Review.countDocuments(filter);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get premium reviews only
const getPremiumReviews = async () => {
  return await Review.find({ isPremium: true, status: 'published' })
    .populate('user', 'name email image')
    .sort({ createdAt: -1 });
};

// Get review preview (for premium reviews - first 100 chars)
const getReviewPreview = async (reviewId: string) => {
  const review = await Review.findById(reviewId).populate(
    'user',
    'name email image'
  );

  if (!review) {
    throw new Error('Review not found');
  }

  if (!review.isPremium) {
    // If not premium, return full review
  return review;
  }

  // Return preview only (first 100 characters)
  return {
    ...review.toObject(),
    description: review.description.substring(0, 100) + '...',
    isPreview: true,
  };
};

export const ReviewService = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,

  // Admin Moderation
  getPendingReviews,
  approveReview,
  unpublishReview,
  getReviewsByStatus,

  // Search & Filter
  searchAndFilterReviews,
  getPremiumReviews,
  getReviewPreview,
};
