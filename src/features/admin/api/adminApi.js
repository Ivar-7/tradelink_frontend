import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import { AdminStatsSchema, AdminUserListSchema } from '../admin.types';

export const getAdminDashboard = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN.DASHBOARD);
  return AdminStatsSchema.parse(data);
};

export const getAdminUsers = async (params) => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS, { params });
  return AdminUserListSchema.parse(data);
};
