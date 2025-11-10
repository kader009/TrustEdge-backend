import { Router } from 'express';
import { voteController } from './vote.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { VoteValidation } from './vote.validation';

const router = Router();

// Upvote a review
router.post(
  '/upvote/:reviewId',
  authMiddleware(['user', 'admin']),
  validateRequest(VoteValidation.voteReviewSchema),
  voteController.upvoteReview
);

// Downvote a review
router.post(
  '/downvote/:reviewId',
  authMiddleware(['user', 'admin']),
  validateRequest(VoteValidation.voteReviewSchema),
  voteController.downvoteReview
);

// Remove vote from a review (unvote)
router.delete(
  '/remove/:reviewId',
  authMiddleware(['user', 'admin']),
  validateRequest(VoteValidation.removeVoteSchema),
  voteController.removeVote
);

// Get vote counts for a review (public - no auth needed)
router.get(
  '/counts/:reviewId',
  validateRequest(VoteValidation.getVoteCountsSchema),
  voteController.getVoteCounts
);

// Get current user's vote on a specific review
router.get(
  '/my-vote/:reviewId',
  authMiddleware(['user', 'admin']),
  validateRequest(VoteValidation.getUserVoteSchema),
  voteController.getUserVote
);

// Get all votes for a review with user details (public - no auth needed)
router.get(
  '/review/:reviewId',
  validateRequest(VoteValidation.getReviewVotesSchema),
  voteController.getReviewVotes
);

export const voteRoutes = router;
