import { validationResult } from 'express-validator';
import { getPool } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// Helper to generate order number
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${year}${month}-${random}`;
};

// Helper to generate invoice number
const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `INV/${year}${month}${day}/XXI/V/${random}`;
};

// Helper to calculate estimated delivery
const getEstimatedDelivery = () => {
  const start = new Date();
  start.setDate(start.getDate() + 3);
  
  const end = new Date();
  end.setDate(end.getDate() + 7);
  
  return { start, end };
};

// Create order
export const createOrder = async (req, res, next) => {
  const connection = await getPool().getConnection();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      recipientName,
      recipientPhone,
      recipientAddress,
      recipientCity,
      recipientPostalCode,
      paymentMethod,
      items,
      promoCode,
      notes
    } = req.body;

    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;

    await connection.beginTransaction();

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const [products] = await connection.query(
        'SELECT * FROM products WHERE id = ?',
        [item.productId]
      );

      if (products.length === 0) {
        throw new AppError(`Produk dengan ID ${item.productId} tidak ditemukan`, 404);
      }

      const product = products[0];
      let price = parseFloat(product.price);

      // Check variant
      let variantInfo = null;
      if (item.variantId) {
        const [variants] = await connection.query(
          'SELECT * FROM product_variants WHERE id = ? AND product_id = ?',
          [item.variantId, item.productId]
        );

        if (variants.length > 0) {
          price += parseFloat(variants[0].price_adjustment);
          variantInfo = {
            type: variants[0].variant_type,
            value: variants[0].variant_value
          };
        }
      }

      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        variantInfo,
        quantity: item.quantity,
        price,
        subtotal: itemSubtotal
      });

      // Update product sold count
      await connection.query(
        'UPDATE products SET sold = sold + ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    // Calculate tax and discount
    const tax = subtotal * 0.11; // PPN 11%
    let discount = 0;

    // Apply promo code
    if (promoCode) {
      const [promos] = await connection.query(
        `SELECT * FROM promo_codes 
         WHERE code = ? 
         AND is_active = true 
         AND (valid_until IS NULL OR valid_until > NOW())
         AND (usage_limit IS NULL OR usage_count < usage_limit)`,
        [promoCode]
      );

      if (promos.length > 0) {
        const promo = promos[0];
        
        if (subtotal >= parseFloat(promo.min_purchase)) {
          if (promo.discount_type === 'percentage') {
            discount = subtotal * (parseFloat(promo.discount_value) / 100);
            if (promo.max_discount) {
              discount = Math.min(discount, parseFloat(promo.max_discount));
            }
          } else {
            discount = parseFloat(promo.discount_value);
          }

          // Update promo usage count
          await connection.query(
            'UPDATE promo_codes SET usage_count = usage_count + 1 WHERE id = ?',
            [promo.id]
          );
        }
      }
    }

    const total = subtotal + tax - discount;

    // Generate order and invoice numbers
    const orderNumber = generateOrderNumber();
    const invoiceNumber = generateInvoiceNumber();
    const { start, end } = getEstimatedDelivery();

    // Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (
        order_number, invoice_number, user_id, session_id,
        recipient_name, recipient_phone, recipient_address, 
        recipient_city, recipient_postal_code,
        payment_method, subtotal, tax, discount, total,
        promo_code, notes, status,
        estimated_delivery_start, estimated_delivery_end
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber, invoiceNumber, userId, sessionId,
        recipientName, recipientPhone, recipientAddress,
        recipientCity, recipientPostalCode,
        paymentMethod, subtotal, tax, discount, total,
        promoCode || null, notes || null, 'Diproses',
        start, end
      ]
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (const item of orderItems) {
      await connection.query(
        `INSERT INTO order_items (
          order_id, product_id, product_name, variant_info,
          quantity, price, subtotal
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.productId,
          item.productName,
          item.variantInfo ? JSON.stringify(item.variantInfo) : null,
          item.quantity,
          item.price,
          item.subtotal
        ]
      );
    }

    // Clear cart after order
    if (userId) {
      await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    } else if (sessionId) {
      await connection.query('DELETE FROM cart_items WHERE session_id = ?', [sessionId]);
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat',
      data: {
        orderId,
        orderNumber,
        invoiceNumber,
        total,
        estimatedDelivery: {
          start,
          end
        }
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

// Get orders (authenticated user only)
export const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, limit = 20, offset = 0 } = req.query;
    const pool = getPool();

    let query = `
      SELECT 
        o.*,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
    `;
    const params = [userId];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [orders] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE user_id = ?';
    const countParams = [userId];
    
    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const [countResult] = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: {
        orders: orders.map(order => ({
          ...order,
          subtotal: parseFloat(order.subtotal),
          tax: parseFloat(order.tax),
          discount: parseFloat(order.discount),
          total: parseFloat(order.total)
        })),
        total: countResult[0].total
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get order by ID
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    // Get order
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      throw new AppError('Pesanan tidak ditemukan', 404);
    }

    const order = orders[0];

    // Check access (user must own the order or it's their session)
    if (req.user) {
      if (order.user_id !== req.user.id) {
        throw new AppError('Anda tidak memiliki akses ke pesanan ini', 403);
      }
    } else {
      const sessionId = req.headers['x-session-id'];
      if (order.session_id !== sessionId) {
        throw new AppError('Anda tidak memiliki akses ke pesanan ini', 403);
      }
    }

    // Get order items
    const [items] = await pool.query(
      `SELECT oi.*, p.image_url as product_image
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: {
        order: {
          ...order,
          subtotal: parseFloat(order.subtotal),
          tax: parseFloat(order.tax),
          discount: parseFloat(order.discount),
          total: parseFloat(order.total),
          items: items.map(item => ({
            ...item,
            price: parseFloat(item.price),
            subtotal: parseFloat(item.subtotal),
            variantInfo: item.variant_info ? JSON.parse(item.variant_info) : null
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete order (authenticated user only)
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const pool = getPool();

    // Check if order exists and belongs to user
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (orders.length === 0) {
      throw new AppError('Pesanan tidak ditemukan', 404);
    }

    // Delete order (cascade will delete order_items)
    await pool.query('DELETE FROM orders WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Pesanan berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

// Update order status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const pool = getPool();

    const validStatuses = ['Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Status tidak valid', 400);
    }

    // Check if order exists and belongs to user
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (orders.length === 0) {
      throw new AppError('Pesanan tidak ditemukan', 404);
    }

    // Update status
    await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({
      success: true,
      message: 'Status pesanan berhasil diupdate'
    });
  } catch (error) {
    next(error);
  }
};
