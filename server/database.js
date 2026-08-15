import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'shopmin.db');

let db;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initDatabase() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT DEFAULT '',
      address TEXT DEFAULT '',
      city TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      original_price INTEGER,
      badge TEXT,
      rating REAL DEFAULT 0,
      reviews_count INTEGER DEFAULT 0,
      image TEXT NOT NULL,
      images TEXT NOT NULL DEFAULT '[]',
      description TEXT NOT NULL DEFAULT '',
      colors TEXT NOT NULL DEFAULT '[]',
      variants TEXT DEFAULT '[]',
      features TEXT NOT NULL DEFAULT '[]',
      specs TEXT NOT NULL DEFAULT '[]',
      in_stock INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL,
      invoice_number TEXT NOT NULL,
      user_id INTEGER,
      date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Diproses',
      subtotal INTEGER NOT NULL DEFAULT 0,
      tax INTEGER NOT NULL DEFAULT 0,
      shipping_cost INTEGER NOT NULL DEFAULT 0,
      discount INTEGER NOT NULL DEFAULT 0,
      total INTEGER NOT NULL DEFAULT 0,
      recipient_name TEXT NOT NULL,
      recipient_phone TEXT NOT NULL,
      recipient_city TEXT NOT NULL,
      recipient_address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      estimated_delivery TEXT NOT NULL,
      tracking_steps TEXT NOT NULL DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      image TEXT NOT NULL,
      variant TEXT,
      quantity INTEGER NOT NULL DEFAULT 1,
      price INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      user_id INTEGER,
      user_name TEXT NOT NULL,
      is_verified INTEGER DEFAULT 0,
      date TEXT NOT NULL,
      rating INTEGER NOT NULL,
      title TEXT NOT NULL,
      comment TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS promo_codes (
      code TEXT PRIMARY KEY,
      discount_percent INTEGER,
      discount_amount INTEGER,
      min_spend INTEGER DEFAULT 0,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS wishlist (
      user_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      PRIMARY KEY (user_id, product_id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
    CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
    CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);

  return db;
}

export function seedDatabase() {
  const db = getDb();

  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (productCount.count > 0) return;

  const products = [
    { id: 'prod-headphones-pro-max', name: 'Headphone Nirkabel Pro Max', category: 'Elektronik', price: 2499000, original_price: null, badge: 'BARU', rating: 4.9, reviews_count: 128, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80']), description: 'Experience studio-quality sound with our next-generation wireless headphones. Featuring active noise cancellation, 40-hour battery life.', colors: JSON.stringify([{name:'Matte Black',hex:'#111827',inStock:true},{name:'Cream White',hex:'#F3F4F6',inStock:true},{name:'Navy Blue',hex:'#1E293B',inStock:true}]), variants: JSON.stringify(['Standard Edition','Travel Case Bundle']), features: JSON.stringify(['Active Noise Cancellation (ANC)','High-Resolution Audio certified','Multi-point Bluetooth connectivity','Touch controls for volume and playback']), specs: JSON.stringify([{label:'Weight',value:'254g'},{label:'Battery Life',value:'Up to 40 hours'},{label:'Bluetooth Version',value:'5.3'},{label:'Driver Size',value:'40mm Dynamic'}]), in_stock: 1 },
    { id: 'prod-kaos-basic-katun', name: 'Kaos Basic Katun Premium', category: 'Fashion', price: 149000, original_price: null, badge: null, rating: 4.8, reviews_count: 94, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', images: JSON.stringify(['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80']), description: 'Kaos polos katun combed 24s premium dengan serat benang halus, daya serap keringat maksimal.', colors: JSON.stringify([{name:'Oatmeal Beige',hex:'#D8CEBE',inStock:true},{name:'Pure White',hex:'#FFFFFF',inStock:true},{name:'Charcoal Black',hex:'#1F2937',inStock:true}]), variants: JSON.stringify(['Ukuran S','Ukuran M','Ukuran L','Ukuran XL']), features: JSON.stringify(['100% Katun Combed Berkualitas Tinggi','Jahitan rantai standar distro tahan lama','Tekstur kain lembut dan sejuk di kulit','Warna awet dan tidak mudah pudar']), specs: JSON.stringify([{label:'Material',value:'100% Cotton Combed 24s'},{label:'Fitting',value:'Regular Fit Uniseks'},{label:'Gramasi',value:'185 GSM'}]), in_stock: 1 },
    { id: 'prod-mug-keramik-matte', name: 'Mug Keramik Matte Hitam', category: 'Home', price: 89000, original_price: null, badge: null, rating: 4.9, reviews_count: 76, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', images: JSON.stringify(['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80']), description: 'Cangkir kopi keramik buatan tangan dengan finishing matte bertekstur elegan.', colors: JSON.stringify([{name:'Matte Black',hex:'#262626',inStock:true},{name:'Stone Grey',hex:'#6B7280',inStock:true}]), variants: JSON.stringify(['Mug + Tatakan Kayu','Mug Saja']), features: JSON.stringify(['Bahan keramik food-grade tahan panas','Sudah termasuk tatakan kayu pinus alami','Pegangan ergonomis','Aman untuk microwave dan dishwasher']), specs: JSON.stringify([{label:'Kapasitas',value:'350 ml'},{label:'Material',value:'High-fired Ceramic & Pine Wood'}]), in_stock: 1 },
    { id: 'prod-jam-tangan-minimalis', name: 'Jam Tangan Minimalis Perak', category: 'Aksesoris', price: 799000, original_price: 999000, badge: '-20%', rating: 4.7, reviews_count: 112, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80', images: JSON.stringify(['https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80']), description: 'Arloji klasik kontemporer dengan casing stainless steel ramping, kaca safir anti-gores.', colors: JSON.stringify([{name:'Silver White',hex:'#E5E7EB',inStock:true},{name:'Rose Gold',hex:'#E0A899',inStock:true},{name:'Obsidian Black',hex:'#18181B',inStock:true}]), variants: JSON.stringify(['Strap Kulit Hitam','Strap Kulit Cokelat','Mesh Steel']), features: JSON.stringify(['Movement Japanese Quartz presisi tinggi','Kaca Sapphire Crystal anti gores','Water Resistant 5 ATM','Tali kulit asli dengan quick-release pin']), specs: JSON.stringify([{label:'Diameter Case',value:'40mm'},{label:'Ketebalan',value:'7.2mm'}]), in_stock: 1 },
    { id: 'prod-powerbank-slim', name: 'Powerbank Slim 10000mAh', category: 'Elektronik', price: 299000, original_price: null, badge: null, rating: 4.8, reviews_count: 88, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80', images: JSON.stringify(['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80']), description: 'Pengisi daya portabel 10.000mAh dengan bodi aluminium ultra-ramping.', colors: JSON.stringify([{name:'Space Grey',hex:'#4B5563',inStock:true},{name:'Silver Metallic',hex:'#D1D5DB',inStock:true}]), variants: JSON.stringify(['Standard Edition','Bundle Kabel C-to-C']), features: JSON.stringify(['Fast Charging 22.5W PD & QC 3.0','Dual output port','Multi-protection sistem']), specs: JSON.stringify([{label:'Kapasitas',value:'10,000mAh / 37Wh'}]), in_stock: 1 },
    { id: 'prod-sneakers-putih', name: 'Sneakers Putih Esensial', category: 'Fashion', price: 549000, original_price: null, badge: null, rating: 4.9, reviews_count: 140, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', images: JSON.stringify(['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80']), description: 'Sepatu sneakers kulit sintetis vegan premium dengan desain minimalis.', colors: JSON.stringify([{name:'All White',hex:'#FFFFFF',inStock:true},{name:'White Grey',hex:'#E5E7EB',inStock:true}]), variants: JSON.stringify(['Ukuran 40','Ukuran 41','Ukuran 42','Ukuran 43']), features: JSON.stringify(['Upper Vegan Leather premium','Insole Memory Foam','Outsole karet vulcanized']), specs: JSON.stringify([{label:'Material Upper',value:'Premium Microfiber Leather'}]), in_stock: 1 },
    { id: 'prod-lampu-meja-geometris', name: 'Lampu Meja Geometris', category: 'Home', price: 320000, original_price: null, badge: null, rating: 4.8, reviews_count: 65, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', images: JSON.stringify(['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80']), description: 'Lampu meja arsitektural bernuansa scandinavian modern.', colors: JSON.stringify([{name:'Nordic White',hex:'#F9FAFB',inStock:true},{name:'Matte Charcoal',hex:'#374151',inStock:true}]), variants: JSON.stringify(['Warm White 3000K','Natural Light 4000K']), features: JSON.stringify(['Sudut kepala lampu dapat diputar 180 derajat','Lampu LED hemat energi']), specs: JSON.stringify([{label:'Daya',value:'7 Watt LED'}]), in_stock: 1 },
    { id: 'prod-dompet-kulit-asli', name: 'Dompet Kulit Asli Pria', category: 'Aksesoris', price: 210000, original_price: null, badge: null, rating: 4.9, reviews_count: 92, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', images: JSON.stringify(['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80']), description: 'Dompet bifold klasik berbahan kulit sapi asli Crazy Horse.', colors: JSON.stringify([{name:'Vintage Brown',hex:'#78350F',inStock:true},{name:'Midnight Black',hex:'#111827',inStock:true}]), variants: JSON.stringify(['Bifold 8 Slot','Bifold 12 Slot + Koin']), features: JSON.stringify(['100% Kulit Sapi Asli Crazy Horse','Lapisan RFID Blocking']), specs: JSON.stringify([{label:'Material',value:'Genuine Crazy Horse Leather'}]), in_stock: 1 },
    { id: 'prod-mechanical-keyboard-k8', name: 'Mechanical Keyboard K8', category: 'Elektronik', price: 1250000, original_price: null, badge: null, rating: 4.9, reviews_count: 156, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', images: JSON.stringify(['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80']), description: 'Mechanical keyboard nirkabel layout TKL 87-key dengan switch hot-swappable.', colors: JSON.stringify([{name:'Retro Gray & Orange',hex:'#EA580C',inStock:true},{name:'Stealth Black',hex:'#1F2937',inStock:true}]), variants: JSON.stringify(['Linear Red Switch','Tactile Brown Switch','Clicky Blue Switch']), features: JSON.stringify(['Hot-swappable socket','Dual mode Bluetooth 5.1 & Type-C','Baterai 4000mAh']), specs: JSON.stringify([{label:'Layout',value:'TKL 87 Keys'},{label:'Switch',value:'Gateron G Pro'}]), in_stock: 1 },
    { id: 'prod-wireless-mouse-mx', name: 'Wireless Mouse MX Master', category: 'Elektronik', price: 350000, original_price: null, badge: null, rating: 4.8, reviews_count: 110, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80', images: JSON.stringify(['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80']), description: 'Mouse nirkabel ergonomis dengan sensor optik presisi tinggi.', colors: JSON.stringify([{name:'Graphite Grey',hex:'#374151',inStock:true},{name:'Pale Grey',hex:'#E5E7EB',inStock:true}]), variants: JSON.stringify(['Standar Abu-abu','Standar Hitam']), features: JSON.stringify(['Sensor Darkfield 8000 DPI','MagSpeed scrolling','Quiet clicks']), specs: JSON.stringify([{label:'Sensor',value:'8000 DPI'}]), in_stock: 1 },
    { id: 'prod-monitor-ultrawide-34', name: 'Monitor UltraWide 34"', category: 'Elektronik', price: 5200000, original_price: null, badge: null, rating: 4.9, reviews_count: 48, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80', images: JSON.stringify(['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80']), description: 'Monitor lengkung 34 inci WQHD 21:9 dengan refresh rate 144Hz.', colors: JSON.stringify([{name:'Matte Black',hex:'#111827',inStock:true}]), variants: JSON.stringify(['Curved 1500R WQHD','Flat IPS WQHD']), features: JSON.stringify(['WQHD 3440x1440','144Hz Refresh Rate','USB-C 65W PD']), specs: JSON.stringify([{label:'Ukuran',value:'34 Inci'},{label:'Resolusi',value:'WQHD 3440x1440'}]), in_stock: 1 },
  ];

  const insertProduct = db.prepare(`INSERT INTO products (id, name, category, price, original_price, badge, rating, reviews_count, image, images, description, colors, variants, features, specs, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const insertMany = db.transaction((items) => {
    for (const p of items) {
      insertProduct.run(p.id, p.name, p.category, p.price, p.original_price, p.badge, p.rating, p.reviews_count, p.image, p.images, p.description, p.colors, p.variants, p.features, p.specs, p.in_stock);
    }
  });

  insertMany(products);

  // Seed promo codes
  const insertPromo = db.prepare('INSERT INTO promo_codes (code, discount_percent, discount_amount, min_spend, description) VALUES (?, ?, ?, ?, ?)');
  insertPromo.run('DISKON20', 20, null, 0, 'Diskon 20% untuk semua produk');
  insertPromo.run('HEMAT50', null, 50000, 200000, 'Potongan Rp 50.000 (Min. Belanja Rp 200.000)');
  insertPromo.run('SHOPMIN10', 10, null, 0, 'Diskon 10% Spesial Pengguna Baru');
  insertPromo.run('FREESHIP', null, 20000, 0, 'Gratis Ongkir hingga Rp 20.000');

  // Seed reviews
  const insertReview = db.prepare('INSERT INTO reviews (id, product_id, user_name, is_verified, date, rating, title, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  insertReview.run('rev-1', 'prod-headphones-pro-max', 'Alex M.', 1, 'Oct 12, 2023', 5, 'Incredible sound quality', 'Best headphones I have ever owned. ANC blocks everything.');
  insertReview.run('rev-2', 'prod-headphones-pro-max', 'Sarah J.', 1, 'Sep 28, 2023', 5, 'Great, but a bit heavy', 'Sound profile is amazing. Battery life as advertised.');
  insertReview.run('rev-3', 'prod-headphones-pro-max', 'Budi Santoso', 1, 'Nov 04, 2023', 5, 'Bass mantap!', 'Pengiriman cepat. Suara detail, staging luas.');

  // Seed demo user
  const hashedPassword = bcrypt.hashSync('password123', 10);
  db.prepare('INSERT INTO users (name, email, password, phone, address, city) VALUES (?, ?, ?, ?, ?, ?)').run(
    'Agil Saputra', 'agil@example.com', hashedPassword, '081234567890', 'Jl. Sudirman No. 45, Kebayoran Baru', 'Jakarta Selatan'
  );

  console.log('Database seeded successfully');
}
