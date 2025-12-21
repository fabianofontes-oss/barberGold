'use client';

import { useState, useEffect } from 'react';
import { useExpenses } from '@/modules/expenses/hooks/useExpenses';
import { useSales } from '@/modules/sales/hooks/useSales';
import { listStaffAction } from '@/modules/staff/actions';
import { getAuthContext } from '@/lib/auth/getTenantId';
import { startOfMonth, endOfMonth } from 'date-fns';

export function useFinanceData() {
  const today = new Date();
  const start = startOfMonth(today).toISOString();
  const end = endOfMonth(today).toISOString();

  const expensesHook = useExpenses({ startDate: start, endDate: end });
  const salesHook = useSales({ startDate: start, endDate: end });

  const [additionalData, setAdditionalData] = useState<any>({
    staff: [],
    staffPayments: [],
    currentUser: null,
    shopSettings: {},
    currentTenantPlanId: 'FREE',
    loading: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [auth, staffData] = await Promise.all([
          getAuthContext(),
          listStaffAction({ isActive: true }),
        ]);

        setAdditionalData({
          staff: staffData,
          staffPayments: [],
          currentUser: {
            id: auth.profileId,
            name: auth.displayName,
            role: auth.role,
          },
          shopSettings: {
            enableCashControl: false,
            discountAllocation: 'SHARED',
          },
          currentTenantPlanId: 'EQUIPE',
          loading: false,
        });
      } catch (error) {
        console.error('Erro ao carregar dados finance:', error);
        setAdditionalData((prev: any) => ({ ...prev, loading: false }));
      }
    }

    loadData();
  }, []);

  return {
    ...expensesHook,
    sales: salesHook.sales,
    ...additionalData,
  };
}
