import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { formatIDR } from '../utils/formatters';
import { Check, Package, Clock, ArrowRight } from 'lucide-react';

export default function OrderSuccessScreen() {
  const { lastCompletedOrder, navigateTo } = useShop();

  const invoiceNo = lastCompletedOrder?.invoiceNumber || `INV-${Date.now().toString(36).toUpperCase()}`;
  const estimatedDelivery = lastCompletedOrder?.estimatedDelivery || '3-5 hari kerja';
  const firstItem = lastCompletedOrder?.items?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-slate-50"
    >
      <div className="max-w-lg mx-auto px-4 py-12 space-y-8">
        {/* Confetti Bar */}
        <div className="flex gap-1 justify-center">
          {['#0EA5E9', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#0EA5E9', '#F59E0B'].map(
            (color, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3 + i * 0.05, type: 'spring', stiffness: 300 }}
                className="w-2 h-8 rounded-full"
                style={{ backgroundColor: color }}
              />
            )
          )}
        </div>

        {/* Animated Check Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 bg-[#E0F2FE] rounded-full flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
              className="w-16 h-16 bg-[#0284C7] rounded-full flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-2"
        >
          <h1 className="text-2xl font-black text-slate-900">Pesanan Berhasil!</h1>
          <p className="text-sm text-slate-500">
            Terima kasih telah berbelanja di ShopMin
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Nomor Invoice</p>
              <p className="text-sm font-bold text-slate-900 font-mono">{invoiceNo}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Estimasi Pengiriman</p>
              <p className="text-sm font-bold text-slate-900">{estimatedDelivery}</p>
            </div>
          </div>

          {firstItem && (
            <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
              <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={firstItem.image}
                  alt={firstItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{firstItem.name}</p>
                <p className="text-xs text-slate-400">
                  Qty: {firstItem.quantity}
                    {lastCompletedOrder?.items?.length > 1 &&
                    ` +${lastCompletedOrder.items.length - 1} item lainnya`}
                </p>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {formatIDR(firstItem.price * firstItem.quantity)}
              </span>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigateTo('katalog')}
            className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
          >
            Kembali ke Katalog
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigateTo('riwayat')}
            className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-semibold hover:bg-slate-50 transition-colors"
          >
            Lihat Riwayat Pesanan
          </motion.button>
        </motion.div>
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
