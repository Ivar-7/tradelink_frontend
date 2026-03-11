import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContext } from './toastContext';

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const TYPE_STYLES = {
    success: 'bg-success text-white',
    error: 'bg-destructive text-white',
    warning: 'bg-warning text-white',
    info: 'bg-primary-600 text-white',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2" aria-live="polite">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex min-w-64 max-w-sm items-center justify-between rounded-lg px-4 py-3 shadow-lg ${TYPE_STYLES[toast.type]}`}
            >
              <span className="text-sm font-medium">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 shrink-0 opacity-80 hover:opacity-100"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
