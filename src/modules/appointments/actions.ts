'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { createAppointmentSchema, updateAppointmentStatusSchema } from './schemas';
import { z } from 'zod';

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
  // âœ… ValidaÃ§Ã£o Zod
  try {
    const validated = createAppointmentSchema.parse(data);

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('NÃ£o autenticado');

    const { data: profile } = await supabase
      .from('profiles')
      .select('store_id')
      .eq('user_id', session.user.id)
      .single();

    if (!profile?.store_id) throw new Error('Store nÃ£o encontrado');

    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        store_id: profile.store_id,
        client_id: validated.clientId,
        staff_id: validated.staffId,
        service_id: validated.serviceId,
        date: validated.date,
        start_time: validated.time,
        end_time: validated.time,
        total_amount: validated.price,
        status: 'SCHEDULED',
        notes: validated.notes || '',
      })
      .select()
      .single();

    if (error) {
      console.error('âŒ Erro ao criar agendamento:', error);
      throw new Error(error.message);
    }

    revalidatePath('/app/agenda');
    revalidatePath('/app/dashboard');
    console.log('âœ… Agendamento criado:', appointment.id);
    return appointment;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('âŒ Erro de validaÃ§Ã£o:', error.issues);
      throw new Error(`Dados invÃ¡lidos: ${error.issues[0].message}`);
    }
    throw error;
  }
}

export async function updateAppointmentStatus(appointmentId: string, status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW') {
  // âœ… ValidaÃ§Ã£o Zod
  try {
    const validated = updateAppointmentStatusSchema.parse({ appointmentId, status });

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('NÃ£o autenticado');

    const { data: profile } = await supabase
      .from('profiles')
      .select('store_id')
      .eq('user_id', session.user.id)
      .single();

    if (!profile?.store_id) throw new Error('Store nÃ£o encontrado');

    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({ status: validated.status })
      .eq('id', validated.appointmentId)
      .eq('store_id', profile.store_id)
      .select()
      .single();

    if (error) {
      console.error('âŒ Erro ao atualizar agendamento:', error);
      throw new Error(error.message);
    }

    revalidatePath('/app/agenda');
    revalidatePath('/app/dashboard');
    return appointment;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('âŒ Erro de validaÃ§Ã£o:', error.issues);
      throw new Error(`Dados invÃ¡lidos: ${error.issues[0].message}`);
    }
    throw error;
  }
}
