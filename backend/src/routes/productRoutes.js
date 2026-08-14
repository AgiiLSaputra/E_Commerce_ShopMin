import express from 'express';
import { 
  getAllProducts, 
  getProductById, 
  searchProducts,
  getProductsByCategory,
  getProductReviews
} from '../controllers/productController.js';

const router = express.Router();

// Get all products with filters
router.get('/', getAllProducts);

// Search products
router.get('/search', searchProducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Get product by ID
router.get('/:id', getProductById);

// Get product reviews
router.get('/:id/reviews', getProductReviews);

export default router;
