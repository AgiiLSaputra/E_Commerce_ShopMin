import { getPool } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// Helper to get user identifier (user_id or session_id)
const getUserIdentifier = (req) => {
  if (req.user) {
    return { userId: req.user.id, sessionId: null };
  }
  // For guest users, use session from header or generate temporary one
  const sessionId = req.headers['x-session-id'] || `guest_${Date.now()}_${Math.random()}`;
  return { userId: null, sessionId };
};

// Get cart
export const getCart = async (req, res, next) => {
  try {
    const { userId, sessionId } = getUserIdentifier(req);
    const pool = getPool();

    let query = `
      SELECT 
        ci.*,
        p.name as product_name,
        p.slug as product_slug,
        p.image_url as product_image,
        p.stock as product_stock,
        pv.variant_type,
        pv.variant_value
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_variants pv ON ci.variant_id = pv.id
      WHERE `;

    const params = [];

    if (userId) {
      query += 'ci.user_id = ?';
      params.push(userId);
    } else {
      query += 'ci.session_id = ?';
      params.push(sessionId);
    }

    const [cartItems] = await pool.query(query, params);

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const tax = subtotal * 0.11; // PPN 11%
    const total = subtotal + tax;

    res.json({
      success: true,
      data: {
        items: cartItems.map(item => ({
          id: item.id,
          productId: item.product_id,
          productName: item.product_name,
          productSlug: item.product_slug,
          productImage: item.product_image,
          variantId: item.variant_id,
          variantType: item.variant_type,
          variantValue: item.variant_value,
          quantity: item.quantity,
          price: parseFloat(item.price),
          subtotal: parseFloat(item.price) * item.quantity,
          stock: item.product_stock
        })),
        summary: {
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          discount: 0,
          total: parseFloat(total.toFixed(2))
        },
        sessionId: sessionId || undefined
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add to cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;
    const { userId, sessionId } = getUserIdentifier(req);
    const pool = getPool();

    if (!productId) {
      throw new AppError('Product ID harus diisi', 400);
    }

    // Get product
    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ? AND is_active = true',
      [productId]
    );

    if (products.length === 0) {
      throw new AppError('Produk tidak ditemukan', 404);
    }

    const product = products[0];
    let price = parseFloat(product.price);

    // Check variant if provided
    if (variantId) {
      const [variants] = await pool.query(
        'SELECT * FROM product_variants WHERE id = ? AND product_id = ?',
        [variantId, productId]
      );

      if (variants.length === 0) {
        throw new AppError('Varian tidak ditemukan', 404);
      }

      price += parseFloat(variants[0].price_adjustment);
    }

    // Check if item already in cart
    let checkQuery = `
      SELECT * FROM cart_items 
      WHERE product_id = ? 
      AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))
      AND `;

    const checkParams = [productId, variantId, variantId];

    if (userId) {
      checkQuery += 'user_id = ?';
      checkParams.push(userId);
    } else {
      checkQuery += 'session_id = ?';
      checkParams.push(sessionId);
    }

    const [existingItems] = await pool.query(checkQuery, checkParams);

    if (existingItems.length > 0) {
      // Update quantity
      const newQuantity = existingItems[0].quantity + quantity;
      await pool.query(
        'UPDATE cart_items SET quantity = ?, price = ? WHERE id = ?',
        [newQuantity, price, existingItems[0].id]
      );

      return res.json({
        success: true,
        message: 'Kuantitas produk di keranjang berhasil diupdate',
        data: { itemId: existingItems[0].id }
      });
    }

    // Add new item
    const [result] = await pool.query(
      `INSERT INTO cart_items (user_id, session_id, product_id, variant_id, quantity, price)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, sessionId, productId, variantId, quantity, price]
    );

    res.status(201).json({
      success: true,
      message: 'Produk berhasil ditambahkan ke keranjang',
      data: { 
        itemId: result.insertId,
        sessionId: sessionId || undefined
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item
export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const { userId, sessionId } = getUserIdentifier(req);
    const pool = getPool();

    if (!quantity || quantity < 1) {
      throw new AppError('Kuantitas harus minimal 1', 400);
    }

    // Check ownership
    let query = 'SELECT * FROM cart_items WHERE id = ? AND ';
    const params = [itemId];

    if (userId) {
      query += 'user_id = ?';
      params.push(userId);
    } else {
      query += 'session_id = ?';
      params.push(sessionId);
    }

    const [items] = await pool.query(query, params);

    if (items.length === 0) {
      throw new AppError('Item tidak ditemukan di keranjang', 404);
    }

    // Update quantity
    await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, itemId]
    );

    res.json({
      success: true,
      message: 'Kuantitas berhasil diupdate'
    });
  } catch (error) {
    next(error);
  }
};

// Remove from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { userId, sessionId } = getUserIdentifier(req);
    const pool = getPool();

    // Check ownership
    let query = 'DELETE FROM cart_items WHERE id = ? AND ';
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
      throw new AppError('Item tidak ditemukan di keranjang', 404);
    }

    res.json({
      success: true,
      message: 'Item berhasil dihapus dari keranjang'
    });
  } catch (error) {
    next(error);
  }
};

// Clear cart
export const clearCart = async (req, res, next) => {
  try {
    const { userId, sessionId } = getUserIdentifier(req);
    const pool = getPool();

    let query = 'DELETE FROM cart_items WHERE ';
    const params = [];

    if (userId) {
      query += 'user_id = ?';
      params.push(userId);
    } else {
      query += 'session_id = ?';
      params.push(sessionId);
    }

    await pool.query(query, params);

    res.json({
      success: true,
      message: 'Keranjang berhasil dikosongkan'
    });
  } catch (error) {
    next(error);
  }
};
