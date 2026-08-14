import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  removeFromWishlistByProduct,
  checkWishlist
} from '../controllers/wishlistController.js';

const router = express.Router();

// All wishlist routes support both authenticated and guest users
router.use(optionalAuth);

// Get wishlist
router.get('/', getWishlist);

// Add to wishlist
router.post('/', addToWishlist);

// Check if product is in wishlist
router.get('/check/:productId', checkWishlist);

// Remove from wishlist by item ID
router.delete('/:itemId', removeFromWishlist);

// Remove from wishlist by product ID
router.delete('/product/:productId', removeFromWishlistByProduct);

export default router;
