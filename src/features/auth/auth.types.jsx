import { z } from 'zod';

export const UserRoleSchema = z.enum(['buyer', 'vendor', 'admin']);

export const UserGenderSchema = z.enum(['M', 'F', 'O', 'male', 'female', 'other']);

const normalizeGender = (value) => {
  if (value == null || value === '') {
    return undefined;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === 'm' || normalized === 'male') return 'M';
  if (normalized === 'f' || normalized === 'female') return 'F';
  if (normalized === 'o' || normalized === 'other') return 'O';

  return value;
};

export const UserSchema = z.object({
  id: z.coerce.string().min(1),
  email: z.string().email(),
  username: z.coerce.string().min(1),
  first_name: z.string().nullish().default(''),
  last_name: z.string().nullish().default(''),
  full_name: z.string().nullish(),
  phone_number: z.string().nullish(),
  gender: z.preprocess(normalizeGender, UserGenderSchema.nullish()).catch(undefined),
  date_of_birth: z.string().nullish(),
  role: UserRoleSchema.catch('buyer'),
  date_joined: z.string().datetime({ offset: true }).nullish(),
});

export const LoginInputSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const SignupInputSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(30),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirm: z.string(),
    phone_number: z.string().min(7, 'Phone number is required'),
    gender: UserGenderSchema.optional(),
    role: UserRoleSchema.default('buyer'),
    date_of_birth: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Passwords do not match',
    path: ['password_confirm'],
  });

export const AuthResponseSchema = z.object({
  user: UserSchema,
  tokens: z.object({
    access: z.string(),
    refresh: z.string(),
  }),
});

export const ChangePasswordInputSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  new_password_confirm: z.string(),
}).refine((data) => data.new_password === data.new_password_confirm, {
  message: 'Passwords do not match',
  path: ['new_password_confirm'],
});

/**
 * @typedef {z.infer<typeof UserSchema>} User
 * @typedef {z.infer<typeof LoginInputSchema>} LoginInput
 * @typedef {z.infer<typeof SignupInputSchema>} SignupInput
 * @typedef {z.infer<typeof AuthResponseSchema>} AuthResponse
 */
