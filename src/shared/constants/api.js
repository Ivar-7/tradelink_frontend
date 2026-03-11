export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    ME: '/users/me',
    UPDATE: '/users/me',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
    SEARCH: '/products/search',
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/items',
    UPDATE: (itemId) => `/cart/items/${itemId}`,
    REMOVE: (itemId) => `/cart/items/${itemId}`,
    CLEAR: '/cart/clear',
  },
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE_STATUS: (id) => `/orders/${id}/status`,
    CONFIRM_DELIVERY: (id) => `/orders/${id}/confirm`,
  },
  PAYMENTS: {
    CREATE: '/payments',
    VERIFY: (id) => `/payments/${id}/verify`,
  },
  REVIEWS: {
    LIST: (productId) => `/products/${productId}/reviews`,
    CREATE: (productId) => `/products/${productId}/reviews`,
    DELETE: (id) => `/reviews/${id}`,
  },
  FEEDBACK: {
    CREATE: '/feedback',
  },
  VENDOR: {
    DASHBOARD: '/vendor/dashboard',
    PRODUCTS: '/vendor/products',
    PRODUCT_CREATE: '/vendor/products',
    PRODUCT_UPDATE: (id) => `/vendor/products/${id}`,
    PRODUCT_DELETE: (id) => `/vendor/products/${id}`,
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USER_DETAIL: (id) => `/admin/users/${id}`,
    ORDERS: '/admin/orders',
  },
};
