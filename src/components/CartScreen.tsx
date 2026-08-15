import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { formatIDR } from '../utils/formatters';
import { Trash2, Minus, Plus, Tag, X, ShoppingBag } from 'lucide-react';

export default function CartScreen() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
    appliedPromo,
    navigateTo,
    cartSubtotal,
    cartTax,
    cartDiscount,
    cartFinalTotal,
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const subtotal = cartSubtotal;
  const tax = cartTax;
  const discount = cartDiscount;
  const total = cartFinalTotal;

  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoCode.trim()) {
      setPromoError('Masukkan kode promo');
      return;
    }
    applyPromoCode(promoCode.trim());
    setPromoCode('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-slate-50"
    >
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <h1 className="text-3xl font-black text-slate-900">Keranjang Belanja</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-500">Keranjang Anda kosong</p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigateTo('katalog')}
              className="px-6 py-3 bg-[#0F172A] text-white rounded-xl font-semibold"
            >
              Mulai Belanja
            </motion.button>
          </div>
        ) : (
          <div className="md:grid md:grid-cols-5 md:gap-8">
            {/* Cart Items */}
            <div className="md:col-span-3">
            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {cart.map((item) => (
                <motion.div
                  key={`${item.id}-${item.selectedVariant}-${item.selectedColor}`}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  className="bg-white rounded-2xl p-4 border border-slate-100 flex gap-4"
                >
                  <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{item.product.name}</h3>
                    <p className="text-xs text-slate-400">
                      {item.selectedColor && `${item.selectedColor}`}
                      {item.selectedColor && item.selectedVariant && ' / '}
                      {item.selectedVariant && `Ukuran ${item.selectedVariant}`}
                    </p>
                    <p className="text-sm font-bold text-slate-900">{formatIDR(item.price)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                        >
                          <Minus className="w-3 h-3" />
                        </motion.button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                        >
                          <Plus className="w-3 h-3" />
                        </motion.button>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-2 md:sticky md:top-20 md:self-start">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 space-y-4">
              <h2 className="font-bold text-slate-900">Ringkasan Pesanan</h2>

              {/* Promo Code */}
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">
                      {appliedPromo.code} (-{appliedPromo.discountPercent || Math.round((appliedPromo.discountAmount || 0) / (subtotal || 1) * 100)}%)
                    </span>
                  </div>
                  <button onClick={removePromoCode} className="text-emerald-600 hover:text-emerald-800">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoError('');
                    }}
                    placeholder="Masukkan kode promo"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleApplyPromo}
                    className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium"
                  >
                    Gunakan
                  </motion.button>
                </div>
              )}
              {promoError && <p className="text-xs text-rose-500">{promoError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Pajak (11%)</span>
                  <span>{formatIDR(tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Diskon</span>
                    <span>-{formatIDR(discount)}</span>
                  </div>
                )}
                <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-900 text-base">
                  <span>Total</span>
                  <span>{formatIDR(total)}</span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigateTo('checkout')}
                className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-semibold text-base hover:bg-slate-800 transition-colors"
              >
                Lanjut ke Checkout
              </motion.button>
            </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-8">
      <div className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-slate-400">
        &copy; 2026 ShopMin. All rights reserved.
      </div>
    </footer>
  );
}
