import { z } from 'zod';

export const createServiceInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  durationMinutes: z.number().int().positive().default(30),
  categoryId: z.string().uuid().optional().nullable(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  allowOnlineBooking: z.boolean().optional().default(true),
  isActive: z.boolean().optional().default(true),
});

export const updateServiceInputSchema = z.object({
  serviceId: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  durationMinutes: z.number().int().positive().optional(),
  categoryId: z.string().uuid().optional().nullable(),
  imageUrl: z.string().url().optional().or(z.literal('')).nullable(),
  allowOnlineBooking: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const listServicesInputSchema = z.object({
  isActive: z.boolean().optional(),
  categoryId: z.string().uuid().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceInputSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceInputSchema>;
export type ListServicesInput = z.infer<typeof listServicesInputSchema>;
