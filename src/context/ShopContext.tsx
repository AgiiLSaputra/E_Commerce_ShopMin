import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { Product, CartItem, Order, Review, ScreenType, Category, PromoCode, RecipientInfo } from '../types';
import { api, setToken, type ApiUser } from '../api';
import { generateInvoiceNumber, generateOrderNumber, getEstimatedDeliveryRange } from '../utils/formatters';

type SortType = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'name';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  reviews: Review[];
  currentScreen: ScreenType;
  selectedProduct: Product | null;
  lastCompletedOrder: Order | null;
  searchQuery: string;
  selectedCategory: Category;
  sortBy: SortType;
  appliedPromo: PromoCode | null;
  promoError: string;
  isSidebarOpen: boolean;
  trackingOrder: Order | null;
  toast: ToastState | null;

  user: ApiUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  loginError: string;

  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: Category) => void;
  setSortBy: (s: SortType) => void;
  setIsSidebarOpen: (open: boolean) => void;
  setTrackingOrder: (order: Order | null) => void;
  showToast: (message: string, type?: ToastState['type']) => void;

  navigateTo: (screen: ScreenType) => void;
  goBack: () => void;
  viewProductDetail: (product: Product) => void;

  addToCart: (product: Product, color?: string, variant?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  cartTax: number;
  cartDiscount: number;
  cartFinalTotal: number;

  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  applyPromoCode: (code: string) => void;
  removePromoCode: () => void;

  createOrder: (recipient: RecipientInfo, paymentMethod: Order['paymentMethod']) => void;
  reorderItems: (order: Order) => void;
  deleteOrder: (orderId: string) => void;
  clearAllOrders: () => void;

  getProductReviews: (productId: string) => Review[];
  addReview: (productId: string, rating: number, title: string, comment: string) => void;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return fallback;
}

const SHIPPING_COST = 20000;
const TAX_RATE = 0.11;

function mapApiProductToProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    originalPrice: p.originalPrice,
    badge: p.badge,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    image: p.image,
    images: p.images || [],
    description: p.description || '',
    colors: (p.colors || []).map((c: any) => ({ name: c.name, hex: c.hex, inStock: c.inStock })),
    variants: p.variants || [],
    features: p.features || [],
    specs: p.specs || [],
    inStock: p.inStock,
  };
}

