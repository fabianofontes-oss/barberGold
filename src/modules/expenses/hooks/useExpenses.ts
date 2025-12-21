'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  listExpensesAction,
  createExpenseAction,
  deleteExpenseAction,
} from '../actions';

export function useExpenses(params?: { startDate?: string; endDate?: string }) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listExpensesAction({
        startDate: params?.startDate,
        endDate: params?.endDate,
      });
      setExpenses(data || []);
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [params?.startDate, params?.endDate]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const createExpense = useCallback(async (data: any) => {
    await createExpenseAction(data);
    await loadExpenses();
  }, [loadExpenses]);

  const deleteExpense = useCallback(async (id: string) => {
    await deleteExpenseAction(id);
    await loadExpenses();
  }, [loadExpenses]);

  return {
    expenses,
    loading,
    createExpense,
    deleteExpense,
    reload: loadExpenses,
  };
}
