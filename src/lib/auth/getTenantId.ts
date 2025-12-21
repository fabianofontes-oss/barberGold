'use server';

import { createClient } from '@/lib/supabase/server';
import { AuthError, type AuthContext } from './types';
import type { ProfileRole } from '@/lib/database.types';

/**
 * Obtém o contexto de autenticação do usuário logado (Server Action)
 * 
 * @throws AuthError se usuário não autenticado ou sem profile
 * @returns AuthContext com userId, profileId, tenantId, role e displayName
 */
export async function getAuthContext(): Promise<AuthContext> {
  const supabase = await createClient();

  // 1. Verifica usuário autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new AuthError('Usuário não autenticado', 'NOT_AUTHENTICATED');
  }

  // 2. Tentar pegar tenant do header (subdomínio) - prioridade
  let tenantIdFromSubdomain: string | null = null;
  try {
    const { headers } = await import('next/headers');
    const headersList = await headers();
    tenantIdFromSubdomain = headersList.get('x-tenant-id');
  } catch {
    // Headers não disponíveis (client-side ou erro) - usar fallback
  }

  // 3. Busca profile do usuário
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, tenant_id, role, name, is_active')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profileError) {
    throw new AuthError(`Erro ao buscar profile: ${profileError.message}`, 'DB_ERROR');
  }

  if (!profile) {
    throw new AuthError('Profile não encontrado para este usuário', 'NO_PROFILE');
  }

  if (!profile.is_active) {
    throw new AuthError('Profile está inativo', 'INACTIVE_PROFILE');
  }

  // 4. Usar tenant do subdomínio se disponível, senão usar do profile
  const finalTenantId = tenantIdFromSubdomain || profile.tenant_id;

  return {
    userId: user.id,
    profileId: profile.id,
    tenantId: finalTenantId,
    role: profile.role as ProfileRole,
    displayName: profile.name,
  };
}

/**
 * Obtém apenas o tenant_id do usuário logado (versão simplificada)
 * 
 * @throws AuthError se usuário não autenticado ou sem profile
 * @returns tenant_id (UUID)
 */
export async function getTenantId(): Promise<string> {
  const ctx = await getAuthContext();
  return ctx.tenantId;
}

/**
 * Versão segura que retorna null em vez de lançar erro
 * Útil para verificações condicionais
 */
export async function getAuthContextSafe(): Promise<AuthContext | null> {
  try {
    return await getAuthContext();
  } catch {
    return null;
  }
}

/**
 * Versão segura do getTenantId
 */
export async function getTenantIdSafe(): Promise<string | null> {
  try {
    return await getTenantId();
  } catch {
    return null;
  }
}
