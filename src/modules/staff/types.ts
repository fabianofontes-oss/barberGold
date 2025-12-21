import { z } from 'zod';

export const listStaffInputSchema = z.object({
  isActive: z.boolean().optional(),
});

export const updateStaffInputSchema = z.object({
  staffId: z.string().uuid(),
  name: z.string().min(1).optional(),
  phone: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().or(z.literal('')).nullable(),
  bio: z.string().optional().nullable(),
  commissionRate: z.number().min(0).max(100).optional(),
  workSchedule: z.any().optional(),
  isActive: z.boolean().optional(),
});

export type ListStaffInput = z.infer<typeof listStaffInputSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffInputSchema>;
