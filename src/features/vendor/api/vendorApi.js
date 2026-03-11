import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import { VendorDashboardSchema } from '../vendor.types';

export const getVendorDashboard = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.VENDOR.DASHBOARD);
  return VendorDashboardSchema.parse(data);
};

export const getVendorProducts = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.VENDOR.PRODUCTS);
  return data;
};

export const createVendorProduct = async (payload) => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.VENDOR.PRODUCT_CREATE, payload);
  return data;
};

export const updateVendorProduct = async (id, payload) => {
  const { data } = await axiosInstance.patch(API_ENDPOINTS.VENDOR.PRODUCT_UPDATE(id), payload);
  return data;
};

export const deleteVendorProduct = async (id) => {
  await axiosInstance.delete(API_ENDPOINTS.VENDOR.PRODUCT_DELETE(id));
};
