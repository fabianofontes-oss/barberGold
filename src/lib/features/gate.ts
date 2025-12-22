/**
 * Feature Gate System
 * 
 * Verifica se o tenant atual tem permissão para usar uma feature
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentTenantId } from '@/lib/tenant/getCurrentTenant'
import { getPlanLimits, planHasFeature, isWithinLimit, type PlanSlug } from './limits'

export interface FeatureCheckResult {
  allowed: boolean
  reason?: string
  currentUsage?: number
  limit?: number | null
  planSlug?: PlanSlug
}

/**
 * Verifica se uma feature booleana está disponível
 */
export async function checkFeature(
  featureName: keyof ReturnType<typeof getPlanLimits>['features']
): Promise<FeatureCheckResult> {
  try {
    const tenantId = await getCurrentTenantId()
    const supabase = await createClient()
    
    // Buscar tenant e seu plano
    const { data: tenant, error } = await supabase
      .from('tenants')
      .select('plan_id, status')
      .eq('id', tenantId)
      .single()
    
    if (error || !tenant) {
      return {
        allowed: false,
        reason: 'Tenant não encontrado',
      }
    }
    
    // Se tenant está suspenso ou cancelado, bloquear tudo
    if (tenant.status === 'suspended' || tenant.status === 'cancelled') {
      return {
        allowed: false,
        reason: 'Conta suspensa. Regularize seu pagamento para continuar.',
      }
    }
    
    // Determinar plan_slug (default: free)
    const planSlug = (tenant.plan_id || 'free') as PlanSlug
    const limits = getPlanLimits(planSlug)
    
    const hasFeature = limits.features[featureName]
    
    if (!hasFeature) {
      return {
        allowed: false,
        reason: `Esta funcionalidade requer upgrade de plano`,
        planSlug,
      }
    }
    
    return {
      allowed: true,
      planSlug,
    }
    
  } catch (error: any) {
    console.error('[Feature Gate] checkFeature error:', error)
    return {
      allowed: false,
      reason: 'Erro ao verificar permissão',
    }
  }
}

/**
 * Verifica limite de quantidade (ex: staff, appointments)
 */
export async function checkLimit(
  limitType: 'staff' | 'appointments_month' | 'clients' | 'products' | 'services' | 'locations',
  currentUsage?: number
): Promise<FeatureCheckResult> {
  try {
    const tenantId = await getCurrentTenantId()
    const supabase = await createClient()
    
    // Buscar tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('plan_id, status')
      .eq('id', tenantId)
      .single()
    
    if (tenantError || !tenant) {
      return {
        allowed: false,
        reason: 'Tenant não encontrado',
      }
    }
    
    // Se tenant está suspenso, bloquear
    if (tenant.status === 'suspended' || tenant.status === 'cancelled') {
      return {
        allowed: false,
        reason: 'Conta suspensa',
      }
    }
    
    const planSlug = (tenant.plan_id || 'free') as PlanSlug
    const limits = getPlanLimits(planSlug)
    
    // Mapear tipo para o campo correto em limits
    let limit: number | null = null
    let usage = currentUsage || 0
    
    switch (limitType) {
      case 'staff':
        limit = limits.max_staff
        if (currentUsage === undefined) {
          const { count } = await supabase
            .from('staff')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId)
          usage = count || 0
        }
        break
      
      case 'appointments_month':
        limit = limits.max_appointments_per_month
        if (currentUsage === undefined) {
          const startOfMonth = new Date()
          startOfMonth.setDate(1)
          startOfMonth.setHours(0, 0, 0, 0)
          
          const { count } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId)
            .gte('created_at', startOfMonth.toISOString())
          usage = count || 0
        }
        break
      
      case 'clients':
        limit = limits.max_clients
        if (currentUsage === undefined) {
          const { count } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId)
          usage = count || 0
        }
        break
      
      case 'products':
        limit = limits.max_products
        if (currentUsage === undefined) {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId)
          usage = count || 0
        }
        break
      
      case 'services':
        limit = limits.max_services
        if (currentUsage === undefined) {
          const { count } = await supabase
            .from('services')
            .select('*', { count: 'exact', head: true })
            .eq('tenant_id', tenantId)
          usage = count || 0
        }
        break
      
      case 'locations':
        limit = limits.max_locations
        if (currentUsage === undefined) {
          // Assumir 1 location por enquanto (feature futura)
          usage = 1
        }
        break
    }
    
    const allowed = isWithinLimit(usage, limit)
    
    if (!allowed) {
      return {
        allowed: false,
        reason: limit === null 
          ? 'Limite ilimitado atingido' 
          : `Limite atingido: ${usage}/${limit}`,
        currentUsage: usage,
        limit,
        planSlug,
      }
    }
    
    return {
      allowed: true,
      currentUsage: usage,
      limit,
      planSlug,
    }
    
  } catch (error: any) {
    console.error('[Feature Gate] checkLimit error:', error)
    return {
      allowed: false,
      reason: 'Erro ao verificar limite',
    }
  }
}

/**
 * Helper: Verificar se pode criar staff
 */
export async function canCreateStaff(): Promise<FeatureCheckResult> {
  return checkLimit('staff')
}

/**
 * Helper: Verificar se pode criar appointment
 */
export async function canCreateAppointment(): Promise<FeatureCheckResult> {
  return checkLimit('appointments_month')
}

/**
 * Helper: Verificar se pode criar client
 */
export async function canCreateClient(): Promise<FeatureCheckResult> {
  return checkLimit('clients')
}

/**
 * Helper: Verificar se pode usar comissões
 */
export async function canUseCommissions(): Promise<FeatureCheckResult> {
  return checkFeature('commissions')
}

/**
 * Helper: Verificar se pode usar agendamento online
 */
export async function canUseOnlineBooking(): Promise<FeatureCheckResult> {
  return checkFeature('online_booking')
}

/**
 * Helper: Verificar se pode usar programa de fidelidade
 */
export async function canUseLoyalty(): Promise<FeatureCheckResult> {
  return checkFeature('loyalty_program')
}

/**
 * Formato padronizado de erro para retornar em Server Actions
 */
export function createFeatureBlockedError(result: FeatureCheckResult) {
  return {
    success: false,
    error: result.reason || 'Funcionalidade não disponível no seu plano',
    code: 'FEATURE_BLOCKED',
    meta: {
      currentUsage: result.currentUsage,
      limit: result.limit,
      planSlug: result.planSlug,
    },
  }
}

