import { Request, Response } from 'express';
import { VoteService } from './vote.service';
import { sendErrorResponse } from '../../../utils/sendErrorResponse';

export const voteController = {
  // Upvote a review
  async upvoteReview(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { reviewId } = req.params;
      const result = await VoteService.upvoteReview(reviewId, userId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.vote,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Downvote a review
  async downvoteReview(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { reviewId } = req.params;
      const result = await VoteService.downvoteReview(reviewId, userId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.vote,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Remove vote from a review
  async removeVote(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { reviewId } = req.params;
      const result = await VoteService.removeVote(reviewId, userId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Get vote counts for a review
  async getVoteCounts(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const result = await VoteService.getVoteCounts(reviewId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Get user's vote on a specific review (to show which button is active)
  async getUserVote(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { reviewId } = req.params;
      const vote = await VoteService.getUserVote(reviewId, userId);

      res.status(200).json({
        success: true,
        data: vote,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Get all votes for a review with user details
  async getReviewVotes(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const votes = await VoteService.getReviewVotes(reviewId);

      res.status(200).json({
        success: true,
        data: votes,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },
};
