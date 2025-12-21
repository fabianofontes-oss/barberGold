import { z } from 'zod';

export const agendaAppointmentStatusDbSchema = z.enum([
  'SCHEDULED',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
  'BLOCKED',
]);

export type AgendaAppointmentStatusDb = z.infer<typeof agendaAppointmentStatusDbSchema>;

export const agendaAppointmentSourceDbSchema = z.enum([
  'MANUAL',
  'ONLINE',
  'WHATSAPP',
  'INSTAGRAM',
  'PHONE',
]);

export type AgendaAppointmentSourceDb = z.infer<typeof agendaAppointmentSourceDbSchema>;

export const agendaRecurrenceSchema = z.enum(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY']);
export type AgendaRecurrence = z.infer<typeof agendaRecurrenceSchema>;

export const getAgendaBootstrapInputSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
});

export type GetAgendaBootstrapInput = z.infer<typeof getAgendaBootstrapInputSchema>;

export const createAgendaServiceAppointmentInputSchema = z.object({
  clientId: z.string().uuid(),
  staffId: z.string().uuid(),
  serviceId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  notes: z.string().optional(),
  recurrence: agendaRecurrenceSchema.optional(),
  recurrenceEndDate: z.string().datetime().optional(),
});

export type CreateAgendaServiceAppointmentInput = z.infer<typeof createAgendaServiceAppointmentInputSchema>;

export const createAgendaBlockedTimeInputSchema = z.object({
  staffId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  durationMinutes: z.number().int().min(5).max(12 * 60),
  reason: z.string().min(1),
});

export type CreateAgendaBlockedTimeInput = z.infer<typeof createAgendaBlockedTimeInputSchema>;

export const updateAgendaAppointmentStatusInputSchema = z.object({
  appointmentId: z.string().uuid(),
  status: z.enum([
    'SCHEDULED',
    'CHECKED_IN',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'BLOCKED',
    'NO_SHOW_PENDING',
    'NO_SHOW',
  ]),
});

export type UpdateAgendaAppointmentStatusInput = z.infer<typeof updateAgendaAppointmentStatusInputSchema>;

export const createAgendaClientInputSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(3),
  email: z.string().email().optional().or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
});

export type CreateAgendaClientInput = z.infer<typeof createAgendaClientInputSchema>;

export type AgendaBootstrapData = {
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  me: {
    profileId: string;
    role: 'OWNER' | 'ADMIN' | 'BARBER' | 'ASSISTANT' | 'STAFF' | 'SUPER_ADMIN';
    displayName: string;
  };
};
