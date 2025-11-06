import express from 'express';
import { reviewController } from './review.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getSingleReview);

// Protected routes (user + admin)
router.post(
  '/',
  authMiddleware(['user', 'admin']),
  reviewController.createReview
);

router.patch(
  '/:id',
  authMiddleware(['user', 'admin']),
  reviewController.updateReview
);

router.delete(
  '/:id',
  authMiddleware(['user', 'admin']),
  reviewController.deleteReview
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
