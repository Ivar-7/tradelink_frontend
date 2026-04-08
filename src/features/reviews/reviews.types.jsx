import { z } from 'zod';

// ── Review ─────────────────────────────────────────────────────────────────
export const ReviewSchema = z.object({
  id: z.string().min(1),
  user_id: z.string().min(1),
  username: z.string().optional(),
  product_id: z.string().min(1),
  rating_value: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  verified_purchase: z.boolean().optional(),
  helpful_count: z.number().int().min(0).optional(),
  date: z.string().datetime(),
});

export const ReviewListResponseSchema = z.object({
  reviews: z.array(ReviewSchema),
  total: z.number().int(),
  average_rating: z.number().min(0).max(5),
});

// ── Create Review Input ────────────────────────────────────────────────────
export const CreateReviewInputSchema = z.object({
  rating_value: z.number().int().min(1, 'Rating is required').max(5),
  comment: z.string().max(500).optional(),
});

/**
 * @typedef {z.infer<typeof ReviewSchema>} Review
 * @typedef {z.infer<typeof CreateReviewInputSchema>} CreateReviewInput
 */
