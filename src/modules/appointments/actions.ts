'use server';

/**
 * Server Actions para Appointments
 * 
 * Funções que rodam no servidor e podem ser chamadas do cliente
 */

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentFilters,
  PaginatedAppointments,
  CreateAppointmentSchema,
  UpdateAppointmentSchema,
  AppointmentFiltersSchema,
} from './types';
import * as repository from './repository';

/**
 * ============================================
 * ACTION RESULT TYPES
 * ============================================
 */

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * ============================================
 * CRUD ACTIONS
 * ============================================
 */

/**
 * Lista appointments com filtros e paginação
 */
export async function listAppointmentsAction(
  filters?: AppointmentFilters
): Promise<ActionResult<PaginatedAppointments>> {
  try {
    // Validar filtros
    const validatedFilters = filters 
      ? AppointmentFiltersSchema.parse(filters)
      : {};

    const supabase = await createClient();
    const result = await repository.listAppointments(supabase, validatedFilters);

    return { success: true, data: result };
  } catch (error) {
    console.error('Erro em listAppointmentsAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao listar agendamentos',
    };
  }
}

/**
 * Busca appointment por ID
 */
export async function getAppointmentAction(
  appointmentId: string
): Promise<ActionResult<Appointment | null>> {
  try {
    const supabase = await createClient();
    const appointment = await repository.getAppointmentById(supabase, appointmentId);

    return { success: true, data: appointment };
  } catch (error) {
    console.error('Erro em getAppointmentAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar agendamento',
    };
  }
}

/**
 * Cria novo appointment
 */
export async function createAppointmentAction(
  input: CreateAppointmentInput
): Promise<ActionResult<Appointment>> {
  try {
    // Validar input
    const validatedInput = CreateAppointmentSchema.parse(input);

    const supabase = await createClient();
    const appointment = await repository.createAppointment(supabase, validatedInput);

    // Revalidar cache
    revalidatePath('/app/agenda');
    revalidatePath('/app/dashboard');

    return { success: true, data: appointment };
  } catch (error) {
    console.error('Erro em createAppointmentAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar agendamento',
    };
  }
}

/**
 * Atualiza appointment existente
 */
export async function updateAppointmentAction(
  appointmentId: string,
  input: UpdateAppointmentInput
): Promise<ActionResult<Appointment>> {
  try {
    // Validar input
    const validatedInput = UpdateAppointmentSchema.parse(input);

    const supabase = await createClient();
    const appointment = await repository.updateAppointment(supabase, appointmentId, validatedInput);

    // Revalidar cache
    revalidatePath('/app/agenda');
    revalidatePath('/app/dashboard');

    return { success: true, data: appointment };
  } catch (error) {
    console.error('Erro em updateAppointmentAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar agendamento',
    };
  }
}

/**
 * Deleta appointment
 */
export async function deleteAppointmentAction(
  appointmentId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    await repository.deleteAppointment(supabase, appointmentId);

    // Revalidar cache
    revalidatePath('/app/agenda');
    revalidatePath('/app/dashboard');

    return { success: true, data: undefined };
  } catch (error) {
    console.error('Erro em deleteAppointmentAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao deletar agendamento',
    };
  }
}

/**
 * ============================================
 * STATUS ACTIONS
 * ============================================
 */

/**
 * Marca appointment como concluído
 */
export async function completeAppointmentAction(
  appointmentId: string
): Promise<ActionResult<Appointment>> {
  try {
    const supabase = await createClient();
    const appointment = await repository.completeAppointment(supabase, appointmentId);

    // Revalidar cache
    revalidatePath('/app/agenda');
    revalidatePath('/app/dashboard');

    return { success: true, data: appointment };
  } catch (error) {
    console.error('Erro em completeAppointmentAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao completar agendamento',
    };
  }
}

/**
 * Cancela appointment
 */
export async function cancelAppointmentAction(
  appointmentId: string
): Promise<ActionResult<Appointment>> {
  try {
    const supabase = await createClient();
    const appointment = await repository.cancelAppointment(supabase, appointmentId);

    // Revalidar cache
    revalidatePath('/app/agenda');
    revalidatePath('/app/dashboard');

    return { success: true, data: appointment };
  } catch (error) {
    console.error('Erro em cancelAppointmentAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao cancelar agendamento',
    };
  }
}

/**
 * Marca como no-show
 */
export async function markNoShowAction(
  appointmentId: string
): Promise<ActionResult<Appointment>> {
  try {
    const supabase = await createClient();
    const appointment = await repository.markNoShow(supabase, appointmentId);

    // Revalidar cache
    revalidatePath('/app/agenda');
    revalidatePath('/app/dashboard');

    return { success: true, data: appointment };
  } catch (error) {
    console.error('Erro em markNoShowAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao marcar no-show',
    };
  }
}

/**
 * ============================================
 * STATS ACTIONS
 * ============================================
 */

/**
 * Conta appointments por status
 */
export async function countAppointmentsByStatusAction(
  date_from?: string,
  date_to?: string
): Promise<ActionResult<Record<string, number>>> {
  try {
    const supabase = await createClient();
    const counts = await repository.countAppointmentsByStatus(supabase, date_from, date_to);

    return { success: true, data: counts };
  } catch (error) {
    console.error('Erro em countAppointmentsByStatusAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao contar agendamentos',
    };
  }
}

/**
 * Busca appointments do dia
 */
export async function getTodayAppointmentsAction(
  staff_id?: string
): Promise<ActionResult<Appointment[]>> {
  try {
    const supabase = await createClient();
    const appointments = await repository.getTodayAppointments(supabase, staff_id);

    return { success: true, data: appointments };
  } catch (error) {
    console.error('Erro em getTodayAppointmentsAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar agendamentos do dia',
    };
  }
}

/**
 * Busca appointments de um cliente
 */
export async function getClientAppointmentsAction(
  client_id: string,
  limit: number = 10
): Promise<ActionResult<Appointment[]>> {
  try {
    const supabase = await createClient();
    const appointments = await repository.getClientAppointments(supabase, client_id, limit);

    return { success: true, data: appointments };
  } catch (error) {
    console.error('Erro em getClientAppointmentsAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar histórico do cliente',
    };
  }
}

/**
 * Verifica disponibilidade de um staff
 */
export async function checkAvailabilityAction(
  staff_id: string,
  scheduled_at: string
): Promise<ActionResult<boolean>> {
  try {
    const supabase = await createClient();
    const isAvailable = await repository.checkAvailability(supabase, staff_id, scheduled_at);

    return { success: true, data: isAvailable };
  } catch (error) {
    console.error('Erro em checkAvailabilityAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao verificar disponibilidade',
    };
  }
}


