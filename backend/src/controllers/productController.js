import { getPool } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all products with filters
export const getAllProducts = async (req, res, next) => {
  try {
    const { 
      category, 
      search, 
      sortBy = 'created_at', 
      order = 'DESC',
      limit = 20,
      offset = 0 
    } = req.query;

    const pool = getPool();
    let query = 'SELECT * FROM products WHERE is_active = true';
    const params = [];

    // Filter by category
    if (category && category !== 'Semua') {
      query += ' AND category = ?';
      params.push(category);
    }

    // Search by name or description
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Sorting
    const validSortFields = ['price', 'created_at', 'rating', 'sold'];
    const validOrder = ['ASC', 'DESC'];
    
    if (validSortFields.includes(sortBy) && validOrder.includes(order.toUpperCase())) {
      query += ` ORDER BY ${sortBy} ${order.toUpperCase()}`;
    }

    // Pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE is_active = true';
    const countParams = [];
    
    if (category && category !== 'Semua') {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    
    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: {
        products,
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Get product
    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ? AND is_active = true',
      [id]
    );

    if (products.length === 0) {
      throw new AppError('Produk tidak ditemukan', 404);
    }

    const product = products[0];

    // Get product images
    const [images] = await pool.query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order',
      [id]
    );

    // Get product variants
    const [variants] = await pool.query(
      'SELECT * FROM product_variants WHERE product_id = ?',
      [id]
    );

    // Group variants by type
    const variantsByType = variants.reduce((acc, variant) => {
      if (!acc[variant.variant_type]) {
        acc[variant.variant_type] = [];
      }
      acc[variant.variant_type].push({
        id: variant.id,
        value: variant.variant_value,
        priceAdjustment: parseFloat(variant.price_adjustment),
        stock: variant.stock
      });
      return acc;
    }, {});

    // Get reviews count and average rating
    const [reviewStats] = await pool.query(
      `SELECT 
        COUNT(*) as review_count,
        COALESCE(AVG(rating), 0) as avg_rating
       FROM reviews 
       WHERE product_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        product: {
          ...product,
          images: images.map(img => ({
            id: img.id,
            url: img.image_url,
            isPrimary: img.is_primary
          })),
          variants: variantsByType,
          rating: parseFloat(reviewStats[0].avg_rating).toFixed(1),
          reviewCount: reviewStats[0].review_count
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Search products
export const searchProducts = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.json({
        success: true,
        data: { products: [] }
      });
    }

    const pool = getPool();
    const [products] = await pool.query(
      `SELECT id, name, slug, price, image_url, category 
       FROM products 
       WHERE is_active = true 
       AND (name LIKE ? OR description LIKE ?)
       LIMIT ?`,
      [`%${q}%`, `%${q}%`, parseInt(limit)]
    );

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const pool = getPool();
    const [products] = await pool.query(
      `SELECT * FROM products 
       WHERE category = ? AND is_active = true 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [category, parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM products WHERE category = ? AND is_active = true',
      [category]
    );

    res.json({
      success: true,
      data: {
        products,
        total: countResult[0].total,
        category
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get product reviews
export const getProductReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const pool = getPool();
    
    const [reviews] = await pool.query(
      `SELECT r.*, u.name as user_name, u.avatar as user_avatar
       FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [id, parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM reviews WHERE product_id = ?',
      [id]
    );

    res.json({
      success: true,
      data: {
        reviews,
        total: countResult[0].total
      }
    });
  } catch (error) {
    next(error);
  }
};
