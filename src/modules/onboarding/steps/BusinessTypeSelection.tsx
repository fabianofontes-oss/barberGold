'use client';

import React from 'react';
import { Scissors, Sparkles, Settings } from 'lucide-react';
import { BusinessType, BusinessTypeOption } from '@/types/onboarding';

interface BusinessTypeSelectionProps {
  onSelect: (type: BusinessType | 'skip') => void;
}

export const BusinessTypeSelection: React.FC<BusinessTypeSelectionProps> = ({ onSelect }) => {
  const options: BusinessTypeOption[] = [
    {
      type: 'barber',
      icon: 'ðŸ’ˆ',
      title: 'Barbearia',
      description: 'Cortes, barba e mais',
      recommended: true
    },
    {
      type: 'salon',
      icon: 'ðŸ’‡â€â™€ï¸',
      title: 'SalÃ£o de Beleza',
      description: 'Cabelo, unhas e estÃ©tica'
    },
    {
      type: 'unisex',
      icon: 'âœ¨',
      title: 'Barbearia + SalÃ£o',
      description: 'Atendimento unissex'
    },
    {
      type: 'skip',
      icon: 'âš™ï¸',
      title: 'Pular',
      description: 'Criar tudo manualmente'
    }
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Vamos montar seus serviÃ§os
        </h1>
        <p className="text-zinc-400 text-lg">
          em 30 segundos
        </p>
      </div>

      <div className="space-y-3 max-w-2xl mx-auto">
        {options.map((option) => (
          <button
            key={option.type}
            onClick={() => onSelect(option.type)}
            className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-amber-500/50 rounded-xl p-6 transition-all group relative overflow-hidden"
          >
            {option.recommended && (
              <div className="absolute top-3 right-3">
                <span className="bg-amber-500 text-zinc-950 text-xs font-bold px-2 py-1 rounded-full">
                  Recomendado
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <div className="text-4xl">{option.icon}</div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-amber-500 transition-colors">
                  {option.title}
                </h3>
                <p className="text-zinc-400 text-sm">
                  {option.description}
                </p>
              </div>
              <div className="text-zinc-600 group-hover:text-amber-500 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-zinc-500 text-sm">
          ðŸ’¡ VocÃª poderÃ¡ editar tudo depois
        </p>
      </div>
    </div>
  );
};
