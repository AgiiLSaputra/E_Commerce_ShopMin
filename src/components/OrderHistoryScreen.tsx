import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { formatIDR } from '../utils/formatters';
import {
  Trash2,
  RotateCcw,
  Truck,
  FileText,
  X,
  AlertTriangle,
  MapPin,
} from 'lucide-react';

const STATUS_TABS = ['Semua', 'Diproses', 'Dikirim', 'Selesai'];

const STATUS_STYLES: Record<string, string> = {
  Selesai: 'bg-slate-900 text-white',
  Dikirim: 'bg-blue-500 text-white',
  Diproses: 'bg-amber-500 text-white',
  Dibatalkan: 'bg-rose-500 text-white',
};

export default function OrderHistoryScreen() {
  const { orders, deleteOrder, clearAllOrders, navigateTo } = useShop();
  const [activeTab, setActiveTab] = useState('Semua');
  const [showClearModal, setShowClearModal] = useState(false);
  const [trackOrder, setTrackOrder] = useState<any>(null);

  const filtered =
    activeTab === 'Semua'
      ? orders
      : orders.filter((o: any) => o.status === activeTab);

  const handleClearAll = () => {
    clearAllOrders();
    setShowClearModal(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-slate-50"
    >
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-slate-900">Riwayat Pesanan</h1>
          {orders.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowClearModal(true)}
              className="text-xs font-medium text-rose-500 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50"
            >
              Hapus Semua Riwayat
            </motion.button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {STATUS_TABS.map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Order Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-500">Belum ada riwayat pesanan</p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigateTo('katalog')}
              className="px-6 py-3 bg-[#0F172A] text-white rounded-xl font-semibold"
            >
              Mulai Belanja
            </motion.button>
          </div>
        ) : (
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {filtered.map((order: any) => (
              <motion.div
                key={order.id}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          STATUS_STYLES[order.status] || 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{order.orderNumber}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{order.date}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => deleteOrder(order.id)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items?.slice(0, 2).map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <p className="text-xs text-slate-400">
                      +{order.items.length - 2} item lainnya
                    </p>
                  )}
                </div>

                {/* Total & Actions */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    Total: {formatIDR(order.total)}
                  </span>
                  <div className="flex gap-2">
                    {order.status === 'Selesai' && (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
              onClick={() => navigateTo('katalog')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Beli Lagi
                      </motion.button>
                    )}
                    {order.status === 'Dikirim' && (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setTrackOrder(order)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg"
                      >
                        <Truck className="w-3 h-3" />
                        Lacak Pesanan
                      </motion.button>
                    )}
                    {order.status === 'Diproses' && (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white text-xs font-medium rounded-lg"
                      >
                        <FileText className="w-3 h-3" />
                        Detail Pesanan
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Footer />

      {/* Clear All Confirmation Modal */}
      <AnimatePresence>
        {showClearModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6"
            onClick={() => setShowClearModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-2xl p-6 space-y-4 text-center"
            >
              <div className="w-14 h-14 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-7 h-7 text-rose-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Hapus Semua Riwayat?</h3>
              <p className="text-sm text-slate-500">
                Semua riwayat pesanan akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleClearAll}
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 transition-colors"
                >
                  Ya, Hapus Semua
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Track Order Modal */}
      <AnimatePresence>
        {trackOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
            onClick={() => setTrackOrder(null)}
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
                <h3 className="text-lg font-bold text-slate-900">Lacak Pesanan</h3>
                <button
                  onClick={() => setTrackOrder(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">Pesanan Diterima</p>
                    <p className="text-xs text-slate-400">Pesanan sedang diproses</p>
                  </div>
                </div>
                <div className="ml-4 w-0.5 h-6 bg-emerald-200" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Truck className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">Dalam Pengiriman</p>
                    <p className="text-xs text-slate-400">Paket sedang dalam perjalanan</p>
                  </div>
                </div>
                <div className="ml-4 w-0.5 h-6 bg-slate-200" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-400">Diterima</p>
                    <p className="text-xs text-slate-400">Menunggu pengiriman</p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 text-center pt-2">
                No. Resi: {trackOrder.trackingNo || 'Belum tersedia'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Check(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
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
