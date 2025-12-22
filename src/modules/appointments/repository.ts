/**
 * Repository para Appointments (Supabase)
 * 
 * Implementa CRUD usando Supabase Client
 */

import { SupabaseClient } from '@supabase/supabase-js';
import {
  Appointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentFilters,
  PaginatedAppointments,
  AppointmentSchema,
  AvailableSlot,
} from './types';

// Tipo genérico para evitar problemas de inferência
type SupabaseAny = SupabaseClient<any, any, any>;

/**
 * ============================================
 * CRUD OPERATIONS
 * ============================================
 */

/**
 * Lista appointments com filtros e paginação
 */
export async function listAppointments(
  supabase: SupabaseAny,
  tenantId: string, // Tenant ID obrigatório para isolamento
  filters: AppointmentFilters = {}
): Promise<PaginatedAppointments> {
  const {
    client_id,
    staff_id,
    service_id,
    status,
    date_from,
    date_to,
    sort_by = 'scheduled_at',
    sort_order = 'asc',
    limit = 100,
    offset = 0,
  } = filters;

  // Base query com filtro de tenant
  let query = supabase
    .from('appointments')
    .select('*', { count: 'exact' })
    .eq('tenant_id', tenantId); // Filtro explícito por tenant

  // Filtros
  if (client_id) query = query.eq('client_id', client_id);
  if (staff_id) query = query.eq('staff_id', staff_id);
  if (service_id) query = query.eq('service_id', service_id);
  if (status) query = query.eq('status', status);
  if (date_from) query = query.gte('scheduled_at', date_from);
  if (date_to) query = query.lte('scheduled_at', date_to);

  // Ordenação
  query = query.order(sort_by, { ascending: sort_order === 'asc' });

  // Paginação
  query = query.range(offset, offset + limit - 1);

  // Executar query
  const { data, error, count } = await query;

  if (error) {
    console.error('Erro ao listar appointments:', error);
    throw new Error(`Falha ao listar agendamentos: ${error.message}`);
  }

  // Validar e parsear dados
  const appointments = (data || [])
    .map(appt => {
      const parsed = AppointmentSchema.safeParse(appt);
      if (!parsed.success) {
        console.warn('Appointment inválido:', (appt as any)?.id, parsed.error);
        return null;
      }
      return parsed.data;
    })
    .filter((a): a is Appointment => a !== null);

  return {
    data: appointments,
    total: count || 0,
    page: Math.floor(offset / limit) + 1,
    per_page: limit,
    has_next: (count || 0) > offset + limit,
  };
}

/**
 * Busca appointment por ID
 */
export async function getAppointmentById(
  supabase: SupabaseAny,
  tenantId: string, // Tenant ID obrigatório para isolamento
  appointmentId: string
): Promise<Appointment | null> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', appointmentId)
    .eq('tenant_id', tenantId) // Filtro explícito por tenant
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Erro ao buscar appointment:', error);
    throw new Error(`Falha ao buscar agendamento: ${error.message}`);
  }

  // Validar dados
  const parsed = AppointmentSchema.safeParse(data);
  if (!parsed.success) {
    console.error('Dados de appointment inválidos:', parsed.error);
    throw new Error('Dados de agendamento inválidos');
  }

  return parsed.data;
}

/**
 * Cria novo appointment
 */
export async function createAppointment(
  supabase: SupabaseAny,
  tenantId: string, // Tenant ID obrigatório para isolamento
  input: CreateAppointmentInput
): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      tenant_id: tenantId, // Adicionar tenant_id explicitamente
      client_id: input.client_id,
      staff_id: input.staff_id,
      service_id: input.service_id,
      scheduled_at: input.scheduled_at,
      price: input.price,
      status: input.status || 'SCHEDULED',
      notes: input.notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar appointment:', error);
    
    // Tratamento de erros específicos
    if (error.code === '23503') {
      throw new Error('Cliente, staff ou serviço não encontrado');
    }
    
    throw new Error(`Falha ao criar agendamento: ${error.message}`);
  }

  // Validar dados
  const parsed = AppointmentSchema.safeParse(data);
  if (!parsed.success) {
    console.error('Dados de appointment inválidos após criação:', parsed.error);
    throw new Error('Dados de agendamento inválidos');
  }

  return parsed.data;
}

/**
 * Atualiza appointment existente
 */
