'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { createExpenseSchema, createRegisterClosureSchema } from './schemas';
import { z } from 'zod';

export async function createExpense(data: {
  category: string;
  amount: number;
  date: string;
  description?: string;
  supplierId?: string;
  paymentMethod?: string;
}) {
  // âœ… ValidaÃ§Ã£o Zod
  try {
    const validated = createExpenseSchema.parse(data);

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('NÃ£o autenticado');

    const { data: profile } = await supabase
      .from('profiles')
      .select('store_id')
      .eq('user_id', session.user.id)
      .single();

    if (!profile?.store_id) throw new Error('Store nÃ£o encontrado');

    const { data: expense, error } = await supabase
      .from('expenses')
      .insert({
        store_id: profile.store_id,
        category: validated.category,
        amount: validated.amount,
        date: validated.date,
        description: validated.description || '',
        supplier_id: validated.supplierId,
        payment_method: validated.paymentMethod,
      })
      .select()
      .single();

    if (error) {
      console.error('âŒ Erro ao criar despesa:', error);
      throw new Error(error.message);
    }

    revalidatePath('/app/finance');
    revalidatePath('/app/dashboard');
    console.log('âœ… Despesa criada:', expense.id);
    return expense;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('âŒ Erro de validaÃ§Ã£o:', error.issues);
      throw new Error(`Dados invÃ¡lidos: ${error.issues[0].message}`);
    }
    throw error;
  }
}

export async function deleteExpense(expenseId: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('NÃ£o autenticado');

  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id, role')
    .eq('user_id', session.user.id)
    .single();

  if (!profile?.store_id || !['OWNER', 'ADMIN'].includes(profile.role)) {
    throw new Error('Sem permissÃ£o');
  }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId)
    .eq('store_id', profile.store_id);

  if (error) {
    console.error('âŒ Erro ao deletar despesa:', error);
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
  // âœ… ValidaÃ§Ã£o Zod
  try {
    const validated = createRegisterClosureSchema.parse(data);

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('NÃ£o autenticado');

    const { data: profile } = await supabase
      .from('profiles')
      .select('store_id')
      .eq('user_id', session.user.id)
      .single();

    if (!profile?.store_id) throw new Error('Store nÃ£o encontrado');

    const { data: closure, error } = await supabase
      .from('register_closures')
      .insert({
        store_id: profile.store_id,
        staff_id: validated.staffId,
        opened_at: validated.openedAt,
        closed_at: validated.closedAt,
        opening_balance: validated.openingBalance,
        closing_balance: validated.closingBalance,
        total_sales: validated.totalSales,
        total_cash: validated.totalCash || 0,
        total_card: validated.totalCard || 0,
        total_pix: validated.totalPix || 0,
        notes: validated.notes || '',
      })
      .select()
      .single();

    if (error) {
      console.error('âŒ Erro ao criar fechamento:', error);
      throw new Error(error.message);
    }

    revalidatePath('/app/finance');
    revalidatePath('/app/dashboard');
    console.log('âœ… Fechamento criado:', closure.id);
    return closure;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('âŒ Erro de validaÃ§Ã£o:', error.issues);
      throw new Error(`Dados invÃ¡lidos: ${error.issues[0].message}`);
    }
    throw error;
  }
}
