'use client';


import React from 'react';
import { Check, ArrowRight, Crown, Star } from 'lucide-react';
import { SaasPlan, SaasPlanId } from '@/types';
import { SAAS_PLANS_BR } from '@/constants';

interface PlanSummaryCardProps {
  currentPlanId: SaasPlanId;
}

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
  ENTERPRISE: [
    'Barbeiros ilimitados',
    'Múltiplas unidades',
    'API Aberta',
    'Gerente de contas dedicado'
  ],
};

const planOrder: SaasPlanId[] = ['FREE', 'SOLO', 'SOLO_PRO', 'EQUIPE', 'STUDIO', 'ENTERPRISE'];

export const PlanSummaryCard: React.FC<PlanSummaryCardProps> = ({ currentPlanId }) => {
  const plansById = Object.fromEntries(
    SAAS_PLANS_BR.map(p => [p.id, p] as const)
  ) as Record<SaasPlanId, SaasPlan>;

  const currentPlan = plansById[currentPlanId];
  const currentIndex = planOrder.indexOf(currentPlanId);
  const nextPlanId = currentIndex >= 0 && currentIndex < planOrder.length - 1
    ? planOrder[currentIndex + 1]
    : undefined;
  
  // If next plan is Enterprise, we handle it slightly differently visually or just show it
  const nextPlan = nextPlanId ? plansById[nextPlanId] : undefined;

  if (!currentPlan) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-zinc-50 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-amber-500/10 transition-all duration-1000"></div>

      <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-1 flex items-center gap-1">
             <Crown className="w-3 h-3 text-amber-500" /> Assinatura Ativa
          </p>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Plano {currentPlan.name}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm">
            {currentPlan.description || 'O plano ideal para o momento do seu negócio.'}
          </p>
        </div>
        <div className="text-right bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">
          <div className="text-[10px] text-zinc-500 uppercase font-bold">Investimento</div>
          <div className="text-2xl font-bold text-white">
            {currentPlan.monthlyPriceBRL === 0 ? 'Grátis' : `R$ ${currentPlan.monthlyPriceBRL}`}
          </div>
          {currentPlan.monthlyPriceBRL > 0 && <div className="text-[10px] text-zinc-500">/mês</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Benefícios do plano atual */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            Seus recursos liberados:
          </p>
          <ul className="space-y-2">
            {(planHighlights[currentPlan.id] || []).map(item => (
              <li key={item} className="flex items-start gap-2 text-xs text-zinc-300">
                <div className="mt-0.5 min-w-[16px]">
                   <Check className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Próximo plano (se existir) */}
        {nextPlan ? (
          <div className="border border-amber-500/20 rounded-xl p-4 bg-gradient-to-br from-zinc-900 to-amber-950/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
               <Star className="w-16 h-16 text-amber-500" />
            </div>
            
            <div className="relative z-10">
               <div className="flex justify-between items-center mb-2">
                  <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                    Próximo Nível: {nextPlan.name}
                  </p>
                  <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">
                     Recomendado
                  </span>
               </div>
               
               <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">
                 Por apenas mais <span className="font-bold text-white">R$ {(nextPlan.monthlyPriceBRL - currentPlan.monthlyPriceBRL).toFixed(0)}</span>/mês, você desbloqueia:
               </p>
               
               <ul className="space-y-1.5 mb-4">
                 {(planHighlights[nextPlan.id] || []).slice(0, 3).map(item => (
                   <li key={item} className="flex items-start gap-2 text-xs text-zinc-200">
                     <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                     <span>{item}</span>
                   </li>
                 ))}
                 {(planHighlights[nextPlan.id] || []).length > 3 && (
                    <li className="text-[10px] text-zinc-500 pl-3.5">+ e muito mais</li>
                 )}
               </ul>
               
               <button
                 type="button"
                 onClick={() => alert('Em breve: fluxo de upgrade automático!')}
                 className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold px-3 py-2.5 rounded-lg bg-amber-500 text-zinc-900 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
               >
                 Quero evoluir para {nextPlan.name}
                 <ArrowRight className="w-3 h-3" />
               </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center text-center p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
               <Crown className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-emerald-400 mb-1">
              Você está no topo!
            </p>
            <p className="text-[11px] text-zinc-400 max-w-xs">
              Você possui o plano mais completo do BarberFlow. Para necessidades customizadas de grandes redes, fale com nosso suporte.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
