import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { formatIDR } from '../utils/formatters';
import { Truck, X, CheckCircle2, Circle, MapPin } from 'lucide-react';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrackOrderModal({ isOpen, onClose }: TrackOrderModalProps) {
  const { trackingOrder } = useShop();

  if (!trackingOrder) return null;

  const steps = [
    {
      title: 'Pesanan Diterima',
      description: 'Pesanan kamu telah diterima dan menunggu diproses.',
      time: '15 Jul 2026, 09:00',
      completed: true,
    },
    {
      title: 'Diproses',
      description: 'Pesanan sedang disiapkan oleh penjual.',
      time: '15 Jul 2026, 11:30',
      completed: true,
    },
    {
      title: 'Dikirim',
      description: 'Pesanan telah diseruh ke kurir pengiriman.',
      time: '16 Jul 2026, 08:15',
      completed: true,
    },
    {
      title: 'Dalam Perjalanan',
      description: 'Pesanan sedang dalam perjalanan ke alamat tujuan.',
      time: '17 Jul 2026, 14:00',
      completed: false,
    },
    {
      title: 'Terkirim',
      description: 'Pesanan telah sampai di alamat tujuan.',
      time: '-',
      completed: false,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Content Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Pelacakan Pesanan
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {trackingOrder.orderNumber}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </motion.button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Status Banner */}
              <div className="bg-blue-500 text-white rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Dalam Perjalanan</p>
                    <p className="text-blue-100 text-xs mt-0.5">
                      Estimasi tiba: 18 Jul 2026
                    </p>
                  </div>
                </div>
              </div>

              {/* Destination Address */}
              <div className="flex items-start gap-3 mb-6 p-4 bg-slate-50 rounded-2xl">
                <MapPin className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {trackingOrder.recipient?.fullName || 'Agil Saputra'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {trackingOrder.recipient?.fullAddress ||
                      'Jl. Merdeka No. 123, Jakarta Selatan'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {trackingOrder.recipient?.phoneNumber || '+62 812-3456-7890'}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4 relative">
                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-[11px] top-[24px] w-[2px] h-[calc(100%-8px)]">
                        <div
                          className={`w-full h-full ${
                            step.completed ? 'bg-blue-500' : 'bg-slate-200'
                          }`}
                        />
                      </div>
                    )}

                    {/* Icon */}
                    <div className="relative z-10 flex-shrink-0 mt-0.5">
                      {step.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-blue-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-6">
                      <p
                        className={`text-sm font-semibold ${
                          step.completed ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step.title}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${
                          step.completed ? 'text-slate-600' : 'text-slate-400'
                        }`}
                      >
                        {step.description}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {step.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="px-6 pb-6 pt-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="w-full py-3 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Tutup
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
