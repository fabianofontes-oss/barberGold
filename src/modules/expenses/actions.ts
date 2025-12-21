'use server';

import { createClient } from '@/lib/supabase/server';
import { getAuthContext } from '@/lib/auth/getTenantId';
import { createExpensesRepository } from './repository';
import { createExpenseInputSchema, listExpensesInputSchema } from './types';

export async function listExpensesAction(input: unknown) {
  const parsed = listExpensesInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createExpensesRepository(supabase);

  return await repo.listExpenses({
    tenantId: auth.tenantId,
    startDate: parsed.startDate,
    endDate: parsed.endDate,
    category: parsed.category,
  });
}

export async function createExpenseAction(input: unknown) {
  const parsed = createExpenseInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createExpensesRepository(supabase);

  return await repo.createExpense({
    input: {
      tenant_id: auth.tenantId,
      title: parsed.title,
      description: parsed.description || null,
      amount: parsed.amount,
      category: parsed.category,
      expense_date: parsed.expenseDate,
      payment_method: parsed.paymentMethod || null,
      receipt_url: parsed.receiptUrl || null,
      notes: parsed.notes || null,
    },
  });
}

export async function deleteExpenseAction(expenseId: string) {
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createExpensesRepository(supabase);

  await repo.deleteExpense({ expenseId });
  return { success: true };
}
