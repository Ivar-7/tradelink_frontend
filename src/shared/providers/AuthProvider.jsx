import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from '../../features/auth/context/authContext';
import { UserSchema } from '../../features/auth/auth.types';
import {
  login as loginApi,
  getCurrentUser as getCurrentUserApi,
  signup as signupApi,
  logout as logoutApi,
  requestPasswordReset as requestPasswordResetApi,
} from '../../features/auth/api/authApi';
import { mapError } from '../utils/errorHandler';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) {
        return null;
      }

      const parsedUser = UserSchema.safeParse(JSON.parse(stored));
      return parsedUser.success ? parsedUser.data : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = UserSchema.safeParse(JSON.parse(storedUser));
        if (parsedUser.success) {
          setUser(parsedUser.data);
        } else {
          localStorage.removeItem('user');
        }
      } catch {
        localStorage.removeItem('user');
      }
    }

    if (!accessToken) {
      return;
    }

    let isActive = true;

    const hydrateSession = async () => {
      setLoading(true);
      try {
        const currentUser = await getCurrentUserApi();
        if (!isActive) return;
        const parsedUser = UserSchema.safeParse(currentUser);
        if (parsedUser.success) {
          localStorage.setItem('user', JSON.stringify(parsedUser.data));
          setUser(parsedUser.data);
        } else {
          throw new Error('Unexpected user response from the backend.');
        }
      } catch (err) {
        if (!isActive) return;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
        setError(mapError(err));
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    hydrateSession();

    return () => {
      isActive = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginApi(credentials);
      setUser(response.user);
      return response.user;
    } catch (err) {
      const message = mapError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await signupApi(payload);
      return response.user;
    } catch (err) {
      const message = mapError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  const requestPasswordReset = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      return await requestPasswordResetApi(payload);
    } catch (err) {
      const message = mapError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        requestPasswordReset,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
