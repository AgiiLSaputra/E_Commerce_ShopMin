import { useShop } from '../context/ShopContext';
import type { ScreenType } from '../types';

const NAV_LINKS: { label: string; screen: ScreenType }[] = [
  { label: 'Katalog', screen: 'katalog' },
  { label: 'Wishlist', screen: 'wishlist' },
  { label: 'Riwayat', screen: 'riwayat' },
];

export default function Footer() {
  const { navigateTo } = useShop();

  return (
    <footer className="bg-[#f1f3f5] border-t border-gray-200 py-8">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <button
          onClick={() => navigateTo('katalog')}
          className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors mb-3"
        >
          ShopMin
        </button>
        <div className="flex items-center justify-center gap-4 mb-4">
          {NAV_LINKS.map(({ label, screen }) => (
            <button
              key={screen}
              onClick={() => navigateTo(screen)}
              className="text-sm text-gray-500 hover:text-slate-900 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">© 2024 ShopMin Portfolio</p>
      </div>
    </footer>
  );
}
