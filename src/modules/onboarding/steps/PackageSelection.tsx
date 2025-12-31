'use client';

import React from 'react';
import { Star, Flame, Zap, Check } from 'lucide-react';
import { BusinessType, PackageLevel, PackageOption } from '@/types/onboarding';

interface PackageSelectionProps {
  businessType: BusinessType;
  onSelect: (level: PackageLevel) => void;
}

export const PackageSelection: React.FC<PackageSelectionProps> = ({ businessType, onSelect }) => {
  const getBusinessTypeLabel = () => {
    switch (businessType) {
      case 'barber': return 'Barbearia';
      case 'salon': return 'Salão';
      case 'unisex': return 'Unissex';
    }
  };

  const getPackageOptions = (): PackageOption[] => {
    if (businessType === 'barber') {
      return [
        {
          level: 'essencial',
          icon: '⭐',
          title: 'ESSENCIAL',
          description: '10 itens principais',
          itemCount: 10,
          features: ['✓ Cortes básicos', '✓ Barba', '✓ Combos'],
          recommended: true
        },
        {
          level: 'completo',
          icon: '🔥',
          title: 'COMPLETO',
          description: '26 itens + extras',
          itemCount: 26,
          features: ['✓ Tudo do Essencial', '✓ Químicas e tratamentos', '✓ Estética facial']
        },
        {
          level: 'custom',
          icon: '⚡',
          title: 'SÓ EU ESCOLHO',
          description: 'Selecionar item por item',
          itemCount: 0,
          features: ['Controle total']
        }
      ];
    } else if (businessType === 'salon') {
      return [
        {
          level: 'essencial',
          icon: '⭐',
          title: 'ESSENCIAL',
          description: '14 itens principais',
          itemCount: 14,
          features: ['✓ Cabelo e escova', '✓ Unhas', '✓ Depilação básica'],
          recommended: true
        },
        {
          level: 'completo',
          icon: '🔥',
          title: 'COMPLETO',
          description: '44 itens + extras',
          itemCount: 44,
          features: ['✓ Tudo do Essencial', '✓ Químicas avançadas', '✓ Penteados e estética']
        },
        {
          level: 'custom',
          icon: '⚡',
          title: 'SÓ EU ESCOLHO',
          description: 'Selecionar item por item',
          itemCount: 0,
          features: ['Controle total']
        }
      ];
    } else {
      return [
        {
          level: 'essencial',
          icon: '⭐',
          title: 'ESSENCIAL',
          description: '15 itens principais',
          itemCount: 15,
          features: ['✓ Mix barbearia + salão', '✓ Serviços essenciais', '✓ Combos'],
          recommended: true
        },
        {
          level: 'completo',
          icon: '🔥',
          title: 'COMPLETO',
          description: '50 itens completos',
          itemCount: 50,
          features: ['✓ Tudo de barbearia', '✓ Tudo de salão', '✓ Máxima variedade']
        },
        {
          level: 'custom',
          icon: '⚡',
          title: 'SÓ EU ESCOLHO',
          description: 'Selecionar item por item',
          itemCount: 0,
          features: ['Controle total']
        }
      ];
    }
  };

  const options = getPackageOptions();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
          <span>←</span>
          <span>{getBusinessTypeLabel()} selecionada</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Escolha seu pacote inicial
        </h2>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {options.map((option) => (
          <button
            key={option.level}
            onClick={() => onSelect(option.level)}
            className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-amber-500/50 rounded-xl p-6 transition-all group text-left relative"
          >
            {option.recommended && (
              <div className="absolute top-3 right-3">
                <span className="bg-amber-500 text-zinc-950 text-xs font-bold px-2 py-1 rounded-full">
                  Recomendado
                </span>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="text-3xl mt-1">{option.icon}</div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl mb-1 group-hover:text-amber-500 transition-colors">
                  {option.title}
                </h3>
                <div className="h-px bg-zinc-700 my-3" />
                <p className="text-zinc-400 text-sm mb-3">
                  {option.description}
                </p>
                <div className="space-y-1">
                  {option.features.map((feature, idx) => (
                    <p key={idx} className="text-zinc-500 text-sm">
                      {feature}
                    </p>
                  ))}
                </div>
                {option.itemCount > 0 && (
                  <p className="text-amber-500 text-xs font-bold mt-3">
                    Pronto para começar
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
