import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export const useAuthHook = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthHook must be used within AuthProvider');
  return ctx;
};

export default useAuthHook;
