import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import { AddToCartInputSchema, CartSchema } from '../cart.types';

const RETRY_DELAYS_MS = [500, 1000];

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const withServiceRetry = async (requestFn) => {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await requestFn();
    } catch (error) {
      const isServiceUnavailable = error?.response?.status === 503;
      const shouldRetry = isServiceUnavailable && attempt < RETRY_DELAYS_MS.length;

      if (!shouldRetry) {
        throw error;
      }

      await wait(RETRY_DELAYS_MS[attempt]);
    }
  }

  throw new Error('Cart request failed after retries.');
};

export const getCart = async () => {
  const { data } = await withServiceRetry(() => axiosInstance.get(API_ENDPOINTS.CART.GET));
  return CartSchema.parse(data);
};

export const addToCart = async (payload) => {
  const parsed = AddToCartInputSchema.parse(payload);
  const requestBody = {
    product_id: parsed.product_id,
    quantity: parsed.quantity,
  };

  try {
    const { data } = await withServiceRetry(() => axiosInstance.post(API_ENDPOINTS.CART.ADD, requestBody));
    return CartSchema.parse(data);
  } catch (error) {
    if (error?.response?.status === 400 && import.meta.env.DEV) {
      console.error('[Cart addToCart 400]', error.response.data);
    }
    throw error;
  }
};

export const updateCartItem = async (itemId, productId, quantity) => {
  const parsed = AddToCartInputSchema.parse({
    product_id: productId,
    quantity,
  });

  const { data } = await withServiceRetry(() =>
    axiosInstance.patch(API_ENDPOINTS.CART.UPDATE(itemId), {
      product_id: parsed.product_id,
      quantity: parsed.quantity,
    })
  );
  return CartSchema.parse(data);
};

export const removeCartItem = async (itemId) => {
  const { data } = await withServiceRetry(() => axiosInstance.delete(API_ENDPOINTS.CART.REMOVE(itemId)));
  return CartSchema.parse(data);
};

export const clearCart = async () => {
  const { data } = await withServiceRetry(() => axiosInstance.post(API_ENDPOINTS.CART.CLEAR));
  return CartSchema.parse(data);
};
