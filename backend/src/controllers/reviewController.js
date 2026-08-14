import { validationResult } from 'express-validator';
import { getPool } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// Create review
export const createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { productId, rating, comment } = req.body;
    const pool = getPool();

    // Check if product exists
    const [products] = await pool.query(
      'SELECT id FROM products WHERE id = ? AND is_active = true',
      [productId]
    );

    if (products.length === 0) {
      throw new AppError('Produk tidak ditemukan', 404);
    }

    // If user is authenticated, check if they already reviewed
    if (req.user) {
      const [existingReviews] = await pool.query(
        'SELECT id FROM reviews WHERE product_id = ? AND user_id = ?',
        [productId, req.user.id]
      );

      if (existingReviews.length > 0) {
        throw new AppError('Anda sudah memberikan review untuk produk ini', 400);
      }
    }

    const userId = req.user?.id || null;
    const userName = req.user?.name || req.body.userName || 'Anonymous';

    // Create review
    const [result] = await pool.query(
      `INSERT INTO reviews (product_id, user_id, user_name, rating, comment, is_verified)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [productId, userId, userName, rating, comment || null, userId ? true : false]
    );

    // Update product rating and review count
    const [stats] = await pool.query(
      `SELECT 
        COUNT(*) as review_count,
        AVG(rating) as avg_rating
       FROM reviews 
       WHERE product_id = ?`,
      [productId]
    );

    await pool.query(
      'UPDATE products SET rating = ?, review_count = ? WHERE id = ?',
      [stats[0].avg_rating, stats[0].review_count, productId]
    );

    res.status(201).json({
      success: true,
      message: 'Review berhasil ditambahkan',
      data: {
        reviewId: result.insertId
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get reviews by product
export const getReviewsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { limit = 10, offset = 0 } = req.query;
    const pool = getPool();

    const [reviews] = await pool.query(
      `SELECT r.*, u.avatar as user_avatar
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [productId, parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM reviews WHERE product_id = ?',
      [productId]
    );

    // Get rating distribution
    const [distribution] = await pool.query(
      `SELECT 
        rating,
        COUNT(*) as count
       FROM reviews
       WHERE product_id = ?
       GROUP BY rating
       ORDER BY rating DESC`,
      [productId]
    );

    res.json({
      success: true,
      data: {
        reviews: reviews.map(review => ({
          id: review.id,
          userId: review.user_id,
          userName: review.user_name,
          userAvatar: review.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name)}`,
          rating: review.rating,
          comment: review.comment,
          isVerified: review.is_verified,
          createdAt: review.created_at,
          updatedAt: review.updated_at
        })),
        total: countResult[0].total,
        distribution: distribution.reduce((acc, item) => {
          acc[item.rating] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete review (authenticated user only)
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const pool = getPool();

    // Check if review exists and belongs to user
    const [reviews] = await pool.query(
      'SELECT * FROM reviews WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (reviews.length === 0) {
      throw new AppError('Review tidak ditemukan', 404);
    }

    const productId = reviews[0].product_id;

    // Delete review
    await pool.query('DELETE FROM reviews WHERE id = ?', [id]);

    // Update product rating and review count
    const [stats] = await pool.query(
      `SELECT 
        COUNT(*) as review_count,
        COALESCE(AVG(rating), 0) as avg_rating
       FROM reviews 
       WHERE product_id = ?`,
      [productId]
    );

    await pool.query(
      'UPDATE products SET rating = ?, review_count = ? WHERE id = ?',
      [stats[0].avg_rating, stats[0].review_count, productId]
    );

    res.json({
      success: true,
      message: 'Review berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};
