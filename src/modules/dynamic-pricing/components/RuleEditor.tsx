'use client';

import React, { useState } from 'react';
import { Save, Trash2, X, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import type { PricingRule, PricingRuleType, DayOfWeek, RuleSuggestion } from '../types';
import { DAY_LABELS, RULE_SUGGESTIONS } from '../types';

interface RuleEditorProps {
  rule?: PricingRule | null;
  onSave: (data: Omit<PricingRule, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const ALL_DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const RuleEditor: React.FC<RuleEditorProps> = ({ rule, onSave, onCancel, onDelete }) => {
  const isEditing = Boolean(rule);

  const [name, setName] = useState(rule?.name ?? '');
  const [type, setType] = useState<PricingRuleType>(rule?.type ?? 'SURGE');
  const [percentModifier, setPercentModifier] = useState(rule?.percentModifier ?? 0.10);
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>(rule?.daysOfWeek ?? ['SATURDAY']);
  const [startTime, setStartTime] = useState(rule?.startTime ?? '09:00');
  const [endTime, setEndTime] = useState(rule?.endTime ?? '12:00');
  const [isActive, setIsActive] = useState(rule?.isActive ?? true);

  const handleApplySuggestion = (s: RuleSuggestion) => {
    setName(s.name);
    setType(s.type);
    setPercentModifier(s.percentModifier);
    setDaysOfWeek([...s.daysOfWeek]);
    setStartTime(s.startTime);
    setEndTime(s.endTime);
  };

  const toggleDay = (day: DayOfWeek) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      type,
      percentModifier: type === 'DEAL' ? -Math.abs(percentModifier) : Math.abs(percentModifier),
      daysOfWeek,
      startTime,
      endTime,
      serviceIds: [],
      isActive,
      priority: rule?.priority ?? 0,
    });
  };

  const displayPercent = Math.abs(percentModifier * 100).toFixed(0);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {isEditing ? 'Editar Regra' : 'Nova Regra de PreÃ§o'}
        </h2>
        <button onClick={onCancel} className="text-zinc-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {!isEditing && (
        <div className="mb-6">
          <p className="text-xs text-zinc-500 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            SugestÃµes prontas (clique para aplicar):
          </p>
          <div className="grid grid-cols-2 gap-2">
            {RULE_SUGGESTIONS.map((s) => (
              <button
                key={s.templateId}
                type="button"
                onClick={() => handleApplySuggestion(s)}
                className={`p-3 rounded-xl border text-left transition-all hover:border-amber-500/50 ${
                  s.type === 'SURGE'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-emerald-500/10 border-emerald-500/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {s.type === 'SURGE' ? (
                    <TrendingUp className="w-3 h-3 text-amber-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-emerald-500" />
                  )}
                  <span className="text-xs font-bold text-white">{s.name}</span>
                </div>
                <p className="text-[10px] text-zinc-500">{s.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Nome da Regra *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ex: SÃ¡bado ManhÃ£ Premium"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Tipo *</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('SURGE')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  type === 'SURGE'
                    ? 'bg-amber-500 text-zinc-900'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" /> Surge (+)
              </button>
              <button
                type="button"
                onClick={() => setType('DEAL')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  type === 'DEAL'
                    ? 'bg-emerald-500 text-zinc-900'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <TrendingDown className="w-4 h-4" /> Deal (-)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">
              {type === 'SURGE' ? 'Aumento' : 'Desconto'} (%) *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={Math.abs(percentModifier * 100)}
                onChange={(e) => setPercentModifier(Number(e.target.value) / 100)}
                min={1}
                max={99}
                step={1}
                required
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
              />
              <span className={`text-xl font-bold ${type === 'SURGE' ? 'text-amber-500' : 'text-emerald-500'}`}>
                {type === 'SURGE' ? '+' : '-'}{displayPercent}%
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-500 mb-2">Dias da Semana *</label>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  daysOfWeek.includes(day)
                    ? 'bg-amber-500 text-zinc-900'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {DAY_LABELS[day].slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">HorÃ¡rio InÃ­cio *</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">HorÃ¡rio Fim *</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
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
            <span className="text-sm text-zinc-300">Regra ativa</span>
          </label>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          {isEditing && onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="text-red-500 hover:text-red-400 text-xs font-bold flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" /> Excluir
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
              <Save className="w-4 h-4" /> Salvar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
