import { createClient } from '@/lib/supabase/server';
import type { AppointmentRow, AppointmentInsert, AppointmentUpdate, AppointmentWithDetails } from './types';

/**
 * Repository: Data Layer para Appointments
 * Apenas chamadas ao Supabase, sem regras de negócio
 */

export async function getAppointmentsByTenant(tenantId: string): Promise<AppointmentWithDetails[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      clients!inner(name),
      profiles!inner(name),
      services!inner(name)
    `)
    .eq('tenant_id', tenantId)
    .order('scheduled_at', { ascending: true });

  if (error) throw error;
  
  return (data || []).map((appt: any) => ({
    ...appt,
    client_name: appt.clients?.name,
    staff_name: appt.profiles?.name,
    service_name: appt.services?.name,
  }));
}

export async function getAppointmentsByStaff(tenantId: string, staffId: string): Promise<AppointmentWithDetails[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      clients!inner(name),
      profiles!inner(name),
      services!inner(name)
    `)
    .eq('tenant_id', tenantId)
    .eq('staff_id', staffId)
    .order('scheduled_at', { ascending: true });

  if (error) throw error;
  
  return (data || []).map((appt: any) => ({
    ...appt,
    client_name: appt.clients?.name,
    staff_name: appt.profiles?.name,
    service_name: appt.services?.name,
  }));
}

export async function getAppointmentsByDate(tenantId: string, date: Date): Promise<AppointmentWithDetails[]> {
  const supabase = await createClient();
  
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      clients!inner(name),
      profiles!inner(name),
      services!inner(name)
    `)
    .eq('tenant_id', tenantId)
    .gte('scheduled_at', startOfDay.toISOString())
    .lte('scheduled_at', endOfDay.toISOString())
    .order('scheduled_at', { ascending: true });

  if (error) throw error;
  
  return (data || []).map((appt: any) => ({
    ...appt,
    client_name: appt.clients?.name,
    staff_name: appt.profiles?.name,
    service_name: appt.services?.name,
  }));
}

export async function createAppointment(tenantId: string, data: Omit<AppointmentInsert, 'tenant_id'>): Promise<AppointmentRow> {
  const supabase = await createClient();
  
  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert({ ...data, tenant_id: tenantId })
    .select()
    .single();

  if (error) throw error;
  return appointment;
}

export async function updateAppointment(id: string, tenantId: string, data: AppointmentUpdate): Promise<AppointmentRow> {
  const supabase = await createClient();
  
  const { data: appointment, error } = await supabase
    .from('appointments')
    .update(data)
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .select()
    .single();

  if (error) throw error;
  return appointment;
}

export async function deleteAppointment(id: string, tenantId: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId);

  if (error) throw error;
}
