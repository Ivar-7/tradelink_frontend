import { useState } from 'react';
import { createPayment } from '../api/paymentsApi';
import { mapError } from '../../../shared/utils/errorHandler';

const usePaymentsHook = () => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initiate = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createPayment(payload);
      setPayment(result);
      return result;
    } catch (err) {
      const message = mapError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { payment, loading, error, initiate };
};

export default usePaymentsHook;
