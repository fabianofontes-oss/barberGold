import { z } from 'zod';
import { Database } from '@/lib/database.types';

// Types do Banco
export type AppointmentRow = Database['public']['Tables']['appointments']['Row'];
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
export type AppointmentUpdate = Database['public']['Tables']['appointments']['Update'];

// Zod Schema para validação
export const appointmentSchema = z.object({
  client_id: z.string().uuid(),
  staff_id: z.string().uuid(),
  service_id: z.string().uuid(),
  scheduled_at: z.string().datetime(),
  price: z.number().positive(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).default('SCHEDULED').optional(),
  notes: z.string().optional(),
});

// Type para UI (com dados relacionados)
export interface AppointmentWithDetails extends AppointmentRow {
  client_name?: string;
  staff_name?: string;
  service_name?: string;
}
