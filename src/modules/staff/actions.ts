'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createStaff(data: {
  name: string;
  role: 'BARBER' | 'ASSISTANT' | 'OWNER' | 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';
  phone: string;
  cpf?: string;
  birthDate?: string;
  address?: string;
  avatar?: string;
  commissionModel: 'PERCENTAGE' | 'RENTAL';
  serviceCommissionRate: number;
  productCommissionRate: number;
  rentalFee?: number;
  paymentFrequency: string;
  workSchedule: any;
  allowedServices?: string[];
}) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('NÃ£o autenticado');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id, role')
    .eq('user_id', session.user.id)
    .single();

  if (!profile?.store_id || !['OWNER', 'ADMIN'].includes(profile.role)) {
    throw new Error('Sem permissÃ£o');
  }

  const { data: staff, error } = await supabase
    .from('staff')
    .insert({
      store_id: profile.store_id,
      name: data.name,
      role: data.role,
      phone: data.phone,
      commission_model: data.commissionModel,
      service_commission_rate: data.serviceCommissionRate,
      product_commission_rate: data.productCommissionRate,
      chair_rental_amount: data.rentalFee || 0,
      work_schedule: data.workSchedule,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar staff:', error);
    throw new Error(error.message);
  }

  revalidatePath('/app');
  return staff;
}

export async function updateStaff(data: {
  id: string;
  name: string;
  role: 'BARBER' | 'ASSISTANT' | 'OWNER' | 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';
  phone: string;
  cpf?: string;
  birthDate?: string;
  address?: string;
  avatar?: string;
  commissionModel: 'PERCENTAGE' | 'RENTAL';
  serviceCommissionRate: number;
  productCommissionRate: number;
  rentalFee?: number;
  paymentFrequency: string;
  workSchedule: any;
  allowedServices?: string[];
}) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('NÃ£o autenticado');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id, role')
    .eq('user_id', session.user.id)
    .single();

  if (!profile?.store_id || !['OWNER', 'ADMIN'].includes(profile.role)) {
    throw new Error('Sem permissÃ£o');
  }

  const { data: staff, error } = await supabase
    .from('staff')
    .update({
      name: data.name,
      role: data.role,
      phone: data.phone,
      commission_model: data.commissionModel,
      service_commission_rate: data.serviceCommissionRate,
      product_commission_rate: data.productCommissionRate,
      chair_rental_amount: data.rentalFee || 0,
      work_schedule: data.workSchedule,
    })
    .eq('id', data.id)
    .eq('store_id', profile.store_id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar staff:', error);
    throw new Error(error.message);
  }

  revalidatePath('/app');
  return staff;
}
