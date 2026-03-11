import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import { ReviewListResponseSchema } from '../reviews.types';

export const getReviews = async (productId) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.REVIEWS.LIST(productId));
  return ReviewListResponseSchema.parse(data);
};

export const createReview = async (productId, payload) => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.REVIEWS.CREATE(productId), payload);
  return data;
};
