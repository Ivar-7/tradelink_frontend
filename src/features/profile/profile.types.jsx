import { z } from 'zod';
import { KENYA_COUNTIES } from '../../shared/constants/app';

// ── Delivery Address ───────────────────────────────────────────────────────
export const DeliveryAddressSchema = z.object({
  country: z.string().default('Kenya'),
  county: z.enum(KENYA_COUNTIES),
  city: z.string().min(1),
  postal_address: z.string().min(1),
  user_email: z.string().email(),
  user_contact: z.string().min(10, 'Enter a valid phone number'),
});

// ── Update Profile Input ───────────────────────────────────────────────────
export const UpdateProfileInputSchema = z.object({
  user_fname: z.string().min(1).optional(),
  user_lname: z.string().min(1).optional(),
  username: z.string().min(3).max(30).optional(),
  user_gender: z.enum(['male', 'female', 'other']).optional(),
  user_dob: z.string().optional(),
  delivery_address: DeliveryAddressSchema.optional(),
});

/**
 * @typedef {z.infer<typeof DeliveryAddressSchema>} DeliveryAddress
 * @typedef {z.infer<typeof UpdateProfileInputSchema>} UpdateProfileInput
 */
