import { Request, Response } from 'express';
import { ReviewService } from './review.service';
import { sendErrorResponse } from '../../../utils/sendErrorResponse';
import {
  recalculateAllProductRatings,
  updateProductRating,
} from './review.utils';

export const reviewController = {
  async createReview(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const reviewData = { ...req.body, user: userId };
      const result = await ReviewService.createReview(reviewData);

      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: result,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getAllReviews(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.query.productId as string;
      const result = await ReviewService.getAllReviews(productId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async getSingleReview(req: Request, res: Response): Promise<void> {
    try {
      const result = await ReviewService.getSingleReview(req.params.id);
      if (!result) {
        res.status(404).json({ success: false, message: 'Review not found' });
        return;
      }
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const result = await ReviewService.updateReview(
        req.params.id,
        userId,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: result,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const isAdmin = userRole === 'admin';
      const result = await ReviewService.deleteReview(
        req.params.id,
        userId,
        isAdmin
      );

      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Admin utility: Recalculate single product rating
  async recalculateProductRating(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.productId;
      const result = await updateProductRating(productId);

      res.status(200).json({
        success: true,
        message: 'Product rating recalculated successfully',
        data: result,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },

  // Admin utility: Recalculate all products ratings
  async recalculateAllRatings(req: Request, res: Response): Promise<void> {
    try {
      const results = await recalculateAllProductRatings();

      res.status(200).json({
        success: true,
        message: `Recalculated ratings for ${results.length} products`,
        data: results,
      });
    } catch (error) {
      sendErrorResponse(error, res);
    }
  },
};
