import { useCallback, useState } from 'react';
import { AuthContext } from './context/authContext';

/**
 * Mock AuthProvider — works fully offline, no backend required.
 * Swap `login` / `signup` internals once a real API exists.
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('tl_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async ({ email, password: _password }) => {
    setLoading(true);
    setError(null);
    try {
      // Mock: accept any credentials
      const mockUser = { id: '1', email, name: email.split('@')[0] };
      localStorage.setItem('tl_user', JSON.stringify(mockUser));
      localStorage.setItem('access_token', 'mock-access-token');
      setUser(mockUser);
    } catch {
      setError('Login failed. Please try again.');
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      // Mock: accept any registration data
      const mockUser = {
        id: '1',
        email: data.user_email,
        name: `${data.user_fname} ${data.user_lname}`.trim(),
      };
      localStorage.setItem('tl_user', JSON.stringify(mockUser));
      localStorage.setItem('access_token', 'mock-access-token');
      setUser(mockUser);
    } catch {
      setError('Signup failed. Please try again.');
      throw new Error('Signup failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tl_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
