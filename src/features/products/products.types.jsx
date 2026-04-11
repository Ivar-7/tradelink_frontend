import { z } from 'zod';

// ── Category ───────────────────────────────────────────────────────────────
export const CategorySchema = z.object({
  id: z.coerce.string().min(1),
  name: z.string().min(1),
  description: z.string().nullish(),
  image_url: z.string().min(1).nullish(),
});

export const CategoryTreeNodeSchema = z.lazy(() =>
  CategorySchema.extend({
    children: z.array(CategoryTreeNodeSchema).optional(),
  })
);

// ── Product ────────────────────────────────────────────────────────────────
export const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string(),
  category_id: z.string().min(1).nullish(),
  category: CategorySchema.nullish(),
  stock_quantity: z.number().int().min(0),
  image_url: z.string().min(1),
  vendor_id: z.string().min(1).nullish(),
  vendor_name: z.string().nullish(),
  average_rating: z.number().min(0).max(5).nullish(),
  review_count: z.number().int().min(0).nullish(),
  created_at: z.string().datetime().nullish(),
});

export const ProductListResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number().int(),
  page: z.coerce.number().int(),
  limit: z.coerce.number().int(),
});

// ── Search / Filter ────────────────────────────────────────────────────────
export const ProductFilterSchema = z.object({
  search: z.string().optional(),
  category_id: z.string().min(1).optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  in_stock: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

/**
 * @typedef {z.infer<typeof ProductSchema>} Product
 * @typedef {z.infer<typeof CategorySchema>} Category
 * @typedef {z.infer<typeof CategoryTreeNodeSchema>} CategoryTreeNode
 * @typedef {z.infer<typeof ProductFilterSchema>} ProductFilter
 */
