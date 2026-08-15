import express from 'express';
import { getDb } from '../database.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const db = getDb();
  const items = db.prepare(`
    SELECT p.* FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
  `).all(req.user.id);

  res.json({
    wishlist: items.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.original_price,
      badge: p.badge,
      rating: p.rating,
      reviewsCount: p.reviews_count,
      image: p.image,
      inStock: !!p.in_stock,
    })),
  });
});

router.post('/:productId', requireAuth, (req, res) => {
  const db = getDb();
  const { productId } = req.params;

  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
  if (!product) return res.status(404).json({ error: 'Produk tidak ditemukan' });

  const existing = db.prepare('SELECT user_id FROM wishlist WHERE user_id = ? AND product_id = ?').get(req.user.id, productId);
  if (existing) return res.status(409).json({ error: 'Produk sudah ada di wishlist' });

  db.prepare('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)').run(req.user.id, productId);

  res.json({ message: 'Produk ditambahkan ke wishlist' });
});

router.delete('/:productId', requireAuth, (req, res) => {
  const db = getDb();
  const { productId } = req.params;

  const result = db.prepare('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?').run(req.user.id, productId);
  if (result.changes === 0) return res.status(404).json({ error: 'Produk tidak ditemukan di wishlist' });

  res.json({ message: 'Produk dihapus dari wishlist' });
});

router.get('/check/:productId', requireAuth, (req, res) => {
  const db = getDb();
  const item = db.prepare('SELECT user_id FROM wishlist WHERE user_id = ? AND product_id = ?').get(req.user.id, req.params.productId);
  res.json({ isWishlisted: !!item });
});

export default router;
