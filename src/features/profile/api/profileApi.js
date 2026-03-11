import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';

export const getProfile = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.USERS.ME);
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await axiosInstance.patch(API_ENDPOINTS.USERS.UPDATE, payload);
  return data;
};
