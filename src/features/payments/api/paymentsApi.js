import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import {
  CreatePaymentInputSchema,
  PaymentMethodListSchema,
  PaymentMethodSchema,
  PaymentSchema,
} from '../payments.types';

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

  throw new Error('Payment request failed after retries.');
};

export const getPaymentMethods = async () => {
  const { data } = await withServiceRetry(() => axiosInstance.get(API_ENDPOINTS.PAYMENTS.METHODS));
  return PaymentMethodListSchema.parse(data);
};

export const addPaymentMethod = async (payload) => {
  const { data } = await withServiceRetry(() =>
    axiosInstance.post(API_ENDPOINTS.PAYMENTS.METHODS, payload)
  );
  return PaymentMethodSchema.parse(data);
};

export const setDefaultPaymentMethod = async (id) => {
  const { data } = await withServiceRetry(() =>
    axiosInstance.patch(API_ENDPOINTS.PAYMENTS.SET_DEFAULT_METHOD(id))
  );
  return PaymentMethodSchema.parse(data);
};

export const removePaymentMethod = async (id) => {
  const { data } = await withServiceRetry(() => axiosInstance.delete(API_ENDPOINTS.PAYMENTS.DELETE_METHOD(id)));
  return data;
};

export const createPayment = async (payload) => {
  const parsed = CreatePaymentInputSchema.parse(payload);
  const { data } = await withServiceRetry(() => axiosInstance.post(API_ENDPOINTS.PAYMENTS.CREATE, parsed));
  return PaymentSchema.parse(data);
};

export const verifyPayment = async (id) => {
  const { data } = await withServiceRetry(() => axiosInstance.get(API_ENDPOINTS.PAYMENTS.VERIFY(id)));
  return PaymentSchema.parse(data);
};
