'use server'

import { createClient } from '@/lib/supabase/server'
import { validateSubdomain } from '@/lib/tenant/reserved-subdomains'
import { getTenantBySlug, isSlugTaken, createTenant } from './repository'

/**
 * Verifica disponibilidade de um slug
 */
export async function checkSlugAvailability(slug: string) {
  try {
    // Validar formato
    const validation = validateSubdomain(slug)
    if (!validation.valid) {
      return { 
        available: false, 
        error: validation.error 
      }
    }
    
    // Verificar se já existe
    const supabase = await createClient()
    const taken = await isSlugTaken(supabase, slug)
    
    if (taken) {
      return { 
        available: false, 
        error: 'Este nome já está em uso' 
      }
    }
    
    return { available: true }
  } catch (error: any) {
    return { 
      available: false, 
      error: 'Erro ao verificar disponibilidade' 
    }
  }
}

/**
 * Registra novo tenant (barbearia)
 */
export async function registerTenantAction(input: {
  slug: string
  name: string
  email: string
  password: string
  ownerName: string
}) {
  try {
    const supabase = await createClient()
    
    // 1. Validar slug
    const validation = validateSubdomain(input.slug)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }
    
    // 2. Verificar disponibilidade
    const taken = await isSlugTaken(supabase, input.slug)
    if (taken) {
      return { success: false, error: 'Este nome já está em uso' }
    }
    
    // 3. Criar usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          name: input.ownerName,
        }
      }
    })
    
    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Erro ao criar usuário')
    }
    
    // 4. Criar tenant
    const { tenant, error: tenantError } = await createTenant(supabase, {
      slug: input.slug.toLowerCase(),
      name: input.name,
      owner_id: authData.user.id,
      status: 'TRIAL',
      plan_id: 'FREE',
      settings: {},
    })
    
    if (tenantError || !tenant) {
      // Tentar deletar usuário criado se tenant falhou
      // Nota: Em produção, isso requer privilégios de admin
      console.error('Erro ao criar tenant:', tenantError)
      throw new Error(tenantError || 'Erro ao criar barbearia')
    }
    
    // 5. Criar profile do owner
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        tenant_id: tenant.id,
        user_id: authData.user.id,
        name: input.ownerName,
        email: input.email,
        role: 'OWNER',
        is_active: true,
      })
    
    if (profileError) {
      console.error('Erro ao criar profile:', profileError)
      // Não falhamos aqui, profile pode ser criado depois
    }
    
    return { 
      success: true, 
      data: {
        slug: tenant.slug,
        tenantId: tenant.id,
        userId: authData.user.id,
      }
    }
  } catch (error: any) {
    console.error('Register tenant error:', error)
    return { 
      success: false, 
      error: error.message || 'Erro ao criar conta' 
    }
  }
}

/**
 * Busca tenant pelo slug (para middleware)
 */
export async function getTenantBySlugAction(slug: string) {
  try {
    const supabase = await createClient()
    const tenant = await getTenantBySlug(supabase, slug)
    
    if (!tenant) {
      return { success: false, error: 'Barbearia não encontrada' }
    }
    
    return { success: true, data: tenant }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

