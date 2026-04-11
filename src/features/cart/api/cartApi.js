import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import { CartSchema } from '../cart.types';

export const getCart = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.CART.GET);
  return CartSchema.parse(data);
};

export const addToCart = async (payload) => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.CART.ADD, payload);
  return CartSchema.parse(data);
};

export const updateCartItem = async (itemId, productId, quantity) => {
  const { data } = await axiosInstance.patch(API_ENDPOINTS.CART.UPDATE(itemId), {
    product_id: productId,
    quantity,
  });
  return CartSchema.parse(data);
};

export const removeCartItem = async (itemId) => {
  const { data } = await axiosInstance.delete(API_ENDPOINTS.CART.REMOVE(itemId));
  return CartSchema.parse(data);
};

export const clearCart = async () => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.CART.CLEAR);
  return CartSchema.parse(data);
};
