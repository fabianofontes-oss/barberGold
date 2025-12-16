'use client';

import React, { useState } from 'react';
import { SAAS_PLANS_BR } from '@/constants';
import { SaasPlanId } from '@/types';
import { Check, Star, Zap } from 'lucide-react';

export const SuperAdminPlans = () => {
  const [billingMode, setBillingMode] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  const planHighlights: Record<SaasPlanId, string[]> = {
    FREE: [
      'Agenda básica',
      'Cadastro de clientes',
      'Registro de vendas simples',
    ],
    SOLO: [
      '1 barbeiro',
      'Agenda + Fila Inteligente',
      'PDV e catálogo de serviços',
      'Agendamento por link',
      'Site básico da barbearia',
    ],
    SOLO_PRO: [
      '1 barbeiro com modo empresa',
      'Tudo do Solo',
      'Fidelidade e pontos',
      'Mensagens de aniversário e win-back',
      'Financeiro avançado (DRE básico)',
    ],
    EQUIPE: [
      'Até 3 barbeiros',
      'Tudo do Solo PRO',
      'Gestão de comissões e payout',
      'Fechamento de caixa cego',
      'Relatórios por barbeiro',
    ],
    STUDIO: [
      'Até 6 barbeiros e até 2 unidades',
      'Tudo do Equipe',
      'Website Premium + domínio próprio',
      'Relatórios avançados por unidade',
      'Suporte prioritário',
    ],
    ENTERPRISE: [],
  };

  const featuredPlanId: SaasPlanId = 'EQUIPE';

  const visiblePlans = SAAS_PLANS_BR.filter(p =>
    ['SOLO', 'SOLO_PRO', 'EQUIPE', 'STUDIO'].includes(p.id)
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 px-4 py-10 animate-fade-in pb-20">
      <div className="max-w-6xl mx-auto">
        
        {/* Título da Seção */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            Planos BarberFlow <span className="text-amber-500">Brasil</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto">
            Escolha o plano ideal para o tamanho da sua barbearia. Você pode começar pequeno e evoluir depois com apenas um clique.
          </p>
        </div>

        {/* Toggle Mensal / Anual */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center bg-zinc-900 border border-zinc-800 rounded-full p-1 text-xs">
            <button
              onClick={() => setBillingMode('MONTHLY')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                billingMode === 'MONTHLY'
                  ? 'bg-zinc-100 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingMode('YEARLY')}
              className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
                billingMode === 'YEARLY'
                  ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              Anual
              <span className={`text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded ${
                 billingMode === 'YEARLY' ? 'bg-black/20 text-black' : 'bg-emerald-500/20 text-emerald-500'
              }`}>
                2 meses grátis
              </span>
            </button>
          </div>
        </div>

        {/* Grid de Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-start">
          {visiblePlans.map(plan => {
            const isFeatured = plan.id === featuredPlanId;
            const price = billingMode === 'MONTHLY' ? plan.monthlyPriceBRL : plan.yearlyPriceBRL;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 flex flex-col h-full transition-all duration-300 ${
                  isFeatured
                    ? 'bg-gradient-to-b from-zinc-900 to-zinc-950 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.15)] scale-[1.02] z-10'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-zinc-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-amber-500/20">
                    <Star className="w-3 h-3 fill-zinc-950" /> Mais popular
                  </div>
                )}

                <div className="mb-6">
                  <h2 className={`text-lg font-bold flex items-center gap-2 ${isFeatured ? 'text-white' : 'text-zinc-200'}`}>
                    {plan.name}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-2 min-h-[40px] leading-relaxed">
                    {plan.description || (plan.id === 'SOLO' && 'Para barbeiro solo que quer organização e presença online.')}
                    {plan.id === 'SOLO_PRO' && 'Para barbeiro solo que já pensa como empresa e quer crescer.'}
                    {plan.id === 'EQUIPE' && 'Para barbearias com pequena equipe que precisam de gestão séria.'}
                    {plan.id === 'STUDIO' && 'Para barbershops premium com marca forte e mais cadeiras.'}
                  </p>
                </div>

                <div className="mb-6 pb-6 border-b border-zinc-800/50">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white tracking-tight">
                      R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">
                      {billingMode === 'MONTHLY' ? '/mês' : '/ano'}
                    </span>
                  </div>
                  {billingMode === 'YEARLY' ? (
                    <p className="text-[10px] text-emerald-400 mt-1 font-medium">
                      Economize R$ {(plan.monthlyPriceBRL * 12 - plan.yearlyPriceBRL).toFixed(0)} no anual
                    </p>
                  ) : (
                     <p className="text-[10px] text-zinc-600 mt-1">Cobrado mensalmente</p>
                  )}
                  
                  <div className="mt-4 flex items-center gap-2 text-[11px] bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
                     <div className={`w-2 h-2 rounded-full ${plan.maxStaff > 3 ? 'bg-purple-500' : 'bg-zinc-600'}`}></div>
                     <span className="text-zinc-400">
                        Limite: <strong className="text-zinc-200">{plan.maxStaff === 999 ? 'Ilimitado' : plan.maxStaff}</strong> barbeiro(s)
                     </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {planHighlights[plan.id].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px] text-zinc-400 leading-tight">
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${isFeatured ? 'text-amber-500' : 'text-zinc-600'}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => alert(`Plano ${plan.name} selecionado. Fluxo de upgrade em breve.`)}
                  className={`mt-auto w-full text-xs font-bold py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                    isFeatured
                      ? 'bg-amber-500 text-zinc-900 border-amber-500 hover:bg-amber-400 hover:scale-[1.02] shadow-lg shadow-amber-500/10'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white'
                  }`}
                >
                  {isFeatured && <Zap className="w-3 h-3 fill-current" />}
                  Escolher {plan.name}
                </button>
              </div>
            );
          })}
        </div>

        {/* Rodapé Enterprise */}
        <div className="mt-12 text-center bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <p className="text-xs text-zinc-400">
            Precisa de mais de 6 barbeiros ou mais de 2 unidades?{' '}
            <span className="text-amber-500 font-semibold cursor-pointer hover:underline">
              Fale com o time BarberFlow
            </span>{' '}
            para um plano Enterprise sob medida com suporte dedicado e API aberta.
          </p>
        </div>

      </div>
    </div>
  );
};
