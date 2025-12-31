'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Sale, Expense, StaffPayment } from '@/types';

interface ExportReportProps {
  sales: Sale[];
  expenses: Expense[];
  staffPayments: StaffPayment[];
  shopName: string;
  period: string;
}

export const ExportReport: React.FC<ExportReportProps> = ({
  sales,
  expenses,
  staffPayments,
  shopName,
  period,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalTips = sales.reduce((sum, s) => sum + (s.tip || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPayouts = staffPayments.reduce((sum, p) => sum + p.amount, 0);
  const netProfit = totalRevenue + totalTips - totalExpenses - totalPayouts;

  const generateCSV = () => {
    const lines: string[] = [];
    
    // Header
    lines.push(`RelatÃ³rio Financeiro - ${shopName}`);
    lines.push(`PerÃ­odo: ${period}`);
    lines.push(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'Ã s' HH:mm", { locale: ptBR })}`);
    lines.push('');
    
    // Resumo
    lines.push('=== RESUMO ===');
    lines.push(`Receita Total,R$ ${totalRevenue.toFixed(2)}`);
    lines.push(`Gorjetas,R$ ${totalTips.toFixed(2)}`);
    lines.push(`Despesas,R$ ${totalExpenses.toFixed(2)}`);
    lines.push(`Pagamentos Equipe,R$ ${totalPayouts.toFixed(2)}`);
    lines.push(`Lucro LÃ­quido,R$ ${netProfit.toFixed(2)}`);
    lines.push('');
    
    // Vendas
    lines.push('=== VENDAS ===');
    lines.push('Data,Cliente,FuncionÃ¡rio,Total,Gorjeta,MÃ©todo');
    sales.forEach((s) => {
      lines.push(
        `${format(new Date(s.date), 'dd/MM/yyyy HH:mm')},${s.clientId || 'Walk-in'},${s.staffId || 'Staff'},R$ ${s.total.toFixed(2)},R$ ${(s.tip || 0).toFixed(2)},${s.method}`
      );
    });
    lines.push('');
    
    // Despesas
    lines.push('=== DESPESAS ===');
    lines.push('Data,DescriÃ§Ã£o,Categoria,Valor');
    expenses.forEach((e) => {
      lines.push(
        `${format(new Date(e.date), 'dd/MM/yyyy')},${e.title},${e.category},R$ ${e.amount.toFixed(2)}`
      );
    });
    lines.push('');
    
    // Pagamentos
    lines.push('=== PAGAMENTOS EQUIPE ===');
    lines.push('Data,FuncionÃ¡rio,Tipo,Valor');
    staffPayments.forEach((p) => {
      lines.push(
        `${format(new Date(p.date), 'dd/MM/yyyy')},${p.staffId},${p.type},R$ ${p.amount.toFixed(2)}`
      );
    });

    return lines.join('\n');
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const csv = generateCSV();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${shopName.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportTXT = async () => {
    setIsExporting(true);
    try {
      const lines: string[] = [];
      
      lines.push('â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—');
      lines.push(`â•‘  RELATÃ“RIO FINANCEIRO - ${shopName.toUpperCase().padEnd(15)}  â•‘`);
      lines.push('â• â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•£');
      lines.push(`â•‘  PerÃ­odo: ${period.padEnd(30)}â•‘`);
      lines.push(`â•‘  Gerado: ${format(new Date(), 'dd/MM/yyyy HH:mm').padEnd(31)}â•‘`);
      lines.push('â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');
      lines.push('');
      lines.push('â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”');
      lines.push('â”‚              RESUMO GERAL                â”‚');
      lines.push('â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤');
      lines.push(`â”‚  Receita:          R$ ${totalRevenue.toFixed(2).padStart(15)}  â”‚`);
      lines.push(`â”‚  Gorjetas:         R$ ${totalTips.toFixed(2).padStart(15)}  â”‚`);
      lines.push(`â”‚  Despesas:         R$ ${totalExpenses.toFixed(2).padStart(15)}  â”‚`);
      lines.push(`â”‚  Pagamentos:       R$ ${totalPayouts.toFixed(2).padStart(15)}  â”‚`);
      lines.push('â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤');
      lines.push(`â”‚  LUCRO LÃQUIDO:    R$ ${netProfit.toFixed(2).padStart(15)}  â”‚`);
      lines.push('â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜');
      
      const txt = lines.join('\n');
      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resumo-${shopName.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
          <Download className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Exportar RelatÃ³rio</h3>
          <p className="text-xs text-zinc-500">Baixe os dados para sua contabilidade</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
          ) : (
            <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
          )}
          <div className="text-left">
            <p className="text-sm font-bold text-white">CSV / Excel</p>
            <p className="text-[10px] text-zinc-500">Dados completos</p>
          </div>
        </button>

        <button
          onClick={handleExportTXT}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 p-4 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : (
            <FileText className="w-5 h-5 text-blue-500" />
          )}
          <div className="text-left">
            <p className="text-sm font-bold text-white">TXT Resumo</p>
            <p className="text-[10px] text-zinc-500">Para impressÃ£o</p>
          </div>
        </button>
      </div>
    </div>
  );
};
