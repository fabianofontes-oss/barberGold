'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ServiceData {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
  category?: string;
  is_active: boolean;
}

export function useServices() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const supabase = createClient();
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setServices([]);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('tenant_id')
          .eq('user_id', session.user.id)
          .single();

        if (!profile?.tenant_id) {
          setServices([]);
          setLoading(false);
          return;
        }

        const { data, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('tenant_id', profile.tenant_id)
          .eq('is_active', true)
          .order('name', { ascending: true });

        if (servicesError) {
          console.error('Erro ao buscar services:', servicesError);
          setError(servicesError.message);
          setServices([]);
          setLoading(false);
          return;
        }

        setServices(data || []);
        setLoading(false);
      } catch (err: any) {
        console.error('Erro ao carregar services:', err);
        setError(err.message);
        setServices([]);
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  return { services, loading, error };
}
