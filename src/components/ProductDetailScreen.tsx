import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import type { Product } from '../types';
import { formatIDR } from '../utils/formatters';
import {
  Star,
  ChevronRight,
  Check,
  Minus,
  Plus,
  Heart,
  Truck,
  RotateCcw,
  X,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';

export default function ProductDetailScreen() {
  const {
    selectedProduct: product,
    addToCart,
    toggleWishlist,
    wishlist,
    navigateTo,
    goBack,
    getProductReviews,
  } = useShop();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!product) return null;

  const images = product.images || [product.image];
  const colors = (product.colors || []).map((c) => c.hex);
  const colorNames = (product.colors || []).map((c) => c.name);
  const variants = product.variants || ['S', 'M', 'L', 'XL'];
  const reviews = product ? getProductReviews(product.id) : [];
  const features = product.features || [
    'Kualitas premium',
    'Garansi resmi',
    'Pengiriman cepat',
  ];
  const specs = product.specs || [
    { label: 'Berat', value: '500g' },
    { label: 'Dimensi', value: '20x15x10 cm' },
    { label: 'Material', value: 'Premium' },
  ];

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-slate-50"
    >
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-xs text-slate-400">
          <button onClick={() => goBack()} className="hover:text-slate-600">
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <button
            onClick={() => navigateTo('katalog')}
            className="hover:text-slate-600"
          >
            {product.category}
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 truncate max-w-[120px]">{product.name}</span>
        </nav>

        {/* Main Image */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="aspect-square bg-slate-100">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2 p-3 overflow-x-auto">
            {images.map((img: string, i: number) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                  selectedImage === i ? 'border-slate-900' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-600">{product.rating}</span>
          {product.badge && (
            <span className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded-full font-medium">
              {product.badge}
            </span>
          )}
        </div>

        {/* Title & Price */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-slate-900">{formatIDR(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-slate-400 line-through">
                {formatIDR(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

        {/* Color Picker */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Warna: <span className="font-normal text-slate-500">{colorNames[selectedColor]}</span>
          </h3>
          <div className="flex gap-3">
            {colors.map((color: string, i: number) => (
              <button
                key={i}
                onClick={() => setSelectedColor(i)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedColor === i
                    ? 'ring-2 ring-offset-2 ring-slate-900'
                    : 'border-slate-200'
                }`}
                style={{ backgroundColor: color }}
              >
                {selectedColor === i && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Variant Selector */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Ukuran</h3>
          <div className="flex gap-2">
            {variants.map((v: string, i: number) => (
              <motion.button
                key={v}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedVariant(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  selectedVariant === i
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {v}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Jumlah</h3>
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Add to Cart */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            addToCart(product, colorNames[selectedColor], variants[selectedVariant]);
            navigateTo('cart');
          }}
          className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-semibold text-base hover:bg-slate-800 transition-colors"
        >
          Tambah ke Keranjang
        </motion.button>

        {/* Add to Wishlist */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => toggleWishlist(product.id)}
          className={`w-full py-4 rounded-2xl font-semibold text-base border-2 transition-colors ${
            wishlist.includes(product.id)
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Heart
            className={`w-5 h-5 inline mr-2 ${
              wishlist.includes(product.id) ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
          {wishlist.includes(product.id) ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
        </motion.button>

        {/* Shipping */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-slate-100 flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">Free Standard Shipping</p>
              <p className="text-xs text-slate-400">Untuk pesanan di atas Rp50.000</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100 flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">30-Day Returns</p>
              <p className="text-xs text-slate-400">Garansi pengembalian</p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 space-y-4">
          <h2 className="font-bold text-slate-900">Detail Produk</h2>
          <div className="space-y-2">
            {features.map((f: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-sm text-slate-600">{f}</span>
              </div>
            ))}
          </div>
          <table className="w-full text-sm">
            <tbody>
              {specs.map((s: { label: string; value: string }, i: number) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="py-2 text-slate-400 w-1/3">{s.label}</td>
                  <td className="py-2 text-slate-700 font-medium">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Ulasan Pelanggan</h2>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowReviewModal(true)}
              className="text-xs font-medium text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              <MessageSquare className="w-3 h-3 inline mr-1" />
              Tulis Ulasan
            </motion.button>
          </div>

          {/* Rating Summary */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-black text-slate-900">{product.rating}</p>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${
                      s <= Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">{reviews.length} ulasan</p>
            </div>
          </div>

          {/* Review Cards */}
          <div className="space-y-4">
            {displayedReviews.map((review: any, i: number) => (
              <div key={i} className="border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                    {review.userName?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{review.userName || 'Anonim'}</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-1">{review.comment}</p>
              </div>
            ))}
          </div>

          {reviews.length > 3 && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="w-full py-2 text-sm font-medium text-slate-600 flex items-center justify-center gap-1 hover:text-slate-900"
            >
              {showAllReviews ? 'Tampilkan Lebih Sedikit' : 'Lihat Semua Ulasan'}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showAllReviews ? 'rotate-180' : ''}`}
              />
            </motion.button>
          )}
        </div>
      </div>

      <Footer />

      {/* Write Review Modal */}
      <AnimatePresence>
        {showReviewModal && <WriteReviewModal product={product} onClose={() => setShowReviewModal(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

function WriteReviewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addReview } = useShop();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-t-3xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Tulis Ulasan</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setRating(s)}>
              <Star
                className={`w-7 h-7 ${
                  s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul ulasan..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tulis ulasan Anda..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            addReview(product.id, rating, title, comment);
            onClose();
          }}
          className="w-full py-3 bg-[#0F172A] text-white rounded-xl font-semibold"
        >
          Kirim Ulasan
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-8">
      <div className="max-w-lg mx-auto px-4 py-6 text-center text-xs text-slate-400">
        &copy; 2026 ShopMin. All rights reserved.
      </div>
    </footer>
  );
}
