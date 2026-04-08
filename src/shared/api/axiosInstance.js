import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const hadAuthHeader = Boolean(originalRequest?.headers?.Authorization);

    if (error.response?.status === 401 && hadAuthHeader && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
          refresh: refreshToken,
        });
        const nextAccessToken = data.access || data.access_token;
        if (nextAccessToken) {
          localStorage.setItem('access_token', nextAccessToken);
          originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
