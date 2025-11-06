import { z } from 'zod';

export const ProductValidation = {
  // Create product schema
  createProductSchema: z.object({
    body: z.object({
      name: z
        .string({ required_error: 'Product name is required' })
        .min(3, 'Product name must be at least 3 characters')
        .max(200, 'Product name cannot exceed 200 characters'),

      slug: z.string().optional(),

      description: z
        .string({ required_error: 'Description is required' })
        .min(10, 'Description must be at least 10 characters')
        .max(5000, 'Description cannot exceed 5000 characters'),

      category: z
        .string({ required_error: 'Category is required' })
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format'),

      price: z
        .number({ required_error: 'Price is required' })
        .min(0, 'Price cannot be negative'),

      brand: z.string().optional(),

      images: z.array(z.string().url('Invalid image URL')).optional(),

      stock: z.number().min(0, 'Stock cannot be negative').optional(),

      specifications: z.record(z.any()).optional(),

      isActive: z.boolean().optional(),
    }),
  }),

  // Update product schema
  updateProductSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format'),
    }),
    body: z.object({
      name: z
        .string()
        .min(3, 'Product name must be at least 3 characters')
        .max(200, 'Product name cannot exceed 200 characters')
        .optional(),

      slug: z.string().optional(),

      description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(5000, 'Description cannot exceed 5000 characters')
        .optional(),

      category: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID format')
        .optional(),

      price: z.number().min(0, 'Price cannot be negative').optional(),

      brand: z.string().optional(),

      images: z.array(z.string().url('Invalid image URL')).optional(),

      stock: z.number().min(0, 'Stock cannot be negative').optional(),

      specifications: z.record(z.any()).optional(),

      isActive: z.boolean().optional(),
    }),
  }),

  // Delete product schema
  deleteProductSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format'),
    }),
  }),

  // Get product by slug schema
  getProductBySlugSchema: z.object({
    params: z.object({
      slug: z.string().min(1, 'Slug is required'),
    }),
  }),

  // Get product by ID schema
  getProductByIdSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product ID format'),
    }),
  }),

  // Get products query schema
  getProductsSchema: z.object({
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      search: z.string().optional(),
      category: z.string().optional(),
      minPrice: z.string().optional(),
      maxPrice: z.string().optional(),
      brand: z.string().optional(),
      sort: z
        .enum(['price', '-price', 'name', '-name', 'createdAt', '-createdAt'])
        .optional(),
    }),
  }),
};
