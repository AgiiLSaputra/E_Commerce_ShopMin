import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const ICON_MAP = {
  success: { icon: CheckCircle2, color: 'text-emerald-400' },
  error: { icon: AlertCircle, color: 'text-rose-400' },
  info: { icon: Info, color: 'text-blue-400' },
};

export default function Toast() {
  const { toast } = useShop();

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="flex items-center gap-3 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl shadow-black/20 max-w-sm"
          >
            {(() => {
              const { icon: Icon, color } = ICON_MAP[toast.type];
              return <Icon className={`w-5 h-5 shrink-0 ${color}`} />;
            })()}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
