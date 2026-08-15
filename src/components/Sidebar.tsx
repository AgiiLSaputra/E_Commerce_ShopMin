import { AnimatePresence, motion } from 'framer-motion';
import { X, LayoutGrid, ShoppingCart, Heart, History, User, ShieldCheck, LogIn } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { ScreenType } from '../types';

const NAV_ITEMS: { label: string; screen: ScreenType; icon: typeof LayoutGrid; badge?: 'cart' | 'wishlist' }[] = [
  { label: 'Katalog', screen: 'katalog', icon: LayoutGrid },
  { label: 'Keranjang', screen: 'cart', icon: ShoppingCart, badge: 'cart' },
  { label: 'Wishlist', screen: 'wishlist', icon: Heart, badge: 'wishlist' },
  { label: 'Riwayat', screen: 'riwayat', icon: History },
  { label: 'Profil', screen: 'profile', icon: User },
];

export default function Sidebar() {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    navigateTo,
    currentScreen,
    cartTotalCount,
    wishlist,
    user,
    isLoggedIn,
  } = useShop();

  const initials = user ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'Guest';
  const displayName = user?.name || 'Guest';
  const memberLabel = isLoggedIn ? 'Member Prioritas Gold' : 'Belum Masuk';

  const getBadgeCount = (badge?: 'cart' | 'wishlist') => {
    if (badge === 'cart') return cartTotalCount;
    if (badge === 'wishlist') return wishlist.length;
    return 0;
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed inset-y-0 left-0 z-50 w-4/5 max-w-xs bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">ShopMin</h2>
                <p className="text-[11px] text-gray-400 font-medium">v1.0</p>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
                  <p className={`text-xs font-medium ${isLoggedIn ? 'text-amber-600' : 'text-slate-400'}`}>
                    {memberLabel}
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex-1 py-2 overflow-y-auto">
              {NAV_ITEMS.map(({ label, screen, icon: Icon, badge }) => {
                const isActive = currentScreen === screen;
                const count = getBadgeCount(badge);
                return (
                  <button
                    key={screen}
                    onClick={() => navigateTo(screen)}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                    {count > 0 && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
              {!isLoggedIn && (
                <button
                  onClick={() => navigateTo('login')}
                  className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
                >
                  <LogIn className="w-5 h-5 shrink-0" />
                  <span className="flex-1 text-left">Masuk / Daftar</span>
                </button>
              )}
            </nav>

            <div className="px-5 py-4 border-t border-gray-100">
              <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 mb-4">
                <p className="text-xs font-semibold text-amber-800 mb-1">Promo Spesial!</p>
                <p className="text-xs text-amber-700">
                  Gunakan <span className="font-bold">DISKON20</span> saat checkout untuk hemat 20%!
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Garansi 100% Produk Original</span>
              </div>
              <p className="text-[10px] text-gray-300 text-center">© 2026 ShopMin</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
