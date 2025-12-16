'use client';

import React, { useMemo } from 'react';
import { Brain, TrendingUp, Coins, Sparkles, Check, Info } from 'lucide-react';
import { useBarber } from '@/context/BarberContext';
import { analyzeServicesAndSuggestPlans, generateAnalysisSummary, type SmartPlanSuggestion } from '../smartSuggestions';

interface SmartSuggestionsPanelProps {
  onSelectSuggestion: (suggestion: SmartPlanSuggestion) => void;
}

export const SmartSuggestionsPanel: React.FC<SmartSuggestionsPanelProps> = ({ onSelectSuggestion }) => {
  const { services } = useBarber();

  const analysis = useMemo(() => analyzeServicesAndSuggestPlans(services), [services]);
  const summary = useMemo(() => generateAnalysisSummary(analysis), [analysis]);

  if (analysis.totalServices === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-zinc-300 font-medium">Cadastre seus serviços primeiro</p>
            <p className="text-xs text-zinc-500 mt-1">
              Vá em <strong>Catálogo</strong> e adicione seus serviços com os preços. 
              Depois volte aqui para receber sugestões inteligentes de planos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Header com explicação */}
      <div className="bg-gradient-to-br from-purple-950/30 to-zinc-900 border border-purple-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Sugestões Inteligentes
            </p>
            <p className="text-xs text-zinc-400 mt-1">{summary}</p>
          </div>
        </div>
      </div>

      {/* Cards de sugestões */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {analysis.suggestions.map((suggestion) => (
          <button
            key={suggestion.templateId}
            type="button"
            onClick={() => onSelectSuggestion(suggestion)}
            className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] ${
              suggestion.tier === 'POPULAR'
                ? 'bg-gradient-to-br from-amber-950/30 to-zinc-900 border-amber-500/30 hover:border-amber-500/60'
                : suggestion.tier === 'PREMIUM'
                ? 'bg-gradient-to-br from-purple-950/30 to-zinc-900 border-purple-500/30 hover:border-purple-500/60'
                : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600'
            }`}
          >
            {/* Badge */}
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  suggestion.tier === 'POPULAR'
                    ? 'bg-amber-500/20 text-amber-400'
                    : suggestion.tier === 'PREMIUM'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {suggestion.tier === 'POPULAR' ? 'Recomendado' : suggestion.tier === 'PREMIUM' ? 'VIP' : 'Básico'}
              </span>
              {suggestion.tier === 'POPULAR' && <Sparkles className="w-4 h-4 text-amber-500" />}
            </div>

            {/* Nome e preço */}
            <h4 className="text-lg font-bold text-white mb-1">{suggestion.name}</h4>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold text-white">R$ {suggestion.monthlyPriceBRL}</span>
              <span className="text-xs text-zinc-500">/mês</span>
            </div>

            {/* Créditos */}
            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>
                <strong className="text-white">{suggestion.monthlyCredits}</strong> crédito{suggestion.monthlyCredits > 1 ? 's' : ''}/mês
              </span>
            </div>

            {/* Economia */}
            <div className="flex items-center gap-2 text-sm mb-3">
              <Coins className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-400 font-medium">
                Economia de R$ {suggestion.savingsPerMonth}/mês
              </span>
            </div>

            {/* Comparativo de preço por visita */}
            <div className="bg-black/30 rounded-lg p-2 text-[10px] text-zinc-500">
              <div className="flex justify-between">
                <span>Preço avulso:</span>
                <span className="line-through">R$ {suggestion.originalPricePerVisit}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>No plano:</span>
                <span>R$ {suggestion.pricePerVisit.toFixed(0)}/visita</span>
              </div>
            </div>

            {/* Benefícios */}
            {suggestion.perks.length > 0 && (
              <div className="mt-2 pt-2 border-t border-zinc-800/50">
                <p className="text-[10px] text-zinc-500">
                  + {suggestion.perks.join(' • ')}
                </p>
              </div>
            )}

            {/* Reasoning */}
            <div className="mt-3 pt-2 border-t border-zinc-800/50">
              <p className="text-[10px] text-zinc-600 italic">{suggestion.reasoning}</p>
            </div>
          </button>
        ))}
      </div>

      <p className="text-[10px] text-zinc-600 text-center">
        Clique em uma sugestão para preencher o formulário. Você pode ajustar todos os valores antes de salvar.
      </p>
    </div>
  );
};
