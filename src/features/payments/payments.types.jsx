import { z } from 'zod';
import { PAYMENT_PROVIDERS, PAYMENT_STATUS } from '../../shared/constants/app';

const FlexibleIsoDateTimeSchema = z.string().refine(
  (value) => !Number.isNaN(Date.parse(value)),
  'Invalid ISO datetime'
);

// ── Enums ──────────────────────────────────────────────────────────────────
export const PaymentProviderSchema = z.enum([
  PAYMENT_PROVIDERS.MPESA,
  PAYMENT_PROVIDERS.CARD,
  PAYMENT_PROVIDERS.BANK_TRANSFER,
]);

export const PaymentStatusSchema = z.enum([
  PAYMENT_STATUS.PENDING,
  PAYMENT_STATUS.COMPLETED,
  PAYMENT_STATUS.FAILED,
  PAYMENT_STATUS.REFUNDED,
]);

export const TransactionTypeSchema = z.enum(['purchase', 'refund']);

export const PaymentMethodSchema = z.object({
  id: z.string().min(1),
  brand: z.string().min(1),
  last4: z.string().length(4),
  expiry_month: z.string().min(1),
  expiry_year: z.string().min(1),
  holder_name: z.string().min(1),
  is_default: z.boolean(),
});

export const PaymentMethodListSchema = z.object({
  methods: z.array(PaymentMethodSchema),
});

// ── Payment ────────────────────────────────────────────────────────────────
export const PaymentSchema = z.object({
  id: z.string().min(1),
  user_id: z.string().min(1),
  order_id: z.string().min(1),
  amount: z.coerce.number().positive(),
  payment_provider: PaymentProviderSchema,
  status: PaymentStatusSchema,
  transaction_type: TransactionTypeSchema.optional().default('purchase'),
  created_at: FlexibleIsoDateTimeSchema.optional(),
  phone_number: z.string().optional(),
  payment_method_id: z.string().optional(),
});

// ── Create Payment Input ───────────────────────────────────────────────────
export const CreatePaymentInputSchema = z.object({
  order_id: z.string().min(1),
  payment_provider: PaymentProviderSchema,
  phone_number: z.string().optional(),
  payment_method_id: z.string().optional(),
  amount: z.coerce.number().positive(),
}).refine(
  (data) => data.payment_provider !== 'mpesa' || !!data.phone_number,
  { message: 'Phone number is required for M-Pesa', path: ['phone_number'] }
);

/**
 * @typedef {z.infer<typeof PaymentSchema>} Payment
 * @typedef {z.infer<typeof CreatePaymentInputSchema>} CreatePaymentInput
 */
