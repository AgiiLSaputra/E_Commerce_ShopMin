const API_BASE = 'http://localhost:5000/api';

function getToken(): string | null {
  return localStorage.getItem('shopmin_token');
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem('shopmin_token', token);
  else localStorage.removeItem('shopmin_token');
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan');
  return data;
}

export interface ApiProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  description: string;
  colors: { name: string; hex: string; inStock: boolean }[];
  variants?: string[];
  features: string[];
  specs: { label: string; value: string }[];
  inStock: boolean;
}

export interface ApiReview {
  id: string;
  productId: string;
  userName: string;
  isVerified: boolean;
  date: string;
  rating: number;
  title: string;
  comment: string;
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  date: string;
  status: string;
  items: { productId: string; name: string; image: string; variant: string; quantity: number; price: number }[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  recipient: { fullName: string; phoneNumber: string; city: string; fullAddress: string };
  paymentMethod: string;
  estimatedDelivery: string;
  trackingSteps?: { title: string; description: string; timestamp: string; completed: boolean }[];
}

export interface ApiPromo {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minSpend?: number;
  description: string;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
}

export const api = {
  getProducts: (params?: { category?: string; search?: string; sort?: string }) => {
    const qs = new URLSearchParams();
    if (params?.category && params.category !== 'Semua') qs.set('category', params.category);
    if (params?.search) qs.set('search', params.search);
    if (params?.sort) qs.set('sort', params.sort);
    const q = qs.toString();
    return apiFetch<{ products: ApiProduct[] }>(`/products${q ? `?${q}` : ''}`);
  },

  getProduct: (id: string) =>
    apiFetch<{ product: ApiProduct }>(`/products/${id}`),

  getReviews: (productId: string) =>
    apiFetch<{ reviews: ApiReview[] }>(`/reviews/${productId}`),

  addReview: (productId: string, userName: string, rating: number, title: string, comment: string) =>
    apiFetch<{ review: ApiReview }>('/reviews', {
      method: 'POST',
      body: JSON.stringify({ productId, userName, rating, title, comment }),
    }),

  validatePromo: (code: string) =>
    apiFetch<{ promo: ApiPromo }>(`/promo/${code}`),

  // Auth
  register: (name: string, email: string, password: string) =>
    apiFetch<{ token: string; user: ApiUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: ApiUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () =>
    apiFetch<{ user: ApiUser }>('/auth/me'),

  // Orders
  createOrder: (items: { productId: string; name: string; image: string; variant?: string; quantity: number; price: number }[], recipient: { fullName: string; phoneNumber: string; city: string; fullAddress: string }, paymentMethod: string) =>
    apiFetch<{ order: ApiOrder }>('/orders', {
      method: 'POST',
      body: JSON.stringify({ items, recipient, paymentMethod }),
    }),

  getOrders: () =>
    apiFetch<{ orders: ApiOrder[] }>('/orders'),

  deleteOrder: (orderId: string) =>
    apiFetch(`/orders/${orderId}`, { method: 'DELETE' }),

  deleteAllOrders: () =>
    apiFetch('/orders', { method: 'DELETE' }),

  // Wishlist
  getWishlist: () =>
    apiFetch<{ wishlist: ApiProduct[] }>('/wishlist'),

  addToWishlist: (productId: string) =>
    apiFetch(`/wishlist/${productId}`, { method: 'POST' }),

  removeFromWishlist: (productId: string) =>
    apiFetch(`/wishlist/${productId}`, { method: 'DELETE' }),
};
