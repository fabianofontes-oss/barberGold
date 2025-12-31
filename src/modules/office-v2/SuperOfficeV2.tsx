'use client';

import React, { useState } from 'react';
import { useSaasV2 } from '@/context/SaasV2Context';
import { useBarber } from '@/context/BarberContext';
import { TenantsListV2 } from './TenantsListV2';
import { TenantDetailsV2 } from './TenantDetailsV2';
import { PlansV2 } from './PlansV2';

type OfficeV2View = 'TENANTS' | 'TENANT_DETAILS' | 'PLANS';

export const SuperOfficeV2: React.FC = () => {
  const [activeView, setActiveView] = useState<OfficeV2View>('TENANTS');
  const { tenants, setCurrentTenantId, getCurrentTenant } = useSaasV2();
  const { impersonateTenant } = useBarber();

  const selectedTenant = getCurrentTenant();

  const handleSelectTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
    setActiveView('TENANT_DETAILS');
  };

  const handleBackToList = () => {
    setActiveView('TENANTS');
  };

  const handleImpersonate = (tenantId: string) => {
    impersonateTenant(tenantId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-950 via-zinc-950 to-zinc-950 text-zinc-50">
      <header className="border-b border-violet-900/60 bg-gradient-to-r from-violet-950/80 to-zinc-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-violet-100 tracking-wide uppercase">
              BarberFlow HQ
            </h1>
            <p className="text-[11px] text-zinc-400">
              Office God V2 â€¢ Painel de controle das barbearias.
            </p>
          </div>
          <div className="text-[11px] text-zinc-400">
            Tenants: <span className="text-zinc-100 font-semibold">{tenants.length}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4 md:py-6">
        <div className="mb-4 flex gap-2 text-[11px] border-b border-zinc-800">
          <button
            onClick={() => setActiveView('TENANTS')}
            className={`px-3 py-2 border-b-2 ${
              activeView === 'TENANTS'
                ? 'border-violet-400 text-violet-200'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Lojas
          </button>
          {selectedTenant && (
            <button
              onClick={() => setActiveView('TENANT_DETAILS')}
              className={`px-3 py-2 border-b-2 ${
                activeView === 'TENANT_DETAILS'
                  ? 'border-violet-400 text-violet-200'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Detalhes da loja
            </button>
          )}
          <button
            onClick={() => setActiveView('PLANS')}
            className={`px-3 py-2 border-b-2 ${
              activeView === 'PLANS'
                ? 'border-violet-400 text-violet-200'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Planos
          </button>
        </div>

        <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4 md:p-5 shadow-xl">
          {activeView === 'TENANTS' && (
            <TenantsListV2 tenants={tenants} onSelectTenant={handleSelectTenant} />
          )}

          {activeView === 'TENANT_DETAILS' && (
            <TenantDetailsV2 
              tenant={selectedTenant} 
              onBack={handleBackToList} 
              onImpersonate={handleImpersonate}
            />
          )}

          {activeView === 'PLANS' && <PlansV2 />}
        </div>
      </main>
    </div>
  );
};
