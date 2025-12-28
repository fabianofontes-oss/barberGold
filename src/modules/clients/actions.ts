'use server';

import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createClientAction(data: {
  name: string;
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
    .select('tenant_id')
    .eq('user_id', session.user.id)
    .single();

  if (!profile?.tenant_id) throw new Error('Tenant não encontrado');

  const { data: client, error } = await supabase
    .from('clients')
    .insert({
      tenant_id: profile.tenant_id,
      name: data.name,
      phone: data.phone || '',
      email: data.email || '',
      birth_date: data.birthDate,
      notes: data.notes || '',
      tags: data.tags || [],
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
    .select('tenant_id')
    .eq('user_id', session.user.id)
    .single();

  if (!profile?.tenant_id) throw new Error('Tenant não encontrado');

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
    .eq('tenant_id', profile.tenant_id)
    .select()
    .single();

  if (error) {
    console.error('❌ Erro ao atualizar cliente:', error);
    throw new Error(error.message);
  }

  revalidatePath('/app/clients');
  return client;
}
