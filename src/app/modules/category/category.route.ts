import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { categoryController } from './category.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';

const router = express.Router();

router.get('/', categoryController.getAllCategories);

router.post(
  '/create-category',
  authMiddleware(['admin']),
  validateRequest(CategoryValidation.createCategorySchema),
  categoryController.createCategory
);

router.get(
  '/admin/all-categories',
  authMiddleware(['admin']),
  categoryController.getCategoriesAdmin
);

router.get(
  '/:id',
  authMiddleware(['admin']),
  validateRequest(CategoryValidation.getSingleCategorySchema),
  categoryController.getSingleCategory
);

router.put(
  '/:id',
  authMiddleware(['admin']),
  validateRequest(CategoryValidation.updateCategorySchema),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authMiddleware(['admin']),
  validateRequest(CategoryValidation.deleteCategorySchema),
  categoryController.deleteCategory
);

export const CategoryRoutes = router;
