import { useCallback, useEffect, useState } from 'react';
import {
  getVendorDashboard,
  getVendorProducts,
  createVendorProduct,
  deleteVendorProduct,
} from '../api/vendorApi';
import { mapError } from '../../../shared/utils/errorHandler';

export const useVendorDashboardHook = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVendorDashboard();
      setDashboard(data);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  return { dashboard, loading, error, refetch: fetchDashboard };
};

export const useVendorProductsHook = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVendorProducts();
      setProducts(data?.products ?? data ?? []);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const create = useCallback(async (payload) => {
    try {
      const created = await createVendorProduct(payload);
      setProducts((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      const message = mapError(err);
      setError(message);
      throw new Error(message);
    }
  }, []);

  const remove = useCallback(async (id) => {
    try {
      await deleteVendorProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(mapError(err));
    }
  }, []);

  return { products, loading, error, refetch: fetchProducts, create, remove };
};

export default useVendorDashboardHook;
