import { createClient } from '@/lib/supabase/server';

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
 * ObtÃ©m o perfil do usuÃ¡rio logado (server-side)
 * 
 * Fluxo:
 * 1. Verifica sessÃ£o Supabase
 * 2. Busca profile vinculado ao user_id
 * 3. Retorna dados do usuÃ¡rio + tenant + role
 * 
 * @returns CurrentProfileResult ou null se nÃ£o autenticado
 */
export async function getCurrentProfile(): Promise<CurrentProfileResult | null> {
  const supabase = await createClient();

  // 1. Verifica usuÃ¡rio autenticado
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  // 2. Busca profile do usuÃ¡rio
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (profileError) {
    // Profile nÃ£o existe - usuÃ¡rio precisa ser configurado
    console.warn('Profile nÃ£o encontrado para user:', user.id);
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
    displayName: profile.name, // Campo correto Ã© 'name', nÃ£o 'display_name'
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
 * Verifica se o usuÃ¡rio estÃ¡ autenticado (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

/**
 * Verifica se o usuÃ¡rio tem um profile configurado
 */
export async function hasProfile(): Promise<boolean> {
  const result = await getCurrentProfile();
  return result?.profile !== null;
}
