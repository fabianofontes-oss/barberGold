import { createClient } from '@/lib/supabase/server';
import { isDemoMode } from '@/lib/env';

export type UserProfile = {
  id: string;
  userId: string;
  tenantId: string;
  role: 'OWNER' | 'ADMIN' | 'BARBER' | 'ASSISTANT' | 'STAFF' | 'SUPER_ADMIN';
  displayName: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
};

export type CurrentProfileResult = {
  user: {
    id: string;
    email: string | undefined;
  };
  profile: UserProfile | null;
  tenantId: string | null;
  role: UserProfile['role'] | null;
};

/**
 * Obtém o perfil do usuário logado (server-side)
 * 
 * Fluxo:
 * 1. Verifica sessão Supabase
 * 2. Busca profile vinculado ao user_id
 * 3. Retorna dados do usuário + tenant + role
 * 
 * @returns CurrentProfileResult ou null se não autenticado
 */
export async function getCurrentProfile(): Promise<CurrentProfileResult | null> {
  // DEMO MODE BYPASS
  if (isDemoMode()) {
    return {
      user: {
        id: 'demo-user-id',
        email: 'demo@barber.com',
      },
      profile: {
        id: 'demo-profile-id',
        userId: 'demo-user-id',
        tenantId: 'demo-tenant-id',
        role: 'OWNER',
        displayName: 'Demo User',
        email: 'demo@barber.com',
        phone: '1234567890',
        isActive: true,
      },
      tenantId: 'demo-tenant-id',
      role: 'OWNER',
    };
  }

  const supabase = await createClient();

  // 1. Verifica usuário autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  // 2. Busca profile do usuário
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (profileError) {
    // Profile não existe - usuário precisa ser configurado
    console.warn('Profile não encontrado para user:', user.id);
    return {
      user: {
        id: user.id,
        email: user.email,
      },
      profile: null,
      tenantId: null,
      role: null,
    };
  }

  // 3. Mapeia dados do profile
  const mappedProfile: UserProfile = {
    id: profile.id,
    userId: profile.user_id,
    tenantId: profile.tenant_id,
    role: profile.role as UserProfile['role'],
    displayName: profile.name, // Campo correto é 'name', não 'display_name'
    email: profile.email,
    phone: profile.phone,
    isActive: profile.is_active,
  };

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile: mappedProfile,
    tenantId: profile.tenant_id,
    role: profile.role as UserProfile['role'],
  };
}

/**
 * Verifica se o usuário está autenticado (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  if (isDemoMode()) return true;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

/**
 * Verifica se o usuário tem um profile configurado
 */
export async function hasProfile(): Promise<boolean> {
  const result = await getCurrentProfile();
  return result?.profile !== null;
}
