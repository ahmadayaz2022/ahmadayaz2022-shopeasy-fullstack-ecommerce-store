// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  PREFERENCES: 'preferences',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_ONE: '/products/:id',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
    FEATURED: '/products/featured',
  },
  CATEGORIES: {
    GET_ALL: '/categories',
    GET_ONE: '/categories/:id',
    CREATE: '/categories',
    UPDATE: '/categories/:id',
    DELETE: '/categories/:id',
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    REMOVE: '/cart/remove/:productId',
    UPDATE: '/cart/update/:productId',
    CLEAR: '/cart/clear',
  },
  ORDERS: {
    CREATE: '/orders',
    GET_ALL: '/orders',
    GET_USER: '/orders/my-orders',
    GET_ONE: '/orders/:id',
    UPDATE_STATUS: '/orders/:id/status',
    CANCEL: '/orders/:id/cancel',
  },
  REVIEWS: {
    CREATE: '/reviews',
    GET_PRODUCT: '/reviews/product/:productId',
    GET_USER: '/reviews/user/reviews',
    UPDATE: '/reviews/:id',
    DELETE: '/reviews/:id',
    HELPFUL: '/reviews/:id/helpful',
    UNHELPFUL: '/reviews/:id/unhelpful',
  },
};

// Status codes
export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

// Tax rate % 
export const TAX_RATE = 10;

// Shipping
export const SHIPPING = {
  FREE_ABOVE: 100,
  COST: 10,
};
