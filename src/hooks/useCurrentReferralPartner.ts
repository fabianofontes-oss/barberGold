'use client';

import { useMemo } from 'react';
import { useBarber } from '@/context/BarberContext';
import { useReferral } from '@/context/ReferralContext';
import { useSaasV2 } from '@/context/SaasV2Context';
import { ReferralPartner } from '@/types';

export const useCurrentReferralPartner = () => {
  const { currentUser } = useBarber();
  const { partners } = useReferral();
  const { currentTenantId } = useSaasV2();

  const partner: ReferralPartner | undefined = useMemo(() => {
    if (!currentUser) return undefined;

    if (currentUser.role === 'OWNER') {
      return partners.find(
        (p) => p.partnerType === 'OWNER' && (currentTenantId ? p.tenantId === currentTenantId : true)
      );
    }

    return partners.find(
      (p) => p.partnerType === 'STAFF' && p.staffId === currentUser.id
    );
  }, [currentUser, partners, currentTenantId]);

  return { partner };
};
