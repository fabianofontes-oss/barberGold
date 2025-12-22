/**
 * Helper centralizado para obter tenant_id do usuário atual
 * 
 * Usado em TODOS os Server Actions e Repositories para garantir
 * isolamento de dados entre tenants (multi-tenancy)
 */

import { getCurrentProfile } from '@/lib/auth/getCurrentProfile';

/**
 * Obtém o tenant_id do usuário logado
 * 
 * @throws Error se usuário não está associado a nenhum tenant
 * @returns tenant_id (UUID)
 */
export async function getCurrentTenantId(): Promise<string> {
  const profile = await getCurrentProfile();
  
  if (!profile?.tenantId) {
    throw new Error('Usuário não está associado a nenhum tenant');
  }
  
  return profile.tenantId;
}

/**
 * Versão segura que retorna null em vez de throw
 * 
 * Útil para casos onde o tenant é opcional
 * 
 * @returns tenant_id ou null
 */
export async function getTenantIdSafe(): Promise<string | null> {
  try {
    return await getCurrentTenantId();
  } catch {
    return null;
  }
}

/**
 * Valida se um recurso pertence ao tenant do usuário atual
 * 
 * Usado em UPDATE/DELETE para prevenir acesso cross-tenant
 * 
 * @param resourceTenantId - tenant_id do recurso
 * @returns true se pertence ao tenant atual
 */
export async function validateTenantAccess(resourceTenantId: string): Promise<boolean> {
  try {
    const currentTenantId = await getCurrentTenantId();
    return currentTenantId === resourceTenantId;
  } catch {
    return false;
  }
}

