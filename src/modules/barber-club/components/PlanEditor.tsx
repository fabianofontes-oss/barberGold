'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import type { MembershipPlan, PlanSuggestion } from '../types';
import { SmartSuggestionsPanel } from './SmartSuggestionsPanel';
import type { SmartPlanSuggestion } from '../smartSuggestions';

interface PlanEditorProps {
  plan?: MembershipPlan | null;
  onSave: (data: Omit<MembershipPlan, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export const PlanEditor: React.FC<PlanEditorProps> = ({ plan, onSave, onCancel, onDelete }) => {
  const isEditing = Boolean(plan);

  const [name, setName] = useState(plan?.name ?? '');
  const [description, setDescription] = useState(plan?.description ?? '');
  const [monthlyPriceBRL, setMonthlyPriceBRL] = useState(plan?.monthlyPriceBRL ?? 99);
  const [monthlyCredits, setMonthlyCredits] = useState(plan?.monthlyCredits ?? 2);
  const [extraServiceDiscountPercent, setExtraServiceDiscountPercent] = useState(plan?.extraServiceDiscountPercent ?? 10);
  const [productDiscountPercent, setProductDiscountPercent] = useState(plan?.productDiscountPercent ?? 5);
  const [perks, setPerks] = useState<string[]>(plan?.perks ?? []);
  const [newPerk, setNewPerk] = useState('');
  const [isActive, setIsActive] = useState(plan?.isActive ?? true);

  const handleApplySuggestion = (suggestion: PlanSuggestion | SmartPlanSuggestion) => {
    setName(suggestion.name);
    setDescription(suggestion.description);
    setMonthlyPriceBRL(suggestion.monthlyPriceBRL);
    setMonthlyCredits(suggestion.monthlyCredits);
    setExtraServiceDiscountPercent(suggestion.extraServiceDiscountPercent);
    setProductDiscountPercent(suggestion.productDiscountPercent);
    setPerks([...suggestion.perks]);
  };

  const handleAddPerk = () => {
    if (newPerk.trim()) {
      setPerks((prev) => [...prev, newPerk.trim()]);
      setNewPerk('');
    }
  };

  const handleRemovePerk = (index: number) => {
    setPerks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      monthlyPriceBRL,
      monthlyCredits,
      eligibleServiceIds: [],
      extraServiceDiscountPercent,
      productDiscountPercent,
      perks,
      isActive,
      displayOrder: plan?.displayOrder ?? 0,
    });
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {isEditing ? 'Editar Plano' : 'Criar Novo Plano'}
        </h2>
        <button onClick={onCancel} className="text-zinc-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {!isEditing && (
        <SmartSuggestionsPanel onSelectSuggestion={handleApplySuggestion} />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Nome do Plano *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Ex: Plano Mensal"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Para quem corta 2x por mês"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Preço Mensal (R$) *</label>
            <input
              type="number"
              value={monthlyPriceBRL}
              onChange={(e) => setMonthlyPriceBRL(Number(e.target.value))}
              min={0}
              step={1}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
            <p className="text-[10px] text-zinc-600 mt-1">Você define. Sugerimos entre R$ 59 e R$ 199.</p>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Créditos/Mês *</label>
            <input
              type="number"
              value={monthlyCredits}
              onChange={(e) => setMonthlyCredits(Number(e.target.value))}
              min={1}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
            <p className="text-[10px] text-zinc-600 mt-1">Quantos serviços o cliente pode resgatar.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Desconto Serviços Extras (%)</label>
            <input
              type="number"
              value={extraServiceDiscountPercent}
              onChange={(e) => setExtraServiceDiscountPercent(Number(e.target.value))}
              min={0}
              max={100}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
            <p className="text-[10px] text-zinc-600 mt-1">Desconto em serviços além dos créditos.</p>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Desconto Produtos (%)</label>
            <input
              type="number"
              value={productDiscountPercent}
              onChange={(e) => setProductDiscountPercent(Number(e.target.value))}
              min={0}
              max={100}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
            <p className="text-[10px] text-zinc-600 mt-1">Desconto em produtos para assinantes.</p>
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-1">Benefícios Extras</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newPerk}
              onChange={(e) => setNewPerk(e.target.value)}
              placeholder="Ex: Cerveja grátis"
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPerk())}
            />
            <button
              type="button"
              onClick={handleAddPerk}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {perks.map((perk, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-lg"
              >
                {perk}
                <button type="button" onClick={() => handleRemovePerk(i)} className="text-zinc-500 hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
            <span className="text-sm text-zinc-300">Plano ativo (visível para clientes)</span>
          </label>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          {isEditing && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="text-red-500 hover:text-red-400 text-xs font-bold flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" /> Excluir Plano
            </button>
          )}
          <div className="flex-1" />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-900 text-sm font-bold rounded-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Salvar Plano
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
