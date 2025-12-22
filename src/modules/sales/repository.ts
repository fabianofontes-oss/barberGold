/**
 * Repository para Sales (Supabase)
 * 
 * Implementa processSale com commission snapshot
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';
import {
  Sale,
  SaleItem,
  CreateSaleInput,
  SaleFilters,
  PaginatedSales,
  SaleSchema,
  CommissionSnapshot,
  SalesStats,
} from './types';
import { calculateCommission } from '@/lib/business-logic/commissions';

/**
 * ============================================
 * PROCESS SALE (Main Operation)
 * ============================================
 */

/**
 * Processa venda completa:
 * 1. Calcula comissão e cria snapshot
 * 2. Cria sale com commission_snapshot
 * 3. Cria sale_items
 * 4. Atualiza client (loyalty, total_spent, last_visit)
 * 5. Retorna sale completa
 */
export async function processSale(
  supabase: SupabaseClient<Database>,
  input: CreateSaleInput,
  staffSettings: {
    commissionType: 'PERCENTAGE' | 'CHAIR_RENTAL' | 'OWNER';
    commissionRate?: number;
    chairRental?: number;
  },
  shopSettings: {
    discountRule: 'SHARED' | 'SHOP_ABSORBS';
  }
): Promise<Sale> {
  // 1. Calcular total
  const total = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // 2. Calcular comissão usando função validada
  const commissionResult = calculateCommission(
    input.items.map(item => ({
      price: item.price,
      qty: item.quantity,
      type: item.item_type === 'SERVICE' ? 'service' : 'product',
    })),
    total - input.discount, // total após desconto
    input.tip,
    {
      commissionType: staffSettings.commissionType,
      commissionRate: staffSettings.commissionRate,
      chairRental: staffSettings.chairRental,
    },
    shopSettings
  );

  // 3. Criar commission snapshot
  const commissionSnapshot: CommissionSnapshot = {
    commission_type: staffSettings.commissionType,
    commission_rate: staffSettings.commissionRate,
    chair_rental: staffSettings.chairRental,
    discount_rule: shopSettings.discountRule,
    gross_commission: commissionResult.grossComm,
    net_commission: commissionResult.netComm,
    discount_impact: commissionResult.discountImpact || 0,
    services_commission: commissionResult.servicesComm || 0,
    products_commission: commissionResult.productsComm || 0,
    tip_commission: commissionResult.tipComm || 0,
  };

  // 4. Criar sale no banco (com snapshot)
  // tenant_id será preenchido automaticamente pelo RLS
  const saleInsertData = {
    client_id: input.client_id || null,
    staff_id: input.staff_id,
    total,
    payment_method: input.payment_method,
    tip: input.tip,
    discount: input.discount,
    notes: input.notes || null,
    commission_snapshot: commissionSnapshot as any, // JSON no banco
  };

  const { data: saleData, error: saleError } = await supabase
    .from('sales')
    .insert(saleInsertData)
    .select()
    .single();

  if (saleError) {
    console.error('Erro ao criar sale:', saleError);
    throw new Error(`Falha ao processar venda: ${saleError.message}`);
  }

  // 5. Criar sale_items
  const itemsToInsert = input.items.map(item => ({
    sale_id: saleData.id,
    item_type: item.item_type,
    item_id: item.item_id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('sale_items')
    .insert(itemsToInsert);

  if (itemsError) {
    console.error('Erro ao criar sale_items:', itemsError);
    // Rollback? (ou deixar sale sem items)
    throw new Error(`Falha ao salvar itens da venda: ${itemsError.message}`);
  }

  // 6. Atualizar client (se tiver)
  if (input.client_id) {
    // Buscar client atual
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('total_spent, loyalty_points')
      .eq('id', input.client_id)
      .single();

    if (!clientError && client) {
      // Calcular novos valores
      const newTotalSpent = Number(client.total_spent || 0) + total;
      const pointsToAdd = Math.floor(total / 10); // 1 ponto a cada R$10
      const newLoyaltyPoints = (client.loyalty_points || 0) + pointsToAdd;

      // Atualizar client
      await supabase
        .from('clients')
        .update({
          total_spent: newTotalSpent,
          loyalty_points: newLoyaltyPoints,
          last_visit: new Date().toISOString(),
        })
        .eq('id', input.client_id);
    }
  }

  // 7. Validar e retornar sale
  const parsed = SaleSchema.safeParse(saleData);
  if (!parsed.success) {
    console.error('Dados de sale inválidos após criação:', parsed.error);
    throw new Error('Dados de venda inválidos');
  }

  return parsed.data;
}

/**
 * ============================================
 * CRUD OPERATIONS
 * ============================================
 */

/**
 * Lista sales com filtros e paginação
 */
export async function listSales(
  supabase: SupabaseClient<Database>,
  filters: SaleFilters = {}
): Promise<PaginatedSales> {
  const {
    client_id,
    staff_id,
    payment_method,
    date_from,
    date_to,
    sort_by = 'created_at',
    sort_order = 'desc',
    limit = 100,
    offset = 0,
  } = filters;

  // Base query
  let query = supabase
    .from('sales')
    .select('*', { count: 'exact' });

  // Filtros
  if (client_id) query = query.eq('client_id', client_id);
  if (staff_id) query = query.eq('staff_id', staff_id);
  if (payment_method) query = query.eq('payment_method', payment_method);
  if (date_from) query = query.gte('created_at', date_from);
  if (date_to) query = query.lte('created_at', date_to);

  // Ordenação
  query = query.order(sort_by, { ascending: sort_order === 'asc' });

  // Paginação
  query = query.range(offset, offset + limit - 1);

  // Executar query
  const { data, error, count } = await query;

  if (error) {
    console.error('Erro ao listar sales:', error);
    throw new Error(`Falha ao listar vendas: ${error.message}`);
  }

  // Validar e parsear dados
  const sales = (data || [])
    .map(sale => {
      const parsed = SaleSchema.safeParse(sale);
      if (!parsed.success) {
        console.warn('Sale inválida:', sale.id, parsed.error);
        return null;
      }
      return parsed.data;
    })
    .filter((s): s is Sale => s !== null);

  return {
    data: sales,
    total: count || 0,
    page: Math.floor(offset / limit) + 1,
    per_page: limit,
    has_next: (count || 0) > offset + limit,
  };
}

/**
 * Busca sale por ID
 */
export async function getSaleById(
  supabase: SupabaseClient<Database>,
  saleId: string
): Promise<Sale | null> {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('id', saleId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Erro ao buscar sale:', error);
    throw new Error(`Falha ao buscar venda: ${error.message}`);
  }

  // Validar dados
  const parsed = SaleSchema.safeParse(data);
  if (!parsed.success) {
    console.error('Dados de sale inválidos:', parsed.error);
    throw new Error('Dados de venda inválidos');
  }

  return parsed.data;
}

/**
 * Busca items de uma sale
 */
export async function getSaleItems(
  supabase: SupabaseClient<Database>,
  saleId: string
): Promise<SaleItem[]> {
  const { data, error } = await supabase
    .from('sale_items')
    .select('*')
    .eq('sale_id', saleId);

  if (error) {
    console.error('Erro ao buscar sale items:', error);
    throw new Error(`Falha ao buscar itens da venda: ${error.message}`);
  }

  return data || [];
}

/**
 * ============================================
 * STATS & ANALYTICS
 * ============================================
 */

/**
 * Calcula estatísticas de vendas
 */
export async function getSalesStats(
  supabase: SupabaseClient<Database>,
  date_from?: string,
  date_to?: string,
  staff_id?: string
): Promise<SalesStats> {
  let query = supabase
    .from('sales')
    .select('total, tip, discount, commission_snapshot');

  if (date_from) query = query.gte('created_at', date_from);
  if (date_to) query = query.lte('created_at', date_to);
  if (staff_id) query = query.eq('staff_id', staff_id);

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar stats:', error);
    return {
      total_sales: 0,
      total_revenue: 0,
      avg_ticket: 0,
      total_tips: 0,
      total_discounts: 0,
      total_commission: 0,
    };
  }

  const sales = data || [];
  const total_sales = sales.length;
  const total_revenue = sales.reduce((sum, s) => sum + Number(s.total), 0);
  const total_tips = sales.reduce((sum, s) => sum + Number(s.tip || 0), 0);
  const total_discounts = sales.reduce((sum, s) => sum + Number(s.discount || 0), 0);
  const total_commission = sales.reduce((sum, s) => {
    const snapshot = s.commission_snapshot as any;
    return sum + (snapshot?.net_commission || 0);
  }, 0);

  return {
    total_sales,
    total_revenue,
    avg_ticket: total_sales > 0 ? total_revenue / total_sales : 0,
    total_tips,
    total_discounts,
    total_commission,
  };
}

/**
 * Busca vendas de hoje
 */
export async function getTodaySales(
  supabase: SupabaseClient<Database>,
  staff_id?: string
): Promise<Sale[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const filters: SaleFilters = {
    date_from: today.toISOString(),
    date_to: tomorrow.toISOString(),
  };

  if (staff_id) {
    filters.staff_id = staff_id;
  }

  const result = await listSales(supabase, filters);
  return result.data;
}


