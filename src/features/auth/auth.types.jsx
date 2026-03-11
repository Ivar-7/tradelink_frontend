import { z } from 'zod';

// ── Enums ──────────────────────────────────────────────────────────────────
export const UserRoleSchema = z.enum(['buyer', 'vendor', 'admin']);

export const UserGenderSchema = z.enum(['male', 'female', 'other']);

// ── Core User ──────────────────────────────────────────────────────────────
export const UserSchema = z.object({
  user_id: z.string().uuid(),
  username: z.string().min(3).max(30),
  user_fname: z.string().min(1),
  user_lname: z.string().min(1),
  user_email: z.string().email(),
  user_gender: UserGenderSchema.optional(),
  user_dob: z.string().datetime().optional(),
  user_role: UserRoleSchema,
  user_cart: z.string().uuid().optional(),
});

/** User shape safe for the UI (no password). */
export const UserPublicSchema = UserSchema;

// ── Auth Inputs ────────────────────────────────────────────────────────────
export const LoginInputSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const SignupInputSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  user_fname: z.string().min(1, 'First name is required'),
  user_lname: z.string().min(1, 'Last name is required'),
  user_email: z.string().email('Enter a valid email address'),
  user_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
  user_gender: UserGenderSchema.optional(),
  user_dob: z.string().optional(),
  user_role: UserRoleSchema.default('buyer'),
}).refine((data) => data.user_password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

// ── Auth Response ──────────────────────────────────────────────────────────
export const AuthResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: UserPublicSchema,
});

/**
 * @typedef {z.infer<typeof UserSchema>} User
 * @typedef {z.infer<typeof LoginInputSchema>} LoginInput
 * @typedef {z.infer<typeof SignupInputSchema>} SignupInput
 * @typedef {z.infer<typeof AuthResponseSchema>} AuthResponse
 */
