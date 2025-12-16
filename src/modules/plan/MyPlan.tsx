'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { Check, Crown, Users, Calendar, DollarSign, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { PLANS_BR } from '@/domain/plans/plans';
import { FEATURE_LABELS, FEATURE_ORDER, PLAN_FEATURES } from '@/domain/plans/features';
import type { BillingInterval, PlanId } from '@/domain/plans/types';

export const MyPlan = () => {
  const { currentTenantPlanId } = useBarber();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('ANNUAL');

  const currentPlan = (currentTenantPlanId || 'FREE') as PlanId;
  const plans = PLANS_BR.filter((p) => p.id !== 'ENTERPRISE');

  const getDisplayPrice = (planId: PlanId) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return { label: '—', sub: '' };
    if (plan.monthlyPriceBRL === 0) return { label: 'Grátis', sub: '' };

    if (billingInterval === 'MONTHLY') {
      return { label: `R$ ${plan.monthlyPriceBRL}`, sub: '/mês' };
    }

    const monthlyEquivalent = (plan.annualPriceBRL / 10).toFixed(0);
    const annualTotal = plan.annualPriceBRL.toFixed(0);
    return { label: `R$ ${annualTotal}`, sub: `10x de R$ ${monthlyEquivalent} (2 meses grátis)` };
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
         <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
               <Crown className="w-8 h-8 text-amber-500" /> Meu Plano
            </h1>
            <p className="text-zinc-400 text-sm max-w-2xl">
               Gerencie sua assinatura e veja os recursos disponíveis para seu plano atual.
            </p>
         </div>
         
         <div className="flex flex-col items-end gap-2">
            <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
               <button 
                  onClick={() => setBillingInterval('MONTHLY')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${billingInterval === 'MONTHLY' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                  Mensal
               </button>
               <button 
                  onClick={() => setBillingInterval('ANNUAL')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${billingInterval === 'ANNUAL' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                  Anual <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">2 meses grátis</span>
               </button>
            </div>
            <p className="text-[10px] text-zinc-500">Anual = 10x o valor mensal (economia de 2 meses)</p>
         </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
         <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
               <ShieldCheck className="w-8 h-8 text-amber-500" />
            </div>
            <div>
               <h2 className="text-xl font-bold text-white">Plano Atual: {plans.find(p => p.id === currentPlan)?.name || currentPlan}</h2>
               <p className="text-zinc-400 text-sm">Sua assinatura está ativa e funcionando normalmente.</p>
            </div>
         </div>
         <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-zinc-400"><Calendar className="w-4 h-4" /> Renovação: 15/01/2025</div>
            <div className="flex items-center gap-2 text-emerald-500"><DollarSign className="w-4 h-4" /> Em dia</div>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
         {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const isHighlight = plan.id === 'EQUIPE';
            const price = getDisplayPrice(plan.id);
            const featureKeys = PLAN_FEATURES[plan.id] || [];
            return (
               <div 
                  key={plan.id} 
                  className={`relative rounded-2xl p-6 transition-all ${
                     isHighlight 
                        ? 'bg-gradient-to-b from-amber-950/50 to-zinc-900 border-2 border-amber-500/50 shadow-xl shadow-amber-500/10' 
                        : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700'
                  }`}
               >
                  {isHighlight && (
                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-zinc-900 text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                        Recomendado
                     </div>
                  )}
                  
                  <div className="mb-6">
                     <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                     <p className="text-zinc-500 text-sm">Plano {plan.id}</p>
                  </div>
                  
                  <div className="mb-6">
                     <span className="text-3xl font-bold text-white">{price.label}</span>
                     {price.sub && <span className="text-zinc-500 text-xs block mt-1">{price.sub}</span>}
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                     {FEATURE_ORDER.map((k) => {
                        const hasFeature = featureKeys.includes(k);
                        return (
                           <li key={k} className={`flex items-center gap-2 text-sm ${hasFeature ? 'text-zinc-300' : 'text-zinc-600 line-through'}`}>
                              {hasFeature ? (
                                 <Check className={`w-4 h-4 flex-shrink-0 ${isHighlight ? 'text-amber-500' : 'text-emerald-500'}`} />
                              ) : (
                                 <Lock className="w-4 h-4 flex-shrink-0 text-zinc-700" />
                              )}
                              <span className="text-xs">{FEATURE_LABELS[k]}</span>
                           </li>
                        );
                     })}
                  </ul>
                  
                  <button 
                     disabled={isCurrent}
                     className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        isCurrent 
                           ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                           : isHighlight 
                              ? 'bg-amber-500 hover:bg-amber-400 text-zinc-900' 
                              : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                     }`}
                  >
                     {isCurrent ? 'Plano Atual' : <>Escolher Plano <ArrowRight className="w-4 h-4" /></>}
                  </button>
               </div>
            );
         })}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
         <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" /> Uso do Plano
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
               <span className="text-xs text-zinc-500 block mb-1">Profissionais</span>
               <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-white">3</span>
                  <span className="text-zinc-500 text-sm">/ 5</span>
               </div>
               <div className="h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }}></div>
               </div>
            </div>
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
               <span className="text-xs text-zinc-500 block mb-1">Clientes Cadastrados</span>
               <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-white">247</span>
                  <span className="text-zinc-500 text-sm">/ ∞</span>
               </div>
               <div className="h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }}></div>
               </div>
            </div>
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
               <span className="text-xs text-zinc-500 block mb-1">Agendamentos/mês</span>
               <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-white">312</span>
                  <span className="text-zinc-500 text-sm">/ ∞</span>
               </div>
               <div className="h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '35%' }}></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
