'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type SaleItem = {
  id: string;
  name: string;
  type: 'SERVICE' | 'PRODUCT';
  price: number;
  qty: number;
};

export async function createSale(data: {
  clientId?: string;
  staffId: string;
  items: SaleItem[];
  total: number;
  method: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'OTHER';
  tip?: number;
  discountApplied?: string;
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

  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .insert({
      store_id: profile.store_id,
      client_id: data.clientId,
      staff_id: data.staffId,
      total_amount: data.total,
      payment_method: data.method,
      payment_status: 'PAID',
      tip_amount: data.tip || 0,
    })
    .select()
    .single();

  if (saleError) {
    console.error('❌ Erro ao criar venda:', saleError);
    throw new Error(saleError.message);
  }

  revalidatePath('/app/pdv');
  revalidatePath('/app/finance');
  revalidatePath('/app/dashboard');
  console.log('✅ Venda criada:', sale.id);
  return sale;
}
