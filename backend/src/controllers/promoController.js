import { getPool } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all promo codes
export const getPromoCodes = async (req, res, next) => {
  try {
    const pool = getPool();

    const [promos] = await pool.query(
      `SELECT 
        id, code, description, discount_type, discount_value,
        min_purchase, max_discount, valid_from, valid_until,
        usage_limit, usage_count, is_active
       FROM promo_codes
       WHERE is_active = true
       AND (valid_until IS NULL OR valid_until > NOW())
       ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: {
        promos: promos.map(promo => ({
          id: promo.id,
          code: promo.code,
          description: promo.description,
          discountType: promo.discount_type,
          discountValue: parseFloat(promo.discount_value),
          minPurchase: parseFloat(promo.min_purchase),
          maxDiscount: promo.max_discount ? parseFloat(promo.max_discount) : null,
          validFrom: promo.valid_from,
          validUntil: promo.valid_until,
          usageLimit: promo.usage_limit,
          usageCount: promo.usage_count,
          isActive: promo.is_active
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Validate promo code
export const validatePromoCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { subtotal } = req.query;
    const pool = getPool();

    if (!code) {
      throw new AppError('Kode promo harus diisi', 400);
    }

    const [promos] = await pool.query(
      `SELECT * FROM promo_codes 
       WHERE code = ? 
       AND is_active = true 
       AND (valid_until IS NULL OR valid_until > NOW())
       AND (usage_limit IS NULL OR usage_count < usage_limit)`,
      [code.toUpperCase()]
    );

    if (promos.length === 0) {
      throw new AppError('Kode promo tidak valid atau sudah tidak berlaku', 400);
    }

    const promo = promos[0];
    const subtotalAmount = parseFloat(subtotal) || 0;

    // Check minimum purchase
    if (subtotalAmount < parseFloat(promo.min_purchase)) {
      throw new AppError(
        `Minimum pembelian untuk kode ini adalah Rp ${parseFloat(promo.min_purchase).toLocaleString('id-ID')}`,
        400
      );
    }

    // Calculate discount
    let discount = 0;
    if (promo.discount_type === 'percentage') {
      discount = subtotalAmount * (parseFloat(promo.discount_value) / 100);
      if (promo.max_discount) {
        discount = Math.min(discount, parseFloat(promo.max_discount));
      }
    } else {
      discount = parseFloat(promo.discount_value);
    }

    res.json({
      success: true,
      message: 'Kode promo valid',
      data: {
        promo: {
          id: promo.id,
          code: promo.code,
          description: promo.description,
          discountType: promo.discount_type,
          discountValue: parseFloat(promo.discount_value),
          discount: parseFloat(discount.toFixed(2)),
          minPurchase: parseFloat(promo.min_purchase),
          maxDiscount: promo.max_discount ? parseFloat(promo.max_discount) : null
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
