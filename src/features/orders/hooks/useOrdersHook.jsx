import { useCallback, useEffect, useState } from 'react';
import {
  getOrders,
  getOrderById,
  confirmDelivery,
  cancelOrder,
  reportOrderIssue,
  initiateReturn,
} from '../api/ordersApi';
import { mapError } from '../../../shared/utils/errorHandler';

export const useOrdersHook = (initialStatus = 'all') => {
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async (status = activeStatus) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOrders(status);
      setOrders(result.orders);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }, [activeStatus]);

  useEffect(() => {
    fetchOrders(activeStatus);
  }, [fetchOrders, activeStatus]);

  return {
    orders,
    activeStatus,
    loading,
    error,
    setActiveStatus,
    refetch: fetchOrders,
  };
};

export const useOrderDetailHook = (id) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getOrderById(id);
      setOrder(result);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleConfirmDelivery = useCallback(async () => {
    setLoading(true);
    try {
      const updated = await confirmDelivery(id);
      setOrder(updated);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleCancelOrder = useCallback(async (reason) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await cancelOrder(id, reason);
      setOrder(updated);
    } catch (err) {
      setError(mapError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleReportIssue = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await reportOrderIssue(id, payload);
      setOrder(updated);
    } catch (err) {
      setError(mapError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleInitiateReturn = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await initiateReturn(id, payload);
      setOrder(updated);
    } catch (err) {
      setError(mapError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  return {
    order,
    loading,
    error,
    confirmDelivery: handleConfirmDelivery,
    cancelOrder: handleCancelOrder,
    reportIssue: handleReportIssue,
    initiateReturn: handleInitiateReturn,
  };
};

export default useOrdersHook;
