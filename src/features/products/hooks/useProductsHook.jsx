import { useCallback, useEffect, useState } from 'react';
import { getProducts, getProductById } from '../api/productsApi';
import { mapError } from '../../../shared/utils/errorHandler';

export const useProductsHook = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getProducts(params);
      setProducts(result.products);
      setTotal(result.total);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, total, loading, error, refetch: fetchProducts };
};

export const useProductDetailHook = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getProductById(id)
      .then(setProduct)
      .catch((err) => setError(mapError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
};

export default useProductsHook;
