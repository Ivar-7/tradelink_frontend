import { create } from 'zustand';
import { addToCart, removeCartItem, updateCartItem, clearCart, getCart } from '../api/cartApi';
import { mapError } from '../../../shared/utils/errorHandler';

const AUTH_REQUIRED_MESSAGE = 'Please log in to view your cart.';

const hasAccessToken = () => Boolean(localStorage.getItem('access_token'));

const useCartHook = create((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  setCart: (cart) => set({ cart }),

  fetchCart: async () => {
    if (!hasAccessToken()) {
      set({ cart: null, error: AUTH_REQUIRED_MESSAGE, loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const cart = await getCart();
      set({ cart });
    } catch (err) {
      set({ error: mapError(err) });
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (payload) => {
    if (!hasAccessToken()) {
      set({ error: AUTH_REQUIRED_MESSAGE });
      return { ok: false, error: AUTH_REQUIRED_MESSAGE };
    }
    set({ loading: true, error: null });
    try {
      const cart = await addToCart(payload);
      set({ cart });
      return { ok: true, cart };
    } catch (err) {
      const message = mapError(err);
      set({ error: message });
      return { ok: false, error: message };
    } finally {
      set({ loading: false });
    }
  },

  updateItem: async (itemId, productId, quantity) => {
    if (!hasAccessToken()) {
      set({ error: AUTH_REQUIRED_MESSAGE });
      return;
    }
    set({ loading: true, error: null });
    try {
      const cart = await updateCartItem(itemId, productId, quantity);
      set({ cart });
    } catch (err) {
      set({ error: mapError(err) });
    } finally {
      set({ loading: false });
    }
  },

  removeItem: async (itemId) => {
    if (!hasAccessToken()) {
      set({ error: AUTH_REQUIRED_MESSAGE });
      return;
    }
    set({ loading: true, error: null });
    try {
      const cart = await removeCartItem(itemId);
      set({ cart });
    } catch (err) {
      set({ error: mapError(err) });
    } finally {
      set({ loading: false });
    }
  },

  clear: async () => {
    if (!hasAccessToken()) {
      set({ error: AUTH_REQUIRED_MESSAGE });
      return;
    }
    set({ loading: true, error: null });
    try {
      const cart = await clearCart();
      set({ cart });
    } catch (err) {
      set({ error: mapError(err) });
    } finally {
      set({ loading: false });
    }
  },

  itemCount: () => get().cart?.products.reduce((sum, p) => sum + p.quantity, 0) ?? 0,
}));

export default useCartHook;
