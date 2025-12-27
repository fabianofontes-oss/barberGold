'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInventory() {
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

        const { data, error: inventoryError } = await supabase
          .from('inventory')
          .select('*')
          .eq('tenant_id', profile.tenant_id)
          .order('name');

        if (inventoryError) {
          console.error('Erro ao carregar inventory:', inventoryError);
          setError(inventoryError.message);
        } else {
          setInventory(data || []);
          console.log('✅ Inventory carregado do Supabase:', data?.length || 0);
        }
      } catch (err) {
        console.error('Erro ao carregar inventory:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    loadInventory();
  }, []);

  return { inventory, loading, error };
}
