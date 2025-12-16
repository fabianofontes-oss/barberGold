'use client';


import React from 'react';
import { Check, Minus } from 'lucide-react';

const CheckIcon = () => <Check className="w-4 h-4 text-emerald-500 mx-auto" />;
const DashIcon = () => <span className="text-zinc-600 font-bold opacity-50">–</span>; 

// Helper types
type RowData = {
  feature: string;
  free: React.ReactNode;
  start: React.ReactNode;
  pro: React.ReactNode;
  elite: React.ReactNode;
};

type CategoryData = {
  title: string;
  rows: RowData[];
};

export const PlanComparisonTable: React.FC = () => {
  const categories: CategoryData[] = [
    {
      title: "Agenda & Operação",
      rows: [
        { 
           feature: "Agenda & Fila", 
           free: "Diária Básica", 
           start: "Agenda Completa", 
           pro: "Agenda + Fila Inteligente", 
           elite: "Agenda + Fila Inteligente" 
        },
        { 
           feature: "Agendamento Online", 
           free: <DashIcon />, 
           start: "Link da Barbearia", 
           pro: "Online + Fila Espera", 
           elite: "Página de Equipe / Perfil" 
        },
      ]
    },
    {
        title: "Clientes (CRM)",
        rows: [
            { feature: "Cadastro de Clientes", free: "Básico", start: "Histórico Simples", pro: "CRM Completo + Tags", elite: "CRM Completo + Tags" },
            { feature: "Fidelidade & Pontos", free: <DashIcon />, start: <DashIcon />, pro: <CheckIcon />, elite: <CheckIcon /> },
            { feature: "Win-back (Reconquista)", free: <DashIcon />, start: <DashIcon />, pro: <CheckIcon />, elite: <CheckIcon /> },
        ]
    },
    {
        title: "Financeiro & Caixa",
        rows: [
            { feature: "Visão Financeira", free: "Faturamento Dia", start: "Faturamento Mês", pro: "Relatórios Avançados", elite: "Relatórios Avançados" },
            { feature: "DRE & Break-even", free: <DashIcon />, start: <DashIcon />, pro: "DRE + Ponto Equilíbrio", elite: "DRE + Ponto Equilíbrio" },
            { feature: "Comissões & Payouts", free: <DashIcon />, start: <DashIcon />, pro: <CheckIcon />, elite: <CheckIcon /> },
            { feature: "Fechamento Cego", free: <DashIcon />, start: <DashIcon />, pro: <CheckIcon />, elite: <CheckIcon /> },
        ]
    },
    {
        title: "Produtos & Estoque",
        rows: [
            { feature: "Catálogo & Vendas", free: "Simples", start: "Organizado", pro: "Custo & Margem", elite: "Custo & Margem" },
        ]
    },
    {
        title: "Marca & Expansão",
        rows: [
            { feature: "Website Profissional", free: <DashIcon />, start: <DashIcon />, pro: <DashIcon />, elite: "Site Premium + Domínio" },
            { feature: "Ferramentas Marketing", free: <DashIcon />, start: <DashIcon />, pro: "Básico", elite: "Avançado + Prioridade" },
        ]
    }
  ];

  return (
    <div className="w-full animate-fade-in">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Comparar Planos</h2>
            <p className="text-zinc-400 text-sm">Veja rapidamente o que cada plano libera em cada parte do sistema.</p>
        </div>

        <div className="overflow-x-auto pb-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
            <table className="w-full min-w-[800px] border-collapse text-sm">
                <thead>
                    <tr>
                        <th className="p-4 text-left text-zinc-500 font-bold uppercase text-xs w-1/3 bg-zinc-900 sticky left-0 z-10 border-b border-zinc-800">Módulo / Recurso</th>
                        <th className="p-4 text-center text-zinc-400 font-bold w-1/6 border-b border-zinc-800 bg-zinc-900/50">Free Solo</th>
                        <th className="p-4 text-center text-white font-bold w-1/6 border-b border-zinc-800 bg-zinc-900">Start</th>
                        <th className="p-4 text-center text-amber-500 font-bold w-1/6 border-b border-zinc-800 bg-amber-500/5">Pro</th>
                        <th className="p-4 text-center text-purple-400 font-bold w-1/6 border-b border-zinc-800 bg-purple-500/5">Elite</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {categories.map((cat, catIdx) => (
                        <React.Fragment key={cat.title}>
                            <tr className="bg-zinc-950/80">
                                <td colSpan={5} className="p-3 pl-4 text-xs font-bold text-zinc-500 uppercase tracking-wider sticky left-0 z-10 bg-zinc-950/80 md:bg-transparent">
                                    {cat.title}
                                </td>
                            </tr>
                            {cat.rows.map((row, rowIdx) => (
                                <tr key={rowIdx} className="hover:bg-zinc-900/50 transition-colors">
                                    <td className="p-4 text-zinc-300 font-medium sticky left-0 bg-zinc-900 md:bg-transparent z-10 border-r md:border-r-0 border-zinc-800">
                                       {row.feature}
                                    </td>
                                    <td className="p-4 text-center text-zinc-500 text-xs border-x border-zinc-800/30">{row.free}</td>
                                    <td className="p-4 text-center text-zinc-300 text-xs border-x border-zinc-800 bg-zinc-900/20">{row.start}</td>
                                    <td className="p-4 text-center text-zinc-200 text-xs border-x border-amber-500/10 bg-amber-500/5 font-medium">{row.pro}</td>
                                    <td className="p-4 text-center text-zinc-200 text-xs border-x border-purple-500/10 bg-purple-500/5 font-medium">{row.elite}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
        
        <p className="text-center text-[10px] text-zinc-600 mt-4">
           * Funcionalidades sujeitas a alteração conforme evolução do sistema. O plano Elite inclui custos de domínio por 1 ano.
        </p>
    </div>
  );
};
