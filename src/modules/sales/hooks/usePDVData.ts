'use client';

import { useState, useEffect } from 'react';
import { useClients } from '@/modules/clients/hooks/useClients';
import { useSales } from './useSales';
import { listServicesAction } from '@/modules/services/actions';
import { listProductsAction } from '@/modules/products/actions';
import { listStaffAction } from '@/modules/staff/actions';
import { getTenantAction } from '@/modules/tenant/actions';

export function usePDVData() {
  const clientsHook = useClients();
  const salesHook = useSales();
  
  const [additionalData, setAdditionalData] = useState<any>({
    services: [],
    products: [],
    staff: [],
    shopSettings: {},
    loading: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesData, productsData, staffData, tenantData] = await Promise.all([
          listServicesAction({ isActive: true }),
          listProductsAction({ isActive: true }),
          listStaffAction({ isActive: true }),
          getTenantAction(),
        ]);

        setAdditionalData({
          services: servicesData,
          products: productsData,
          staff: staffData,
          shopSettings: {
            paymentSettings: {
              inStore: ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX'],
            },
            enableLoyaltyCard: true,
          },
          loading: false,
        });
      } catch (error) {
        console.error('Erro ao carregar dados PDV:', error);
        setAdditionalData((prev: any) => ({ ...prev, loading: false }));
      }
    }

    loadData();
  }, []);

  return {
    ...clientsHook,
    ...salesHook,
    ...additionalData,
  };
}
