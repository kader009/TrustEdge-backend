import { z } from 'zod';

// MongoDB ObjectId validation regex
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Create review validation
export const createReviewSchema = z.object({
  body: z.object({
    product: z
      .string({ required_error: 'Product ID is required' })
      .regex(objectIdRegex, 'Invalid product ID format'),
    title: z
      .string({ required_error: 'Review title is required' })
      .min(5, 'Title must be at least 5 characters')
      .max(200, 'Title cannot exceed 200 characters'),
    description: z
      .string({ required_error: 'Review description is required' })
      .min(20, 'Description must be at least 20 characters')
      .max(5000, 'Description cannot exceed 5000 characters'),
    rating: z
      .number({ required_error: 'Rating is required' })
      .int('Rating must be an integer')
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5'),
    comment: z
      .string()
      .max(1000, 'Comment cannot exceed 1000 characters')
      .optional(),
    images: z.array(z.string().url('Invalid image URL')).optional(),
    purchaseSource: z.string().max(500, 'Purchase source too long').optional(),
    isPremium: z.boolean().optional().default(false),
    price: z.number().min(0, 'Price must be non-negative').optional(),
  }),
});

// Update review validation
export const updateReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid review ID format'),
  }),
  body: z.object({
    title: z
      .string()
      .min(5, 'Title must be at least 5 characters')
      .max(200, 'Title cannot exceed 200 characters')
      .optional(),
    description: z
      .string()
      .min(20, 'Description must be at least 20 characters')
      .max(5000, 'Description cannot exceed 5000 characters')
      .optional(),
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().max(1000).optional(),
    images: z.array(z.string().url()).optional(),
    purchaseSource: z.string().max(500).optional(),
    isPremium: z.boolean().optional(),
    price: z.number().min(0).optional(),
  }),
});

// Get single review validation
export const getSingleReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid review ID format'),
  }),
});

// Delete review validation
export const deleteReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid review ID format'),
  }),
});

// Approve review validation
export const approveReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid review ID format'),
  }),
});

// Unpublish review validation
export const unpublishReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid review ID format'),
  }),
  body: z.object({
    reason: z
      .string({ required_error: 'Moderation reason is required' })
      .min(10, 'Reason must be at least 10 characters')
      .max(500, 'Reason cannot exceed 500 characters'),
  }),
});

// Search and filter validation
export const searchReviewsSchema = z.object({
  query: z.object({
    keyword: z.string().optional(),
    category: z.string().optional(),
    rating: z
      .string()
      .regex(/^[1-5]$/, 'Rating must be between 1 and 5')
      .optional(),
    status: z.enum(['pending', 'published', 'unpublished']).optional(),
    isPremium: z.enum(['true', 'false']).optional(),
    sort: z.enum(['date', 'rating', 'votes']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
    limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional(),
  }),
});

export const ReviewValidation = {
  createReviewSchema,
  updateReviewSchema,
  getSingleReviewSchema,
  deleteReviewSchema,
  approveReviewSchema,
  unpublishReviewSchema,
  searchReviewsSchema,
};
