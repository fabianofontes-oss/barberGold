'use client';

import React from 'react';
import { useSaasV2 } from '@/context/SaasV2Context';
import { SaasV2Tenant, SaasV2PlanId, SaasV2BillingInterval, SaasV2SizeTier } from '@/types';
import { getSuggestedMonthlyPriceForTenantBR } from '@/utils/pricing';

interface TenantDetailsV2Props {
  tenant: SaasV2Tenant | undefined;
  onBack: () => void;
  onImpersonate: (tenantId: string) => void;
}

const sizeTierLabels: Record<SaasV2SizeTier, string> = {
  SOLO: '1 barbeiro (Solo)',
  UP_TO_3: 'AtÃ© 3 barbeiros',
  UP_TO_6: 'De 3 a 6 barbeiros',
  PLUS_6: 'Mais de 6 barbeiros',
};

export const TenantDetailsV2: React.FC<TenantDetailsV2Props> = ({
  tenant,
  onBack,
  onImpersonate,
}) => {
  const { plans, updateTenant } = useSaasV2();

  if (!tenant) {
    return (
      <div className="p-4 text-sm text-zinc-400">
        Nenhuma barbearia selecionada.
      </div>
    );
  }

  const suggestedPriceBR = getSuggestedMonthlyPriceForTenantBR(tenant);

  const handleChangePlan = (planId: SaasV2PlanId) => {
    updateTenant(tenant.id, { planId });
  };

  const handleChangeBillingInterval = (interval: SaasV2BillingInterval) => {
    updateTenant(tenant.id, { billingInterval: interval });
  };

  const handleMarkPaidToday = () => {
    const today = new Date();
    updateTenant(tenant.id, {
      lastPaymentDate: today,
      status: 'ACTIVE',
      overdueDays: 0,
      nextDueDate: today, // SimplificaÃ§Ã£o para demo
    });
  };

  const handleMarkOverdue = () => {
    updateTenant(tenant.id, {
      status: 'OVERDUE',
      overdueDays: tenant.overdueDays && tenant.overdueDays > 0 ? tenant.overdueDays : 5,
    });
  };

  const handleSuspend = () => {
    updateTenant(tenant.id, {
      status: 'SUSPENDED',
    });
  };

  const statusColorMap: Record<SaasV2Tenant['status'], string> = {
    TRIAL: 'text-sky-400',
    ACTIVE: 'text-emerald-400',
    OVERDUE: 'text-amber-400',
    SUSPENDED: 'text-red-400',
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="text-[11px] text-zinc-400 hover:text-zinc-200"
      >
        â† Voltar para lista
      </button>

      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-zinc-50">
            {tenant.shopName}
          </h1>
          <p className="text-xs text-zinc-400">
            Dono: {tenant.ownerName} â€¢ Criado em{' '}
            {tenant.createdAt.toLocaleDateString?.() ?? ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 font-semibold">
            Plano: {tenant.planId}
          </span>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full bg-zinc-900 border border-zinc-800 ${statusColorMap[tenant.status]}`}
          >
            Status: {tenant.status}
          </span>
          <button
            onClick={() => onImpersonate(tenant.id)}
            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-[11px] font-semibold text-white transition-colors"
          >
            Acessar painel da barbearia
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px]">
        {/* Bloco 1: Dados de cobranÃ§a */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
          <h2 className="text-sm font-semibold text-zinc-100 mb-1">
            CobranÃ§a & Assinatura
          </h2>
          <p className="text-zinc-400">
            MRR: <span className="text-zinc-100 font-semibold">R$ {tenant.mrr}</span>
          </p>
          <p className="text-zinc-400">
            Dia de cobranÃ§a: <span className="text-zinc-100">{tenant.billingDay}</span>
          </p>
          <p className="text-zinc-400">
            Ãšltimo pagamento:{' '}
            <span className="text-zinc-100">
              {tenant.lastPaymentDate?.toLocaleDateString?.() ?? 'â€”'}
            </span>
          </p>
          <p className="text-zinc-400">
            PrÃ³ximo vencimento:{' '}
            <span className="text-zinc-100">
              {tenant.nextDueDate?.toLocaleDateString?.() ?? 'â€”'}
            </span>
          </p>
          {typeof tenant.overdueDays === 'number' && tenant.overdueDays > 0 && (
            <p className="text-xs text-amber-400">
              Em atraso hÃ¡ {tenant.overdueDays} dia(s).
            </p>
          )}
        </section>

        {/* Bloco 2: RegiÃ£o & idioma */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
          <h2 className="text-sm font-semibold text-zinc-100 mb-1">
            RegiÃ£o & Idioma
          </h2>
          <p className="text-zinc-400">
            PaÃ­s: <span className="text-zinc-100">{tenant.country}</span>
          </p>
          <p className="text-zinc-400">
            Idioma padrÃ£o:{' '}
            <span className="text-zinc-100">{tenant.defaultLanguage}</span>
          </p>
          <p className="text-zinc-400">
            Moeda padrÃ£o:{' '}
            <span className="text-zinc-100">{tenant.defaultCurrency}</span>
          </p>
        </section>

        {/* Bloco 3: Plano & cobranÃ§a */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
          <h2 className="text-sm font-semibold text-zinc-100 mb-2">
            Plano & cobranÃ§a
          </h2>

          {/* Plano */}
          <div className="space-y-1">
            <span className="text-zinc-400">Plano atual</span>
            <select
              value={tenant.planId}
              onChange={(e) => handleChangePlan(e.target.value as SaasV2PlanId)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-[11px] text-zinc-100 focus:border-violet-500 focus:outline-none"
            >
              {plans
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} (R$ {plan.monthlyPriceBRL}/mÃªs)
                  </option>
                ))}
            </select>
          </div>

          {/* Faixa de tamanho da barbearia */}
          <div className="space-y-1">
            <span className="text-zinc-400">Tamanho da barbearia</span>
            <select
              value={tenant.sizeTier}
              onChange={(e) =>
                updateTenant(tenant.id, { sizeTier: e.target.value as SaasV2SizeTier })
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-[11px] text-zinc-100 focus:border-violet-500 focus:outline-none"
            >
              <option value="SOLO">{sizeTierLabels.SOLO}</option>
              <option value="UP_TO_3">{sizeTierLabels.UP_TO_3}</option>
              <option value="UP_TO_6">{sizeTierLabels.UP_TO_6}</option>
              <option value="PLUS_6">{sizeTierLabels.PLUS_6}</option>
            </select>
          </div>

          {/* Intervalo de cobranÃ§a */}
          <div className="space-y-1">
            <span className="text-zinc-400">Intervalo de cobranÃ§a</span>
            <select
              value={tenant.billingInterval || 'MONTHLY'}
              onChange={(e) =>
                handleChangeBillingInterval(e.target.value as SaasV2BillingInterval)
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-[11px] text-zinc-100 focus:border-violet-500 focus:outline-none"
            >
              <option value="MONTHLY">Mensal</option>
              <option value="ANNUAL">Anual</option>
            </select>
          </div>

          {/* PreÃ§o Sugerido Brasil */}
          {tenant.country === 'BR' && (
            <div className="mt-3 p-2.5 rounded-lg border border-zinc-800 bg-zinc-950">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wide text-zinc-500">
                    PreÃ§o sugerido (Brasil â€“ mensal)
                  </span>
                  <span className="text-sm font-semibold text-zinc-100">
                    {suggestedPriceBR != null
                      ? `R$ ${suggestedPriceBR.toFixed(0)},00`
                      : 'â€” definir manualmente'}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={suggestedPriceBR == null}
                  onClick={() => {
                    if (suggestedPriceBR != null) {
                      updateTenant(tenant.id, { mrr: suggestedPriceBR });
                    }
                  }}
                  className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-emerald-500 text-zinc-900 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Aplicar no MRR
                </button>
              </div>
              <p className="mt-1 text-[10px] text-zinc-500">
                Valores base recomendados para o mercado brasileiro. VocÃª pode ajustar o MRR manualmente acima, se der desconto ou condiÃ§Ãµes especiais.
              </p>
            </div>
          )}

          {/* AÃ§Ãµes rÃ¡pidas */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleMarkPaidToday}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1.5 rounded-lg text-[11px] transition-colors"
            >
              Marcar pagamento hoje
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleMarkOverdue}
                className="flex-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 font-semibold py-1.5 rounded-lg text-[10px] transition-colors"
              >
                Marcar em atraso
              </button>
              <button
                type="button"
                onClick={handleSuspend}
                className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 font-semibold py-1.5 rounded-lg text-[10px] transition-colors"
              >
                Suspender conta
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Notas internas */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <h2 className="text-sm font-semibold text-zinc-100 mb-2">
          Notas internas
        </h2>
        <p className="text-[11px] text-zinc-300 whitespace-pre-line">
          {tenant.notesInternal || 'Nenhuma anotaÃ§Ã£o interna cadastrada.'}
        </p>
      </section>
    </div>
  );
};
