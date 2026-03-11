import { z } from 'zod';
import { PAYMENT_PROVIDERS, PAYMENT_STATUS } from '../../shared/constants/app';

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

// ── Payment ────────────────────────────────────────────────────────────────
export const PaymentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  order_id: z.string().uuid(),
  amount: z.number().positive(),
  payment_provider: PaymentProviderSchema,
  status: PaymentStatusSchema,
  transaction_type: TransactionTypeSchema,
  created_at: z.string().datetime().optional(),
  phone_number: z.string().optional(),
});

// ── Create Payment Input ───────────────────────────────────────────────────
export const CreatePaymentInputSchema = z.object({
  order_id: z.string().uuid(),
  payment_provider: PaymentProviderSchema,
  phone_number: z.string().optional(),
}).refine(
  (data) => data.payment_provider !== 'mpesa' || !!data.phone_number,
  { message: 'Phone number is required for M-Pesa', path: ['phone_number'] }
);

/**
 * @typedef {z.infer<typeof PaymentSchema>} Payment
 * @typedef {z.infer<typeof CreatePaymentInputSchema>} CreatePaymentInput
 */
