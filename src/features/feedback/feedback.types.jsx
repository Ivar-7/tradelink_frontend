import { z } from 'zod';

// ── Feedback Type ──────────────────────────────────────────────────────────
export const FeedbackTypeSchema = z.enum([
  'bug_report',
  'feature_request',
  'general',
  'complaint',
]);

// ── User Feedback ──────────────────────────────────────────────────────────
export const UserFeedbackSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: FeedbackTypeSchema,
  message: z.string().min(10).max(1000),
  created_at: z.string().datetime().optional(),
});

// ── Create Feedback Input ──────────────────────────────────────────────────
export const CreateFeedbackInputSchema = z.object({
  type: FeedbackTypeSchema,
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

/**
 * @typedef {z.infer<typeof UserFeedbackSchema>} UserFeedback
 * @typedef {z.infer<typeof CreateFeedbackInputSchema>} CreateFeedbackInput
 */
