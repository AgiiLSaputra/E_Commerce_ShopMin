import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { formatIDR } from '../utils/formatters';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function WishlistScreen() {
  const { wishlist, toggleWishlist, addToCart, products, navigateTo } = useShop();

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 pb-24 md:pb-6"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Wishlist Saya</h1>
        <p className="text-sm text-slate-500 mt-1">
          {wishlist.length} produk tersimpan
        </p>
      </div>

      {wishlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-1">
            Belum Ada Wishlist
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-xs">
            Simpan produk favoritmu di sini agar mudah ditemukan nanti.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigateTo('katalog')}
            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            Jelajahi Produk
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {wishlist.map((productId) => {
            const product = products.find((p) => p.id === productId);
            if (!product) return null;
            return (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col sm:flex-row"
              >
                <div className="relative w-full sm:w-40 h-44 sm:h-auto bg-slate-50 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-slate-900 text-white text-xs font-medium rounded-lg">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="flex-1 p-4 flex flex-col">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                    {product.category}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-800 mt-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-slate-900 mt-2">
                    {formatIDR(product.price)}
                  </p>

                  <div className="mt-auto pt-4 flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAddToCart(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      + Keranjang
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleWishlist(product.id)}
                      className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <div className="mt-12 py-6 border-t border-slate-200 text-center text-xs text-slate-400">
        © 2026 ShopMin. Semua hak dilindungi.
      </div>
    </motion.div>
  );
}
