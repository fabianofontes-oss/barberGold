import { z } from 'zod';

export const createClientInputSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
  referrerCode: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const updateClientInputSchema = z.object({
  clientId: z.string().uuid(),
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  preferredStaffId: z.string().uuid().optional().nullable(),
});

export const listClientsInputSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateClientInput = z.infer<typeof createClientInputSchema>;
export type UpdateClientInput = z.infer<typeof updateClientInputSchema>;
export type ListClientsInput = z.infer<typeof listClientsInputSchema>;
