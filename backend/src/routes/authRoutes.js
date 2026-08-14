import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Nama harus diisi'),
    body('email').isEmail().withMessage('Email tidak valid'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
    body('phone').optional().trim()
  ],
  register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email tidak valid'),
    body('password').notEmpty().withMessage('Password harus diisi')
  ],
  login
);

// Get Profile (protected)
router.get('/profile', authenticate, getProfile);

// Update Profile (protected)
router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().trim().notEmpty().withMessage('Nama tidak boleh kosong'),
    body('phone').optional().trim(),
    body('avatar').optional().trim().isURL().withMessage('Avatar harus berupa URL valid')
  ],
  updateProfile
);

export default router;
