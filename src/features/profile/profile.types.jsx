import { z } from 'zod';
import { KENYA_COUNTIES } from '../../shared/constants/app';

// ── Delivery Address ───────────────────────────────────────────────────────
export const DeliveryAddressSchema = z.object({
  id: z.string().min(1).optional(),
  label: z.string().optional(),
  country: z.string().default('Kenya'),
  county: z.enum(KENYA_COUNTIES),
  city: z.string().min(1),
  line1: z.string().min(1).optional(),
  postal_address: z.string().min(1),
  user_email: z.string().email(),
  user_contact: z.string().min(10, 'Enter a valid phone number'),
  is_default: z.boolean().optional(),
});

export const NotificationPreferencesSchema = z.object({
  order_updates: z.boolean().default(true),
  marketing_emails: z.boolean().default(false),
  price_drop_alerts: z.boolean().default(true),
});

export const PrivacyPreferencesSchema = z.object({
  analytics: z.boolean().default(true),
  marketing: z.boolean().default(false),
});

export const ProfileSchema = z.object({
  user_id: z.string().min(1),
  username: z.string().min(3),
  user_fname: z.string().min(1),
  user_lname: z.string().min(1),
  user_email: z.string().email(),
  user_phone: z.string().optional(),
  user_role: z.enum(['buyer', 'vendor', 'admin']).default('buyer'),
  addresses: z.array(DeliveryAddressSchema).default([]),
  notification_preferences: NotificationPreferencesSchema.default({
    order_updates: true,
    marketing_emails: false,
    price_drop_alerts: true,
  }),
  privacy_preferences: PrivacyPreferencesSchema.default({
    analytics: true,
    marketing: false,
  }),
});

// ── Update Profile Input ───────────────────────────────────────────────────
export const UpdateProfileInputSchema = z.object({
  user_fname: z.string().min(1).optional(),
  user_lname: z.string().min(1).optional(),
  username: z.string().min(3).max(30).optional(),
  user_email: z.string().email().optional(),
  user_phone: z.string().min(10).optional(),
  user_gender: z.enum(['male', 'female', 'other']).optional(),
  user_dob: z.string().optional(),
  delivery_address: DeliveryAddressSchema.optional(),
  notification_preferences: NotificationPreferencesSchema.optional(),
  privacy_preferences: PrivacyPreferencesSchema.optional(),
});

export const UpsertAddressInputSchema = DeliveryAddressSchema.omit({
  id: true,
  is_default: true,
}).extend({
  label: z.string().min(1),
});

/**
 * @typedef {z.infer<typeof DeliveryAddressSchema>} DeliveryAddress
 * @typedef {z.infer<typeof UpdateProfileInputSchema>} UpdateProfileInput
 * @typedef {z.infer<typeof ProfileSchema>} Profile
 */
