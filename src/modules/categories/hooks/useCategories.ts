'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
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

        const { data, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('tenant_id', profile.tenant_id)
          .order('name');

        if (categoriesError) {
          console.error('Erro ao carregar categories:', categoriesError);
          setError(categoriesError.message);
        } else {
          setCategories(data || []);
          console.log('✅ Categories carregadas do Supabase:', data?.length || 0);
        }
      } catch (err) {
        console.error('Erro ao carregar categories:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return { categories, loading, error };
}
