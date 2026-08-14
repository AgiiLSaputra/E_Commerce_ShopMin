import jwt from 'jsonwebtoken';
import { getPool } from '../config/database.js';
import { AppError } from './errorHandler.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('Token tidak ditemukan', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const pool = getPool();
    const [users] = await pool.query(
      'SELECT id, name, email, phone, avatar FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      throw new AppError('User tidak ditemukan', 401);
    }

    req.user = users[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Token tidak valid', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token sudah expired', 401));
    } else {
      next(error);
    }
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const pool = getPool();
      const [users] = await pool.query(
        'SELECT id, name, email, phone, avatar FROM users WHERE id = ?',
        [decoded.userId]
      );

      if (users.length > 0) {
        req.user = users[0];
      }
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};
