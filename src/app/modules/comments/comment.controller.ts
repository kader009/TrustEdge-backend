import { Request, Response } from 'express';
import { CommentService } from './comment.service';
import { sendErrorResponse } from '../../../utils/sendErrorResponse';

export const commentController = {
  // Create a new comment
  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const commentData = { ...req.body, user: userId };
      const result = await CommentService.createComment(commentData);

      res.status(201).json({
        success: true,
        message: 'Comment posted successfully',
        data: result,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Get all comments for a review (with nested replies)
  async getReviewComments(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const result = await CommentService.getReviewComments(reviewId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Get a single comment by ID
  async getSingleComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await CommentService.getSingleComment(id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Get replies to a specific comment
  async getCommentReplies(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const result = await CommentService.getCommentReplies(commentId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Update a comment (only by owner)
  async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const { text } = req.body;

      if (!text || text.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Comment text is required',
        });
        return;
      }

      const result = await CommentService.updateComment(id, userId, text);

      res.status(200).json({
        success: true,
        message: 'Comment updated successfully',
        data: result,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Delete a comment (by owner or admin - soft delete)
  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const isAdmin = userRole === 'admin';

      const result = await CommentService.deleteComment(id, userId, isAdmin);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Hard delete a comment (admin only - removes from database)
  async hardDeleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await CommentService.hardDeleteComment(id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Get comment count for a review
  async getCommentCount(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const result = await CommentService.getCommentCount(reviewId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Get all comments by a user
  async getUserComments(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const result = await CommentService.getUserComments(userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Get all comments across all reviews (admin only)
  async getAllComments(req: Request, res: Response): Promise<void> {
    try {
      const result = await CommentService.getAllComments();

      res.status(200).json({
        success: true,
        message: 'All comments retrieved successfully',
        data: result,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Approve a comment (admin only)
  async approveComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await CommentService.approveComment(id);

      res.status(200).json({
        success: true,
        message: 'Comment approved successfully',
        data: result,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },
};
