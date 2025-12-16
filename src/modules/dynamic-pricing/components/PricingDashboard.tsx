'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Edit2,
  ToggleLeft,
  ToggleRight,
  Zap,
  Percent,
  Clock,
  Calendar,
} from 'lucide-react';
import { useDynamicPricing } from '../hooks/useDynamicPricing';
import { RuleEditor } from './RuleEditor';
import type { PricingRule } from '../types';
import { DAY_LABELS } from '../types';

export const PricingDashboard: React.FC = () => {
  const { rules, loading, createRule, updateRule, deleteRule, toggleRule, stats } = useDynamicPricing();
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = async (data: Omit<PricingRule, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    if (editingRule) {
      await updateRule(editingRule.id, data);
    } else {
      await createRule(data);
    }
    setEditingRule(null);
    setIsCreating(false);
  };

  const handleDelete = async () => {
    if (editingRule && confirm('Excluir esta regra?')) {
      await deleteRule(editingRule.id);
      setEditingRule(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isCreating || editingRule) {
    return (
      <RuleEditor
        rule={editingRule}
        onSave={handleSave}
        onCancel={() => {
          setEditingRule(null);
          setIsCreating(false);
        }}
        onDelete={editingRule ? handleDelete : undefined}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center">
          <Zap className="w-7 h-7 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Dynamic Pricing</h1>
          <p className="text-sm text-zinc-500">Regras de preço por horário e dia da semana.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
              <Percent className="w-5 h-5 text-zinc-400" />
            </div>
            <span className="text-xs text-zinc-500 font-medium">Regras Ativas</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.activeRulesCount}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-xs text-zinc-500 font-medium">Surge (+)</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.surgeRulesCount}</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs text-zinc-500 font-medium">Deal (-)</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.dealRulesCount}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Regras de Preço</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold text-sm rounded-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nova Regra
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <Zap className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Nenhuma regra criada</h3>
          <p className="text-sm text-zinc-500 mb-4">
            Crie regras de preço dinâmico para aumentar lucro em horários de pico ou atrair clientes em horários ociosos.
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold text-sm rounded-lg"
          >
            Criar Primeira Regra
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`bg-zinc-900 border rounded-2xl p-5 transition-all ${
                rule.isActive ? 'border-zinc-800' : 'border-zinc-800/50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      rule.type === 'SURGE' ? 'bg-amber-500/10' : 'bg-emerald-500/10'
                    }`}
                  >
                    {rule.type === 'SURGE' ? (
                      <TrendingUp className="w-6 h-6 text-amber-500" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-emerald-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{rule.name}</h3>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          rule.type === 'SURGE'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {rule.type === 'SURGE' ? '+' : ''}
                        {(rule.percentModifier * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {rule.daysOfWeek.map((d) => DAY_LABELS[d].slice(0, 3)).join(', ')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rule.startTime} - {rule.endTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`p-2 rounded-lg ${rule.isActive ? 'text-emerald-500' : 'text-zinc-600'}`}
                    title={rule.isActive ? 'Desativar' : 'Ativar'}
                  >
                    {rule.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={() => setEditingRule(rule)}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
