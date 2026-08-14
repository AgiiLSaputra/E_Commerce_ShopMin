# Product Requirements Document (PRD)
## Project: ShopMin

*Versi Final — Telah disesuaikan dengan kebutuhan prioritas, scope, dan spesifikasi teknis.*

---

## 1. Overview

ShopMin adalah project simulasi e-commerce yang dibangun sebagai showcase portfolio developer. Project ini merepresentasikan alur bisnis e-commerce sungguhan (browse → detail → cart → checkout) tanpa kompleksitas backend penuh seperti integrasi payment gateway asli atau sistem inventory. 
**Platform:** Web, responsive, mobile-first. 
**Stack:** React (frontend) + backend dengan database SQL.

---

## 2. Problem Statement

Banyak developer pemula/menengah kesulitan menemukan project portfolio yang cukup kompleks untuk menunjukkan kemampuan full-stack (state management, flow transaksi, UI/UX) tapi tetap achievable dalam waktu terbatas. Website e-commerce nyata biasanya terlalu rumit, sehingga dibutuhkan versi "simulasi" yang tetap merepresentasikan alur bisnis dengan fokus pada fungsionalitas utama dan kemudahan belajar.

---

## 3. Goals & Objectives

1. Membangun alur belanja online yang lengkap (browse → detail → cart → checkout) sebagai showcase portfolio.
2. Mempelajari dan mempraktikkan state management (cart, wishlist, auth) dalam aplikasi frontend React dan integrasi ke backend SQL.
3. Menghasilkan UI/UX yang bersih, responsif, dan enak dipakai sebagai bahan demo.

---

## 4. Target User

- **Prioritas Utama:** Pengguna e-commerce umum (usia 18–35 tahun, familiar dengan belanja online). Desain dan flow dioptimalkan untuk kenyamanan pengguna umum.
- **Pengguna Sekunder:** Recruiter/klien yang mengevaluasi portfolio developer (bisa mencoba end-to-end flow dengan cepat).

---

## 5. Scope & Fitur (Semua Masuk Fase V1)

### Fitur Utama (Core)
1. **Katalog Produk:** List produk, search, filter kategori, sort harga.
2. **Halaman Detail Produk:** Gambar, deskripsi, pilihan varian, quantity.
3. **Keranjang Belanja:** Tambah/hapus/update qty, ringkasan harga.
4. **Checkout & Pembayaran Dummy:** 
   - Metode: **COD & E-Wallet**.
   - Form alamat pengiriman lengkap.
   - **Guest Checkout:** Tidak perlu login untuk berbelanja (fokus untuk kemudahan belajar/demo).

### Fitur Tambahan (Terintegrasi)
5. **Autentikasi Sederhana:** Login/register opsional.
6. **Riwayat Pesanan:** 
   - Menyimpan daftar order sebelumnya dan status order (membutuhkan login).
   - Dilengkapi dengan **fitur hapus riwayat pesanan**.
7. **Wishlist:** Tambah/hapus produk favorit.
8. **Kode Promo/Voucher:** Input kode saat checkout untuk potongan harga.
9. **Dark Mode:** Toggle tampilan gelap/terang.
10. **Rating & Review Produk:** Sistem ulasan di halaman detail.

### Out of Scope
1. Integrasi payment gateway asli (hanya simulasi metode dummy).
2. Sistem inventory/admin panel yang kompleks.
3. Notifikasi email/SMS real.
4. Aplikasi mobile native (Android/iOS).

---

## 6. Resolusi Alur Checkout vs Login

Karena checkout dirancang agar **tidak memerlukan login** (Guest Checkout), maka flow riwayat pesanannya ditetapkan sebagai berikut:
- **Jika User Belum Login:** User tetap bisa melakukan proses checkout dari awal hingga mendapatkan nomor invoice (Guest Checkout). Namun, pesanan ini tidak akan masuk ke menu "Riwayat Pesanan".
- **Jika User Login:** Pesanan akan dikaitkan ke akun user. User dapat melihat status pesanannya dan **menghapus data riwayat pesanannya** melalui halaman khusus.

