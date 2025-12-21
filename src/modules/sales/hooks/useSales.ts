'use client';

import { useState, useEffect, useCallback } from 'react';
import { listSalesAction, createSaleAction } from '../actions';
import type { MappedSale } from '../repository';
import type { CreateSaleInput } from '../types';

type SalesLoadState = {
  sales: MappedSale[];
  isLoading: boolean;
  error: string | null;
};

export function useSales(params?: { startDate?: string; endDate?: string }) {
  const [state, setState] = useState<SalesLoadState>({
    sales: [],
    isLoading: true,
    error: null,
  });

  const reload = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await listSalesAction({
        startDate: params?.startDate,
        endDate: params?.endDate,
      });
      setState({ sales: data, isLoading: false, error: null });
    } catch (err) {
      setState({ sales: [], isLoading: false, error: String(err) });
    }
  }, [params?.startDate, params?.endDate]);

  useEffect(() => {
    reload();
  }, [reload]);

  const createSale = useCallback(
    async (input: CreateSaleInput) => {
      const result = await createSaleAction(input);
      await reload();
      return result.id;
    },
    [reload]
  );

  return {
    sales: state.sales,
    isLoading: state.isLoading,
    error: state.error,
    reload,
    createSale,
  };
}
