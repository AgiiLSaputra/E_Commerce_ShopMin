import express from 'express';
import { getDb } from '../database.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function genOrderNum() { const d=new Date(); return `ORD-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}-${Math.floor(100+Math.random()*900)}`; }
function genInvoice() { const d=new Date(); return `INV/${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}/XXI/V/${Math.floor(1000000+Math.random()*9000000)}`; }
function genDelivery() { const mn=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']; const d1=new Date(); d1.setDate(d1.getDate()+2); const d2=new Date(); d2.setDate(d2.getDate()+4); return `${d1.getDate()} - ${d2.getDate()} ${mn[d2.getMonth()]} ${d2.getFullYear()}`; }

router.post('/', (req, res) => {
  const db = getDb();
  const { items, recipient, paymentMethod } = req.body;
  if (!items?.length || !recipient || !paymentMethod) return res.status(400).json({ error: 'Data tidak lengkap' });

  const userId = req.user?.id || null;
  let subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax + 20000;
  const orderId = `ord-${Date.now()}`;
  const dateStr = new Date().toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
  const tracking = JSON.stringify([
    { title:'Pesanan Dibuat', description:`Dibuat dengan metode ${paymentMethod}`, timestamp:'Baru saja', completed:true },
    { title:'Sedang Diproses', description:'Gudang menyiapkan pesanan', timestamp:'Sedang Berlangsung', completed:true },
    { title:'Diserahkan ke Kurir', description:'Menunggu penjemputan', timestamp:'Estimasi besok', completed:false },
    { title:'Dalam Pengiriman', description:`Menuju ${recipient.city}`, timestamp:'-', completed:false },
    { title:'Pesanan Selesai', description:'Paket diterima', timestamp:'-', completed:false },
  ]);

  db.prepare(`INSERT INTO orders (id,order_number,invoice_number,user_id,date,status,subtotal,tax,shipping_cost,discount,total,recipient_name,recipient_phone,recipient_city,recipient_address,payment_method,estimated_delivery,tracking_steps) VALUES (?,?,?,?,?,'Diproses',?,?,20000,0,?,?,?,?,?,?,?,?)`)
    .run(orderId, genOrderNum(), genInvoice(), userId, dateStr, subtotal, tax, total, recipient.fullName, recipient.phoneNumber, recipient.city, recipient.fullAddress, paymentMethod, genDelivery(), tracking);

  const ins = db.prepare('INSERT INTO order_items (order_id,product_id,name,image,variant,quantity,price) VALUES (?,?,?,?,?,?,?)');
  items.forEach(i => ins.run(orderId, i.productId, i.name, i.image, i.variant||'', i.quantity, i.price));

  res.json({ order: { id:orderId, orderNumber:db.prepare('SELECT order_number FROM orders WHERE id=?').get(orderId).order_number, invoiceNumber:db.prepare('SELECT invoice_number FROM orders WHERE id=?').get(orderId).invoice_number, date:dateStr, status:'Diproses', items, subtotal, tax, shippingCost:20000, discount:0, total, recipient, paymentMethod, estimatedDelivery:db.prepare('SELECT estimated_delivery FROM orders WHERE id=?').get(orderId).estimated_delivery, trackingSteps:JSON.parse(tracking) } });
});

router.get('/', requireAuth, (req, res) => {
  const db = getDb();
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  const result = orders.map(o => ({
    id:o.id, orderNumber:o.order_number, invoiceNumber:o.invoice_number, date:o.date, status:o.status,
    items: db.prepare('SELECT * FROM order_items WHERE order_id=?').all(o.id).map(i => ({ productId:i.product_id, name:i.name, image:i.image, variant:i.variant, quantity:i.quantity, price:i.price })),
    subtotal:o.subtotal, tax:o.tax, shippingCost:o.shipping_cost, discount:o.discount, total:o.total,
    recipient:{ fullName:o.recipient_name, phoneNumber:o.recipient_phone, city:o.recipient_city, fullAddress:o.recipient_address },
    paymentMethod:o.payment_method, estimatedDelivery:o.estimated_delivery, trackingSteps:JSON.parse(o.tracking_steps),
  }));
  res.json({ orders: result });
});

router.delete('/:id', requireAuth, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM order_items WHERE order_id = ?').run(req.params.id);
  db.prepare('DELETE FROM orders WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

router.delete('/', requireAuth, (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE user_id = ?)').run(req.user.id);
  db.prepare('DELETE FROM orders WHERE user_id = ?').run(req.user.id);
  res.json({ success: true });
});

export default router;
