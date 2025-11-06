import { z } from 'zod';

export const CategoryValidation = {
  // Create category schema
  createCategorySchema: z.object({
    body: z.object({
      name: z
        .string({ required_error: 'Category name is required' })
        .min(2, 'Category name must be at least 2 characters')
        .max(100, 'Category name cannot exceed 100 characters'),

      slug: z.string().optional(),

      description: z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .optional(),

      image: z.string().url('Invalid image URL').optional(),

      isActive: z.boolean().optional(),

      parent: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent category ID format')
        .optional(),

      order: z.number().min(0, 'Order cannot be negative').optional(),
    }),
  }),

  // Update category schema
  updateCategorySchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format'),
    }),
    body: z.object({
      name: z
        .string()
        .min(2, 'Category name must be at least 2 characters')
        .max(100, 'Category name cannot exceed 100 characters')
        .optional(),

      slug: z.string().optional(),

      description: z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .optional(),

      image: z.string().url('Invalid image URL').optional(),

      isActive: z.boolean().optional(),

      parent: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid parent category ID format')
        .optional(),

      order: z.number().min(0, 'Order cannot be negative').optional(),
    }),
  }),

  // Delete category schema
  deleteCategorySchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format'),
    }),
  }),

  // Get single category schema
  getSingleCategorySchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format'),
    }),
  }),
};
