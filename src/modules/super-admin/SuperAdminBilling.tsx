'use client';

import React from 'react';
import { useBarber } from '@/context/BarberContext';
import { Receipt, AlertTriangle, CheckCircle2, MoreVertical, DollarSign, RefreshCw, Download } from 'lucide-react';
import { format } from 'date-fns';

export const SuperAdminBilling = () => {
   const { globalInvoices, markInvoicePaid } = useBarber();

   const totalRevenue = globalInvoices.filter(i => i.status === 'PAID').reduce((acc, i) => acc + i.amount, 0);
   const pendingRevenue = globalInvoices.filter(i => i.status === 'PENDING' || i.status === 'OVERDUE').reduce((acc, i) => acc + i.amount, 0);

   const getStatusStyle = (status: string) => {
      switch(status) {
         case 'PAID': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
         case 'OVERDUE': return 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse';
         case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
         default: return 'bg-zinc-800 text-zinc-400';
      }
   };

   return (
      <div className="min-h-screen bg-zinc-950 space-y-6 animate-fade-in pb-20">
         <div className="border-b border-zinc-800 pb-6 flex justify-between items-center">
            <div>
               <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                  <Receipt className="w-8 h-8 text-emerald-500" /> Faturamento Global
               </h2>
               <p className="text-zinc-400 text-sm">Controle de receitas, faturas e inadimplência.</p>
            </div>
         </div>

         {/* KPIs */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
               <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Receita Realizada (Total)</p>
                  <h3 className="text-3xl font-bold text-white">${totalRevenue.toFixed(2)}</h3>
               </div>
               <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500"><DollarSign className="w-8 h-8"/></div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
               <div>
                  <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Pendente / Em Atraso</p>
                  <h3 className="text-3xl font-bold text-amber-500">${pendingRevenue.toFixed(2)}</h3>
               </div>
               <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500"><AlertTriangle className="w-8 h-8"/></div>
            </div>
         </div>

         {/* INVOICE LIST */}
         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
               <h3 className="font-bold text-white">Histórico de Faturas</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm text-zinc-400">
                  <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold text-xs">
                     <tr>
                        <th className="px-6 py-4">Fatura ID</th>
                        <th className="px-6 py-4">Cliente (Tenant)</th>
                        <th className="px-6 py-4">Plano</th>
                        <th className="px-6 py-4">Vencimento</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Valor</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                     {globalInvoices.map(inv => (
                        <tr key={inv.id} className="hover:bg-zinc-800/30 transition-colors">
                           <td className="px-6 py-4 font-mono text-xs">#{inv.id.toUpperCase()}</td>
                           <td className="px-6 py-4 font-bold text-white">{inv.tenantName}</td>
                           <td className="px-6 py-4"><span className="bg-zinc-950 border border-zinc-800 px-2 py-1 rounded text-xs font-bold">{inv.planName}</span></td>
                           <td className="px-6 py-4">{format(inv.dueDate, 'dd/MM/yyyy')}</td>
                           <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase ${getStatusStyle(inv.status)}`}>
                                 {inv.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right font-bold text-white">${inv.amount.toFixed(2)}</td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 {inv.status !== 'PAID' && (
                                    <button 
                                       onClick={() => markInvoicePaid(inv.id)}
                                       className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                       title="Mark as Paid"
                                    >
                                       <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                 )}
                                 <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors" title="Download PDF">
                                    <Download className="w-4 h-4" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};
