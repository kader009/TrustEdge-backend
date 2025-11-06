import { Router } from 'express';
import { voteController } from './vote.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// All voting routes require authentication
// Users must be logged in to vote

// Upvote a review
router.post(
  '/upvote/:reviewId',
  authMiddleware(['user', 'admin']),
  voteController.upvoteReview
);

// Downvote a review
router.post(
  '/downvote/:reviewId',
  authMiddleware(['user', 'admin']),
  voteController.downvoteReview
);

// Remove vote from a review (unvote)
router.delete(
  '/remove/:reviewId',
  authMiddleware(['user', 'admin']),
  voteController.removeVote
);

// Get vote counts for a review (public - no auth needed)
router.get('/counts/:reviewId', voteController.getVoteCounts);

// Get current user's vote on a specific review
router.get(
  '/my-vote/:reviewId',
  authMiddleware(['user', 'admin']),
  voteController.getUserVote
);

// Get all votes for a review with user details (public - no auth needed)
router.get('/review/:reviewId', voteController.getReviewVotes);

export const voteRoutes = router;
