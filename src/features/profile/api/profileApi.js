import {
  ProfileSchema,
  UpdateProfileInputSchema,
  UpsertAddressInputSchema,
  NotificationPreferencesSchema,
  PrivacyPreferencesSchema,
} from '../profile.types';

const PROFILE_STORAGE_KEY = 'tradelink-profile';

const wait = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

const defaultProfile = {
  user_id: 'guest-user',
  username: 'angela.trader',
  user_fname: 'Angela',
  user_lname: 'Mwangi',
  user_email: 'angela@tradelink.dev',
  user_phone: '+254700123456',
  user_role: 'buyer',
  addresses: [
    {
      id: 'addr-001',
      label: 'Default Shipping',
      country: 'Kenya',
      county: 'Nairobi',
      city: 'Westlands',
      line1: '824 Premium Avenue, Suite 400',
      postal_address: 'P.O. Box 1001',
      user_email: 'angela@tradelink.dev',
      user_contact: '+254700123456',
      is_default: true,
    },
    {
      id: 'addr-002',
      label: 'Office',
      country: 'Kenya',
      county: 'Nairobi',
      city: 'Upper Hill',
      line1: 'Digital Atelier HQ',
      postal_address: 'Upper Hill 19',
      user_email: 'angela@tradelink.dev',
      user_contact: '+254711888222',
      is_default: false,
    },
  ],
  notification_preferences: {
    order_updates: true,
    marketing_emails: false,
    price_drop_alerts: true,
  },
  privacy_preferences: {
    analytics: true,
    marketing: false,
  },
};

const readProfile = () => {
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
    return { ...defaultProfile };
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
    return { ...defaultProfile };
  }
};

const saveProfile = (profile) => {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

const syncUserRecord = (profile) => {
  const raw = localStorage.getItem('user');
  if (!raw) return;

  try {
    const user = JSON.parse(raw);
    const updated = {
      ...user,
      user_id: profile.user_id,
      username: profile.username,
      user_fname: profile.user_fname,
      user_lname: profile.user_lname,
      user_email: profile.user_email,
      user_role: profile.user_role,
    };
    localStorage.setItem('user', JSON.stringify(updated));
  } catch {
    // no-op
  }
};

export const getProfile = async () => {
  await wait();
  return ProfileSchema.parse(readProfile());
};

export const updateProfile = async (payload) => {
  await wait();
  const parsed = UpdateProfileInputSchema.parse(payload);
  const current = readProfile();
  const next = {
    ...current,
    ...parsed,
    notification_preferences: {
      ...current.notification_preferences,
      ...parsed.notification_preferences,
    },
    privacy_preferences: {
      ...current.privacy_preferences,
      ...parsed.privacy_preferences,
    },
  };

  saveProfile(next);
  syncUserRecord(next);
  return ProfileSchema.parse(next);
};

export const addAddress = async (payload) => {
  await wait();
  const parsed = UpsertAddressInputSchema.parse(payload);
  const profile = readProfile();
  const address = {
    ...parsed,
    id: `addr-${Date.now()}`,
    is_default: profile.addresses.length === 0,
  };

  const next = {
    ...profile,
    addresses: [...profile.addresses, address],
  };
  saveProfile(next);
  return ProfileSchema.parse(next);
};

export const removeAddress = async (addressId) => {
  await wait();
  const profile = readProfile();
  const target = profile.addresses.find((item) => item.id === addressId);
  if (!target) {
    throw new Error('Address not found.');
  }

  const addresses = profile.addresses.filter((item) => item.id !== addressId);
  if (target.is_default && addresses.length > 0) {
    addresses[0].is_default = true;
  }

  const next = {
    ...profile,
    addresses,
  };
  saveProfile(next);
  return ProfileSchema.parse(next);
};

export const setDefaultAddress = async (addressId) => {
  await wait();
  const profile = readProfile();
  const found = profile.addresses.some((item) => item.id === addressId);
  if (!found) {
    throw new Error('Address not found.');
  }

  const next = {
    ...profile,
    addresses: profile.addresses.map((item) => ({
      ...item,
      is_default: item.id === addressId,
    })),
  };
  saveProfile(next);
  return ProfileSchema.parse(next);
};

export const updateNotifications = async (payload) => {
  await wait();
  const parsed = NotificationPreferencesSchema.parse(payload);
  const profile = readProfile();
  const next = {
    ...profile,
    notification_preferences: parsed,
  };
  saveProfile(next);
  return ProfileSchema.parse(next);
};

export const updatePrivacy = async (payload) => {
  await wait();
  const parsed = PrivacyPreferencesSchema.parse(payload);
  const profile = readProfile();
  const next = {
    ...profile,
    privacy_preferences: parsed,
  };
  saveProfile(next);
  return ProfileSchema.parse(next);
};

export const requestDataExport = async () => {
  await wait(500);
  return {
    message: 'Your export request has been received. We will email a secure archive shortly.',
  };
};
