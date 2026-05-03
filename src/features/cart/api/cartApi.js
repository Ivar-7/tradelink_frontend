import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import { AddToCartInputSchema, CartSchema } from '../cart.types';

const RETRY_DELAYS_MS = [1000, 2000, 4000];
const CART_REQUEST_TIMEOUT_MS = 30000;

const RETRYABLE_STATUS_CODES = new Set([429, 502, 503, 504]);

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const isTimeoutError = (error) => {
  return error?.code === 'ECONNABORTED' || (typeof error?.message === 'string' && error.message.toLowerCase().includes('timeout'));
};

const isNetworkError = (error) => {
  return Boolean(error?.request) && !error?.response;
};

const shouldRetryRequest = (error) => {
  const statusCode = error?.response?.status;
  return isTimeoutError(error) || isNetworkError(error) || RETRYABLE_STATUS_CODES.has(statusCode);
};

const withServiceRetry = async (requestFn) => {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await requestFn();
    } catch (error) {
      const shouldRetry = shouldRetryRequest(error) && attempt < RETRY_DELAYS_MS.length;

      if (!shouldRetry) {
        throw error;
      }

      await wait(RETRY_DELAYS_MS[attempt]);
    }
  }

  throw new Error('Cart request failed after retries.');
};

export const getCart = async () => {
  const { data } = await withServiceRetry(() =>
    axiosInstance.get(API_ENDPOINTS.CART.GET, { timeout: CART_REQUEST_TIMEOUT_MS })
  );
  return CartSchema.parse(data);
};

export const addToCart = async (payload) => {
  const parsed = AddToCartInputSchema.parse(payload);
  const requestBody = {
    product_id: parsed.product_id,
    quantity: parsed.quantity,
  };

  try {
    const { data } = await withServiceRetry(() =>
      axiosInstance.post(API_ENDPOINTS.CART.ADD, requestBody, { timeout: CART_REQUEST_TIMEOUT_MS })
    );
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
    }, { timeout: CART_REQUEST_TIMEOUT_MS })
  );
  return CartSchema.parse(data);
};

export const removeCartItem = async (itemId) => {
  const { data } = await withServiceRetry(() =>
    axiosInstance.delete(API_ENDPOINTS.CART.REMOVE(itemId), { timeout: CART_REQUEST_TIMEOUT_MS })
  );
  return CartSchema.parse(data);
};

export const clearCart = async () => {
  const { data } = await withServiceRetry(() =>
    axiosInstance.post(API_ENDPOINTS.CART.CLEAR, {}, { timeout: CART_REQUEST_TIMEOUT_MS })
  );
  return CartSchema.parse(data);
};
