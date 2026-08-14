import { getPool } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// Helper to get user identifier
const getUserIdentifier = (req) => {
  if (req.user) {
    return { userId: req.user.id, sessionId: null };
  }
  const sessionId = req.headers['x-session-id'] || `guest_${Date.now()}_${Math.random()}`;
  return { userId: null, sessionId };
};

// Get wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const { userId, sessionId } = getUserIdentifier(req);
    const pool = getPool();

    let query = `
      SELECT 
        w.id,
        w.created_at,
        p.id as product_id,
        p.name,
        p.slug,
        p.price,
        p.original_price,
        p.image_url,
        p.rating,
        p.review_count,
        p.category
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE p.is_active = true AND `;

    const params = [];

    if (userId) {
      query += 'w.user_id = ?';
      params.push(userId);
    } else {
      query += 'w.session_id = ?';
      params.push(sessionId);
    }

    query += ' ORDER BY w.created_at DESC';

    const [wishlistItems] = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        items: wishlistItems.map(item => ({
          id: item.id,
          productId: item.product_id,
          name: item.name,
          slug: item.slug,
          price: parseFloat(item.price),
          originalPrice: item.original_price ? parseFloat(item.original_price) : null,
          imageUrl: item.image_url,
          rating: parseFloat(item.rating),
          reviewCount: item.review_count,
          category: item.category,
          addedAt: item.created_at
        })),
        sessionId: sessionId || undefined
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add to wishlist
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const { userId, sessionId } = getUserIdentifier(req);
    const pool = getPool();

    if (!productId) {
      throw new AppError('Product ID harus diisi', 400);
    }

    // Check if product exists
    const [products] = await pool.query(
      'SELECT id FROM products WHERE id = ? AND is_active = true',
      [productId]
    );

    if (products.length === 0) {
      throw new AppError('Produk tidak ditemukan', 404);
    }

    // Check if already in wishlist
    let checkQuery = 'SELECT id FROM wishlist WHERE product_id = ? AND ';
    const checkParams = [productId];

    if (userId) {
      checkQuery += 'user_id = ?';
      checkParams.push(userId);
    } else {
      checkQuery += 'session_id = ?';
      checkParams.push(sessionId);
    }

    const [existing] = await pool.query(checkQuery, checkParams);

    if (existing.length > 0) {
      return res.json({
        success: true,
        message: 'Produk sudah ada di wishlist',
        data: { itemId: existing[0].id }
      });
    }

    // Add to wishlist
    const [result] = await pool.query(
      'INSERT INTO wishlist (user_id, session_id, product_id) VALUES (?, ?, ?)',
      [userId, sessionId, productId]
    );

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan ke wishlist',
      data: { 
        itemId: result.insertId,
        sessionId: sessionId || undefined
      }
    });
  } catch (error) {
    next(error);
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { userId, sessionId } = getUserIdentifier(req);
    const pool = getPool();

    // Check ownership and delete
    let query = 'DELETE FROM wishlist WHERE id = ? AND ';
    const params = [itemId];

    if (userId) {
      query += 'user_id = ?';
      params.push(userId);
    } else {
      query += 'session_id = ?';
      params.push(sessionId);
    }

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      throw new AppError('Item tidak ditemukan di wishlist', 404);
    }

    res.json({
      success: true,
      message: 'Produk berhasil dihapus dari wishlist'
    });
  } catch (error) {
    next(error);
  }
};

// Remove from wishlist by product ID
export const removeFromWishlistByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { userId, sessionId } = getUserIdentifier(req);
    const pool = getPool();

    // Check ownership and delete
    let query = 'DELETE FROM wishlist WHERE product_id = ? AND ';
    const params = [productId];

    if (userId) {
      query += 'user_id = ?';
      params.push(userId);
    } else {
      query += 'session_id = ?';
      params.push(sessionId);
    }

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      throw new AppError('Produk tidak ditemukan di wishlist', 404);
    }

    res.json({
      success: true,
      message: 'Produk berhasil dihapus dari wishlist'
    });
  } catch (error) {
    next(error);
  }
};

// Check if product is in wishlist
export const checkWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { userId, sessionId } = getUserIdentifier(req);
    const pool = getPool();

    let query = 'SELECT id FROM wishlist WHERE product_id = ? AND ';
    const params = [productId];

    if (userId) {
      query += 'user_id = ?';
      params.push(userId);
    } else {
      query += 'session_id = ?';
      params.push(sessionId);
    }

    const [items] = await pool.query(query, params);

    res.json({
      success: true,
      data: {
        inWishlist: items.length > 0,
        itemId: items.length > 0 ? items[0].id : null
      }
    });
  } catch (error) {
    next(error);
  }
};
