import { z } from 'zod';

// ── Admin Dashboard Stats ──────────────────────────────────────────────────
export const AdminStatsSchema = z.object({
  total_users: z.number().int().min(0),
  total_vendors: z.number().int().min(0),
  total_buyers: z.number().int().min(0),
  total_products: z.number().int().min(0),
  total_orders: z.number().int().min(0),
  total_revenue: z.number().min(0),
  pending_orders: z.number().int().min(0),
  new_users_today: z.number().int().min(0),
});

// ── Admin User Summary ─────────────────────────────────────────────────────
export const AdminUserSummarySchema = z.object({
  user_id: z.string().uuid(),
  username: z.string(),
  user_email: z.string().email(),
  user_role: z.enum(['buyer', 'vendor', 'admin']),
  created_at: z.string().datetime({ offset: true }).optional(),
  is_active: z.boolean().default(true),
});

export const AdminUserListSchema = z.object({
  users: z.array(AdminUserSummarySchema),
  total: z.number().int(),
});

/**
 * @typedef {z.infer<typeof AdminStatsSchema>} AdminStats
 * @typedef {z.infer<typeof AdminUserSummarySchema>} AdminUserSummary
 */
