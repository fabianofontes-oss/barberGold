'use client';

import React from 'react';
import { useSaasV2 } from '@/context/SaasV2Context';
import { SaasPlanId } from '@/types';

interface TenantsListV2Props {
  tenants: any[];
  onSelectTenant: (tenantId: string) => void;
}

export const TenantsListV2: React.FC<TenantsListV2Props> = ({
  tenants,
  onSelectTenant,
}) => {
  const { plans, updateTenant } = useSaasV2();

  if (!tenants || tenants.length === 0) {
    return (
      <div className="p-4 text-sm text-zinc-400">
        Nenhuma barbearia cadastrada ainda.
      </div>
    );
  }

  const handlePlanChange = (tenantId: string, planId: SaasPlanId) => {
     updateTenant(tenantId, { planId });
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-zinc-50">
            Lojas cadastradas
          </h1>
          <p className="text-xs text-zinc-400">
            Visão geral das barbearias conectadas ao BarberFlow.
          </p>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-[11px] text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-2 pr-4 text-zinc-500 font-medium">Loja</th>
              <th className="py-2 pr-4 text-zinc-500 font-medium">Dono</th>
              <th className="py-2 pr-4 text-zinc-500 font-medium">Plano Oficial</th>
              <th className="py-2 pr-4 text-zinc-500 font-medium">MRR</th>
              <th className="py-2 pr-4 text-zinc-500 font-medium">Status</th>
              <th className="py-2 pr-4 text-zinc-500 font-medium text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => {
               const currentPlan = plans.find(p => p.id === tenant.planId);
               return (
              <tr
                key={tenant.id}
                className="border-b border-zinc-900 hover:bg-zinc-900/60"
              >
                <td className="py-2 pr-4">
                  <div className="flex flex-col">
                    <span className="text-[12px] text-zinc-50 font-medium">
                      {tenant.shopName}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {tenant.country} • Desde{' '}
                      {tenant.createdAt?.toLocaleDateString?.() ?? ''}
                    </span>
                  </div>
                </td>
                <td className="py-2 pr-4 text-zinc-300">
                  {tenant.ownerName}
                </td>
                <td className="py-2 pr-4">
                   <select 
                      value={tenant.planId} 
                      onChange={(e) => handlePlanChange(tenant.id, e.target.value as SaasPlanId)}
                      className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-white text-[10px] focus:border-violet-500 outline-none"
                   >
                      {plans.map(p => (
                         <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                   </select>
                </td>
                <td className="py-2 pr-4 text-zinc-300 font-mono">
                   R$ {tenant.mrr}
                </td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      {
                        TRIAL: 'text-sky-400',
                        ACTIVE: 'text-emerald-400',
                        OVERDUE: 'text-amber-400',
                        SUSPENDED: 'text-red-400',
                      }[tenant.status as string]
                    }
                  >
                    {tenant.status}
                  </span>
                </td>
                <td className="py-2 pr-4 text-right">
                  <button
                    onClick={() => onSelectTenant(tenant.id)}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg border border-zinc-700 text-[11px] text-zinc-100 hover:border-amber-500 hover:text-amber-400 transition-colors"
                  >
                    Ver detalhes
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};
