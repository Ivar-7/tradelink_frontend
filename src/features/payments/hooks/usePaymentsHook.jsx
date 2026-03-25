import { useState } from 'react';
import {
  createPayment,
  getPaymentMethods,
  addPaymentMethod,
  setDefaultPaymentMethod,
  removePaymentMethod,
} from '../api/paymentsApi';
import { mapError } from '../../../shared/utils/errorHandler';

const usePaymentsHook = () => {
  const [payment, setPayment] = useState(null);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMethods = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPaymentMethods();
      setMethods(result.methods);
      return result.methods;
    } catch (err) {
      const message = mapError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const addMethod = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      await addPaymentMethod(payload);
      const result = await getPaymentMethods();
      setMethods(result.methods);
      return result.methods;
    } catch (err) {
      const message = mapError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const setDefaultMethod = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await setDefaultPaymentMethod(id);
      const result = await getPaymentMethods();
      setMethods(result.methods);
      return result.methods;
    } catch (err) {
      const message = mapError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const removeMethod = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await removePaymentMethod(id);
      const result = await getPaymentMethods();
      setMethods(result.methods);
      return result.methods;
    } catch (err) {
      const message = mapError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

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

  return {
    payment,
    methods,
    loading,
    error,
    initiate,
    fetchMethods,
    addMethod,
    setDefaultMethod,
    removeMethod,
  };
};

export default usePaymentsHook;