function mapApiOrderToOrder(o: any): Order {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    invoiceNumber: o.invoiceNumber,
    date: o.date,
    status: o.status as Order['status'],
    items: o.items || [],
    subtotal: o.subtotal,
    tax: o.tax,
    shippingCost: o.shippingCost,
    discount: o.discount,
    total: o.total,
    recipient: o.recipient,
    paymentMethod: o.paymentMethod,
    estimatedDelivery: o.estimatedDelivery,
    trackingSteps: o.trackingSteps || [],
  };
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('shopmin_cart', []));
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [user, setUser] = useState<ApiUser | null>(() => loadFromStorage('shopmin_user', null));
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('shopmin_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState('');

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('katalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['katalog']);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Semua');
  const [sortBy, setSortBy] = useState<SortType>('default');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Load products from API
  useEffect(() => {
    api.getProducts()
      .then(({ products: p }) => setProducts(p.map(mapApiProductToProduct)))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Load user data if logged in
  useEffect(() => {
    if (isLoggedIn) {
      api.getMe()
        .then(({ user: u }) => {
          setUser(u);
          localStorage.setItem('shopmin_user', JSON.stringify(u));
        })
        .catch(() => {
          logout();
        });
    }
  }, [isLoggedIn]);

  // Load wishlist when logged in
  useEffect(() => {
    if (isLoggedIn) {
      api.getWishlist()
        .then(({ wishlist: w }) => setWishlist(w.map((p) => p.id)))
        .catch(() => setWishlist([]));
    } else {
      setWishlist([]);
    }
  }, [isLoggedIn]);

  // Load orders when logged in
  useEffect(() => {
    if (isLoggedIn) {
      api.getOrders()
        .then(({ orders: o }) => setOrders(o.map(mapApiOrderToOrder)))
        .catch(() => setOrders([]));
    } else {
      setOrders([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('shopmin_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = useCallback((message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const navigateTo = useCallback((screen: ScreenType) => {
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    setIsSidebarOpen(false);
  }, []);

  const goBack = useCallback(() => {
    setScreenHistory((prev) => {
      if (prev.length <= 1) {
        setCurrentScreen('katalog');
        return ['katalog'];
      }
      const next = prev.slice(0, -1);
      setCurrentScreen(next[next.length - 1]);
      return next;
    });
    setSelectedProduct(null);
    setTrackingOrder(null);
  }, []);

  const viewProductDetail = useCallback((product: Product) => {
    setSelectedProduct(product);
    navigateTo('detail');
  }, [navigateTo]);

  const addToCart = useCallback(
    (product: Product, color?: string, variant?: string) => {
      setCart((prev) => {
        const existing = prev.find(
          (item) =>
            item.productId === product.id &&
            item.selectedColor === (color || product.colors[0]?.name) &&
            item.selectedVariant === (variant || product.variants?.[0])
        );
        if (existing) {
          return prev.map((item) =>
            item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [
          ...prev,
          {
            id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            productId: product.id,
            product,
            selectedColor: color || product.colors[0]?.name,
            selectedVariant: variant || product.variants?.[0],
            quantity: 1,
            price: product.price,
          },
        ];
      });
      showToast(`${product.name} ditambahkan ke keranjang`);
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (cartItemId: string) => {
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
      showToast('Produk dihapus dari keranjang', 'info');
    },
    [showToast]
  );

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTax = Math.round(cartSubtotal * TAX_RATE);

  const cartDiscount = appliedPromo
    ? (() => {
        if (appliedPromo.discountPercent) {
          return Math.round(cartSubtotal * (appliedPromo.discountPercent / 100));
        }
        if (appliedPromo.discountAmount) {
          if (appliedPromo.minSpend && cartSubtotal < appliedPromo.minSpend) return 0;
          return appliedPromo.discountAmount;
        }
        return 0;
      })()
    : 0;

  const cartFinalTotal = cartSubtotal + cartTax + SHIPPING_COST - cartDiscount;

  const toggleWishlist = useCallback(
    (productId: string) => {
      const exists = wishlist.includes(productId);
      if (isLoggedIn) {
        if (exists) {
          api.removeFromWishlist(productId).then(() => {
            setWishlist((prev) => prev.filter((id) => id !== productId));
            showToast('Produk dihapus dari wishlist', 'info');
          }).catch(() => showToast('Gagal menghapus dari wishlist', 'error'));
        } else {
          api.addToWishlist(productId).then(() => {
            setWishlist((prev) => [...prev, productId]);
            showToast('Produk ditambahkan ke wishlist');
          }).catch(() => showToast('Gagal menambahkan ke wishlist', 'error'));
        }
      } else {
        setWishlist((prev) => {
          if (exists) {
            showToast('Produk dihapus dari wishlist', 'info');
            return prev.filter((id) => id !== productId);
          }
          showToast('Produk ditambahkan ke wishlist');
          return [...prev, productId];
        });
      }
    },
    [wishlist, isLoggedIn, showToast]
  );

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const applyPromoCode = useCallback(
    (code: string) => {
      const upperCode = code.toUpperCase().trim();
      api.validatePromo(upperCode)
        .then(({ promo }) => {
          if (promo.minSpend && cartSubtotal < promo.minSpend) {
            setPromoError(`Minimal belanja ${promo.minSpend.toLocaleString('id-ID')}`);
            setAppliedPromo(null);
            return;
          }
          setAppliedPromo(promo);
          setPromoError('');
          showToast(`Promo ${promo.code} berhasil diterapkan!`);
        })
        .catch(() => {
          setPromoError('Kode promo tidak valid');
          setAppliedPromo(null);
        });
    },
    [cartSubtotal, showToast]
  );

  const removePromoCode = useCallback(() => {
    setAppliedPromo(null);
    setPromoError('');
  }, []);

  const createOrder = useCallback(
    (recipient: RecipientInfo, paymentMethod: Order['paymentMethod']) => {
      const items = cart.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        image: item.product.image,
        variant: item.selectedVariant,
        quantity: item.quantity,
        price: item.price,
      }));

      api.createOrder(items, recipient, paymentMethod as string)
        .then(({ order }) => {
          const mappedOrder = mapApiOrderToOrder(order);
          setOrders((prev) => [mappedOrder, ...prev]);
          setLastCompletedOrder(mappedOrder);
          setCart([]);
          setAppliedPromo(null);
          setPromoError('');
          navigateTo('success');
          showToast('Pesanan berhasil dibuat!');
        })
        .catch(() => {
          showToast('Gagal membuat pesanan', 'error');
        });
    },
    [cart, navigateTo, showToast]
  );

  const reorderItems = useCallback(
    (order: Order) => {
      const readdedCart: CartItem[] = order.items.map((item, i) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          id: `cart-reorder-${Date.now()}-${i}`,
          productId: item.productId,
          product: product || ({} as Product),
          selectedVariant: item.variant,
          quantity: item.quantity,
          price: item.price,
        };
      });
      setCart(readdedCart);
      navigateTo('cart');
      showToast('Produk ditambahkan ke keranjang');
    },
    [products, navigateTo, showToast]
  );

  const deleteOrder = useCallback(
    (orderId: string) => {
      if (isLoggedIn) {
        api.deleteOrder(orderId)
          .then(() => {
            setOrders((prev) => prev.filter((o) => o.id !== orderId));
            showToast('Pesanan dihapus', 'info');
          })
          .catch(() => showToast('Gagal menghapus pesanan', 'error'));
      } else {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        showToast('Pesanan dihapus', 'info');
      }
    },
    [isLoggedIn, showToast]
  );

  const clearAllOrders = useCallback(() => {
    if (isLoggedIn) {
      api.deleteAllOrders()
        .then(() => {
          setOrders([]);
          showToast('Semua riwayat pesanan dihapus', 'info');
        })
        .catch(() => showToast('Gagal menghapus riwayat', 'error'));
    } else {
      setOrders([]);
      showToast('Semua riwayat pesanan dihapus', 'info');
    }
  }, [isLoggedIn, showToast]);

  const getProductReviews = useCallback(
    (productId: string) => reviews.filter((r) => r.productId === productId),
    [reviews]
  );

  const addReview = useCallback(
    (productId: string, rating: number, title: string, comment: string) => {
      const userName = user?.name || 'Anonim';
      api.addReview(productId, userName, rating, title, comment)
        .then(({ review }) => {
          const mappedReview: Review = {
            id: review.id,
            productId: review.productId,
            userName: review.userName,
            isVerified: review.isVerified,
            date: review.date,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
          };
          setReviews((prev) => [mappedReview, ...prev]);
          showToast('Ulasan berhasil dikirim!');
        })
        .catch(() => showToast('Gagal mengirim ulasan', 'error'));
    },
    [user, showToast]
  );

  const loginFn = useCallback(
    async (email: string, password: string) => {
      setLoginError('');
      try {
        const { token, user: u } = await api.login(email, password);
        setToken(token);
        setUser(u);
        setIsLoggedIn(true);
        localStorage.setItem('shopmin_user', JSON.stringify(u));
        navigateTo('katalog');
        showToast(`Selamat datang, ${u.name}!`);
      } catch (err: any) {
        setLoginError(err.message || 'Login gagal');
      }
    },
    [navigateTo, showToast]
  );

  const registerFn = useCallback(
    async (name: string, email: string, password: string) => {
      setLoginError('');
      try {
        const { token, user: u } = await api.register(name, email, password);
        setToken(token);
        setUser(u);
        setIsLoggedIn(true);
        localStorage.setItem('shopmin_user', JSON.stringify(u));
        navigateTo('katalog');
        showToast(`Akun berhasil dibuat! Selamat datang, ${u.name}!`);
      } catch (err: any) {
        setLoginError(err.message || 'Registrasi gagal');
      }
    },
    [navigateTo, showToast]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('shopmin_user');
    setOrders([]);
    setWishlist([]);
    setScreenHistory(['katalog']);
    setCurrentScreen('katalog');
    navigateTo('katalog');
    showToast('Berhasil keluar', 'info');
  }, [navigateTo, showToast]);

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        reviews,
        currentScreen,
        selectedProduct,
        lastCompletedOrder,
        searchQuery,
        selectedCategory,
        sortBy,
        appliedPromo,
        promoError,
        isSidebarOpen,
        trackingOrder,
        toast,

        user,
        isLoggedIn,
        isLoading,
        loginError,

        setSearchQuery,
        setSelectedCategory,
        setSortBy,
        setIsSidebarOpen,
        setTrackingOrder,
        showToast,
        navigateTo,
        goBack,
        viewProductDetail,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        cartTax,
        cartDiscount,
        cartFinalTotal,

        toggleWishlist,
        isInWishlist,

        applyPromoCode,
        removePromoCode,

        createOrder,
        reorderItems,
        deleteOrder,
        clearAllOrders,

        getProductReviews,
        addReview,

        login: loginFn,
        register: registerFn,
        logout,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop(): ShopContextType {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
