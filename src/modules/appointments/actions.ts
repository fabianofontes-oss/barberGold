'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createAppointment(data: {
  clientId?: string;
  clientName: string;
  staffId: string;
  serviceId: string;
  date: string;
  time: string;
  price: number;
  notes?: string;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Não autenticado');

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', session.user.id)
    .single();

  if (!profile?.tenant_id) throw new Error('Tenant não encontrado');

  const scheduledAt = `${data.date}T${data.time}:00`;

  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert({
      tenant_id: profile.tenant_id,
      client_id: data.clientId,
      client_name: data.clientName,
      staff_id: data.staffId,
      service_id: data.serviceId,
      scheduled_at: scheduledAt,
      price: data.price,
      status: 'SCHEDULED',
      notes: data.notes || '',
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Erro ao criar agendamento:', error);
    throw new Error(error.message);
  }

  revalidatePath('/app/agenda');
  revalidatePath('/app/dashboard');
  console.log('✅ Agendamento criado:', appointment.id);
  return appointment;
}

export async function updateAppointmentStatus(appointmentId: string, status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW') {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Não autenticado');

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', session.user.id)
    .single();

  if (!profile?.tenant_id) throw new Error('Tenant não encontrado');

  const { data: appointment, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId)
    .eq('tenant_id', profile.tenant_id)
    .select()
    .single();

  if (error) {
    console.error('❌ Erro ao atualizar agendamento:', error);
    throw new Error(error.message);
  }

  revalidatePath('/app/agenda');
  revalidatePath('/app/dashboard');
  return appointment;
}
