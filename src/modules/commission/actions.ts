'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCommissionPlan(data: {
  name: string;
  model: 'PERCENTAGE' | 'RENTAL';
  serviceRate: number;
  productRate: number;
  rentalFee: number;
}) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Não autenticado');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id')
    .eq('user_id', session.user.id)
    .single();

  if (!profile?.tenant_id) {
    throw new Error('Tenant não encontrado');
  }

  const { data: plan, error } = await supabase
    .from('commission_plans')
    .insert({
      tenant_id: profile.tenant_id,
      name: data.name,
      model: data.model,
      service_rate: data.serviceRate,
      product_rate: data.productRate,
      rental_fee: data.rentalFee,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar plano de comissão:', error);
    throw new Error(error.message);
  }

  revalidatePath('/app');
  return plan;
}

export async function deleteCommissionPlan(planId: string) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Não autenticado');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tenant_id, role')
    .eq('user_id', session.user.id)
    .single();

  if (!profile?.tenant_id || !['OWNER', 'ADMIN'].includes(profile.role)) {
    throw new Error('Sem permissão');
  }

  const { error } = await supabase
    .from('commission_plans')
    .delete()
    .eq('id', planId)
    .eq('tenant_id', profile.tenant_id);

  if (error) {
    console.error('Erro ao deletar plano de comissão:', error);
    throw new Error(error.message);
  }

  revalidatePath('/app');
  return { success: true };
}
