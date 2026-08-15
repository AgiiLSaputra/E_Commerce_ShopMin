import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopProvider, useShop } from './context/ShopContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import KatalogScreen from './components/KatalogScreen';
import ProductDetailScreen from './components/ProductDetailScreen';
import CartScreen from './components/CartScreen';
import CheckoutScreen from './components/CheckoutScreen';
import OrderSuccessScreen from './components/OrderSuccessScreen';
import OrderHistoryScreen from './components/OrderHistoryScreen';
import { WishlistScreen } from './components/WishlistScreen';
import { ProfileScreen } from './components/ProfileScreen';
import LoginScreen from './components/LoginScreen';

function MainContent() {
  const { currentScreen, isLoading } = useShop();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (currentScreen === 'login') {
    return <LoginScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'katalog':
        return <KatalogScreen />;
      case 'detail':
        return <ProductDetailScreen />;
      case 'cart':
        return <CartScreen />;
      case 'checkout':
        return <CheckoutScreen />;
      case 'success':
        return <OrderSuccessScreen />;
      case 'riwayat':
        return <OrderHistoryScreen />;
      case 'wishlist':
        return <WishlistScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <KatalogScreen />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8f9fa]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>

        <BottomNav />
        <Toast />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
