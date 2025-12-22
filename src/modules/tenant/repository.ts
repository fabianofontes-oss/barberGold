import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

export type Tenant = Database['public']['Tables']['tenants']['Row']
export type TenantInsert = Database['public']['Tables']['tenants']['Insert']

// Tipo genérico para evitar problemas de inferência
type SupabaseAny = SupabaseClient<any, any, any>

/**
 * Busca tenant pelo slug (subdomain)
 */
export async function getTenantBySlug(
  supabase: SupabaseAny,
  slug: string
): Promise<Tenant | null> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug.toLowerCase())
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data
}

/**
 * Verifica se slug já está em uso
 */
export async function isSlugTaken(
  supabase: SupabaseAny,
  slug: string
): Promise<boolean> {
  const { data } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', slug.toLowerCase())
    .single()
  
  return data !== null
}

/**
 * Cria novo tenant
 */
export async function createTenant(
  supabase: SupabaseAny,
  input: any
): Promise<{ tenant: Tenant | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .insert(input)
      .select()
      .single()
    
    if (error) throw error
    
    return { tenant: data, error: null }
  } catch (error: any) {
    return { tenant: null, error: error.message }
  }
}

