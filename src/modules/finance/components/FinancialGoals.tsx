'use client';

import React, { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Check, TrendingUp } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  period: 'MONTHLY' | 'WEEKLY';
}

interface FinancialGoalsProps {
  currentMonthRevenue: number;
  currentWeekRevenue: number;
  tenantId: string;
}

const STORAGE_KEY = (tenantId: string) => `bf:finance:goals:${tenantId}`;

export const FinancialGoals: React.FC<FinancialGoalsProps> = ({
  currentMonthRevenue,
  currentWeekRevenue,
  tenantId,
}) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState<{ name: string; targetAmount: number; period: 'MONTHLY' | 'WEEKLY' }>({ name: '', targetAmount: 0, period: 'MONTHLY' });

  // Carregar metas do localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY(tenantId));
    if (stored) {
      try {
        setGoals(JSON.parse(stored));
      } catch {}
    }
  }, [tenantId]);

  // Salvar metas
  const saveGoals = (updated: Goal[]) => {
    setGoals(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY(tenantId), JSON.stringify(updated));
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.name || newGoal.targetAmount <= 0) return;

    const goal: Goal = {
      id: crypto.randomUUID(),
      name: newGoal.name,
      targetAmount: newGoal.targetAmount,
      currentAmount: newGoal.period === 'MONTHLY' ? currentMonthRevenue : currentWeekRevenue,
      period: newGoal.period,
    };

    saveGoals([...goals, goal]);
    setNewGoal({ name: '', targetAmount: 0, period: 'MONTHLY' });
    setIsAdding(false);
  };

  const handleDeleteGoal = (id: string) => {
    saveGoals(goals.filter((g) => g.id !== id));
  };

  // Atualizar valores atuais
  const goalsWithCurrentValues = goals.map((g) => ({
    ...g,
    currentAmount: g.period === 'MONTHLY' ? currentMonthRevenue : currentWeekRevenue,
  }));

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Metas Financeiras</h3>
            <p className="text-xs text-zinc-500">Acompanhe seu progresso</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* FormulÃ¡rio para adicionar meta */}
      {isAdding && (
        <div className="mb-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
          <input
            type="text"
            placeholder="Nome da meta (ex: Faturamento Mensal)"
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Valor alvo (R$)"
              value={newGoal.targetAmount || ''}
              onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-purple-500"
            />
            <select
              value={newGoal.period}
              onChange={(e) => setNewGoal({ ...newGoal, period: e.target.value as Goal['period'] })}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none"
            >
              <option value="MONTHLY">Mensal</option>
              <option value="WEEKLY">Semanal</option>
            </select>
          </div>
          <button
            onClick={handleAddGoal}
            className="w-full py-2 bg-purple-500 hover:bg-purple-400 text-white text-sm font-bold rounded-lg"
          >
            Adicionar Meta
          </button>
        </div>
      )}

      {/* Lista de metas */}
      {goalsWithCurrentValues.length === 0 ? (
        <div className="text-center py-8 text-zinc-600 text-sm">
          Nenhuma meta definida. Clique em + para adicionar.
        </div>
      ) : (
        <div className="space-y-3">
          {goalsWithCurrentValues.map((goal) => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            const isComplete = goal.currentAmount >= goal.targetAmount;

            return (
              <div key={goal.id} className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isComplete ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                    )}
                    <span className="text-sm font-bold text-white">{goal.name}</span>
                    <span className="text-[10px] text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                      {goal.period === 'MONTHLY' ? 'Mensal' : 'Semanal'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-zinc-600 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Barra de progresso */}
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-purple-500'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">
                    R$ {goal.currentAmount.toLocaleString('pt-BR')} / R$ {goal.targetAmount.toLocaleString('pt-BR')}
                  </span>
                  <span className={`font-bold ${isComplete ? 'text-emerald-500' : 'text-purple-400'}`}>
                    {progress.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
