# ShopMin

E-commerce full-stack portfolio project — React frontend + Express.js backend + MySQL database.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Motion |
| Backend | Node.js, Express.js |
| Database | MySQL (XAMPP) |
| Auth | JWT + bcrypt |

## Fitur

- Katalog produk (search, filter kategori, sort harga)
- Detail produk (gambar, varian warna/ukuran, quantity)
- Shopping cart (tambah/hapus/update qty)
- Checkout & pembayaran dummy (COD, GoPay, OVO, Bank Transfer)
- Guest checkout (tidak perlu login)
- Autentikasi (login/register)
- Riwayat pesanan + hapus riwayat
- Wishlist produk
- Kode promo/voucher
- Rating & review produk
- Animasi transisi di semua halaman
- Responsive mobile-first

## Requirements

- [Node.js](https://nodejs.org/) v16+
- [XAMPP](https://www.apachefriends.org/) (MySQL)

## Setup

### 1. Install XAMPP & jalankan MySQL

Buka XAMPP Control Panel → klik **Start** pada MySQL.

### 2. Install semua dependencies

```bash
npm run install:all
```

### 3. Setup database

```bash
npm run migrate    # buat database & tabel
npm run seed       # insert data dummy
```

### 4. Jalankan aplikasi

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Matikan server

Tekan `Ctrl+C` di terminal.

## Project Structure

```
E_Commerce_ShopMin/
├── package.json              # root scripts (concurrently)
├── .gitignore
├── .env.example
├── ShopMin_PRD_Final.md      # product requirements document
│
├── ShopMin/                  # frontend (React + Vite)
│   ├── src/
│   │   ├── components/       # 15 komponen UI
│   │   ├── context/          # state management (Context API)
│   │   ├── data/             # mock data
│   │   ├── types.ts          # TypeScript types
│   │   ├── utils/            # formatters
│   │   └── App.tsx           # main app
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── backend/                  # backend (Express + MySQL)
    ├── src/
    │   ├── config/           # database connection
    │   ├── controllers/      # 7 controllers
    │   ├── database/         # schema, migrate, seed
    │   ├── middleware/       # auth, error handler
    │   └── routes/           # 7 route groups
    ├── server.js             # entry point
    ├── .env.example
    └── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product detail |
| POST | `/api/cart` | Add to cart |
| GET | `/api/cart` | Get cart |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get orders (login) |
| POST | `/api/wishlist` | Add to wishlist |
| POST | `/api/reviews` | Create review |
| GET | `/api/promos/validate/:code` | Validate promo |

## Database

11 tabel MySQL:

`users` · `products` · `product_images` · `product_variants` · `cart_items` · `wishlist` · `orders` · `order_items` · `reviews` · `promo_codes`

## Data Dummy

- 11 produk (4 kategori)
- 3 user (password: `password123`)
- 4 kode promo aktif
- Sample reviews & orders

## License

MIT
