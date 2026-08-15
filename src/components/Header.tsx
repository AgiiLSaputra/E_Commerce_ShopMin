import { AnimatePresence, motion } from 'framer-motion';
import { Menu, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function Header() {
  const { currentScreen, cartTotalCount, navigateTo, goBack, setIsSidebarOpen } = useShop();

  if (currentScreen === 'login') return null;

  const showHamburger = ['katalog', 'riwayat', 'wishlist', 'profile'].includes(currentScreen);
  const showBack = ['detail', 'checkout'].includes(currentScreen);
  const showCart = !['checkout', 'success'].includes(currentScreen);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-4 h-14">
        <AnimatePresence mode="wait">
          {showHamburger && (
            <motion.button
              key="hamburger"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors md:hidden"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </motion.button>
          )}
          {showBack && (
            <motion.button
              key="back"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={goBack}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </motion.button>
          )}
        </AnimatePresence>

        <button
          onClick={() => navigateTo('katalog')}
          className="text-lg font-bold tracking-tight text-slate-900 hover:text-blue-600 transition-colors"
        >
          ShopMin
        </button>

        {showCart && (
          <button
            onClick={() => navigateTo('cart')}
            className="relative p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-blue-600 rounded-full">
                {cartTotalCount > 99 ? '99+' : cartTotalCount}
              </span>
            )}
          </button>
        )}
        {!showHamburger && !showBack && <div className="w-9" />}
      </div>
    </header>
  );
}
