'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { createSaleSchema } from './schemas';
import { z } from 'zod';

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
  // âœ… ValidaÃ§Ã£o Zod
  try {
    const validated = createSaleSchema.parse(data);

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('NÃ£o autenticado');

    const { data: profile } = await supabase
      .from('profiles')
      .select('store_id')
      .eq('user_id', session.user.id)
      .single();

    if (!profile?.store_id) throw new Error('Store nÃ£o encontrado');

    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({
        store_id: profile.store_id,
        client_id: validated.clientId,
        staff_id: validated.staffId,
        total_amount: validated.total,
        payment_method: validated.method,
        payment_status: 'PAID',
        tip_amount: validated.tip || 0,
      })
      .select()
      .single();

    if (saleError) {
      console.error('âŒ Erro ao criar venda:', saleError);
      throw new Error(saleError.message);
    }

    revalidatePath('/app/pdv');
    revalidatePath('/app/finance');
    revalidatePath('/app/dashboard');
    console.log('âœ… Venda criada:', sale.id);
    return sale;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('âŒ Erro de validaÃ§Ã£o:', error.issues);
      throw new Error(`Dados invÃ¡lidos: ${error.issues[0].message}`);
    }
    throw error;
  }
}
