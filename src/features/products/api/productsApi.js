import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import { ProductListResponseSchema, ProductSchema } from '../products.types';

/**
 * @param {import('../products.types').ProductFilter} [params]
 */
export const getProducts = async (params) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
  return ProductListResponseSchema.parse(data);
};

/**
 * @param {string} id
 * @returns {Promise<import('../products.types').Product>}
 */
export const getProductById = async (id) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.DETAIL(id));
  return ProductSchema.parse(data);
};
