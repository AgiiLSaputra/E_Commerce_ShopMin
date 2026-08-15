import { useState } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { formatIDR } from '../utils/formatters';
import { Truck, Smartphone, CreditCard, Lock } from 'lucide-react';

const CITIES_LIST = [
  'Jakarta',
  'Bandung',
  'Surabaya',
  'Yogyakarta',
  'Semarang',
  'Malang',
  'Medan',
  'Makassar',
  'Denpasar',
  'Palembang',
];

const PAYMENT_METHODS = [
  { id: 'cod', name: 'Cash on Delivery', icon: Truck, color: 'text-slate-600' },
  { id: 'gopay', name: 'GoPay', icon: Smartphone, color: 'text-emerald-600' },
  { id: 'ovo', name: 'OVO', icon: Smartphone, color: 'text-purple-600' },
  { id: 'transfer', name: 'Bank Transfer', icon: CreditCard, color: 'text-blue-600' },
];

export default function CheckoutScreen() {
  const { cart, appliedPromo, createOrder, navigateTo } = useShop();

  const [name, setName] = useState('Agil Saputra');
  const [phone, setPhone] = useState('081234567890');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 20000;
  const total = subtotal + shipping;

  const handlePay = () => {
    setError('');
    if (!name.trim()) return setError('Nama harus diisi');
    if (!phone.trim()) return setError('Nomor telepon harus diisi');
    if (!city) return setError('Kota harus dipilih');
    if (!address.trim()) return setError('Alamat harus diisi');

    createOrder({
      fullName: name.trim(),
      phoneNumber: phone.trim(),
      city,
      fullAddress: address.trim(),
    }, paymentMethod as any);
    navigateTo('success');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-slate-50 pb-24"
    >
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 md:space-y-0 md:grid md:grid-cols-5 md:gap-8">
        {/* Left Column - Orders */}
        <div className="md:col-span-3 space-y-6">
        {/* Pesanan Anda */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Pesanan Anda</h2>
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={`${item.id}-${item.selectedVariant}-${item.selectedColor}`} className="p-4 flex gap-3">
                <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">{item.product.name}</h3>
                  <p className="text-xs text-slate-400">
                    {item.selectedColor && `${item.selectedColor}`}
                    {item.selectedColor && item.selectedVariant && ' / '}
                    {item.selectedVariant && `Ukuran ${item.selectedVariant}`}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatIDR(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Penerima */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Data Penerima</h2>
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Nomor Telepon</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Kota</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="">Pilih kota</option>
                {CITIES_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Alamat Lengkap</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Masukkan alamat lengkap..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
              />
            </div>
          </div>
        </section>
        </div>

        {/* Right Column - Payment & Summary */}
        <div className="md:col-span-2 md:sticky md:top-20 md:self-start space-y-6">
        {/* Metode Pembayaran */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Metode Pembayaran</h2>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <motion.button
                  key={method.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-colors ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-slate-900' : 'bg-slate-100'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isSelected ? 'text-white' : method.color}`}
                    />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    {method.name}
                  </span>
                  <div className="ml-auto">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-slate-900' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Price Summary */}
        <section className="bg-white rounded-2xl border border-slate-100 p-4 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{formatIDR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Pengiriman</span>
            <span>{formatIDR(shipping)}</span>
          </div>
          <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-900 text-base">
            <span>Total</span>
            <span>{formatIDR(total)}</span>
          </div>
        </section>

        {/* Error */}
        {error && (
          <p className="text-sm text-rose-500 text-center">{error}</p>
        )}
        </div>
      </div>

      {/* Sticky Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <div className="max-w-4xl mx-auto">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handlePay}
            className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-semibold text-base flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <Lock className="w-4 h-4" />
            Bayar Sekarang &mdash; {formatIDR(total)}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
