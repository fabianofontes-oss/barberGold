'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  listClientDependentsAction,
  createClientDependentAction,
  deleteClientDependentAction,
} from '../actions';

export function useClientDependents(clientId: string | null) {
  const [dependents, setDependents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDependents = useCallback(async () => {
    if (!clientId) {
      setDependents([]);
      return;
    }
    
    setLoading(true);
    try {
      const data = await listClientDependentsAction(clientId);
      setDependents(data || []);
    } catch (error) {
      console.error('Erro ao carregar dependentes:', error);
      setDependents([]);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    loadDependents();
  }, [loadDependents]);

  const addDependent = useCallback(async (data: { name: string; relationship?: string; preferredStaffId?: string }) => {
    if (!clientId) return;
    
    try {
      await createClientDependentAction(clientId, data);
      await loadDependents();
    } catch (error) {
      console.error('Erro ao adicionar dependente:', error);
    }
  }, [clientId, loadDependents]);

  const deleteDependent = useCallback(async (dependentId: string) => {
    try {
      await deleteClientDependentAction(dependentId);
      await loadDependents();
    } catch (error) {
      console.error('Erro ao deletar dependente:', error);
    }
  }, [loadDependents]);

  return {
    dependents,
    loading,
    addDependent,
    deleteDependent,
    reload: loadDependents,
  };
}
