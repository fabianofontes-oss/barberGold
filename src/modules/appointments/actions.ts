'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import * as repository from './repository';
import { appointmentSchema } from './types';

async function getTenantId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();
  
  if (!profile?.tenant_id) throw new Error('Tenant not found');
  return profile.tenant_id;
}

export async function getAppointmentsAction() {
  try {
    const tenantId = await getTenantId();
    const appointments = await repository.getAppointmentsByTenant(tenantId);
    return { success: true, data: appointments };
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    return { success: false, error: error.message };
  }
}

export async function getAppointmentsByStaffAction(staffId: string) {
  try {
    const tenantId = await getTenantId();
    const appointments = await repository.getAppointmentsByStaff(tenantId, staffId);
    return { success: true, data: appointments };
  } catch (error: any) {
    console.error('Error fetching staff appointments:', error);
    return { success: false, error: error.message };
  }
}

export async function getAppointmentsByDateAction(date: Date) {
  try {
    const tenantId = await getTenantId();
    const appointments = await repository.getAppointmentsByDate(tenantId, date);
    return { success: true, data: appointments };
  } catch (error: any) {
    console.error('Error fetching appointments by date:', error);
    return { success: false, error: error.message };
  }
}

export async function createAppointmentAction(formData: FormData) {
  try {
    const tenantId = await getTenantId();
    
    const rawData = {
      client_id: formData.get('client_id') as string,
      staff_id: formData.get('staff_id') as string,
      service_id: formData.get('service_id') as string,
      scheduled_at: formData.get('scheduled_at') as string,
      price: parseFloat(formData.get('price') as string),
      status: (formData.get('status') as string) || 'SCHEDULED',
      notes: formData.get('notes') as string || undefined,
    };

    const validated = appointmentSchema.parse(rawData);
    const appointment = await repository.createAppointment(tenantId, validated);
    
    revalidatePath('/app/agenda');
    revalidatePath('/app/dashboard');
    
    return { success: true, data: appointment };
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    return { success: false, error: error.message };
  }
}

export async function updateAppointmentAction(id: string, formData: FormData) {
  try {
    const tenantId = await getTenantId();
    
    const updates: any = {};
    if (formData.has('status')) updates.status = formData.get('status');
    if (formData.has('scheduled_at')) updates.scheduled_at = formData.get('scheduled_at');
    if (formData.has('price')) updates.price = parseFloat(formData.get('price') as string);
    if (formData.has('notes')) updates.notes = formData.get('notes');

    const appointment = await repository.updateAppointment(id, tenantId, updates);
    
    revalidatePath('/app/agenda');
    revalidatePath('/app/dashboard');
    
    return { success: true, data: appointment };
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteAppointmentAction(id: string) {
  try {
    const tenantId = await getTenantId();
    await repository.deleteAppointment(id, tenantId);
    
    revalidatePath('/app/agenda');
    revalidatePath('/app/dashboard');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting appointment:', error);
    return { success: false, error: error.message };
  }
}
