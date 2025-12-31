'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface SaleData {
  id: string;
  created_at: string;
  tenant_id: string;
  client_id: string | null;
  staff_id: string;
  total: number;
  payment_method: string;
  tip: number;
  discount: number;
  notes?: string;
}

export function useSales() {
  const [sales, setSales] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSales() {
      try {
        const supabase = createClient();
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setSales([]);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('tenant_id')
          .eq('user_id', session.user.id)
          .single();

        if (!profile?.tenant_id) {
          setSales([]);
          setLoading(false);
          return;
        }

        const { data, error: salesError } = await supabase
          .from('sales')
          .select('*')
          .eq('tenant_id', profile.tenant_id)
          .order('created_at', { ascending: false });

        if (salesError) {
          console.error('Erro ao buscar sales:', salesError);
          setError(salesError.message);
          setSales([]);
          setLoading(false);
          return;
        }

        setSales(data || []);
        setLoading(false);
      } catch (err: any) {
        console.error('Erro ao carregar sales:', err);
        setError(err.message);
        setSales([]);
        setLoading(false);
      }
    }

    loadSales();
  }, []);

  return { sales, loading, error };
}
