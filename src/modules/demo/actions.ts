/**
 * Server Actions para Dados de Exemplo
 */

'use server'

import { getCurrentProfile } from '@/lib/auth/getCurrentProfile'
import { getCurrentTenantId } from '@/lib/tenant/getCurrentTenant'
import { seedDemoData, hasDemoData } from '@/lib/demo/seed-data'
import { revalidatePath } from 'next/cache'

export type SeedResult = {
  success: boolean
  error?: string
  alreadyHasData?: boolean
}

/**
 * Popula conta com dados de exemplo
 */
export async function seedDemoDataAction(): Promise<SeedResult> {
  try {
    const profile = await getCurrentProfile()
    
    if (!profile || !profile.userId || !profile.tenantId) {
      return {
        success: false,
        error: 'Usuário não autenticado',
      }
    }
    
    // Verificar se já tem dados
    const hasData = await hasDemoData(profile.tenantId)
    
    if (hasData) {
      return {
        success: false,
        alreadyHasData: true,
        error: 'Sua conta já possui dados. Não é possível adicionar dados de exemplo.',
      }
    }
    
    // Popular dados
    const result = await seedDemoData(profile.tenantId, profile.userId)
    
    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Erro ao popular dados',
      }
    }
    
    // Revalidar páginas
    revalidatePath('/app/clients')
    revalidatePath('/app/agenda')
    revalidatePath('/app/pdv')
    revalidatePath('/app/dashboard')
    
    return { success: true }
    
  } catch (error: any) {
    console.error('[seedDemoDataAction] Error:', error)
    return {
      success: false,
      error: error.message || 'Erro ao popular dados',
    }
  }
}

/**
 * Verifica se conta já tem dados
 */
export async function checkHasDemoDataAction(): Promise<{ hasData: boolean }> {
  try {
    const tenantId = await getCurrentTenantId()
    const hasData = await hasDemoData(tenantId)
    
    return { hasData }
    
  } catch {
    return { hasData: false }
  }
}

