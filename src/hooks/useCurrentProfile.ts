'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type UserProfile = {
  id: string;
  userId: string;
  tenantId: string;
  role: 'OWNER' | 'ADMIN' | 'BARBER' | 'ASSISTANT' | 'STAFF' | 'SUPER_ADMIN';
  name: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
};

/**
 * Hook client-side para buscar profile do usuário logado
 * Substitui uso de mocks no BarberContext
 */
export function useCurrentProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();

        // 1. Verificar sessão
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setProfile(null);
          setLoading(false);
          return;
        }

        // 2. Buscar profile do usuário
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .single();

        if (profileError) {
          console.error('Erro ao buscar profile:', profileError);
          setError(profileError.message);
          setProfile(null);
          setLoading(false);
          return;
        }

        // 3. Mapear dados
        const mappedProfile: UserProfile = {
          id: profileData.id,
          userId: profileData.user_id,
          tenantId: profileData.tenant_id,
          role: profileData.role as UserProfile['role'],
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          isActive: profileData.is_active,
        };

        setProfile(mappedProfile);
        setLoading(false);
      } catch (err: any) {
        console.error('Erro ao carregar profile:', err);
        setError(err.message);
        setProfile(null);
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  return { profile, loading, error };
}
