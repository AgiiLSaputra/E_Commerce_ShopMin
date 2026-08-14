import express from 'express';
import { getPromoCodes, validatePromoCode } from '../controllers/promoController.js';

const router = express.Router();

// Get all active promo codes
router.get('/', getPromoCodes);

// Validate promo code
router.get('/validate/:code', validatePromoCode);

export default router;
