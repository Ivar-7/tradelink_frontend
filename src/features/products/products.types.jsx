import { z } from 'zod';

// ── Category ───────────────────────────────────────────────────────────────
export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
});

// ── Product ────────────────────────────────────────────────────────────────
export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string(),
  category_id: z.string().uuid(),
  category: CategorySchema.optional(),
  stock_quantity: z.number().int().min(0),
  image_url: z.string().url(),
  vendor_id: z.string().uuid().optional(),
  vendor_name: z.string().optional(),
  average_rating: z.number().min(0).max(5).optional(),
  review_count: z.number().int().min(0).optional(),
  created_at: z.string().datetime().optional(),
});

export const ProductListResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
});

// ── Search / Filter ────────────────────────────────────────────────────────
export const ProductFilterSchema = z.object({
  search: z.string().optional(),
  category_id: z.string().uuid().optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  in_stock: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

/**
 * @typedef {z.infer<typeof ProductSchema>} Product
 * @typedef {z.infer<typeof CategorySchema>} Category
 * @typedef {z.infer<typeof ProductFilterSchema>} ProductFilter
 */
