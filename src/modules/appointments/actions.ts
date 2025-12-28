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
    .select('store_id')
    .eq('user_id', session.user.id)
    .single();

  if (!profile?.store_id) throw new Error('Store não encontrado');

  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert({
      store_id: profile.store_id,
      client_id: data.clientId,
      staff_id: data.staffId,
      service_id: data.serviceId,
      date: data.date,
      start_time: data.time,
      end_time: data.time,
      total_amount: data.price,
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
    .select('store_id')
    .eq('user_id', session.user.id)
    .single();

  if (!profile?.store_id) throw new Error('Store não encontrado');

  const { data: appointment, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId)
    .eq('store_id', profile.store_id)
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
