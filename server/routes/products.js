import express from 'express';
import { getDb } from '../database.js';

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const { category, search, sort } = req.query;

  let query = 'SELECT * FROM products WHERE in_stock = 1';
  const params = [];

  if (category && category !== 'Semua') {
    query += ' AND category = ?';
    params.push(category);
  }
  if (search) {
    query += ' AND (name LIKE ? OR category LIKE ? OR description LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }
  if (sort === 'harga-rendah') query += ' ORDER BY price ASC';
  else if (sort === 'harga-tinggi') query += ' ORDER BY price DESC';
  else if (sort === 'rating') query += ' ORDER BY rating DESC';
  else query += ' ORDER BY id ASC';

  const products = db.prepare(query).all(...params);
  const parsed = products.map(p => ({
    id: p.id, name: p.name, category: p.category, price: p.price,
    originalPrice: p.original_price, badge: p.badge, rating: p.rating,
    reviewsCount: p.reviews_count, image: p.image, images: JSON.parse(p.images),
    description: p.description, colors: JSON.parse(p.colors),
    variants: JSON.parse(p.variants), features: JSON.parse(p.features),
    specs: JSON.parse(p.specs), inStock: !!p.in_stock,
  }));

  res.json({ products: parsed });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const p = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Produk tidak ditemukan' });

  res.json({
    product: {
      id: p.id, name: p.name, category: p.category, price: p.price,
      originalPrice: p.original_price, badge: p.badge, rating: p.rating,
      reviewsCount: p.reviews_count, image: p.image, images: JSON.parse(p.images),
      description: p.description, colors: JSON.parse(p.colors),
      variants: JSON.parse(p.variants), features: JSON.parse(p.features),
      specs: JSON.parse(p.specs), inStock: !!p.in_stock,
    },
  });
});

export default router;
