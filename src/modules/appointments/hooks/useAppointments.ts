'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AppointmentWithDetails } from '../types';

/**
 * Hook client-side para buscar appointments do tenant
 */
export function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const supabase = createClient();
        
        // 1. Verificar sessÃ£o
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setAppointments([]);
          setLoading(false);
          return;
        }

        // 2. Buscar tenant_id do profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('tenant_id')
          .eq('user_id', session.user.id)
          .single();

        if (!profile?.tenant_id) {
          setAppointments([]);
          setLoading(false);
          return;
        }

        // 3. Buscar appointments com dados relacionados
        const { data, error: apptError } = await supabase
          .from('appointments')
          .select(`
            *,
            clients!inner(name),
            profiles!inner(name),
            services!inner(name)
          `)
          .eq('tenant_id', profile.tenant_id)
          .order('scheduled_at', { ascending: true });

        if (apptError) {
          console.error('Erro ao buscar appointments:', apptError);
          setError(apptError.message);
          setAppointments([]);
          setLoading(false);
          return;
        }

        const mappedAppointments: AppointmentWithDetails[] = (data || []).map(appt => ({
          ...appt,
          client_name: appt.clients?.name,
          staff_name: appt.profiles?.name,
          service_name: appt.services?.name,
        }));

        setAppointments(mappedAppointments);
        setLoading(false);
      } catch (err: any) {
        console.error('Erro ao carregar appointments:', err);
        setError(err.message);
        setAppointments([]);
        setLoading(false);
      }
    }

    loadAppointments();
  }, []);

  return { appointments, loading, error };
}
