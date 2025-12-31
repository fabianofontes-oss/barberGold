'use client';

import React from 'react';
import { FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SimpleDREProps {
  revenue: number;
  tips: number;
  staffPayouts: number;
  fixedExpenses: number;
  variableExpenses: number;
}

export const SimpleDRE: React.FC<SimpleDREProps> = ({
  revenue,
  tips,
  staffPayouts,
  fixedExpenses,
  variableExpenses,
}) => {
  const grossRevenue = revenue + tips;
  const totalExpenses = fixedExpenses + variableExpenses;
  const grossProfit = grossRevenue - staffPayouts;
  const operatingProfit = grossProfit - totalExpenses;
  const profitMargin = grossRevenue > 0 ? (operatingProfit / grossRevenue) * 100 : 0;

  const rows = [
    { label: 'Receita Bruta', value: revenue, type: 'revenue' as const },
    { label: '(+) Gorjetas', value: tips, type: 'add' as const },
    { label: '= Receita Total', value: grossRevenue, type: 'subtotal' as const, bold: true },
    { label: '(-) ComissÃµes Equipe', value: staffPayouts, type: 'expense' as const },
    { label: '= Lucro Bruto', value: grossProfit, type: 'subtotal' as const, bold: true },
    { label: '(-) Custos Fixos', value: fixedExpenses, type: 'expense' as const },
    { label: '(-) Custos VariÃ¡veis', value: variableExpenses, type: 'expense' as const },
    { label: '= Lucro Operacional', value: operatingProfit, type: 'result' as const, bold: true },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">DRE Simplificado</h3>
          <p className="text-xs text-zinc-500">DemonstraÃ§Ã£o do Resultado</p>
        </div>
      </div>

      <div className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`flex items-center justify-between py-2 px-3 rounded-lg ${
              row.type === 'subtotal' || row.type === 'result'
                ? 'bg-zinc-800/50'
                : ''
            }`}
          >
            <span
              className={`text-sm ${
                row.bold ? 'font-bold text-white' : 'text-zinc-400'
              }`}
            >
              {row.label}
            </span>
            <span
              className={`text-sm font-mono ${
                row.type === 'result'
                  ? row.value >= 0
                    ? 'text-emerald-500 font-bold'
                    : 'text-red-500 font-bold'
                  : row.type === 'expense'
                  ? 'text-red-400'
                  : row.type === 'revenue' || row.type === 'add'
                  ? 'text-emerald-400'
                  : 'text-white'
              }`}
            >
              {row.type === 'expense' ? '-' : ''} R$ {Math.abs(row.value).toLocaleString('pt-BR')}
            </span>
          </div>
        ))}
      </div>

      {/* Margem de lucro */}
      <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
        <span className="text-sm text-zinc-400">Margem de Lucro</span>
        <div className="flex items-center gap-2">
          {profitMargin > 0 ? (
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          ) : profitMargin < 0 ? (
            <TrendingDown className="w-4 h-4 text-red-500" />
          ) : (
            <Minus className="w-4 h-4 text-zinc-500" />
          )}
          <span
            className={`text-lg font-bold ${
              profitMargin > 0 ? 'text-emerald-500' : profitMargin < 0 ? 'text-red-500' : 'text-zinc-400'
            }`}
          >
            {profitMargin.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};
