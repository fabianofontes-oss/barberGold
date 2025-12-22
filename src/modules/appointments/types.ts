/**
 * Types & Zod Schemas para Módulo de Agendamentos
 * 
 * Conecta com tabela `appointments` no Supabase
 */

import { z } from 'zod';

/**
 * ============================================
 * ENUMS
 * ============================================
 */

/**
 * Status do Agendamento
 */
export const AppointmentStatus = z.enum([
  'SCHEDULED',  // Agendado
  'COMPLETED',  // Concluído
  'CANCELLED',  // Cancelado
  'NO_SHOW',    // Não compareceu
]);
export type AppointmentStatus = z.infer<typeof AppointmentStatus>;

/**
 * ============================================
 * SCHEMAS ZOD
 * ============================================
 */

/**
 * Schema Base do Appointment (do banco)
 */
export const AppointmentSchema = z.object({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  tenant_id: z.string().uuid(),
  client_id: z.string().uuid(),
  staff_id: z.string().uuid(),
  service_id: z.string().uuid(),
  scheduled_at: z.string().datetime(),
  price: z.number().nonnegative(),
  status: AppointmentStatus.default('SCHEDULED'),
  notes: z.string().nullable().optional(),
});

/**
 * Schema para CRIAR appointment (sem campos auto-gerados)
 */
export const CreateAppointmentSchema = AppointmentSchema.omit({
  id: true,
  created_at: true,
  tenant_id: true, // Será preenchido automaticamente via RLS
});

/**
 * Schema para ATUALIZAR appointment (campos opcionais)
 */
export const UpdateAppointmentSchema = z.object({
  scheduled_at: z.string().datetime().optional(),
  price: z.number().nonnegative().optional(),
  status: AppointmentStatus.optional(),
  notes: z.string().nullable().optional(),
});

/**
 * Schema para BUSCAR appointments (filtros)
 */
export const AppointmentFiltersSchema = z.object({
  client_id: z.string().uuid().optional(),
  staff_id: z.string().uuid().optional(),
  service_id: z.string().uuid().optional(),
  status: AppointmentStatus.optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  sort_by: z.enum(['scheduled_at', 'created_at', 'price']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  limit: z.number().int().positive().max(200).optional(),
  offset: z.number().int().nonnegative().optional(),
});

/**
 * ============================================
 * TYPES
 * ============================================
 */

/**
 * Appointment completo (do banco)
 */
export type Appointment = z.infer<typeof AppointmentSchema>;

/**
 * Dados para criar appointment
 */
export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>;

/**
 * Dados para atualizar appointment
 */
export type UpdateAppointmentInput = z.infer<typeof UpdateAppointmentSchema>;

/**
 * Filtros para listar appointments
 */
export type AppointmentFilters = z.infer<typeof AppointmentFiltersSchema>;

/**
 * Appointment com dados relacionados (frontend)
 */
export interface AppointmentWithRelations extends Appointment {
  client_name?: string;
  staff_name?: string;
  service_name?: string;
}

/**
 * Resultado paginado
 */
export interface PaginatedAppointments {
  data: Appointment[];
  total: number;
  page: number;
  per_page: number;
  has_next: boolean;
}

/**
 * Slot disponível para agendamento
 */
export interface AvailableSlot {
  time: string; // ISO datetime
  staff_id: string;
  staff_name: string;
  is_available: boolean;
}

/**
 * ============================================
 * HELPER FUNCTIONS (Type Guards)
 * ============================================
 */

/**
 * Valida se é um appointment válido
 */
export function isValidAppointment(data: unknown): data is Appointment {
  return AppointmentSchema.safeParse(data).success;
}

/**
 * Valida input de criação
 */
export function isValidCreateInput(data: unknown): data is CreateAppointmentInput {
  return CreateAppointmentSchema.safeParse(data).success;
}

/**
 * Valida input de atualização
 */
export function isValidUpdateInput(data: unknown): data is UpdateAppointmentInput {
  return UpdateAppointmentSchema.safeParse(data).success;
}


