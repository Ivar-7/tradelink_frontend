import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import { CartSchema } from '../cart.types';
import { getCatalogProductById } from '../../products/data/productCatalog';

const CART_STORAGE_KEY = 'tradelink-local-cart';

const readLocalCart = () => {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (!stored) {
    return {
      id: 'local-cart',
      user_id: 'guest-user',
      date_created: new Date().toISOString(),
      total_price: 0,
      products: [],
    };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return {
      id: 'local-cart',
      user_id: 'guest-user',
      date_created: new Date().toISOString(),
      total_price: 0,
      products: [],
    };
  }
};

const saveLocalCart = (cart) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

const normalizeCartTotals = (cart) => {
  const products = cart.products.map((item) => ({
    ...item,
    subtotal: Number((item.unit_price * item.quantity).toFixed(2)),
  }));

  return {
    ...cart,
    products,
    total_price: Number(products.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)),
  };
};

const getLocalCart = () => {
  const cart = normalizeCartTotals(readLocalCart());
  saveLocalCart(cart);
  return CartSchema.parse(cart);
};

export const getCart = async () => {
  try {
    const { data } = await axiosInstance.get(API_ENDPOINTS.CART.GET);
    return CartSchema.parse(data);
  } catch {
    return getLocalCart();
  }
};

export const addToCart = async (payload) => {
  try {
    const { data } = await axiosInstance.post(API_ENDPOINTS.CART.ADD, payload);
    return CartSchema.parse(data);
  } catch {
    const cart = readLocalCart();
    const product = getCatalogProductById(payload.product_id);

    if (!product) {
      throw new Error('Product not found.');
    }

    const existing = cart.products.find((item) => item.product_id === payload.product_id);
    if (existing) {
      existing.quantity += payload.quantity;
    } else {
      cart.products.push({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image,
        quantity: payload.quantity,
        unit_price: product.price,
        subtotal: Number((product.price * payload.quantity).toFixed(2)),
      });
    }

    const normalized = normalizeCartTotals(cart);
    saveLocalCart(normalized);
    return CartSchema.parse(normalized);
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const { data } = await axiosInstance.patch(API_ENDPOINTS.CART.UPDATE(itemId), { quantity });
    return CartSchema.parse(data);
  } catch {
    const cart = readLocalCart();
    cart.products = cart.products
      .map((item) =>
        item.product_id === itemId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
      .filter((item) => item.quantity > 0);

    const normalized = normalizeCartTotals(cart);
    saveLocalCart(normalized);
    return CartSchema.parse(normalized);
  }
};

export const removeCartItem = async (itemId) => {
  try {
    const { data } = await axiosInstance.delete(API_ENDPOINTS.CART.REMOVE(itemId));
    return CartSchema.parse(data);
  } catch {
    const cart = readLocalCart();
    cart.products = cart.products.filter((item) => item.product_id !== itemId);
    const normalized = normalizeCartTotals(cart);
    saveLocalCart(normalized);
    return CartSchema.parse(normalized);
  }
};

export const clearCart = async () => {
  try {
    await axiosInstance.post(API_ENDPOINTS.CART.CLEAR);
  } catch {
    const cart = readLocalCart();
    const cleared = {
      ...cart,
      products: [],
      total_price: 0,
    };
    saveLocalCart(cleared);
  }
};
