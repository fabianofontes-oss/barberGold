'use server';

import { createClient } from '@/lib/supabase/server';
import { getAuthContext } from '@/lib/auth/getTenantId';
import { createSalesRepository } from './repository';
import { createSaleInputSchema, listSalesInputSchema } from './types';

export async function listSalesAction(input: unknown) {
  const parsed = listSalesInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createSalesRepository(supabase);

  const sales = await repo.listSales({
    tenantId: auth.tenantId,
    startDate: parsed.startDate,
    endDate: parsed.endDate,
    staffId: parsed.staffId,
    paymentMethod: parsed.paymentMethod,
  });

  return sales;
}

export async function createSaleAction(input: unknown) {
  const parsed = createSaleInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createSalesRepository(supabase);

  const result = await repo.createSale({
    input: {
      tenant_id: auth.tenantId,
      client_id: parsed.clientId || null,
      staff_id: parsed.staffId,
      appointment_id: null,
      payment_method: parsed.paymentMethod,
      subtotal: parsed.subtotal,
      discount: parsed.discount,
      tip: parsed.tip,
      total: parsed.total,
      notes: parsed.notes || null,
    },
    items: parsed.items.map(item => ({
      type: item.type,
      itemId: item.itemId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });

  // TODO: Atualizar stats do cliente via trigger SQL ou job background
  // Por enquanto, stats serão atualizadas via query agregada quando necessário

  return result;
}

export async function validatePromoCodeAction(code: string) {
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createSalesRepository(supabase);

  return await repo.validatePromoCode({ tenantId: auth.tenantId, code });
}

export async function createSaleWithSplitPaymentAction(saleData: any, payments: Array<{ method: string; amount: number }>) {
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createSalesRepository(supabase);

  const result = await repo.createSale({
    input: {
      tenant_id: auth.tenantId,
      client_id: saleData.clientId || null,
      staff_id: saleData.staffId,
      payment_method: payments[0].method as any,
      subtotal: saleData.subtotal,
      discount: saleData.discount,
      tip: saleData.tip,
      total: saleData.total,
      notes: saleData.notes || null,
    },
    items: saleData.items,
  });

  if (payments.length > 1) {
    await repo.createSalePayments({ saleId: result.id, payments });
  }

  return result;
}
