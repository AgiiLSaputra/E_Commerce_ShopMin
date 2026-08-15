import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

router.get('/:code', (req, res) => {
  const db = getDb();
  const promo = db.prepare('SELECT * FROM promo_codes WHERE code = ?').get(req.params.code.toUpperCase());
  if (!promo) return res.status(404).json({ error: 'Kode promo tidak valid' });
  res.json({ promo: { code:promo.code, discountPercent:promo.discount_percent, discountAmount:promo.discount_amount, minSpend:promo.min_spend, description:promo.description } });
});

export default router;
