import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import { AuthResponseSchema } from '../auth.types';

/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<import('../auth.types').AuthResponse>}
 */
export const login = async (credentials) => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return AuthResponseSchema.parse(data);
};

/**
 * @param {import('../auth.types').SignupInput} payload
 * @returns {Promise<import('../auth.types').AuthResponse>}
 */
export const signup = async (payload) => {
  const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP, payload);
  return AuthResponseSchema.parse(data);
};

export const logout = async () => {
  await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};
