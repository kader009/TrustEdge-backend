import { Router } from 'express';
import { productController } from './product.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validateRequest';
import { ProductValidation } from './product.validation';

const router = Router();

router.get('/filters', productController.getFilterOptions);

router.get(
  '/',
  validateRequest(ProductValidation.getProductsSchema),
  productController.getProducts
);

router.get(
  '/admin/all-products',
  authMiddleware(['admin', 'staff']),
  productController.getProductsAdmin
);

router.post(
  '/create-product',
  authMiddleware(['admin', 'staff']),
  validateRequest(ProductValidation.createProductSchema),
  productController.createProduct
);

router.put(
  '/update-product/:id',
  authMiddleware(['admin', 'staff']),
  validateRequest(ProductValidation.updateProductSchema),
  productController.updateProduct
);

router.delete(
  '/:id',
  authMiddleware(['admin', 'staff']),
  validateRequest(ProductValidation.deleteProductSchema),
  productController.deleteProduct
);

router.get(
  '/:slug',
  validateRequest(ProductValidation.getProductBySlugSchema),
  productController.getProductBySlug
);

router.get(
  '/admin/:id',
  authMiddleware(['admin', 'staff']),
  validateRequest(ProductValidation.getProductByIdSchema),
  productController.getProductById
);

export const productRoutes = router;
