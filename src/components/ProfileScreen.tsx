import React from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { formatIDR } from '../utils/formatters';
import {
  CheckCircle2,
  ShoppingCart,
  Heart,
  Package,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  Shield,
  ChevronRight,
  LogOut,
  LogIn,
} from 'lucide-react';

const menuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export function ProfileScreen() {
  const { orders, wishlist, cart, navigateTo, user, isLoggedIn, logout } = useShop();

  const initials = user ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'Guest';

  if (!isLoggedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-24 md:pb-6"
      >
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6 text-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold text-slate-500">?</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Belum Masuk</h2>
          <p className="text-sm text-slate-500 mb-4">Masuk untuk menyimpan wishlist, pesanan, dan ulasan</p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigateTo('login')}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 mx-auto"
          >
            <LogIn className="w-4 h-4" />
            Masuk / Daftar
          </motion.button>
        </div>

        <div className="mt-8 py-4 border-t border-slate-200 text-center text-xs text-slate-400">
          © 2026 ShopMin. Semua hak dilindungi.
        </div>
      </motion.div>
    );
  }

  const metrics = [
    {
      label: 'Pesanan',
      value: orders.length,
      icon: Package,
      screen: 'riwayat' as const,
    },
    {
      label: 'Wishlist',
      value: wishlist.length,
      icon: Heart,
      screen: 'wishlist' as const,
    },
    {
      label: 'Keranjang',
      value: cart.length,
      icon: ShoppingCart,
      screen: 'cart' as const,
    },
  ];

  const accountMenu = [
    {
      label: 'Alamat Tersimpan',
      icon: MapPin,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Metode Pembayaran',
      icon: CreditCard,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Notifikasi',
      icon: Bell,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
  ];

  const supportMenu = [
    {
      label: 'Pusat Bantuan',
      icon: HelpCircle,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      label: 'Kebijakan Privasi',
      icon: Shield,
      color: 'text-slate-500',
      bg: 'bg-slate-100',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-24 md:pb-6"
    >
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 truncate">
                {user?.name}
              </h2>
              <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
            </div>
            <p className="text-sm text-slate-500 truncate">
              {user?.email}
            </p>
            <span className="inline-flex items-center mt-2 px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">
              Member Prioritas Gold
            </span>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {metrics.map((metric) => (
          <motion.button
            key={metric.label}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo(metric.screen)}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col items-center gap-2 hover:border-slate-200 transition-colors"
          >
            <metric.icon className="w-5 h-5 text-slate-500" />
            <span className="text-xl font-bold text-slate-900">
              {metric.value}
            </span>
            <span className="text-xs text-slate-500">{metric.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">
            Pengaturan Akun
          </h3>
        </div>
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
        >
          {accountMenu.map((item) => (
            <motion.button
              key={item.label}
              variants={menuItemVariants}
              whileTap={{ scale: 0.98 }}
              onClick={() => {}}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg}`}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <span className="flex-1 text-sm font-medium text-slate-700 text-left">
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Support Menu */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">Dukungan</h3>
        </div>
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
        >
          {supportMenu.map((item) => (
            <motion.button
              key={item.label}
              variants={menuItemVariants}
              whileTap={{ scale: 0.98 }}
              onClick={() => {}}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg}`}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <span className="flex-1 text-sm font-medium text-slate-700 text-left">
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Logout */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 text-sm font-semibold rounded-2xl hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Keluar
      </motion.button>

      <div className="mt-8 py-4 border-t border-slate-200 text-center text-xs text-slate-400">
        © 2026 ShopMin. Semua hak dilindungi.
      </div>
    </motion.div>
  );
}
