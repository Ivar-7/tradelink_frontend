export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/',
    SIGNUP: '/auth/register/',
    LOGOUT: '/auth/logout/',
    REFRESH: '/auth/token/refresh/',
  },
  USERS: {
    ME: '/users/me/',
    UPDATE: '/users/me/',
    CHANGE_PASSWORD: '/users/me/change-password/',
  },
  PRODUCTS: {
    LIST: '/products/',
    DETAIL: (id) => `/products/${id}/`,
    CREATE: '/products/',
    UPDATE: (id) => `/products/${id}/`,
    DELETE: (id) => `/products/${id}/`,
    SEARCH: '/products/search/',
  },
  CATEGORIES: {
    LIST: '/categories/',
    TREE: '/categories/tree/',
    DETAIL: (id) => `/categories/${id}/`,
  },
  CART: {
    GET: '/cart/',
    ADD: '/cart/items/',
    UPDATE: (itemId) => `/cart/items/${itemId}/`,
    REMOVE: (itemId) => `/cart/items/${itemId}/delete/`,
    CLEAR: '/cart/clear/',
  },
  ORDERS: {
    LIST: '/orders/',
    DETAIL: (id) => `/orders/${id}/`,
    CREATE: '/orders/',
    UPDATE_STATUS: (id) => `/orders/${id}/status/`,
    CONFIRM_DELIVERY: (id) => `/orders/${id}/confirm/`,
    CANCEL: (id) => `/orders/${id}/cancel/`,
    ISSUE: (id) => `/orders/${id}/issue/`,
    REQUEST_RETURN: (id) => `/orders/${id}/request_return/`,
  },
  PAYMENTS: {
    METHODS: '/payments/methods/',
    SET_DEFAULT_METHOD: (id) => `/payments/methods/${id}/default/`,
    DELETE_METHOD: (id) => `/payments/methods/${id}/`,
    CREATE: '/payments/',
    VERIFY: (id) => `/payments/${id}/verify/`,
  },
  REVIEWS: {
    LIST: (productId) => `/reviews/products/${productId}/reviews/`,
    CREATE: (productId) => `/reviews/products/${productId}/reviews/`,
    DELETE: (id) => `/reviews/reviews/${id}/`,
  },
  FEEDBACK: {
    CREATE: '/feedback/',
  },
  VENDOR: {
    DASHBOARD: '/vendor/dashboard/',
    PRODUCTS: '/vendor/products/',
    PRODUCT_CREATE: '/vendor/products/',
    PRODUCT_UPDATE: (id) => `/vendor/products/${id}/`,
    PRODUCT_DELETE: (id) => `/vendor/products/${id}/`,
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard/',
    USERS: '/admin/users/',
    USER_DETAIL: (id) => `/admin/users/${id}/`,
    ORDERS: '/admin/orders/',
  },
};
