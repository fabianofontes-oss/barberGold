'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  listClientsAction,
  createClientAction,
  updateClientAction,
  deleteClientAction,
} from '../actions';
import type { MappedClient } from '../repository';
import type { CreateClientInput, UpdateClientInput } from '../types';

type ClientsLoadState = {
  clients: MappedClient[];
  isLoading: boolean;
  error: string | null;
};

export function useClients(params?: { search?: string }) {
  const [state, setState] = useState<ClientsLoadState>({
    clients: [],
    isLoading: true,
    error: null,
  });

  const reload = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await listClientsAction({ search: params?.search, isActive: true });
      setState({ clients: data, isLoading: false, error: null });
    } catch (err) {
      setState({ clients: [], isLoading: false, error: String(err) });
    }
  }, [params?.search]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addClient = useCallback(
    async (input: CreateClientInput) => {
      const result = await createClientAction(input);
      await reload();
      return result.id;
    },
    [reload]
  );

  const updateClient = useCallback(
    async (input: UpdateClientInput) => {
      await updateClientAction(input);
      await reload();
    },
    [reload]
  );

  const removeClient = useCallback(
    async (clientId: string) => {
      await deleteClientAction(clientId);
      await reload();
    },
    [reload]
  );

  return {
    clients: state.clients,
    isLoading: state.isLoading,
    error: state.error,
    reload,
    addClient,
    updateClient,
    removeClient,
  };
}
