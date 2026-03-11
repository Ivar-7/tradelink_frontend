import { useCallback, useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../api/profileApi';
import { mapError } from '../../../shared/utils/errorHandler';

const useProfileHook = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) {
      setError(mapError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const save = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateProfile(payload);
      setProfile(updated);
      return updated;
    } catch (err) {
      const message = mapError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, error, save, refetch: fetchProfile };
};

export default useProfileHook;
