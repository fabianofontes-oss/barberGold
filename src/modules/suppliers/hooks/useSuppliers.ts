'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSuppliers() {
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

        const { data, error: suppliersError } = await supabase
          .from('suppliers')
          .select('*')
          .eq('tenant_id', profile.tenant_id)
          .order('name');

        if (suppliersError) {
          console.error('Erro ao carregar suppliers:', suppliersError);
          setError(suppliersError.message);
        } else {
          setSuppliers(data || []);
          console.log('✅ Suppliers carregados do Supabase:', data?.length || 0);
        }
      } catch (err) {
        console.error('Erro ao carregar suppliers:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    loadSuppliers();
  }, []);

  return { suppliers, loading, error };
}
