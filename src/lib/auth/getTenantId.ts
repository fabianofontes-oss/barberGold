'use server';

import { createClient } from '@/lib/supabase/server';
import type { ProfileRole } from '@/lib/database.types';

export type AuthContext = {
  userId: string;
  profileId: string;
  tenantId: string;
  role: ProfileRole;
  displayName: string;
};

export class AuthError extends Error {
  constructor(
    message: string,
    public code: 'NOT_AUTHENTICATED' | 'NO_PROFILE' | 'INACTIVE_PROFILE' | 'DB_ERROR'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

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

  // 2. Busca profile do usuário
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

  return {
    userId: user.id,
    profileId: profile.id,
    tenantId: profile.tenant_id,
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
