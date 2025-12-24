import { useState, useEffect } from 'react';
import { ClientWithStats } from '../types';
import { getClients, getClientStats } from '../actions';

export function useClients(filters?: { search?: string; tags?: string[] }) {
  const [clients, setClients] = useState<ClientWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      try {
        const result = await getClients(filters);
        if (result.success) {
          setClients(result.data || []);
          setError(null);
        } else {
          setError(result.error || 'Erro ao carregar clientes');
        }
      } catch (err) {
        setError('Erro ao carregar clientes');
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, [filters?.search, filters?.tags?.join(',')]);

  const refetch = async () => {
    setLoading(true);
    try {
      const result = await getClients(filters);
      if (result.success) {
        setClients(result.data || []);
        setError(null);
      } else {
        setError(result.error || 'Erro ao carregar clientes');
      }
    } catch (err) {
      setError('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  return { clients, loading, error, refetch };
}

export function useClientStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getClientStats();
        if (result.success) {
          setStats(result.data);
          setError(null);
        } else {
          setError(result.error || 'Erro ao carregar estatísticas');
        }
      } catch (err) {
        setError('Erro ao carregar estatísticas');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}
