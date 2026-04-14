import { z } from 'zod';
import { ORDER_STATUS, SHIPPING_METHODS } from '../../shared/constants/app';

const FlexibleIsoDateTimeSchema = z.string().refine(
  (value) => !Number.isNaN(Date.parse(value)),
  'Invalid ISO datetime'
);

// ── Enums ──────────────────────────────────────────────────────────────────
export const OrderStatusSchema = z.enum([
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
  'processing',
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.CANCELLED,
]);

export const ShippingMethodSchema = z.enum([
  SHIPPING_METHODS.PICKUP,
  SHIPPING_METHODS.DELIVERY,
]);

// ── Order Item ─────────────────────────────────────────────────────────────
export const OrderItemSchema = z.object({
  product_id: z.string().min(1),
  product_name: z.string().optional(),
  product_image: z.string().optional(),
  quantity: z.coerce.number().int().positive(),
  unit_price: z.coerce.number().positive(),
  subtotal: z.coerce.number().positive(),
});

// ── Order ──────────────────────────────────────────────────────────────────
export const OrderSchema = z.object({
  id: z.string().min(1),
  user_id: z.string().min(1),
  order_date: FlexibleIsoDateTimeSchema,
  order_amount: z.coerce.number().nonnegative(),
  products: z.array(OrderItemSchema),
  status: OrderStatusSchema,
  shipping_method: ShippingMethodSchema,
  tracking_number: z.string().nullable().optional(),
  delivered_at: FlexibleIsoDateTimeSchema.nullable().optional(),
  cancelled_at: FlexibleIsoDateTimeSchema.nullable().optional(),
  cancellation_reason: z.string().optional(),
  issue_report: z
    .object({
      type: z.string(),
      details: z.string(),
      reported_at: FlexibleIsoDateTimeSchema,
    })
    .nullable()
    .optional(),
  return_request: z
    .object({
      id: z.string().min(1),
      created_at: FlexibleIsoDateTimeSchema,
      status: z.enum(['requested', 'approved', 'shipped_back', 'refunded']),
      reason: z.string(),
      notes: z.string(),
      timeline: z.object({
        requested_at: FlexibleIsoDateTimeSchema.nullable(),
        approved_at: FlexibleIsoDateTimeSchema.nullable(),
        shipped_back_at: FlexibleIsoDateTimeSchema.nullable(),
        refunded_at: FlexibleIsoDateTimeSchema.nullable(),
      }),
    })
    .nullable()
    .optional(),
  delivery_address: z.object({
    county: z.string(),
    city: z.string(),
    postal_address: z.string(),
    user_contact: z.string(),
  }).nullable().optional(),
});

export const OrderListResponseSchema = z.object({
  orders: z.array(OrderSchema),
  total: z.number().int(),
});

// ── Create Order Input ─────────────────────────────────────────────────────
export const CreateOrderInputSchema = z.object({
  shipping_method: ShippingMethodSchema,
  delivery_address: z.object({
    county: z.string().min(1),
    city: z.string().min(1),
    postal_address: z.string().min(1),
    user_contact: z.string().min(10),
  }).optional(),
});

/**
 * @typedef {z.infer<typeof OrderSchema>} Order
 * @typedef {z.infer<typeof OrderItemSchema>} OrderItem
 * @typedef {z.infer<typeof CreateOrderInputSchema>} CreateOrderInput
 */
