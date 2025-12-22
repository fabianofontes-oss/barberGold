'use server';

/**
 * Server Actions para Sales
 * 
 * Funções que rodam no servidor e podem ser chamadas do cliente
 */

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  Sale,
  CreateSaleInput,
  SaleFilters,
  PaginatedSales,
  CreateSaleSchema,
  SaleFiltersSchema,
  SalesStats,
  SaleItem,
} from './types';
import * as repository from './repository';

/**
 * ============================================
 * ACTION RESULT TYPES
 * ============================================
 */

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * ============================================
 * MAIN ACTION: PROCESS SALE
 * ============================================
 */

/**
 * Processa venda completa (com commission snapshot)
 * 
 * Esta é a action mais importante do PDV
 */
export async function processSaleAction(
  input: CreateSaleInput,
  staffSettings: {
    commissionType: 'PERCENTAGE' | 'CHAIR_RENTAL' | 'OWNER';
    commissionRate?: number;
    chairRental?: number;
  },
  shopSettings: {
    discountRule: 'SHARED' | 'SHOP_ABSORBS';
  }
): Promise<ActionResult<Sale>> {
  try {
    // Validar input
    const validatedInput = CreateSaleSchema.parse(input);

    const supabase = await createClient();
    const sale = await repository.processSale(
      supabase,
      validatedInput,
      staffSettings,
      shopSettings
    );

    // Revalidar cache
    revalidatePath('/app/pdv');
    revalidatePath('/app/dashboard');
    revalidatePath('/app/finance');
    revalidatePath('/app/clients');

    return { success: true, data: sale };
  } catch (error) {
    console.error('Erro em processSaleAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao processar venda',
    };
  }
}

/**
 * ============================================
 * CRUD ACTIONS
 * ============================================
 */

/**
 * Lista sales com filtros e paginação
 */
export async function listSalesAction(
  filters?: SaleFilters
): Promise<ActionResult<PaginatedSales>> {
  try {
    // Validar filtros
    const validatedFilters = filters 
      ? SaleFiltersSchema.parse(filters)
      : {};

    const supabase = await createClient();
    const result = await repository.listSales(supabase, validatedFilters);

    return { success: true, data: result };
  } catch (error) {
    console.error('Erro em listSalesAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao listar vendas',
    };
  }
}

/**
 * Busca sale por ID
 */
export async function getSaleAction(
  saleId: string
): Promise<ActionResult<Sale | null>> {
  try {
    const supabase = await createClient();
    const sale = await repository.getSaleById(supabase, saleId);

    return { success: true, data: sale };
  } catch (error) {
    console.error('Erro em getSaleAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar venda',
    };
  }
}

/**
 * Busca items de uma sale
 */
export async function getSaleItemsAction(
  saleId: string
): Promise<ActionResult<SaleItem[]>> {
  try {
    const supabase = await createClient();
    const items = await repository.getSaleItems(supabase, saleId);

    return { success: true, data: items };
  } catch (error) {
    console.error('Erro em getSaleItemsAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar itens',
    };
  }
}

/**
 * ============================================
 * STATS ACTIONS
 * ============================================
 */

/**
 * Calcula estatísticas de vendas
 */
export async function getSalesStatsAction(
  date_from?: string,
  date_to?: string,
  staff_id?: string
): Promise<ActionResult<SalesStats>> {
  try {
    const supabase = await createClient();
    const stats = await repository.getSalesStats(supabase, date_from, date_to, staff_id);

    return { success: true, data: stats };
  } catch (error) {
    console.error('Erro em getSalesStatsAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao calcular estatísticas',
    };
  }
}

/**
 * Busca vendas de hoje
 */
export async function getTodaySalesAction(
  staff_id?: string
): Promise<ActionResult<Sale[]>> {
  try {
    const supabase = await createClient();
    const sales = await repository.getTodaySales(supabase, staff_id);

    return { success: true, data: sales };
  } catch (error) {
    console.error('Erro em getTodaySalesAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar vendas de hoje',
    };
  }
}

