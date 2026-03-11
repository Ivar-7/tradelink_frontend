import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import { OrderSchema, OrderListResponseSchema } from '../orders.types';

export const getOrders = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.ORDERS.LIST);
  return OrderListResponseSchema.parse(data);
};

export const getOrderById = async (id) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.ORDERS.DETAIL(id));
  return OrderSchema.parse(data);
};

export const createOrder = async (payload) => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, payload);
  return OrderSchema.parse(data);
};

export const confirmDelivery = async (id) => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.ORDERS.CONFIRM_DELIVERY(id));
  return OrderSchema.parse(data);
};
