import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

router.get('/:productId', (req, res) => {
  const db = getDb();
  const reviews = db.prepare('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC').all(req.params.productId);
  res.json({ reviews: reviews.map(r => ({ id:r.id, productId:r.product_id, userName:r.user_name, isVerified:!!r.is_verified, date:r.date, rating:r.rating, title:r.title, comment:r.comment })) });
});

router.post('/', (req, res) => {
  const db = getDb();
  const { productId, userName, rating, title, comment } = req.body;
  if (!productId || !rating || !title || !comment) return res.status(400).json({ error: 'Data tidak lengkap' });

  const id = `rev-${Date.now()}`;
  const date = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  db.prepare('INSERT INTO reviews (id,product_id,user_id,user_name,is_verified,date,rating,title,comment) VALUES (?,?,?,1,?,?,?,?)')
    .run(id, productId, req.user?.id||null, userName||'Pembeli Terverifikasi', date, rating, title, comment);

  const stats = db.prepare('SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id=?').get(productId);
  if (stats) db.prepare('UPDATE products SET rating=?, reviews_count=? WHERE id=?').run(Math.round(stats.avg_rating*10)/10, stats.count, productId);

  res.json({ review: { id, productId, userName:userName||'Pembeli Terverifikasi', isVerified:true, date, rating, title, comment } });
});

export default router;
