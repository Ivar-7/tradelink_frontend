import { ThemeProvider } from './shared/theme/ThemeProvider';
import { ToastProvider } from './shared/components/Toast';

/**
 * Root context provider — wraps the entire app with all global providers.
 * Add new providers here (e.g., AuthProvider, CartProvider) as features are built.
 */
const ContextProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
};

export default ContextProvider;