export async function updateAppointment(
  supabase: SupabaseAny,
  tenantId: string, // Tenant ID obrigatório para isolamento
  appointmentId: string,
  input: UpdateAppointmentInput
): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .update({
      scheduled_at: input.scheduled_at,
      price: input.price,
      status: input.status,
      notes: input.notes,
    })
    .eq('id', appointmentId)
    .eq('tenant_id', tenantId) // Filtro explícito por tenant
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar appointment:', error);
    
    if (error.code === 'PGRST116') {
      throw new Error('Agendamento não encontrado');
    }
    
    throw new Error(`Falha ao atualizar agendamento: ${error.message}`);
  }

  // Validar dados
  const parsed = AppointmentSchema.safeParse(data);
  if (!parsed.success) {
    console.error('Dados de appointment inválidos após atualização:', parsed.error);
    throw new Error('Dados de agendamento inválidos');
  }

  return parsed.data;
}

/**
 * Deleta appointment
 */
export async function deleteAppointment(
  supabase: SupabaseAny,
  tenantId: string, // Tenant ID obrigatório para isolamento
  appointmentId: string
): Promise<void> {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', appointmentId)
    .eq('tenant_id', tenantId); // Filtro explícito por tenant

  if (error) {
    console.error('Erro ao deletar appointment:', error);
    throw new Error(`Falha ao deletar agendamento: ${error.message}`);
  }
}

/**
 * ============================================
 * STATUS OPERATIONS
 * ============================================
 */

/**
 * Marca appointment como concluído
 */
export async function completeAppointment(
  supabase: SupabaseAny,
  tenantId: string,
  appointmentId: string
): Promise<Appointment> {
  return updateAppointment(supabase, tenantId, appointmentId, { status: 'COMPLETED' });
}

/**
 * Cancela appointment
 */
export async function cancelAppointment(
  supabase: SupabaseAny,
  tenantId: string,
  appointmentId: string
): Promise<Appointment> {
  return updateAppointment(supabase, tenantId, appointmentId, { status: 'CANCELLED' });
}

/**
 * Marca como no-show
 */
export async function markNoShow(
  supabase: SupabaseAny,
  tenantId: string,
  appointmentId: string
): Promise<Appointment> {
  return updateAppointment(supabase, tenantId, appointmentId, { status: 'NO_SHOW' });
}

/**
 * ============================================
 * STATS & ANALYTICS
 * ============================================
 */

/**
 * Conta appointments por status
 */
export async function countAppointmentsByStatus(
  supabase: SupabaseAny,
  date_from?: string,
  date_to?: string
): Promise<Record<string, number>> {
  let query = supabase
    .from('appointments')
    .select('status');

  if (date_from) query = query.gte('scheduled_at', date_from);
  if (date_to) query = query.lte('scheduled_at', date_to);

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao contar appointments:', error);
    return {};
  }

  // Agrupar por status
  const counts: Record<string, number> = {};
  (data || []).forEach((appt) => {
    counts[appt.status] = (counts[appt.status] || 0) + 1;
  });

  return counts;
}

/**
 * Busca appointments do dia
 */
export async function getTodayAppointments(
  supabase: SupabaseAny,
  tenantId: string,
  staff_id?: string
): Promise<Appointment[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const filters: AppointmentFilters = {
    date_from: today.toISOString(),
    date_to: tomorrow.toISOString(),
    status: 'SCHEDULED',
  };

  if (staff_id) {
    filters.staff_id = staff_id;
  }

  const result = await listAppointments(supabase, tenantId, filters);
  return result.data;
}

/**
 * Busca appointments de um cliente
 */
export async function getClientAppointments(
  supabase: SupabaseAny,
  tenantId: string,
  client_id: string,
  limit: number = 10
): Promise<Appointment[]> {
  const result = await listAppointments(supabase, tenantId, {
    client_id,
    sort_by: 'scheduled_at',
    sort_order: 'desc',
    limit,
  });
  return result.data;
}

/**
 * ============================================
 * AVAILABILITY OPERATIONS
 * ============================================
 */

/**
 * Verifica disponibilidade de um staff em um horário
 */
export async function checkAvailability(
  supabase: SupabaseAny,
  staff_id: string,
  scheduled_at: string
): Promise<boolean> {
  const scheduledDate = new Date(scheduled_at);
  
  // Buscar appointments no mesmo horário (+/- 1h)
  const hourBefore = new Date(scheduledDate);
  hourBefore.setHours(hourBefore.getHours() - 1);
  const hourAfter = new Date(scheduledDate);
  hourAfter.setHours(hourAfter.getHours() + 1);

  const { data, error } = await supabase
    .from('appointments')
    .select('id')
    .eq('staff_id', staff_id)
    .gte('scheduled_at', hourBefore.toISOString())
    .lte('scheduled_at', hourAfter.toISOString())
    .neq('status', 'CANCELLED');

  if (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    return false;
  }

  return (data || []).length === 0;
}


