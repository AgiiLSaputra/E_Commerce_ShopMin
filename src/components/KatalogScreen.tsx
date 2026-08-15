import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { formatIDR } from '../utils/formatters';
import { Search, X, Heart, ChevronDown } from 'lucide-react';

const categories = ['Semua', 'Elektronik', 'Fashion', 'Home', 'Aksesoris'];
const sortOptions = ['Relevansi', 'Harga Terendah', 'Harga Tertinggi', 'Rating Tertinggi', 'Produk Baru'];

export default function KatalogScreen() {
  const { products, toggleWishlist, wishlist, navigateTo, viewProductDetail } = useShop();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('Relevansi');
  const [showSort, setShowSort] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => {
    let items = [...products];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'Semua') {
      items = items.filter((p) => p.category === selectedCategory);
    }
    switch (sortBy) {
      case 'Harga Terendah':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'Harga Tertinggi':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'Rating Tertinggi':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'Produk Baru':
        items.sort((a, b) => (b.badge === 'BARU' ? 1 : 0) - (a.badge === 'BARU' ? 1 : 0));
        break;
      default:
        break;
    }
    return items;
  }, [products, search, selectedCategory, sortBy]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-slate-50"
    >
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
              <span className="text-xs ml-1">Hapus</span>
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {sortBy}
            <ChevronDown className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {showSort && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute z-10 top-full mt-1 left-0 bg-white border border-slate-200 rounded-xl shadow-lg w-56 overflow-hidden"
              >
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortBy(opt);
                      setShowSort(false);
                    }}
                    className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 ${
                      sortBy === opt ? 'font-semibold text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Grid */}
        {visible.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-slate-500">Tidak ada produk ditemukan.</p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setSearch('');
                setSelectedCategory('Semua');
                setSortBy('Relevansi');
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium"
            >
              Reset Filter
            </motion.button>
          </div>
        ) : (
          <>
            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-3"
            >
              {visible.map((product) => (
                <motion.div
                  key={product.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer"
                  onClick={() => viewProductDetail(product)}
                >
                  <div className="relative aspect-square bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.badge === 'BARU' && (
                      <span className="absolute top-2 left-2 bg-white text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                        BARU
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    )}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.includes(product.id)
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-slate-400'
                        }`}
                      />
                    </motion.button>
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-xs text-slate-400">{product.category}</p>
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {formatIDR(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatIDR(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {visibleCount < filtered.length && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setVisibleCount((v) => v + 4)}
                className="w-full py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Muat Lebih Banyak
              </motion.button>
            )}
          </>
        )}
      </div>

      <Footer />
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
