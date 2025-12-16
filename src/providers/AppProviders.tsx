'use client';

import { SaasV2Provider } from '@/context/SaasV2Context';
import { ReferralProvider } from '@/context/ReferralContext';
import { BarberProvider } from '@/context/BarberContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SaasV2Provider>
      <ReferralProvider>
        <BarberProvider>
          {children}
        </BarberProvider>
      </ReferralProvider>
    </SaasV2Provider>
  );
}
