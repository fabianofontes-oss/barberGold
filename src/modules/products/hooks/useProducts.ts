'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ProductData {
  id: string;
  name: string;
  price: number;
  cost_price: number;
  stock: number;
  category?: string;
  image_url?: string;
  is_active: boolean;
}

export function useProducts() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const supabase = createClient();
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('tenant_id')
          .eq('user_id', session.user.id)
          .single();

        if (!profile?.tenant_id) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const { data, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('tenant_id', profile.tenant_id)
          .eq('is_active', true)
          .order('name', { ascending: true });

        if (productsError) {
          console.error('Erro ao buscar products:', productsError);
          setError(productsError.message);
          setProducts([]);
          setLoading(false);
          return;
        }

        setProducts(data || []);
        setLoading(false);
      } catch (err: any) {
        console.error('Erro ao carregar products:', err);
        setError(err.message);
        setProducts([]);
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return { products, loading, error };
}
