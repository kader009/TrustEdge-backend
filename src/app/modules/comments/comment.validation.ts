import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Create comment validation
export const createCommentSchema = z.object({
  body: z.object({
    review: z
      .string({ required_error: 'Review ID is required' })
      .regex(objectIdRegex, 'Invalid review ID format'),
    text: z
      .string({ required_error: 'Comment text is required' })
      .min(1, 'Comment cannot be empty')
      .max(1000, 'Comment cannot exceed 1000 characters'),
    parentComment: z
      .string()
      .regex(objectIdRegex, 'Invalid parent comment ID format')
      .optional()
      .nullable(),
  }),
});

// Get review comments validation
export const getReviewCommentsSchema = z.object({
  params: z.object({
    reviewId: z
      .string({ required_error: 'Review ID is required' })
      .regex(objectIdRegex, 'Invalid review ID format'),
  }),
});

// Get single comment validation
export const getSingleCommentSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Comment ID is required' })
      .regex(objectIdRegex, 'Invalid comment ID format'),
  }),
});

// Get comment replies validation
export const getCommentRepliesSchema = z.object({
  params: z.object({
    commentId: z
      .string({ required_error: 'Comment ID is required' })
      .regex(objectIdRegex, 'Invalid comment ID format'),
  }),
});

// Update comment validation
export const updateCommentSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Comment ID is required' })
      .regex(objectIdRegex, 'Invalid comment ID format'),
  }),
  body: z.object({
    text: z
      .string({ required_error: 'Comment text is required' })
      .min(1, 'Comment cannot be empty')
      .max(1000, 'Comment cannot exceed 1000 characters'),
  }),
});

// Delete comment validation
export const deleteCommentSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Comment ID is required' })
      .regex(objectIdRegex, 'Invalid comment ID format'),
  }),
});

// Get comment count validation
export const getCommentCountSchema = z.object({
  params: z.object({
    reviewId: z
      .string({ required_error: 'Review ID is required' })
      .regex(objectIdRegex, 'Invalid review ID format'),
  }),
});

export const CommentValidation = {
  createCommentSchema,
  getReviewCommentsSchema,
  getSingleCommentSchema,
  getCommentRepliesSchema,
  updateCommentSchema,
  deleteCommentSchema,
  getCommentCountSchema,
};
