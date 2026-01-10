'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ShopProfile } from '@/types';

const DEFAULT_OPERATING_HOURS = Array.from({ length: 7 }, (_, i) => ({
  dayIndex: i,
  isActive: i !== 0,
  startTime: '09:00',
  endTime: i === 6 ? '14:00' : '20:00',
  breaks: [] as any[],
}));

const DEFAULT_PROFILE: ShopProfile = {
  name: 'Minha Barbearia',
  slug: 'minha-barbearia',
  logo: '',
  address: '',
  phone: '',
  whatsapp: '',
  instagram: '',
  operatingHours: DEFAULT_OPERATING_HOURS,
};

interface UseShopProfileReturn {
  shopProfile: ShopProfile;
  loading: boolean;
  updateShopProfile: (profile: ShopProfile) => Promise<void>;
}

export function useShopProfile(): UseShopProfileReturn {
  const [shopProfile, setShopProfile] = useState<ShopProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('tenant_id')
          .eq('user_id', session.user.id)
          .single();

        if (!profile?.tenant_id) {
          setLoading(false);
          return;
        }

        const { data: tenant } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', profile.tenant_id)
          .single();

        if (tenant) {
          let operatingHours = DEFAULT_OPERATING_HOURS;
          if (tenant.settings && typeof tenant.settings === 'object') {
            const settings = tenant.settings as Record<string, unknown>;
            if (settings.operatingHours && Array.isArray(settings.operatingHours)) {
              operatingHours = settings.operatingHours;
            }
          }

          setShopProfile({
            name: tenant.name,
            slug: tenant.slug,
            logo: tenant.logo_url || '',
            address: tenant.address || '',
            phone: tenant.phone || '',
            whatsapp: tenant.whatsapp || '',
            instagram: tenant.instagram || '',
            operatingHours,
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar perfil da loja:', error);
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const updateShopProfile = useCallback(async (profile: ShopProfile) => {
    setShopProfile(profile);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) return;

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('user_id', session.user.id)
        .single();

      if (!userProfile?.tenant_id) return;

      await supabase
        .from('tenants')
        .update({
          name: profile.name,
          slug: profile.slug,
          logo_url: profile.logo,
          address: profile.address,
          phone: profile.phone,
          whatsapp: profile.whatsapp,
          instagram: profile.instagram,
          settings: { operatingHours: profile.operatingHours },
        })
        .eq('id', userProfile.tenant_id);

      console.log('Perfil da loja atualizado');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  }, []);

  return { shopProfile, loading, updateShopProfile };
}
