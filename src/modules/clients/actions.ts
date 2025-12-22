'use server';

/**
 * Server Actions para Clients
 * 
 * Funções que rodam no servidor e podem ser chamadas do cliente
 */

import { revalidatePath } from 'next/cache';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/database.types';

/**
 * ============================================
 * TYPES
 * ============================================
 */

// Tipo do banco de dados (snake_case)
export type ClientDB = Database['public']['Tables']['clients']['Row'];

// Tipo para UI (camelCase + campos extras opcionais)
export interface Client {
  id: string;
  created_at: string;
  tenant_id: string;
  name: string;
  phone: string;
  email: string | null;
  birthDate: string | null;
  totalSpent: number;
  loyaltyPoints: number;
  lastVisit: Date | null;
  notes: string | null;
  // Campos opcionais (não existem no banco ainda)
  preferredStaffId?: string;
  dependents?: Array<{ id: string; name: string; preferredStaffId?: string }>;
  tags?: string[];
  preferences?: Record<string, any>;
}

// Converte do banco para UI
export function toClientUI(db: ClientDB): Client {
  return {
    id: db.id,
    created_at: db.created_at,
    tenant_id: db.tenant_id,
    name: db.name,
    phone: db.phone,
    email: db.email,
    birthDate: db.birth_date,
    totalSpent: db.total_spent,
    loyaltyPoints: db.loyalty_points,
    lastVisit: db.last_visit ? new Date(db.last_visit) : null,
    notes: db.notes,
    // Campos opcionais ficam undefined por enquanto
    preferredStaffId: undefined,
    dependents: [],
    tags: [],
    preferences: {},
  };
}

export type CreateClientInput = Database['public']['Tables']['clients']['Insert'];

export type UpdateClientInput = Database['public']['Tables']['clients']['Update'];

export interface ClientFilters {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedClients {
  data: Client[];
  total: number;
  hasMore: boolean;
}

export interface ClientStats {
  total: number;
  new_this_month: number;
  returning: number;
  at_risk: number;
}

/**
 * ============================================
 * ACTION RESULT TYPE
 * ============================================
 */

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * ============================================
 * CRUD ACTIONS
 * ============================================
 */

/**
 * Lista clients com filtros e paginação
 */
export async function listClientsAction(
  filters?: ClientFilters
): Promise<ActionResult<PaginatedClients>> {
  try {
    const supabase = await createSupabaseClient();
    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;

    let query = supabase
      .from('clients')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Aplicar filtros
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Converter para formato UI (camelCase)
    const clientsUI = (data || []).map(toClientUI);

    return {
      success: true,
      data: {
        data: clientsUI,
        total: count || 0,
        hasMore: (count || 0) > offset + limit,
      },
    };
  } catch (error) {
    console.error('Erro em listClientsAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao listar clientes',
    };
  }
}

/**
 * Busca client por ID
 */
export async function getClientAction(
  clientId: string
): Promise<ActionResult<Client | null>> {
  try {
    const supabase = await createSupabaseClient();
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return { success: true, data: data ? toClientUI(data) : null };
  } catch (error) {
    console.error('Erro em getClientAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar cliente',
    };
  }
}

/**
 * Cria novo client
 */
export async function createClientAction(
  input: CreateClientInput
): Promise<ActionResult<Client>> {
  try {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
      .from('clients')
      .insert(input)
      .select()
      .single();

    if (error) throw error;

    // Revalidar cache
    revalidatePath('/app/clients');
    revalidatePath('/app/dashboard');

    return { success: true, data: toClientUI(data) };
  } catch (error) {
    console.error('Erro em createClientAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar cliente',
    };
  }
}

/**
 * Atualiza client existente
 */
export async function updateClientAction(
  clientId: string,
  input: UpdateClientInput
): Promise<ActionResult<Client>> {
  try {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
      .from('clients')
      .update(input)
      .eq('id', clientId)
      .select()
      .single();

    if (error) throw error;

    // Revalidar cache
    revalidatePath('/app/clients');
    revalidatePath('/app/dashboard');

    return { success: true, data: toClientUI(data) };
  } catch (error) {
    console.error('Erro em updateClientAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar cliente',
    };
  }
}

/**
 * Deleta client
 */
export async function deleteClientAction(
  clientId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createSupabaseClient();

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) throw error;

    // Revalidar cache
    revalidatePath('/app/clients');
    revalidatePath('/app/dashboard');

    return { success: true, data: undefined };
  } catch (error) {
    console.error('Erro em deleteClientAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao deletar cliente',
    };
  }
}

/**
 * ============================================
 * SEARCH & STATS
 * ============================================
 */

/**
 * Busca clients por nome ou telefone
 */
export async function searchClientsAction(
  searchTerm: string,
  limit: number = 10
): Promise<ActionResult<Client[]>> {
  try {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      .limit(limit)
      .order('name');

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erro em searchClientsAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar clientes',
    };
  }
}

/**
 * Estatísticas de clients
 */
export async function getClientStatsAction(): Promise<ActionResult<ClientStats>> {
  try {
    const supabase = await createSupabaseClient();

    // Total de clients
    const { count: total } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    // Novos este mês
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const { count: newThisMonth } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayOfMonth.toISOString());

    // Clientes que retornaram (têm last_visit)
    const { count: returning } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .not('last_visit', 'is', null);

    // Em risco (last_visit > 60 dias atrás)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const { count: atRisk } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .not('last_visit', 'is', null)
      .lt('last_visit', sixtyDaysAgo.toISOString());

    return {
      success: true,
      data: {
        total: total || 0,
        new_this_month: newThisMonth || 0,
        returning: returning || 0,
        at_risk: atRisk || 0,
      },
    };
  } catch (error) {
    console.error('Erro em getClientStatsAction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao calcular estatísticas',
    };
  }
}

