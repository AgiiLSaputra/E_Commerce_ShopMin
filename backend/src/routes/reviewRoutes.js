import express from 'express';
import { body } from 'express-validator';
import { optionalAuth, authenticate } from '../middleware/auth.js';
import {
  createReview,
  getReviewsByProduct,
  deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

// Create review (guest or authenticated)
router.post(
  '/',
  optionalAuth,
  [
    body('productId').isInt().withMessage('Product ID harus berupa angka'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating harus antara 1-5'),
    body('comment').optional().trim(),
    body('userName').optional().trim()
  ],
  createReview
);

// Get reviews by product
router.get('/product/:productId', getReviewsByProduct);

// Delete review (authenticated only)
router.delete('/:id', authenticate, deleteReview);

export default router;
