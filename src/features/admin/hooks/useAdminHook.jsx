import { useCallback, useEffect, useState } from 'react';
import { getAdminDashboard } from '../api/adminApi';
import { mapError } from '../../../shared/utils/errorHandler';

const useAdminHook = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminDashboard();
      setStats(data);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
};

export default useAdminHook;
