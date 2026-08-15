# ShopMin - E-Commerce

Toko online modern dengan tampilan minimalis, dibangun dengan React + Express + SQLite.

## Tech Stack

**Frontend**

- React 19 + TypeScript
- Tailwind CSS
- Framer Motion (animasi)
- Lucide React (ikon)

**Backend**

- Express 5
- SQLite (better-sqlite3)
- JWT (jsonwebtoken)
- bcryptjs (hashing password)

## Fitur

- **Katalog Produk** — pencarian, filter kategori, sorting
- **Detail Produk** — galeri gambar, pilihan warna/ukuran, spesifikasi, ulasan
- **Keranjang Belanja** — tambah/hapus item, ubah jumlah, kode promo
- **Checkout** — form data penerima, pilihan metode pembayaran
- **Riwayat Pesanan** — status pesanan, lacak pengiriman
- **Wishlist** — simpan produk favorit
- **Auth** — register, login, JWT token
- **Ulasan** — tulis ulasan dengan rating bintang

## Struktur Project

```
ShopMin/
├── server/
│   ├── index.js              # Express server entry
│   ├── database.js           # SQLite setup, schema, seed data
│   ├── middleware/
│   │   └── auth.js           # JWT auth middleware
│   └── routes/
│       ├── auth.js           # Register, login, /me
│       ├── products.js       # CRUD produk
│       ├── orders.js         # CRUD pesanan
│       ├── reviews.js        # CRUD ulasan
│       ├── promo.js          # Validasi kode promo
│       └── wishlist.js       # CRUD wishlist
├── src/
│   ├── main.tsx
│   ├── App.tsx               # Router & screen manager
│   ├── api.ts                # API client (fetch + token)
│   ├── types.ts              # TypeScript type definitions
│   ├── context/
│   │   └── ShopContext.tsx    # Global state & API integration
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Toast.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── KatalogScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   ├── OrderSuccessScreen.tsx
│   │   ├── OrderHistoryScreen.tsx
│   │   ├── WishlistScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── WriteReviewModal.tsx
│   ├── data/
│   │   └── mockData.ts       # Data awal (fallback)
│   └── utils/
│       └── formatters.ts     # Format IDRGit
├── .env                      # Environment variables
├── .gitignore
└── package.json
```

## Database

**Engine:** SQLite (file-based)
**File:** `server/shopmin.db` (auto-generated saat pertama kali run)

### Tabel

| Tabel         | Keterangan                                 |
| ------------- | ------------------------------------------ |
| `users`       | Akun pengguna (nama, email, password hash) |
| `products`    | Katalog produk (12 item seed data)         |
| `orders`      | Header pesanan                             |
| `order_items` | Item dalam pesanan                         |
| `reviews`     | Ulasan produk                              |
| `promo_codes` | Kode diskon (4 kode seed data)             |
| `wishlist`    | Produk favorit user                        |

### Seed Data

- 12 produk (Elektronik, Fashion, Home, Aksesoris)
- 4 kode promo: `DISKON20`, `HEMAT50`, `SHOPMIN10`, `FREESHIP`
- 3 ulasan
- 1 akun demo: `agil@example.com` / `password123`

## API Endpoints

| Method | Endpoint                   | Keterangan                         | Auth |
| ------ | -------------------------- | ---------------------------------- | ---- |
| GET    | `/api/health`              | Cek server status                  | -    |
| GET    | `/api/products`            | List produk (filter, search, sort) | -    |
| GET    | `/api/products/:id`        | Detail produk                      | -    |
| GET    | `/api/reviews/:productId`  | Ulasan produk                      | -    |
| POST   | `/api/reviews`             | Tulis ulasan                       | -    |
| GET    | `/api/promo/:code`         | Validasi kode promo                | -    |
| POST   | `/api/auth/register`       | Daftar akun                        | -    |
| POST   | `/api/auth/login`          | Login                              | -    |
| GET    | `/api/auth/me`             | Data user login                    | Ya   |
| POST   | `/api/orders`              | Buat pesanan                       | -    |
| GET    | `/api/orders`              | Riwayat pesanan user               | Ya   |
| DELETE | `/api/orders/:id`          | Hapus pesanan                      | Ya   |
| DELETE | `/api/orders`              | Hapus semua riwayat                | Ya   |
| GET    | `/api/wishlist`            | Ambil wishlist                     | Ya   |
| POST   | `/api/wishlist/:productId` | Tambah ke wishlist                 | Ya   |
| DELETE | `/api/wishlist/:productId` | Hapus dari wishlist                | Ya   |

## Cara Menjalankan

### Prerequisites

- Node.js v18+
- npm

### Install

```bash
npm install
```

### Development

Jalankan backend terlebih dahulu, lalu frontend:

```bash
# Terminal 1 — jalankan backend server
npm run server

# Terminal 2 — jalankan frontend client
npm run client
```

Atau jalankan sekaligus dengan `concurrently`:

```bash
npm run dev
```

Server: `http://localhost`
Client: `http://localhost`

### Production Build

```bash
npm run build
npm run preview
```

### Lint / Type Check

```bash
npm run lint
```

## Environment Variables

Buat file `.env` di root project:

```env
PORT=
JWT_SECRET=your-secret-key-here
```

## Kontribusi

1. Fork project
2. Buat branch baru (`git checkout -b fitur/nama-fitur`)
3. Commit perubahan (`git commit -m 'Tambah fitur X'`)
4. Push ke branch (`git push origin fitur/nama-fitur`)
5. Buka Pull Request

## Lisensi

MIT