---

## 7. Struktur Data Dummy Rekomendasi (20 Produk, 4 Kategori)

Sebagai basis data awal, akan disiapkan 20 produk yang dibagi rata ke dalam 4 kategori berikut agar terlihat realistis:

1. **Elektronik & Gadget**
   - Smartphone Pro Max (Dummy)
   - Laptop Ultrabook 14"
   - TWS Earbuds dengan Active Noise Cancelling
   - Smartwatch Fitness Tracker
   - Powerbank 20.000 mAh

2. **Fashion & Pakaian**
   - Kaos Polos Katun Premium
   - Kemeja Flanel Lengan Panjang
   - Jaket Hoodie Pria/Wanita
   - Celana Jeans Slim Fit
   - Sepatu Sneakers Casual

3. **Kebutuhan Rumah (Home & Living)**
   - Lampu Meja Belajar LED
   - Diffuser Aromaterapi
   - Rak Buku Minimalis Susun
   - Bantal Duduk Ergonomis
   - Termos Air Panas Stainless

4. **Aksesoris & Perlengkapan**
   - Tas Ransel/Backpack Waterproof
   - Kacamata Anti Radiasi
   - Dompet Kulit Sintetis
   - Stand Laptop Aluminium
   - Mouse Wireless Silent

---

## 8. Functional Requirements

| ID | Requirement | Detail |
|----|-------------|--------|
| FR-1 | Katalog Produk | Fetch data 20 produk, fitur search, filter (4 kategori), sort (harga termurah/termahal). |
| FR-2 | Detail Produk | Menampilkan gambar, deksripsi, pilihan varian (warna/ukuran), dan input quantity. |
| FR-3 | Cart Management | Simpan produk di keranjang (state management React), kalkulasi subtotal. |
| FR-4 | Guest Checkout | Form pengisian: Nama Penerima, Alamat Lengkap, Kota, Kode Pos, No. HP. |
| FR-5 | Simulasi Pembayaran| Pilihan pembayaran COD atau E-Wallet (misal: GoPay/OVO dummy). Berujung pada halaman sukses. |
| FR-6 | Auth Sederhana | Fungsi pendaftaran & login akun menggunakan database SQL. |
| FR-7 | Riwayat Pesanan | Menampilkan order dari user yang login. Menyediakan tombol **"Hapus Riwayat"**. |
| FR-8 | Interaksi Lainnya | Wishlist, Rating & Review, Input Kode Promo berfungsi sesuai simulasi. |
| FR-9 | Dark Mode | State UI untuk mengubah tema secara global. |

---

## 9. Non-Functional Requirements

- **Tech Stack:**
  - Frontend: **React** (State management menggunakan Context API / Redux / Zustand).
  - Backend: **SQL Database** (MySQL atau PostgreSQL disarankan untuk relasi tabel pesanan, user, dan produk).
- **Responsive:** Mobile-first design, dapat dibuka mulus di HP, Tablet, maupun Desktop.
- **Performa:** Navigasi antar halaman (React Router) berjalan instan.

---

## 10. Content Map (Struktur Halaman)

* **Navbar Utama:** Logo ShopMin, Search bar, Ikon Cart, Ikon Wishlist, Akun (Login/Profil), Toggle Dark Mode.
* **Footer:** Deskripsi showcase portfolio, copyright.
* **Halaman Katalog (Home):** Grid 20 produk dummy, sidebar/topbar untuk filter kategori & sort.
* **Halaman Detail Produk:** View spesifik item + form tambah keranjang & review.
* **Halaman Cart:** Tabel item keranjang, ringkasan biaya, input kode promo, tombol lanjut checkout.
* **Halaman Checkout:** Form data penerima, radio button untuk COD / E-Wallet, tombol bayar.
* **Halaman Konfirmasi (Success):** Nomor invoice dummy, ringkasan order, estimasi pengiriman dummy.
* **Halaman Riwayat Pesanan:** List pesanan user (dengan login) + fungsi hapus riwayat.
* **Halaman Wishlist & Login/Register:** Fitur penunjang standar.
