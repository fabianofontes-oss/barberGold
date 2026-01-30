'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isDemoMode } from '@/lib/env';
import type { StaffMember, CompensationModel } from '@/types';

interface CurrentUserState {
  currentUser: StaffMember | null;
  isAuthenticated: boolean;
  loading: boolean;
  tenantId: string | null;
  logout: () => Promise<void>;
}

export function useCurrentUser(): CurrentUserState {
  const [currentUser, setCurrentUser] = useState<StaffMember | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      // DEMO MODE BYPASS
      if (isDemoMode()) {
        setCurrentUser({
          id: 'demo-profile-id',
          name: 'Demo User',
          role: 'OWNER',
          email: 'demo@barber.com',
          phone: '1234567890',
          commissionModel: 'PERCENTAGE',
          serviceCommissionRate: 50,
          productCommissionRate: 50,
          rentalFee: 0,
          paymentFrequency: 'WEEKLY',
          workSchedule: [],
        });
        setIsAuthenticated(true);
        setTenantId('demo-tenant-id');
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .single();

        if (!profile) {
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        const mappedUser: StaffMember = {
          id: profile.id,
          name: profile.name,
          role: profile.role,
          email: profile.email || '',
          phone: profile.phone || '',
          commissionModel: (profile.commission_model || 'PERCENTAGE') as CompensationModel,
          serviceCommissionRate: Number(profile.commission_rate) || 50,
          productCommissionRate: Number(profile.commission_rate) || 50,
          rentalFee: 0,
          paymentFrequency: 'WEEKLY',
          workSchedule: profile.work_schedule || [],
        };

        setCurrentUser(mappedUser);
        setIsAuthenticated(true);
        setTenantId(profile.tenant_id);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar usuario:', error);
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const logout = async () => {
    if (isDemoMode()) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        window.location.href = '/login';
        return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return { currentUser, isAuthenticated, loading, tenantId, logout };
}
