'use client';

import React, { useMemo, useState } from 'react';
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

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'TRIAL' | 'ACTIVE' | 'OVERDUE' | 'SUSPENDED'>('ALL');
  const [planFilter, setPlanFilter] = useState<'ALL' | SaasPlanId>('ALL');
  const [query, setQuery] = useState('');

  const filteredTenants = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = tenants || [];
    return list.filter((t) => {
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      if (planFilter !== 'ALL' && t.planId !== planFilter) return false;
      if (!q) return true;
      return (
        String(t.shopName ?? '').toLowerCase().includes(q) ||
        String(t.ownerName ?? '').toLowerCase().includes(q) ||
        String(t.id ?? '').toLowerCase().includes(q)
      );
    });
  }, [planFilter, query, statusFilter, tenants]);

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
            VisÃ£o geral das barbearias conectadas ao BarberFlow.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por loja, dono ou ID"
          className="md:col-span-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-violet-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="md:col-span-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-violet-500"
        >
          <option value="ALL">Status: Todos</option>
          <option value="TRIAL">Trial</option>
          <option value="ACTIVE">Active</option>
          <option value="OVERDUE">Overdue</option>
          <option value="SUSPENDED">Suspended</option>
        </select>

        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value as any)}
          className="md:col-span-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-violet-500"
        >
          <option value="ALL">Plano: Todos</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="text-[10px] text-zinc-500">
        Exibindo <span className="text-zinc-200 font-semibold">{filteredTenants.length}</span> de{' '}
        <span className="text-zinc-200 font-semibold">{tenants.length}</span>
      </div>

      {/* Mobile: cards */}
      <div className="sm:hidden space-y-3">
        {filteredTenants.map((tenant) => (
          <div key={tenant.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[12px] text-zinc-50 font-semibold truncate">{tenant.shopName}</p>
                <p className="text-[10px] text-zinc-500 truncate">{tenant.ownerName}</p>
                <p className="text-[10px] text-zinc-600 font-mono truncate">{tenant.id}</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full border bg-zinc-900 ${{
                    TRIAL: 'text-sky-400 border-sky-400/20',
                    ACTIVE: 'text-emerald-400 border-emerald-400/20',
                    OVERDUE: 'text-amber-400 border-amber-400/20',
                    SUSPENDED: 'text-red-400 border-red-400/20',
                  }[tenant.status as string]
                  }`}
              >
                {tenant.status}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 items-center">
              <select
                value={tenant.planId}
                onChange={(e) => handlePlanChange(tenant.id, e.target.value as SaasPlanId)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-2 text-[11px] text-white focus:border-violet-500 outline-none"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => onSelectTenant(tenant.id)}
                className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-zinc-700 text-[11px] text-zinc-100 hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                Ver detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: tabela */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full text-[11px] text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-2 pr-4 text-zinc-500 font-medium">Loja</th>
              <th className="py-2 pr-4 text-zinc-500 font-medium">Dono</th>
              <th className="py-2 pr-4 text-zinc-500 font-medium">Plano Oficial</th>
              <th className="py-2 pr-4 text-zinc-500 font-medium">MRR</th>
              <th className="py-2 pr-4 text-zinc-500 font-medium">Status</th>
              <th className="py-2 pr-4 text-zinc-500 font-medium text-right">
                AÃ§Ãµes
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map((tenant) => {
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
                        {tenant.country} â€¢ Desde{' '}
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
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
