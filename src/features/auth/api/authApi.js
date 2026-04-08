import axiosInstance from '../../../shared/api/axiosInstance';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import { AuthResponseSchema, ChangePasswordInputSchema, LoginInputSchema, SignupInputSchema } from '../auth.types';

const authStorageKeys = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  user: 'user',
};

const persistSession = (response) => {
  localStorage.setItem(authStorageKeys.accessToken, response.tokens.access);
  localStorage.setItem(authStorageKeys.refreshToken, response.tokens.refresh);
  localStorage.setItem(authStorageKeys.user, JSON.stringify(response.user));
  return response;
};

const normalizeResponse = (payload) => {
  if (payload?.tokens?.access && payload?.tokens?.refresh) {
    return AuthResponseSchema.parse(payload);
  }

  if (payload?.access_token && payload?.refresh_token && payload?.user) {
    return AuthResponseSchema.parse({
      user: payload.user,
      tokens: {
        access: payload.access_token,
        refresh: payload.refresh_token,
      },
    });
  }

  return AuthResponseSchema.parse(payload);
};

/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<import('../auth.types').AuthResponse>}
 */
export const login = async (credentials) => {
  const parsed = LoginInputSchema.parse(credentials);
  const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, parsed);
  return persistSession(normalizeResponse(data));
};

/**
 * @param {import('../auth.types').SignupInput} payload
 * @returns {Promise<import('../auth.types').AuthResponse>}
 */
export const signup = async (payload) => {
  const parsed = SignupInputSchema.parse(payload);
  const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP, {
    username: parsed.username,
    first_name: parsed.first_name,
    last_name: parsed.last_name,
    email: parsed.email,
    password: parsed.password,
    password_confirm: parsed.password_confirm,
    phone_number: parsed.phone_number,
    gender: parsed.gender,
    role: parsed.role,
    date_of_birth: parsed.date_of_birth,
  });
  return normalizeResponse(data);
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINTS.USERS.ME);
  return data;
};

export const changePassword = async (payload) => {
  const parsed = ChangePasswordInputSchema.parse(payload);
  const { data } = await axiosInstance.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD, parsed);
  return data;
};

export const requestPasswordReset = async () => {
  return {
    message: 'Password reset is not available in the backend API yet.',
  };
};

export const logout = async () => {
  const refresh = localStorage.getItem(authStorageKeys.refreshToken);

  try {
    if (refresh) {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT, { refresh });
    }
  } finally {
    localStorage.removeItem(authStorageKeys.accessToken);
    localStorage.removeItem(authStorageKeys.refreshToken);
    localStorage.removeItem(authStorageKeys.user);
  }
};
