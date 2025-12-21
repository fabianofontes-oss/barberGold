'use client';

import { useState, useCallback } from 'react';

export function useLoyalty() {
  const [loading, setLoading] = useState(false);

  const getPoints = useCallback(async (clientId: string) => {
    // Em produção, buscar do Supabase (clients.loyalty_points)
    return 0;
  }, []);

  const addPoints = useCallback(async (clientId: string, points: number) => {
    // Em produção, atualizar no Supabase
    console.log('Adicionando pontos:', clientId, points);
  }, []);

  const redeemPoints = useCallback(async (clientId: string, points: number) => {
    // Em produção, decrementar pontos no Supabase
    console.log('Resgatando pontos:', clientId, points);
    return true;
  }, []);

  return {
    loading,
    getPoints,
    addPoints,
    redeemPoints,
  };
}
