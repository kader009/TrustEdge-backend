import { z } from 'zod';

export const UserValidation = {
  // Update profile schema
  updateProfileSchema: z.object({
    body: z.object({
      name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .optional(),

      email: z.string().email('Invalid email format').optional(),

      phone: z
        .string()
        .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
        .optional(),

      address: z
        .string()
        .max(500, 'Address cannot exceed 500 characters')
        .optional(),

      avatar: z.string().url('Invalid avatar URL').optional(),

      bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional(),
    }),
  }),

  // Update password schema
  updatePasswordSchema: z.object({
    body: z
      .object({
        currentPassword: z
          .string({ required_error: 'Current password is required' })
          .min(6, 'Password must be at least 6 characters'),

        newPassword: z
          .string({ required_error: 'New password is required' })
          .min(6, 'New password must be at least 6 characters')
          .max(50, 'New password cannot exceed 50 characters'),

        confirmPassword: z.string({
          required_error: 'Confirm password is required',
        }),
      })
      .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'New password and confirm password do not match',
        path: ['confirmPassword'],
      }),
  }),

  // Admin update user schema
  adminUpdateUserSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    }),
    body: z.object({
      name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name cannot exceed 100 characters')
        .optional(),

      email: z.string().email('Invalid email format').optional(),

      role: z.enum(['user', 'admin', 'staff']).optional(),

      isActive: z.boolean().optional(),

      phone: z
        .string()
        .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
        .optional(),

      address: z
        .string()
        .max(500, 'Address cannot exceed 500 characters')
        .optional(),

      avatar: z.string().url('Invalid avatar URL').optional(),

      bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional(),
    }),
  }),

  // Delete user schema
  deleteUserSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    }),
  }),

  // Get single user schema
  getSingleUserSchema: z.object({
    params: z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
    }),
  }),

  // Get all users query schema
  getAllUsersSchema: z.object({
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      search: z.string().optional(),
      role: z.enum(['user', 'admin', 'staff']).optional(),
      isActive: z.enum(['true', 'false']).optional(),
      sort: z
        .enum(['name', '-name', 'email', '-email', 'createdAt', '-createdAt'])
        .optional(),
    }),
  }),
};
