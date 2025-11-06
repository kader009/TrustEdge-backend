import express from 'express';
import { reviewController } from './review.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';

const router = express.Router();

// Public routes
router.get('/', reviewController.getAllReviews);

router.get(
  '/:id',
  validateRequest(ReviewValidation.getSingleReviewSchema),
  reviewController.getSingleReview
);

// Search & Filter routes (public)
router.get(
  '/search/reviews',
  validateRequest(ReviewValidation.searchReviewsSchema),
  reviewController.searchReviews
);

router.get('/premium/all', reviewController.getPremiumReviews);

router.get(
  '/preview/:id',
  validateRequest(ReviewValidation.getSingleReviewSchema),
  reviewController.getReviewPreview
);

// Protected routes (user + admin)
router.post(
  '/',
  authMiddleware(['user', 'admin']),
  validateRequest(ReviewValidation.createReviewSchema),
  reviewController.createReview
);

router.patch(
  '/:id',
  authMiddleware(['user', 'admin']),
  validateRequest(ReviewValidation.updateReviewSchema),
  reviewController.updateReview
);

router.delete(
  '/:id',
  authMiddleware(['user', 'admin']),
  validateRequest(ReviewValidation.deleteReviewSchema),
  reviewController.deleteReview
);

// Admin moderation routes
router.get(
  '/admin/pending',
  authMiddleware(['admin']),
  reviewController.getPendingReviews
);

router.get(
  '/admin/status/:status',
  authMiddleware(['admin']),
  reviewController.getReviewsByStatus
);

router.patch(
  '/admin/approve/:id',
  authMiddleware(['admin']),
  validateRequest(ReviewValidation.approveReviewSchema),
  reviewController.approveReview
);

router.patch(
  '/admin/unpublish/:id',
  authMiddleware(['admin']),
  validateRequest(ReviewValidation.unpublishReviewSchema),
  reviewController.unpublishReview
);

// Admin utility routes
router.post(
  '/admin/recalculate-all',
  authMiddleware(['admin']),
  reviewController.recalculateAllRatings
);

router.post(
  '/admin/recalculate/:productId',
  authMiddleware(['admin']),
  reviewController.recalculateProductRating
);

export const reviewRoutes = router;
