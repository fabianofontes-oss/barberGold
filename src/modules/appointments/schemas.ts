import { z } from 'zod';

// ===================================
// APPOINTMENTS SCHEMAS
// ===================================

export const createAppointmentSchema = z.object({
  clientId: z.string().uuid().optional(),
  clientName: z.string().min(2, 'Nome do cliente deve ter pelo menos 2 caracteres'),
  staffId: z.string().uuid('ID do staff inválido'),
  serviceId: z.string().uuid('ID do serviço inválido'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Hora deve estar no formato HH:MM'),
  price: z.number().positive('Preço deve ser positivo'),
  notes: z.string().optional()
});

export const updateAppointmentStatusSchema = z.object({
  appointmentId: z.string().uuid('ID do agendamento inválido'),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
