import { z } from 'zod';

export const updateTenantInputSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')).nullable(),
  settings: z.any().optional(),
});

export type UpdateTenantInput = z.infer<typeof updateTenantInputSchema>;
