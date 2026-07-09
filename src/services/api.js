// ============================================================
// API SERVICE — Pet Store
// Usar axios para todas las peticiones HTTP al backend.
// Cambia BASE_URL por la URL real cuando el backend esté listo.
// ============================================================

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Instancia de axios con configuración base
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: adjunta el token JWT a cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pet_store_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: manejo global de errores
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Error de red';
    return Promise.reject(new Error(message));
  }
);

// ---- AUTH ----
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
};

// ---- PRODUCTOS ----
export const productService = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// ---- CATEGORÍAS ----
export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ---- CARRITO ----
export const cartService = {
  get: () => api.get('/cart'),
  addItem: (productId, quantity) => api.post('/cart/items', { productId, quantity }),
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete('/cart'),
  checkout: (paymentData) => api.post('/cart/checkout', paymentData),
};

// ---- PEDIDOS ----
export const orderService = {
  getMyOrders: () => api.get('/orders/me'),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: (params = {}) => api.get('/orders', { params }),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  create: (data) => api.post('/orders', data),  // ← agregado
};

// ---- FAVORITOS ----
export const favoriteService = {
  getAll: () => api.get('/favorites'),
  add: (productId) => api.post('/favorites', { productId }),
  remove: (productId) => api.delete(`/favorites/${productId}`),
};

// ---- USUARIOS (admin) ----
export const userService = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// ---- DASHBOARD (admin) ----
export const dashboardService = {
  getStats: () => api.get('/admin/stats'),
  getSalesChart: () => api.get('/admin/sales-chart'),
  getTopProducts: () => api.get('/admin/top-products'),
  getRecentOrders: () => api.get('/admin/recent-orders'),
};

// ---- PAGOS (Stripe) ----
export const paymentService = {
  createPaymentIntent: (amount, currency = 'clp') =>
    api.post('/payments/create-intent', { amount, currency }),
  confirmPayment: (paymentIntentId, orderId) =>
    api.post('/payments/confirm', { paymentIntentId, orderId }),
};

export default api;