# ShopMin Backend API

Backend REST API untuk ShopMin E-Commerce menggunakan Express.js dan MySQL.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 📋 Fitur

- ✅ Autentikasi (Register & Login)
- ✅ Manajemen Produk (CRUD)
- ✅ Shopping Cart (Guest & Authenticated)
- ✅ Checkout & Orders
- ✅ Wishlist
- ✅ Reviews & Ratings
- ✅ Promo Codes
- ✅ Guest Checkout Support

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v16 atau lebih tinggi)
- MySQL (v8.0 atau lebih tinggi)
- npm atau yarn

### Instalasi

1. Clone repository dan masuk ke folder backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

4. Edit file `.env` dan sesuaikan dengan konfigurasi MySQL Anda:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shopmin_db

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:3000
```

5. Jalankan migration untuk membuat database dan tabel:
```bash
npm run migrate
```

6. Seed data dummy ke database:
```bash
npm run seed
```

7. Jalankan server:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user baru | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get product by ID | No |
| GET | `/api/products/search` | Search products | No |
| GET | `/api/products/category/:category` | Get by category | No |
| GET | `/api/products/:id/reviews` | Get product reviews | No |

### Cart

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/cart` | Get cart items | Optional |
| POST | `/api/cart` | Add to cart | Optional |
| PUT | `/api/cart/:itemId` | Update cart item | Optional |
| DELETE | `/api/cart/:itemId` | Remove from cart | Optional |
| DELETE | `/api/cart` | Clear cart | Optional |

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create order | Optional |
| GET | `/api/orders` | Get user orders | Yes |
| GET | `/api/orders/:id` | Get order by ID | Optional |
| DELETE | `/api/orders/:id` | Delete order | Yes |
| PATCH | `/api/orders/:id/status` | Update status | Yes |

### Wishlist

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/wishlist` | Get wishlist | Optional |
| POST | `/api/wishlist` | Add to wishlist | Optional |
| GET | `/api/wishlist/check/:productId` | Check wishlist | Optional |
| DELETE | `/api/wishlist/:itemId` | Remove item | Optional |
| DELETE | `/api/wishlist/product/:productId` | Remove by product | Optional |

### Reviews

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/reviews` | Create review | Optional |
| GET | `/api/reviews/product/:productId` | Get reviews | No |
| DELETE | `/api/reviews/:id` | Delete review | Yes |

### Promo Codes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/promos` | Get all promos | No |
| GET | `/api/promos/validate/:code` | Validate promo | No |

## 🔒 Authentication

API menggunakan JWT (JSON Web Token) untuk autentikasi. Untuk endpoint yang memerlukan autentikasi, sertakan token di header:

```
Authorization: Bearer <your_token>
```

## 🎯 Guest Checkout

API mendukung guest checkout untuk user yang tidak login. Gunakan header `x-session-id` untuk tracking:

```
x-session-id: guest_12345
```

## 📦 Database Schema

Database terdiri dari 11 tabel utama:

- `users` - Data user
- `products` - Data produk
- `product_images` - Gambar produk
- `product_variants` - Varian produk (warna, ukuran, dll)
- `cart_items` - Item di keranjang
- `wishlist` - Wishlist produk
- `orders` - Data pesanan
- `order_items` - Item dalam pesanan
- `reviews` - Review produk
- `promo_codes` - Kode promo

## 🧪 Testing

Gunakan Postman atau Thunder Client untuk testing API. Import collection dari folder `docs/` (jika tersedia).

## 📝 Sample Data

Setelah seeding, database akan berisi:
- 3 users (password: `password123`)
- 11 produk dari 4 kategori
- 4 kode promo aktif
- Sample reviews dan orders

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License

## 👨‍💻 Author

ShopMin Development Team
