'use client';

import { useState, useEffect, useCallback } from 'react';
import { useClients } from './useClients';
import { listServicesAction } from '@/modules/services/actions';
import { listProductsAction } from '@/modules/products/actions';
import { listStaffAction } from '@/modules/staff/actions';
import { getAgendaBootstrapAction } from '@/modules/agenda/actions';
import { getTenantAction } from '@/modules/tenant/actions';
import { getAuthContext } from '@/lib/auth/getTenantId';

export function useClientsData() {
  const clientsHook = useClients();
  
  const [additionalData, setAdditionalData] = useState<any>({
    appointments: [],
    staff: [],
    services: [],
    products: [],
    shopProfile: null,
    shopSettings: {},
    currentUser: null,
    loading: true,
  });

  const loadAdditionalData = useCallback(async () => {
    try {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const [auth, servicesData, productsData, staffData, agendaData, tenantData] = await Promise.all([
        getAuthContext(),
        listServicesAction({ isActive: true }),
        listProductsAction({ isActive: true }),
        listStaffAction({ isActive: true }),
        getAgendaBootstrapAction({ start, end }),
        getTenantAction(),
      ]);

      setAdditionalData({
        appointments: agendaData.appointments,
        staff: staffData,
        services: servicesData,
        products: productsData,
        shopProfile: {
          name: tenantData?.name || '',
          slug: tenantData?.slug || '',
          logo: tenantData?.logoUrl || '',
          address: tenantData?.address || '',
          phone: tenantData?.phone || '',
        },
        shopSettings: {
          hideClientContactInfo: false,
        },
        currentUser: {
          id: auth.profileId,
          name: auth.displayName,
          role: auth.role,
        },
        loading: false,
      });
    } catch (error) {
      console.error('Erro ao carregar dados adicionais:', error);
      setAdditionalData((prev: any) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    loadAdditionalData();
  }, [loadAdditionalData]);

  return {
    ...clientsHook,
    ...additionalData,
    reload: async () => {
      await clientsHook.reload();
      await loadAdditionalData();
    },
  };
}
