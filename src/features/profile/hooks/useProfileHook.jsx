import { useCallback, useEffect, useState } from 'react';
import {
  getProfile,
  updateProfile,
  addAddress,
  removeAddress,
  setDefaultAddress,
  updateNotifications,
  updatePrivacy,
  requestDataExport,
} from '../api/profileApi';
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

  const addProfileAddress = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await addAddress(payload);
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

  const deleteProfileAddress = useCallback(async (addressId) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await removeAddress(addressId);
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

  const makeDefaultAddress = useCallback(async (addressId) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await setDefaultAddress(addressId);
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

  const saveNotifications = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateNotifications(payload);
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

  const savePrivacy = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updatePrivacy(payload);
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

  const exportData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await requestDataExport();
    } catch (err) {
      const message = mapError(err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    save,
    addAddress: addProfileAddress,
    removeAddress: deleteProfileAddress,
    setDefaultAddress: makeDefaultAddress,
    saveNotifications,
    savePrivacy,
    exportData,
    refetch: fetchProfile,
  };
};

export default useProfileHook;
