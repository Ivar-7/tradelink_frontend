import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import { CreateOrderInputSchema, OrderListResponseSchema, OrderSchema } from '../orders.types';

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

  throw new Error('Order request failed after retries.');
};

export const getOrders = async (status = 'all') => {
  const params = status && status !== 'all' ? { status } : undefined;
  const { data } = await withServiceRetry(() => axiosInstance.get(API_ENDPOINTS.ORDERS.LIST, { params }));
  return OrderListResponseSchema.parse(data);
};

export const getOrderById = async (id) => {
  const { data } = await withServiceRetry(() => axiosInstance.get(API_ENDPOINTS.ORDERS.DETAIL(id)));
  return OrderSchema.parse(data);
};

export const createOrder = async (payload) => {
  const parsed = CreateOrderInputSchema.parse(payload);
  const { data } = await withServiceRetry(() => axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, parsed));
  return OrderSchema.parse(data);
};

export const confirmDelivery = async (id) => {
  const { data } = await withServiceRetry(() => axiosInstance.post(API_ENDPOINTS.ORDERS.CONFIRM_DELIVERY(id)));
  return OrderSchema.parse(data);
};

export const cancelOrder = async (id, reason) => {
  const { data } = await withServiceRetry(() =>
    axiosInstance.post(API_ENDPOINTS.ORDERS.CANCEL(id), { reason })
  );
  return OrderSchema.parse(data);
};

export const reportOrderIssue = async (id, payload) => {
  const { data } = await withServiceRetry(() => axiosInstance.post(API_ENDPOINTS.ORDERS.ISSUE(id), payload));
  return OrderSchema.parse(data);
};

export const initiateReturn = async (id, payload) => {
  const { data } = await withServiceRetry(() =>
    axiosInstance.post(API_ENDPOINTS.ORDERS.REQUEST_RETURN(id), payload)
  );
  return OrderSchema.parse(data);
};
