'use server';

import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { createClientSchema } from './schemas';
import { z } from 'zod';

export async function getClients(filters?: { search?: string; tags?: string[] }) {
  try {
    const supabase = await createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, error: 'Não autenticado' };

    const { data: profile } = await supabase
      .from('profiles')
      .select('store_id')
      .eq('user_id', session.user.id)
      .single();

    if (!profile?.store_id) return { success: false, error: 'Store não encontrada' };

    let query = supabase
      .from('clients')
      .select('*')
      .eq('store_id', profile.store_id)
      .order('name');

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    const { data: clients, error } = await query;

    if (error) throw error;

    return { success: true, data: clients || [] };
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return { success: false, error: 'Erro ao buscar clientes' };
  }
}

export async function getClientStats(clientId: string) {
  try {
    const supabase = await createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, error: 'Não autenticado' };

    // Por enquanto retorna stats vazias - implementar depois
    return {
      success: true,
      data: {
        totalVisits: 0,
        totalSpent: 0,
        lastVisit: null,
        averageTicket: 0
      }
    };
  } catch (error) {
    console.error('Erro ao buscar stats do cliente:', error);
    return { success: false, error: 'Erro ao buscar estatísticas' };
  }
}

export async function createClientAction(data: {
  name: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  notes?: string;
  tags?: string[];
}) {
  // ✅ Validação Zod
  try {
    // Validate unconditionally using the schema
    const validated = createClientSchema.parse({
      ...data,
      phone: data.phone || '', // Ensure empty string if undefined, matching schema
    });

    const supabase = await createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Não autenticado');

    const { data: profile } = await supabase
      .from('profiles')
      .select('store_id')
      .eq('user_id', session.user.id)
      .single();

    if (!profile?.store_id) throw new Error('Store não encontrado');

    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        store_id: profile.store_id,
        name: validated.name,
        phone: validated.phone || '',
        email: validated.email || '',
        birth_date: validated.birthDate,
        notes: validated.notes || '',
        tags: validated.tags || [],
        total_spent: 0,
        total_visits: 0,
        loyalty_points: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar cliente:', error);
      throw new Error(error.message);
    }

    revalidatePath('/app/clients');
    revalidatePath('/app/dashboard');
    console.log('✅ Cliente criado:', client.id);
    return client;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Erro de validação:', error.issues);
      throw new Error(`Dados inválidos: ${error.issues[0].message}`);
    }
    throw error;
  }
}

export async function updateClientAction(clientId: string, data: {
  name?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  notes?: string;
  tags?: string[];
}) {
  const supabase = await createSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Não autenticado');

  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id')
    .eq('user_id', session.user.id)
    .single();

  if (!profile?.store_id) throw new Error('Store não encontrado');

  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.birthDate !== undefined) updateData.birth_date = data.birthDate;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.tags) updateData.tags = data.tags;

  const { data: client, error } = await supabase
    .from('clients')
    .update(updateData)
    .eq('id', clientId)
    .eq('store_id', profile.store_id)
    .select()
    .single();

  if (error) {
    console.error('❌ Erro ao atualizar cliente:', error);
    throw new Error(error.message);
  }

  revalidatePath('/app/clients');
  return client;
}
