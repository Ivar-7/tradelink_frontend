import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addToCart, removeCartItem, updateCartItem, clearCart } from '../api/cartApi';
import { mapError } from '../../../shared/utils/errorHandler';

const useCartHook = create(
  persist(
    (set, get) => ({
      cart: null,
      loading: false,
      error: null,

      setCart: (cart) => set({ cart }),

      addItem: async (payload) => {
        set({ loading: true, error: null });
        try {
          const cart = await addToCart(payload);
          set({ cart });
        } catch (err) {
          set({ error: mapError(err) });
        } finally {
          set({ loading: false });
        }
      },

      updateItem: async (itemId, quantity) => {
        set({ loading: true, error: null });
        try {
          const cart = await updateCartItem(itemId, quantity);
          set({ cart });
        } catch (err) {
          set({ error: mapError(err) });
        } finally {
          set({ loading: false });
        }
      },

      removeItem: async (itemId) => {
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
        set({ loading: true, error: null });
        try {
          await clearCart();
          set({ cart: null });
        } catch (err) {
          set({ error: mapError(err) });
        } finally {
          set({ loading: false });
        }
      },

      itemCount: () => get().cart?.products.reduce((sum, p) => sum + p.quantity, 0) ?? 0,
    }),
    { name: 'tradelink-cart' }
  )
);

export default useCartHook;
