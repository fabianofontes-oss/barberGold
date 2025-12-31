'use client';

import React from 'react';
import { useSaasV2 } from '@/context/SaasV2Context';
import { SaasV2FeatureKey, SaasV2PlanId } from '@/types';

const featureLabels: Record<SaasV2FeatureKey, string> = {
  ONLINE_BOOKING: 'Agendamento Online',
  LOYALTY: 'Fidelidade & Pontos',
  ADVANCED_REPORTS: 'RelatÃ³rios AvanÃ§ados',
  MULTI_SHOP: 'Multi-unidade',
  WEBSITE_PREMIUM: 'Website Premium',
};

const ALL_FEATURES: SaasV2FeatureKey[] = [
  'ONLINE_BOOKING',
  'LOYALTY',
  'ADVANCED_REPORTS',
  'MULTI_SHOP',
  'WEBSITE_PREMIUM',
];

export const PlansV2: React.FC = () => {
  const { plans, updatePlan } = useSaasV2();

  const handlePriceChange = (
    planId: string,
    field: 'monthlyPriceBRL' | 'yearlyPriceBRL',
    value: string,
  ) => {
    const numeric = Number(value.replace(',', '.')) || 0;
    updatePlan(planId as any, { [field]: numeric });
  };

  const handleToggleActive = (planId: string, current: boolean | undefined) => {
    updatePlan(planId as any, { isActive: !current });
  };

  const handleToggleFeature = (planId: SaasV2PlanId, feature: SaasV2FeatureKey) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    const currentFlags = plan.featureFlags;
    const nextFlags = { ...currentFlags, [feature]: !currentFlags[feature] };

    updatePlan(planId, { featureFlags: nextFlags });
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg md:text-xl font-semibold text-zinc-50">
          Planos do BarberFlow
        </h1>
        <p className="text-xs text-zinc-400">
          Defina preÃ§os e quais recursos cada plano desbloqueia.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-[11px] text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="py-2 pr-4 text-zinc-500 font-medium">Plano</th>
              <th className="py-2 pr-4 text-zinc-500 font-medium">Mensal</th>
              <th className="py-2 pr-4 text-zinc-500 font-medium">Anual</th>
              <th className="py-2 pr-4 text-zinc-500 font-medium">Status</th>
              <th className="py-2 pr-4 text-zinc-500 font-medium">Features</th>
            </tr>
          </thead>
          <tbody>
            {plans
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((plan) => (
                <tr key={plan.id} className="border-b border-zinc-900">
                  <td className="py-2 pr-4">
                    <div className="flex flex-col">
                      <span className="text-[12px] text-zinc-50 font-semibold">
                        {plan.name}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {plan.description}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="text"
                      defaultValue={plan.monthlyPriceBRL.toString()}
                      onBlur={(e) =>
                        handlePriceChange(plan.id, 'monthlyPriceBRL', e.target.value)
                      }
                      className="w-20 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] text-zinc-100 focus:border-amber-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="text"
                      defaultValue={plan.yearlyPriceBRL.toString()}
                      onBlur={(e) =>
                        handlePriceChange(plan.id, 'yearlyPriceBRL', e.target.value)
                      }
                      className="w-20 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] text-zinc-100 focus:border-amber-500 focus:outline-none"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <button
                      onClick={() => handleToggleActive(plan.id, plan.isActive)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border ${
                        plan.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                          : 'bg-zinc-900 text-zinc-500 border-zinc-700'
                      }`}
                    >
                      {plan.isActive ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap gap-1 max-w-sm">
                      {ALL_FEATURES.map((featureKey) => {
                        const isEnabled = plan.featureFlags[featureKey];
                        return (
                          <button
                            key={featureKey}
                            type="button"
                            onClick={() => handleToggleFeature(plan.id, featureKey)}
                            className={`px-2 py-0.5 rounded-full border text-[9px] transition-colors ${
                              isEnabled
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/20'
                                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600'
                            }`}
                          >
                            {featureLabels[featureKey]}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
