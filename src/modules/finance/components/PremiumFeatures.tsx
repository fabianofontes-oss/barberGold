'use client';

import React from 'react';
import { Crown, Lock } from 'lucide-react';
import { useBarber } from '@/context/BarberContext';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { PremiumCharts } from './PremiumCharts';
import { SimpleDRE } from './SimpleDRE';
import { FinancialGoals } from './FinancialGoals';
import { ExportReport } from './ExportReport';
import type { Sale, Expense, StaffPayment } from '@/types';

interface PremiumFeaturesProps {
  sales: Sale[];
  expenses: Expense[];
  staffPayments: StaffPayment[];
  filteredSales: Sale[];
  filteredExpenses: Expense[];
  filteredPayouts: StaffPayment[];
  totalRevenue: number;
  totalTips: number;
  staffPayoutsTotal: number;
  fixedExpenses: number;
  variableExpenses: number;
  currentMonthRevenue: number;
  currentWeekRevenue: number;
  period: string;
}

export const PremiumFeatures: React.FC<PremiumFeaturesProps> = (props) => {
  const { shopProfile, currentTenantPlanId } = useBarber();
  const { canUseFeature } = useFeatureGate();

  const hasAdvancedReports = canUseFeature('ADVANCED_REPORTS');
  const isPremium = currentTenantPlanId !== 'FREE';

  if (!isPremium) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Recursos Premium</h3>
        <p className="text-sm text-zinc-500 mb-4">
          Gráficos de tendência, DRE, metas e exportação de relatórios estão disponíveis nos planos pagos.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-zinc-600">
          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Gráficos</span>
          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> DRE</span>
          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Metas</span>
          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Exportar</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gráficos de tendência */}
      <PremiumCharts sales={props.filteredSales} expenses={props.filteredExpenses} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DRE Simplificado */}
        <SimpleDRE
          revenue={props.totalRevenue}
          tips={props.totalTips}
          staffPayouts={props.staffPayoutsTotal}
          fixedExpenses={props.fixedExpenses}
          variableExpenses={props.variableExpenses}
        />

        {/* Metas Financeiras */}
        <FinancialGoals
          currentMonthRevenue={props.currentMonthRevenue}
          currentWeekRevenue={props.currentWeekRevenue}
          tenantId={shopProfile.slug || 'standalone'}
        />
      </div>

      {/* Exportação */}
      {hasAdvancedReports && (
        <ExportReport
          sales={props.filteredSales}
          expenses={props.filteredExpenses}
          staffPayments={props.filteredPayouts}
          shopName={shopProfile.name || 'Barbearia'}
          period={props.period}
        />
      )}
    </div>
  );
};
