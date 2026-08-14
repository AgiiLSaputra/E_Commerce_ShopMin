import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('🌱 Memulai seeding data...');

    // 1. Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    await connection.query(`
      INSERT INTO users (name, email, password, phone, avatar) VALUES
      ('Budi Santoso', 'budi@example.com', '${hashedPassword}', '081234567890', 'https://ui-avatars.com/api/?name=Budi+Santoso'),
      ('Siti Nurhaliza', 'siti@example.com', '${hashedPassword}', '081234567891', 'https://ui-avatars.com/api/?name=Siti+Nurhaliza'),
      ('Ahmad Rizki', 'ahmad@example.com', '${hashedPassword}', '081234567892', 'https://ui-avatars.com/api/?name=Ahmad+Rizki')
    `);
    console.log('✅ Users seeded');

    // 2. Seed Products
    await connection.query(`
      INSERT INTO products (name, slug, description, price, original_price, category, stock, sold, rating, review_count, image_url) VALUES
      ('Headphone Wireless Premium', 'headphone-wireless-premium', 'Headphone wireless dengan noise cancellation aktif, battery life 30 jam, dan kualitas suara Hi-Fi premium.', 899000, 1299000, 'Elektronik', 50, 120, 4.8, 45, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'),
      ('Powerbank 20000mAh Fast Charging', 'powerbank-20000mah', 'Powerbank kapasitas besar dengan teknologi fast charging 18W, dilengkapi 2 USB port dan 1 USB-C.', 299000, 399000, 'Elektronik', 100, 250, 4.7, 89, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500'),
      ('Mechanical Keyboard RGB', 'mechanical-keyboard-rgb', 'Keyboard mechanical dengan switch blue, RGB backlight customizable, dan build quality premium untuk gaming dan typing.', 750000, 950000, 'Elektronik', 30, 85, 4.9, 67, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500'),
      ('Wireless Mouse Gaming', 'wireless-mouse-gaming', 'Mouse gaming wireless dengan sensor 16000 DPI, battery life 70 jam, dan RGB lighting.', 450000, 599000, 'Elektronik', 75, 145, 4.6, 52, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'),
      ('Monitor LED 24 inch Full HD', 'monitor-led-24-inch', 'Monitor LED 24 inch dengan resolusi Full HD 1920x1080, refresh rate 75Hz, perfect untuk kerja dan gaming.', 1499000, 1899000, 'Elektronik', 25, 60, 4.7, 38, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500'),
      ('Kaos Polos Premium Cotton', 'kaos-polos-premium', 'Kaos polos 100% cotton combed 30s, nyaman dipakai sehari-hari, tersedia berbagai warna.', 89000, 129000, 'Fashion', 200, 450, 4.5, 128, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'),
      ('Sneakers Casual Pria', 'sneakers-casual-pria', 'Sepatu sneakers casual dengan desain minimalis, bahan canvas premium, cocok untuk daily wear.', 349000, 499000, 'Fashion', 80, 180, 4.6, 95, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500'),
      ('Mug Keramik Premium', 'mug-keramik-premium', 'Mug keramik berkualitas tinggi dengan desain minimalis, kapasitas 350ml, cocok untuk kopi atau teh.', 65000, 99000, 'Home', 150, 320, 4.4, 78, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500'),
      ('Lampu Meja LED Modern', 'lampu-meja-led-modern', 'Lampu meja LED dengan 3 tingkat kecerahan, desain modern minimalis, hemat energi.', 175000, 249000, 'Home', 60, 140, 4.7, 56, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500'),
      ('Jam Tangan Analog Classic', 'jam-tangan-analog-classic', 'Jam tangan analog dengan desain classic elegant, tali stainless steel, water resistant.', 599000, 899000, 'Aksesoris', 40, 95, 4.8, 43, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500'),
      ('Dompet Kulit Pria Premium', 'dompet-kulit-premium', 'Dompet kulit asli premium dengan banyak slot kartu, desain slim dan elegant.', 249000, 349000, 'Aksesoris', 90, 210, 4.5, 87, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500')
    `);
    console.log('✅ Products seeded');

    // 3. Seed Product Images
    await connection.query(`
      INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
      (1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', TRUE, 1),
      (1, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500', FALSE, 2),
      (2, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500', TRUE, 1),
      (3, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500', TRUE, 1),
      (4, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', TRUE, 1),
      (5, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', TRUE, 1),
      (6, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', TRUE, 1),
      (7, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500', TRUE, 1),
      (8, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500', TRUE, 1),
      (9, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', TRUE, 1),
      (10, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500', TRUE, 1),
      (11, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', TRUE, 1)
    `);
    console.log('✅ Product Images seeded');

    // 4. Seed Product Variants
    await connection.query(`
      INSERT INTO product_variants (product_id, variant_type, variant_value, price_adjustment, stock) VALUES
      (1, 'color', 'Hitam', 0, 20),
      (1, 'color', 'Putih', 0, 15),
      (1, 'color', 'Biru', 0, 15),
      (6, 'size', 'S', 0, 50),
      (6, 'size', 'M', 0, 80),
      (6, 'size', 'L', 0, 50),
      (6, 'size', 'XL', 0, 20),
      (6, 'color', 'Hitam', 0, 50),
      (6, 'color', 'Putih', 0, 50),
      (6, 'color', 'Abu-abu', 0, 50),
      (6, 'color', 'Navy', 0, 50),
      (7, 'size', '39', 0, 20),
      (7, 'size', '40', 0, 20),
      (7, 'size', '41', 0, 20),
      (7, 'size', '42', 0, 20)
    `);
    console.log('✅ Product Variants seeded');

    // 5. Seed Promo Codes
    await connection.query(`
      INSERT INTO promo_codes (code, description, discount_type, discount_value, min_purchase, max_discount, valid_until, usage_limit, is_active) VALUES
      ('DISKON20', 'Diskon 20% untuk semua produk', 'percentage', 20, 100000, 100000, '2026-12-31', 100, TRUE),
      ('HEMAT50', 'Potongan Rp 50.000 min. belanja Rp 500.000', 'fixed', 50000, 500000, NULL, '2026-12-31', 50, TRUE),
      ('SHOPMIN10', 'Diskon 10% tanpa minimum pembelian', 'percentage', 10, 0, 50000, '2026-12-31', NULL, TRUE),
      ('FREESHIP', 'Gratis ongkir untuk pembelian di atas Rp 200.000', 'fixed', 0, 200000, NULL, '2026-12-31', NULL, TRUE)
    `);
    console.log('✅ Promo Codes seeded');

    // 6. Seed Reviews
    await connection.query(`
      INSERT INTO reviews (product_id, user_id, user_name, rating, comment, is_verified, created_at) VALUES
      (1, 1, 'Budi Santoso', 5, 'Headphone mantap! Suara jernih, bass nendang, noise cancelling bekerja sempurna. Recommended!', TRUE, '2026-08-01 10:30:00'),
      (1, 2, 'Siti Nurhaliza', 5, 'Kualitas premium, nyaman dipakai seharian. Battery life sesuai deskripsi.', TRUE, '2026-08-05 14:20:00'),
      (1, 3, 'Ahmad Rizki', 4, 'Bagus sih, cuma agak berat kalau dipakai lama. Overall puas!', TRUE, '2026-08-10 09:15:00'),
      (2, 1, 'Budi Santoso', 5, 'Powerbank terbaik yang pernah saya beli. Fast charging works great!', TRUE, '2026-07-25 16:45:00'),
      (2, 2, 'Siti Nurhaliza', 4, 'Kapasitas besar, tapi agak berat. Cocok untuk travel.', TRUE, '2026-08-08 11:30:00'),
      (3, 3, 'Ahmad Rizki', 5, 'Keyboard mechanical terbaik di harga segini. RGB-nya keren!', TRUE, '2026-08-12 20:10:00'),
      (6, 1, 'Budi Santoso', 4, 'Kaos nyaman, bahan adem. Ukuran pas sesuai size chart.', TRUE, '2026-08-03 13:25:00'),
      (7, 2, 'Siti Nurhaliza', 5, 'Sepatu bagus dan nyaman, cocok untuk jalan-jalan.', TRUE, '2026-08-07 15:50:00')
    `);
    console.log('✅ Reviews seeded');

    console.log('🎉 Seeding selesai! Database siap digunakan.');

  } catch (error) {
    console.error('❌ Error saat seeding:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

seedData()
  .then(() => {
    console.log('✨ Seeding berhasil!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding gagal:', error);
    process.exit(1);
  });
