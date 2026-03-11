import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import { PaymentSchema } from '../payments.types';

export const createPayment = async (payload) => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.CREATE, payload);
  return PaymentSchema.parse(data);
};

export const verifyPayment = async (id) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.VERIFY(id));
  return PaymentSchema.parse(data);
};
