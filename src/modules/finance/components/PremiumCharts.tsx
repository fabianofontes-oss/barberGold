'use client';

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Calendar } from 'lucide-react';
import { format, subDays, startOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Sale, Expense } from '@/types';

interface PremiumChartsProps {
  sales: Sale[];
  expenses: Expense[];
}

export const PremiumCharts: React.FC<PremiumChartsProps> = ({ sales, expenses }) => {
  // Ãšltimos 7 dias
  const last7Days = useMemo(() => {
    const today = new Date();
    return eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });
  }, []);

  // Dados diÃ¡rios
  const dailyData = useMemo(() => {
    return last7Days.map((day) => {
      const daySales = sales.filter((s) => isSameDay(new Date(s.date), day));
      const dayExpenses = expenses.filter((e) => isSameDay(new Date(e.date), day));

      const revenue = daySales.reduce((sum, s) => sum + s.total, 0);
      const expense = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      const profit = revenue - expense;

      return {
        date: day,
        label: format(day, 'EEE', { locale: ptBR }),
        revenue,
        expense,
        profit,
      };
    });
  }, [last7Days, sales, expenses]);

  const maxValue = Math.max(...dailyData.map((d) => Math.max(d.revenue, d.expense)), 1);

  // Totais do perÃ­odo
  const totals = useMemo(() => {
    const revenue = dailyData.reduce((sum, d) => sum + d.revenue, 0);
    const expense = dailyData.reduce((sum, d) => sum + d.expense, 0);
    const profit = revenue - expense;
    
    // Comparar com perÃ­odo anterior (simplificado)
    const prevPeriodSales = sales.filter((s) => {
      const date = new Date(s.date);
      return date >= subDays(last7Days[0], 7) && date < last7Days[0];
    });
    const prevRevenue = prevPeriodSales.reduce((sum, s) => sum + s.total, 0);
    const revenueChange = prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;

    return { revenue, expense, profit, revenueChange };
  }, [dailyData, sales, last7Days]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">TendÃªncia 7 Dias</h3>
            <p className="text-xs text-zinc-500">Receita vs Despesas</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-500 rounded" />
            Receita
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded" />
            Despesa
          </span>
        </div>
      </div>

      {/* GrÃ¡fico de barras */}
      <div className="flex items-end justify-between gap-2 h-32 mb-4">
        {dailyData.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-0.5 items-end h-24">
              {/* Barra de receita */}
              <div
                className="flex-1 bg-emerald-500/80 rounded-t transition-all hover:bg-emerald-500"
                style={{ height: `${(day.revenue / maxValue) * 100}%`, minHeight: day.revenue > 0 ? '4px' : '0' }}
                title={`Receita: R$ ${day.revenue.toFixed(0)}`}
              />
              {/* Barra de despesa */}
              <div
                className="flex-1 bg-red-500/80 rounded-t transition-all hover:bg-red-500"
                style={{ height: `${(day.expense / maxValue) * 100}%`, minHeight: day.expense > 0 ? '4px' : '0' }}
                title={`Despesa: R$ ${day.expense.toFixed(0)}`}
              />
            </div>
            <span className="text-[10px] text-zinc-500 capitalize">{day.label}</span>
          </div>
        ))}
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
        <div>
          <p className="text-xs text-zinc-500 mb-1">Receita</p>
          <p className="text-lg font-bold text-emerald-500">
            R$ {totals.revenue.toLocaleString('pt-BR')}
          </p>
          {totals.revenueChange !== 0 && (
            <p className={`text-[10px] flex items-center gap-1 ${totals.revenueChange > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totals.revenueChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(totals.revenueChange).toFixed(0)}% vs anterior
            </p>
          )}
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-1">Despesas</p>
          <p className="text-lg font-bold text-red-500">
            R$ {totals.expense.toLocaleString('pt-BR')}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-1">Lucro</p>
          <p className={`text-lg font-bold ${totals.profit >= 0 ? 'text-white' : 'text-red-500'}`}>
            R$ {totals.profit.toLocaleString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
};
