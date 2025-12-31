'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useCommissionPlans() {
  const [commissionPlans, setCommissionPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCommissionPlans() {
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

        const { data, error: plansError } = await supabase
          .from('commission_plans')
          .select('*')
          .eq('tenant_id', profile.tenant_id)
          .order('name');

        if (plansError) {
          console.error('Erro ao carregar commission plans:', plansError);
          setError(plansError.message);
        } else {
          setCommissionPlans(data || []);
          console.log('âœ… Commission Plans carregados do Supabase:', data?.length || 0);
        }
      } catch (err) {
        console.error('Erro ao carregar commission plans:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    loadCommissionPlans();
  }, []);

  return { commissionPlans, loading, error };
}
