import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';

export const submitFeedback = async (payload) => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.FEEDBACK.CREATE, payload);
  return data;
};
