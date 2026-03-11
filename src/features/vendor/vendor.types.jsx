import { z } from 'zod';
import { ProductSchema } from '../products/products.types';

// ── Vendor Profile ─────────────────────────────────────────────────────────
export const VendorProfileSchema = z.object({
  vendor_id: z.string().uuid(),
  business_name: z.string().min(1).optional(),
  business_description: z.string().optional(),
  is_verified: z.boolean().default(false),
  rating: z.number().min(0).max(5).optional(),
  total_sales: z.number().int().min(0).default(0),
  products_count: z.number().int().min(0).default(0),
});

// ── Vendor Dashboard Stats ─────────────────────────────────────────────────
export const VendorDashboardSchema = z.object({
  total_revenue: z.number().min(0),
  total_orders: z.number().int().min(0),
  pending_orders: z.number().int().min(0),
  active_products: z.number().int().min(0),
  recent_orders: z.array(z.object({
    id: z.string().uuid(),
    order_date: z.string().datetime(),
    order_amount: z.number().positive(),
    status: z.string(),
  })),
});

// ── Vendor Product Input ───────────────────────────────────────────────────
export const VendorProductInputSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().positive('Price must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category_id: z.string().uuid('Select a valid category'),
  stock_quantity: z.number().int().min(0),
  image_url: z.string().url('Enter a valid image URL'),
});

export const VendorProductSchema = ProductSchema.extend({
  vendor_id: z.string().uuid(),
  is_active: z.boolean().default(true),
});

/**
 * @typedef {z.infer<typeof VendorProfileSchema>} VendorProfile
 * @typedef {z.infer<typeof VendorDashboardSchema>} VendorDashboard
 * @typedef {z.infer<typeof VendorProductInputSchema>} VendorProductInput
 */
