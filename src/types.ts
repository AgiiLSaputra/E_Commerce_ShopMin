export type Category = 'Semua' | 'Elektronik' | 'Fashion' | 'Home' | 'Aksesoris';

export type ScreenType =
  | 'katalog'
  | 'detail'
  | 'cart'
  | 'checkout'
  | 'success'
  | 'riwayat'
  | 'wishlist'
  | 'profile'
  | 'login';

export type OrderStatus = 'Diproses' | 'Dikirim' | 'Selesai' | 'Dibatalkan';

export interface ProductColor {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  isVerified: boolean;
  date: string;
  rating: number;
  title: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category | string;
  price: number;
  originalPrice?: number;
  badge?: string;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  description: string;
  colors: ProductColor[];
  variants?: string[];
  features: string[];
  specs: ProductSpec[];
  inStock: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedColor?: string;
  selectedVariant?: string;
  quantity: number;
  price: number;
}

export interface RecipientInfo {
  fullName: string;
  phoneNumber: string;
  city: string;
  fullAddress: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  variant?: string;
  quantity: number;
  price: number;
}

export interface TrackingStep {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  recipient: RecipientInfo;
  paymentMethod: 'COD' | 'GoPay' | 'OVO' | 'Bank Transfer';
  estimatedDelivery: string;
  trackingSteps?: TrackingStep[];
}

export interface PromoCode {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minSpend?: number;
  description: string;
}
