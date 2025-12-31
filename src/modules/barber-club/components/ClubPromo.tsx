'use client';

import React from 'react';
import { Crown, Gift, Sparkles, Check, ArrowRight } from 'lucide-react';

interface ClubPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  credits: number;
  benefits: string[];
}

interface ClubPromoProps {
  plans: ClubPlan[];
  shopName: string;
  onSelectPlan?: (planId: string) => void;
  compact?: boolean;
}

export const ClubPromo: React.FC<ClubPromoProps> = ({ plans, shopName, onSelectPlan, compact = false }) => {
  if (plans.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-purple-950/50 to-zinc-900 border border-purple-500/30 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Barber Clubâ„¢
                <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded font-bold">NOVO</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Economize atÃ© 40% com nossos planos
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectPlan && onSelectPlan('')}
            className="flex items-center gap-1 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold rounded-lg transition-all"
          >
            Ver Planos <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-950/30 to-zinc-900 border border-purple-500/20 rounded-3xl p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-purple-400" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {shopName} <span className="text-purple-400">Clubâ„¢</span>
        </h2>
        <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto">
          Seja membro e aproveite descontos exclusivos, crÃ©ditos mensais e benefÃ­cios especiais.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan, index) => {
          const isPopular = index === 1 && plans.length >= 2;

          return (
            <div
              key={plan.id}
              className={`relative bg-zinc-900 border rounded-2xl p-5 transition-all hover:scale-[1.02] ${
                isPopular ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-zinc-800'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> MAIS POPULAR
                  </span>
                </div>
              )}

              <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-purple-400">
                  R$ {plan.price.toFixed(0)}
                </span>
                <span className="text-zinc-500 text-sm">
                  /{plan.billingCycle === 'MONTHLY' ? 'mÃªs' : 'ano'}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4 p-3 bg-purple-500/10 rounded-lg">
                <Gift className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-white font-bold">
                  {plan.credits} crÃ©ditos/mÃªs
                </span>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.benefits.slice(0, 4).map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelectPlan && onSelectPlan(plan.id)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  isPopular
                    ? 'bg-purple-500 hover:bg-purple-400 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
              >
                Assinar Agora
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-zinc-500">
          Cancele quando quiser â€¢ Sem fidelidade â€¢ CrÃ©ditos nÃ£o acumulam
        </p>
      </div>
    </div>
  );
};
