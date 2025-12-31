'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface StaffData {
  id: string;
  user_id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  avatar_url: string | null;
  service_commission_rate: number;
  product_commission_rate: number;
  created_at: string;
}

export function useStaff() {
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStaff() {
      try {
        const supabase = createClient();
        
        // Obter sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setLoading(false);
          return;
        }

        // Obter tenant_id do usuário
        const { data: profile } = await supabase
          .from('profiles')
          .select('tenant_id')
          .eq('user_id', session.user.id)
          .single();

        if (!profile?.tenant_id) {
          setLoading(false);
          return;
        }

        // Buscar todos os membros do staff do mesmo tenant
        const { data, error: staffError } = await supabase
          .from('profiles')
          .select('*')
          .eq('tenant_id', profile.tenant_id)
          .order('name');

        if (staffError) {
          console.error('Erro ao carregar staff:', staffError);
          setError(staffError.message);
        } else {
          setStaff(data || []);
          console.log('✅ Staff carregado do Supabase:', data?.length || 0);
        }
      } catch (err) {
        console.error('Erro ao carregar staff:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    loadStaff();
  }, []);

  return { staff, loading, error };
}
