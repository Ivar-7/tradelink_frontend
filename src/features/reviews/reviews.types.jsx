import { z } from 'zod';

// ── Review ─────────────────────────────────────────────────────────────────
export const ReviewSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  username: z.string().optional(),
  product_id: z.string().uuid(),
  rating_value: z.number().int().min(1).max(5),
  comment: z.string().optional(),
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
