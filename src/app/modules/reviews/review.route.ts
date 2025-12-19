import express from 'express';
import { reviewController } from './review.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';

const router = express.Router();

// Public routes
router.get('/', reviewController.getAllReviews);
router.get('/search', reviewController.searchReviews);
router.get('/premium', reviewController.getPremiumReviews);
router.get('/preview/:id', reviewController.getReviewPreview);
router.get('/:id', reviewController.getSingleReview);

// Protected routes (User & Admin)
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
  reviewController.deleteReview
);

// Admin only routes
router.get(
  '/admin/pending',
  authMiddleware(['admin']),
  reviewController.getPendingReviews
);

router.patch(
  '/admin/approve/:id',
  authMiddleware(['admin']),
  reviewController.approveReview
);

router.patch(
  '/admin/unpublish/:id',
  authMiddleware(['admin']),
  validateRequest(ReviewValidation.unpublishReviewSchema),
  reviewController.unpublishReview
);

router.get(
  '/admin/status/:status',
  authMiddleware(['admin']),
  reviewController.getReviewsByStatus
);

export const reviewRoutes = router;
