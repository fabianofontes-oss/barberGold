'use client';

import React, { useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import { Check, Crown, Users, Calendar, DollarSign, ShieldCheck, ArrowRight } from 'lucide-react';

export const MyPlan = () => {
  const { currentUser } = useBarber();
  const [billingInterval, setBillingInterval] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');

  const plans = [
    {
      id: 'SOLO',
      name: 'Start',
      subtitle: 'Organização c/ Agendamento',
      price: billingInterval === 'YEARLY' ? 49 : 59,
      level: 'basic',
      features: ['Agenda & Clientes', 'PDV & Serviços', 'Link de Agendamento', 'Gestão de Horários'],
      color: 'zinc'
    },
    {
      id: 'SOLO_PRO',
      name: 'Pro',
      subtitle: 'Gestão Completa',
      price: billingInterval === 'YEARLY' ? 99 : 119,
      level: 'pro',
      highlight: true,
      features: ['Tudo do Start', 'Contas a Pagar', 'Comissões & DRE', 'Programa de Pontos', 'Campanhas Win-back'],
      color: 'amber'
    },
    {
      id: 'STUDIO',
      name: 'Elite',
      subtitle: 'Marca Forte',
      price: billingInterval === 'YEARLY' ? 199 : 239,
      level: 'elite',
      features: ['Tudo do Pro', 'Site Personalizado', 'Domínio Próprio', 'Suporte Prioritário', 'Multi-unidades'],
      color: 'purple'
    }
  ];

  const currentPlan = 'SOLO_PRO';

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
         
         <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button 
               onClick={() => setBillingInterval('MONTHLY')}
               className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${billingInterval === 'MONTHLY' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
               Mensal
            </button>
            <button 
               onClick={() => setBillingInterval('YEARLY')}
               className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${billingInterval === 'YEARLY' ? 'bg-amber-500 text-zinc-900' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
               Anual <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded">-17%</span>
            </button>
         </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
         <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
               <ShieldCheck className="w-8 h-8 text-amber-500" />
            </div>
            <div>
               <h2 className="text-xl font-bold text-white">Plano Atual: {plans.find(p => p.id === currentPlan)?.name || 'Pro'}</h2>
               <p className="text-zinc-400 text-sm">Sua assinatura está ativa e funcionando normalmente.</p>
            </div>
         </div>
         <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-zinc-400"><Calendar className="w-4 h-4" /> Renovação: 15/01/2025</div>
            <div className="flex items-center gap-2 text-emerald-500"><DollarSign className="w-4 h-4" /> Em dia</div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            return (
               <div 
                  key={plan.id} 
                  className={`relative rounded-2xl p-6 transition-all ${
                     plan.highlight 
                        ? 'bg-gradient-to-b from-amber-950/50 to-zinc-900 border-2 border-amber-500/50 shadow-xl shadow-amber-500/10' 
                        : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700'
                  }`}
               >
                  {plan.highlight && (
                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-zinc-900 text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                        Recomendado
                     </div>
                  )}
                  
                  <div className="mb-6">
                     <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                     <p className="text-zinc-500 text-sm">{plan.subtitle}</p>
                  </div>
                  
                  <div className="mb-6">
                     <span className="text-4xl font-bold text-white">R${plan.price}</span>
                     <span className="text-zinc-500 text-sm">/mês</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                     {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-zinc-300">
                           <Check className={`w-4 h-4 ${plan.highlight ? 'text-amber-500' : 'text-emerald-500'}`} />
                           {feature}
                        </li>
                     ))}
                  </ul>
                  
                  <button 
                     disabled={isCurrent}
                     className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        isCurrent 
                           ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                           : plan.highlight 
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
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
