import { ThemeProvider } from '../theme/ThemeProvider';
import { ToastProvider } from '../components/Toast';
import AuthProvider from '../../features/auth/AuthProvider';

const ContextProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default ContextProvider;
