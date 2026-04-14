import { z } from 'zod';
import { ORDER_STATUS, SHIPPING_METHODS } from '../../shared/constants/app';

// ── Enums ──────────────────────────────────────────────────────────────────
export const OrderStatusSchema = z.enum([
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
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
  product_name: z.string(),
  product_image: z.string().min(1),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
  subtotal: z.number().positive(),
});

// ── Order ──────────────────────────────────────────────────────────────────
export const OrderSchema = z.object({
  id: z.string().min(1),
  user_id: z.string().min(1),
  order_date: z.string().datetime({ offset: true }),
  order_amount: z.number().positive(),
  products: z.array(OrderItemSchema),
  status: OrderStatusSchema,
  shipping_method: ShippingMethodSchema,
  tracking_number: z.string().nullable().optional(),
  delivered_at: z.string().datetime({ offset: true }).optional(),
  cancelled_at: z.string().datetime({ offset: true }).optional(),
  cancellation_reason: z.string().optional(),
  issue_report: z
    .object({
      type: z.string(),
      details: z.string(),
      reported_at: z.string().datetime({ offset: true }),
    })
    .optional(),
  return_request: z
    .object({
      id: z.string().min(1),
      created_at: z.string().datetime({ offset: true }),
      status: z.enum(['requested', 'approved', 'shipped_back', 'refunded']),
      reason: z.string(),
      notes: z.string(),
      timeline: z.object({
        requested_at: z.string().datetime({ offset: true }).nullable(),
        approved_at: z.string().datetime({ offset: true }).nullable(),
        shipped_back_at: z.string().datetime({ offset: true }).nullable(),
        refunded_at: z.string().datetime({ offset: true }).nullable(),
      }),
    })
    .optional(),
  delivery_address: z.object({
    county: z.string(),
    city: z.string(),
    postal_address: z.string(),
    user_contact: z.string(),
  }).optional(),
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
