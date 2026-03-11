import { z } from 'zod';

// ── Cart Item ──────────────────────────────────────────────────────────────
export const CartItemSchema = z.object({
  product_id: z.string().uuid(),
  product_name: z.string(),
  product_image: z.string().url(),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
  subtotal: z.number().positive(),
});

// ── Cart ───────────────────────────────────────────────────────────────────
export const CartSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  date_created: z.string().datetime(),
  total_price: z.number().min(0),
  products: z.array(CartItemSchema),
});

// ── Add to Cart Input ──────────────────────────────────────────────────────
export const AddToCartInputSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
});

/**
 * @typedef {z.infer<typeof CartSchema>} Cart
 * @typedef {z.infer<typeof CartItemSchema>} CartItem
 * @typedef {z.infer<typeof AddToCartInputSchema>} AddToCartInput
 */
