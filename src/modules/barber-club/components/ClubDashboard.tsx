'use client';

import React, { useState } from 'react';
import { Crown, Users, DollarSign, CreditCard, TrendingUp, Settings } from 'lucide-react';
import { useBarberClub } from '../hooks/useBarberClub';
import { PlansManager } from './PlansManager';
import { SubscribersList } from './SubscribersList';

type TabId = 'OVERVIEW' | 'PLANS' | 'SUBSCRIBERS';

export const ClubDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('OVERVIEW');
  const { stats, plans, subscriptions, loading } = useBarberClub();

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'OVERVIEW', label: 'VisÃ£o Geral', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'PLANS', label: 'Planos', icon: <Settings className="w-4 h-4" /> },
    { id: 'SUBSCRIBERS', label: 'Assinantes', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center">
          <Crown className="w-7 h-7 text-purple-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Barber Clubâ„¢</h1>
          <p className="text-sm text-zinc-500">Gerencie seus planos de assinatura e assinantes.</p>
        </div>
      </div>

      <div className="flex gap-2 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-xs text-zinc-500 font-medium">Assinantes Ativos</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.totalActiveSubscribers}</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-xs text-zinc-500 font-medium">MRR (Receita Mensal)</span>
              </div>
              <p className="text-3xl font-bold text-white">R$ {stats.totalMRR.toLocaleString('pt-BR')}</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-xs text-zinc-500 font-medium">CrÃ©ditos Usados</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.creditsUsedThisMonth}</p>
              <p className="text-[10px] text-zinc-600 mt-1">neste mÃªs</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-xs text-zinc-500 font-medium">CrÃ©ditos Restantes</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.creditsRemainingThisMonth}</p>
              <p className="text-[10px] text-zinc-600 mt-1">disponÃ­veis</p>
            </div>
          </div>

          {plans.length === 0 && (
            <div className="bg-gradient-to-br from-purple-950/30 to-zinc-900 border border-purple-500/20 rounded-2xl p-6 text-center">
              <Crown className="w-10 h-10 text-purple-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Crie seu primeiro plano!</h3>
              <p className="text-sm text-zinc-400 mb-4 max-w-md mx-auto">
                Configure os planos de assinatura da sua barbearia. VocÃª define os preÃ§os, crÃ©ditos e benefÃ­cios.
              </p>
              <button
                onClick={() => setActiveTab('PLANS')}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl"
              >
                Configurar Planos
              </button>
            </div>
          )}

          {subscriptions.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                Ãšltimos Assinantes
              </h3>
              <div className="space-y-2">
                {subscriptions.slice(0, 5).map((sub) => {
                  const plan = plans.find((p) => p.id === sub.planId);
                  return (
                    <div key={sub.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                      <div>
                        <p className="text-sm text-white font-medium">Cliente #{sub.clientId.slice(0, 8)}</p>
                        <p className="text-[10px] text-zinc-500">{plan?.name ?? 'Plano removido'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-emerald-400 font-bold">{sub.creditsRemaining} crÃ©ditos</p>
                        <p className="text-[10px] text-zinc-600">restantes</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'PLANS' && <PlansManager />}

      {activeTab === 'SUBSCRIBERS' && <SubscribersList />}
    </div>
  );
};
