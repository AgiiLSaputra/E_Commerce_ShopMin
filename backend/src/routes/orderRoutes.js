import express from 'express';
import { body } from 'express-validator';
import { optionalAuth, authenticate } from '../middleware/auth.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

// Create order (guest or authenticated)
router.post(
  '/',
  optionalAuth,
  [
    body('recipientName').trim().notEmpty().withMessage('Nama penerima harus diisi'),
    body('recipientPhone').trim().notEmpty().withMessage('No HP harus diisi'),
    body('recipientAddress').trim().notEmpty().withMessage('Alamat harus diisi'),
    body('recipientCity').trim().notEmpty().withMessage('Kota harus diisi'),
    body('recipientPostalCode').trim().notEmpty().withMessage('Kode pos harus diisi'),
    body('paymentMethod').isIn(['COD', 'GoPay', 'OVO', 'Bank Transfer']).withMessage('Metode pembayaran tidak valid'),
    body('items').isArray({ min: 1 }).withMessage('Items harus berupa array dan tidak boleh kosong'),
    body('promoCode').optional().trim()
  ],
  createOrder
);

// Get orders (authenticated only)
router.get('/', authenticate, getOrders);

// Get order by ID
router.get('/:id', optionalAuth, getOrderById);

// Delete order (authenticated only)
router.delete('/:id', authenticate, deleteOrder);

// Update order status (for admin, but simplified here)
router.patch('/:id/status', authenticate, updateOrderStatus);

export default router;
