import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

type AppSupabaseClient = SupabaseClient<Database>;
type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];

export type MappedExpense = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  category: string;
  expenseDate: string;
  paymentMethod: string | null;
  receiptUrl: string | null;
  notes: string | null;
  createdAt: string;
};

export function createExpensesRepository(supabase: AppSupabaseClient) {
  return {
    async listExpenses({ tenantId, startDate, endDate, category }: { 
      tenantId: string; 
      startDate?: string;
      endDate?: string;
      category?: string;
    }): Promise<MappedExpense[]> {
      let query = supabase
        .from('expenses')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('expense_date', { ascending: false });

      if (startDate) query = query.gte('expense_date', startDate);
      if (endDate) query = query.lte('expense_date', endDate);
      if (category) query = query.eq('category', category);

      const { data, error } = await query;
      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        amount: Number(row.amount),
        category: row.category,
        expenseDate: row.expense_date,
        paymentMethod: row.payment_method,
        receiptUrl: row.receipt_url,
        notes: row.notes,
        createdAt: row.created_at,
      }));
    },

    async createExpense({ input }: { input: TablesInsert<'expenses'> }) {
      const { data, error } = await supabase
        .from('expenses')
        .insert(input)
        .select('id')
        .single();

      if (error) throw error;
      return { id: data.id };
    },

    async deleteExpense({ expenseId }: { expenseId: string }) {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
    },
  };
}
