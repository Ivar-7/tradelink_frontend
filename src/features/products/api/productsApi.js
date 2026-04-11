import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import {
  CategorySchema,
  CategoryTreeNodeSchema,
  ProductListResponseSchema,
  ProductSchema,
} from '../products.types';

const extractCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.categories)) {
    return payload.categories;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
};

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

export const getCategories = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.LIST);
  return CategorySchema.array().parse(extractCollection(data));
};

export const getCategoriesTree = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.TREE);
  return CategoryTreeNodeSchema.array().parse(extractCollection(data));
};
