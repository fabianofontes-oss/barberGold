import { z } from 'zod';
import { Database } from '@/types/supabase';

// Types do Banco
export type ClientDB = Database['public']['Tables']['clients']['Row'];
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type ClientUpdate = Database['public']['Tables']['clients']['Update'];

// Schema de ValidaÃ§Ã£o
export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Nome muito curto'),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato invÃ¡lido'),
  email: z.string().email().optional().or(z.literal('')),
  birthDate: z.string().optional(),
  document: z.string().optional(),
  preferredStaffId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const clientFilterSchema = z.object({
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(['name', 'lastVisit', 'totalSpent']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Types de UI
export interface ClientWithStats extends ClientDB {
  totalSpent?: number;
  visitCount?: number;
  lastVisit?: string;
  loyaltyPoints?: number;
  preferredStaffName?: string;
}

export type ClientFormData = z.infer<typeof clientSchema>;
export type ClientFilter = z.infer<typeof clientFilterSchema>;
