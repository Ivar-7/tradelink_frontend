import { useCallback, useEffect, useState } from 'react';
import { getOrders, getOrderById, confirmDelivery } from '../api/ordersApi';
import { mapError } from '../../../shared/utils/errorHandler';

export const useOrdersHook = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOrders();
      setOrders(result.orders);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
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

  return { order, loading, error, confirmDelivery: handleConfirmDelivery };
};

export default useOrdersHook;
