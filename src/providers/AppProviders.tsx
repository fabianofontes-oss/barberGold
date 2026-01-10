'use client';

import { SaasV2Provider } from '@/context/SaasV2Context';
import { ReferralProvider } from '@/context/ReferralContext';
import { AppProvider } from '@/context/AppContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SaasV2Provider>
      <AppProvider>
        <ReferralProvider>
          {children}
        </ReferralProvider>
      </AppProvider>
    </SaasV2Provider>
  );
}
