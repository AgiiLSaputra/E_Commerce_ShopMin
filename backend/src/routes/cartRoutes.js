import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

// All cart routes support both authenticated and guest users
router.use(optionalAuth);

// Get cart
router.get('/', getCart);

// Add item to cart
router.post('/', addToCart);

// Update cart item quantity
router.put('/:itemId', updateCartItem);

// Remove item from cart
router.delete('/:itemId', removeFromCart);

// Clear cart
router.delete('/', clearCart);

export default router;
