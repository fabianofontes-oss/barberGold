'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Users, CreditCard, Percent, Gift, ToggleLeft, ToggleRight } from 'lucide-react';
import type { MembershipPlan } from '../types';
import { useBarberClub } from '../hooks/useBarberClub';
import { PlanEditor } from './PlanEditor';

export const PlansManager: React.FC = () => {
  const { plans, loading, createPlan, updatePlan, deletePlan } = useBarberClub();
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = async (data: Omit<MembershipPlan, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
    if (editingPlan) {
      await updatePlan(editingPlan.id, data);
    } else {
      await createPlan(data);
    }
    setEditingPlan(null);
    setIsCreating(false);
  };

  const handleDelete = async () => {
    if (editingPlan && confirm('Tem certeza que deseja excluir este plano?')) {
      await deletePlan(editingPlan.id);
      setEditingPlan(null);
    }
  };

  const handleToggleActive = async (plan: MembershipPlan) => {
    await updatePlan(plan.id, { isActive: !plan.isActive });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isCreating || editingPlan) {
    return (
      <PlanEditor
        plan={editingPlan}
        onSave={handleSave}
        onCancel={() => {
          setEditingPlan(null);
          setIsCreating(false);
        }}
        onDelete={editingPlan ? handleDelete : undefined}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Planos de Assinatura</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Crie e gerencie os planos do seu clube. VocÃª define os valores e benefÃ­cios.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold text-sm rounded-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Plano
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <CreditCard className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Nenhum plano criado</h3>
          <p className="text-sm text-zinc-500 mb-4">
            Crie seu primeiro plano de assinatura e comece a fidelizar clientes.
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold text-sm rounded-lg"
          >
            Criar Primeiro Plano
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-zinc-900 border rounded-2xl p-5 transition-all ${
                plan.isActive ? 'border-zinc-800' : 'border-zinc-800/50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  {plan.description && <p className="text-xs text-zinc-500 mt-0.5">{plan.description}</p>}
                </div>
                <button
                  onClick={() => handleToggleActive(plan)}
                  className={`p-1 rounded ${plan.isActive ? 'text-emerald-500' : 'text-zinc-600'}`}
                  title={plan.isActive ? 'Desativar' : 'Ativar'}
                >
                  {plan.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-white">R$ {plan.monthlyPriceBRL}</span>
                <span className="text-sm text-zinc-500">/mÃªs</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Users className="w-4 h-4 text-amber-500" />
                  <span><strong className="text-white">{plan.monthlyCredits}</strong> crÃ©ditos/mÃªs</span>
                </div>
                {plan.extraServiceDiscountPercent > 0 && (
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Percent className="w-4 h-4 text-emerald-500" />
                    <span><strong className="text-white">{plan.extraServiceDiscountPercent}%</strong> off serviÃ§os extras</span>
                  </div>
                )}
                {plan.productDiscountPercent > 0 && (
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Percent className="w-4 h-4 text-blue-500" />
                    <span><strong className="text-white">{plan.productDiscountPercent}%</strong> off produtos</span>
                  </div>
                )}
                {plan.perks.length > 0 && (
                  <div className="flex items-start gap-2 text-sm text-zinc-400">
                    <Gift className="w-4 h-4 text-purple-500 mt-0.5" />
                    <span className="text-xs">{plan.perks.join(' â€¢ ')}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setEditingPlan(plan)}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Editar Plano
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
