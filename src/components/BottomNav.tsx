import { LayoutGrid, Heart, History, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { ScreenType } from '../types';

const TABS: { label: string; screen: ScreenType; icon: typeof LayoutGrid; badge?: 'wishlist' }[] = [
  { label: 'Katalog', screen: 'katalog', icon: LayoutGrid },
  { label: 'Wishlist', screen: 'wishlist', icon: Heart, badge: 'wishlist' },
  { label: 'Riwayat', screen: 'riwayat', icon: History },
  { label: 'Profile', screen: 'profile', icon: User },
];

export default function BottomNav() {
  const { currentScreen, navigateTo, wishlist } = useShop();

  if (['checkout', 'success', 'login'].includes(currentScreen)) return null;

  return (
    <nav className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 md:hidden">
      <div className="flex items-stretch">
        {TABS.map(({ label, screen, icon: Icon, badge }) => {
          const isActive = currentScreen === screen || (screen === 'katalog' && currentScreen === 'detail');
          const count = badge === 'wishlist' ? wishlist.length : 0;
          return (
            <button
              key={screen}
              onClick={() => navigateTo(screen)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 pt-2.5 text-[10px] font-medium transition-colors relative ${
                isActive ? 'text-blue-600 font-bold' : 'text-gray-500'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white bg-rose-500 rounded-full">
                    {count}
                  </span>
                )}
              </div>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
