import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import fallbackProductImage from '../../../assets/images/photo.jpg';
import {
  CategorySchema,
  CategoryTreeNodeSchema,
  ProductFilterSchema,
  ProductListResponseSchema,
  ProductSchema,
} from '../products.types';

const normalizeImageUrl = (value) => {
  if (typeof value !== 'string') return fallbackProductImage;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallbackProductImage;
};

const normalizeCategoryMedia = (category) => {
  if (!category || typeof category !== 'object') return category;

  return {
    ...category,
    image_url: normalizeImageUrl(category.image_url),
  };
};

const normalizeCategoryTreeMedia = (category) => {
  const normalizedCategory = normalizeCategoryMedia(category);

  if (!normalizedCategory || typeof normalizedCategory !== 'object') {
    return normalizedCategory;
  }

  return {
    ...normalizedCategory,
    children: Array.isArray(normalizedCategory.children)
      ? normalizedCategory.children.map(normalizeCategoryTreeMedia)
      : normalizedCategory.children,
  };
};

const normalizeProductMedia = (product) => {
  if (!product || typeof product !== 'object') return product;

  const normalizedImages = Array.isArray(product.images)
    ? product.images.map((image) => ({
      ...image,
      image_url: normalizeImageUrl(image?.image_url),
    }))
    : [];

  return {
    ...product,
    image_url: normalizeImageUrl(product.image_url),
    category: normalizeCategoryMedia(product.category),
    images: normalizedImages,
  };
};

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
  const parsedParams = params ? ProductFilterSchema.partial().parse(params) : undefined;
  const { data } = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.LIST, { params: parsedParams });
  const normalizedProducts = Array.isArray(data?.products)
    ? data.products.map(normalizeProductMedia)
    : [];

  return ProductListResponseSchema.parse({
    ...data,
    products: normalizedProducts,
  });
};

/**
 * @param {string} id
 * @returns {Promise<import('../products.types').Product>}
 */
export const getProductById = async (id) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.DETAIL(id));
  return ProductSchema.parse(normalizeProductMedia(data));
};

export const getCategories = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.LIST);
  const normalizedCategories = extractCollection(data).map(normalizeCategoryMedia);
  return CategorySchema.array().parse(normalizedCategories);
};

export const getCategoriesTree = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.TREE);
  const normalizedCategoryTree = extractCollection(data).map(normalizeCategoryTreeMedia);
  return CategoryTreeNodeSchema.array().parse(normalizedCategoryTree);
};
