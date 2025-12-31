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

export function useClientStats(clientId?: string) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!clientId) {
        setLoading(false);
        return;
      }
      
      try {
        const result = await getClientStats(clientId);
        if (result.success) {
          setStats(result.data);
          setError(null);
        } else {
          setError(result.error || 'Erro ao carregar estatÃ­sticas');
        }
      } catch (err) {
        setError('Erro ao carregar estatÃ­sticas');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [clientId]);

  return { stats, loading, error };
}
