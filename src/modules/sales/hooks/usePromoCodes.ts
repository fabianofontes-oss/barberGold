'use client';

import { useState, useCallback } from 'react';

export function usePromoCodes() {
  const [loading, setLoading] = useState(false);

  const validateCode = useCallback(async (code: string, subtotal: number) => {
    setLoading(true);
    try {
      // Mock validation - em produção, chamar Server Action
      const PROMO_CODES: Record<string, number> = {
        'BEMVINDO10': 0.10,
        'VOLTA15': 0.15,
        'AMIGO20': 0.20,
      };

      const normalizedCode = code.toUpperCase().trim();
      const discount = PROMO_CODES[normalizedCode];

      if (discount) {
        return {
          valid: true,
          code: normalizedCode,
          discount,
          discountAmount: subtotal * discount,
        };
      }

      return { valid: false, error: 'Cupom inválido' };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    validateCode,
  };
}
