'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createExpense(data: {
  category: string;
  amount: number;
  date: string;
  description?: string;
  supplierId?: string;
  paymentMethod?: string;
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

  const { data: expense, error } = await supabase
    .from('expenses')
    .insert({
      store_id: profile.store_id,
      category: data.category,
      amount: data.amount,
      date: data.date,
      description: data.description || '',
      supplier_id: data.supplierId,
      payment_method: data.paymentMethod,
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Erro ao criar despesa:', error);
    throw new Error(error.message);
  }

  revalidatePath('/app/finance');
  revalidatePath('/app/dashboard');
  console.log('✅ Despesa criada:', expense.id);
  return expense;
}

export async function deleteExpense(expenseId: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Não autenticado');

  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id, role')
    .eq('user_id', session.user.id)
    .single();

  if (!profile?.store_id || !['OWNER', 'ADMIN'].includes(profile.role)) {
    throw new Error('Sem permissão');
  }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId)
    .eq('store_id', profile.store_id);

  if (error) {
    console.error('❌ Erro ao deletar despesa:', error);
    throw new Error(error.message);
  }

  revalidatePath('/app/finance');
  revalidatePath('/app/dashboard');
  return { success: true };
}

export async function createRegisterClosure(data: {
  staffId: string;
  openedAt: string;
  closedAt: string;
  openingBalance: number;
  closingBalance: number;
  totalSales: number;
  totalCash?: number;
  totalCard?: number;
  totalPix?: number;
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

  const { data: closure, error } = await supabase
    .from('register_closures')
    .insert({
      store_id: profile.store_id,
      staff_id: data.staffId,
      opened_at: data.openedAt,
      closed_at: data.closedAt,
      opening_balance: data.openingBalance,
      closing_balance: data.closingBalance,
      total_sales: data.totalSales,
      total_cash: data.totalCash || 0,
      total_card: data.totalCard || 0,
      total_pix: data.totalPix || 0,
      notes: data.notes || '',
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Erro ao criar fechamento:', error);
    throw new Error(error.message);
  }

  revalidatePath('/app/finance');
  revalidatePath('/app/dashboard');
  console.log('✅ Fechamento criado:', closure.id);
  return closure;
}
