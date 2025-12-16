'use client';

import React from 'react';
import { useReferral } from '@/context/ReferralContext';
import { Link2, Users, DollarSign, ToggleLeft, ToggleRight, Plus, Copy } from 'lucide-react';

export const SuperAdminPartners: React.FC = () => {
  const { partners, links, sales, generateReferralLink, togglePartnerActive } = useReferral();

  // const totalSalesCount = sales.length;
  const totalApprovedCommission = sales
    .filter(s => s.status === 'AVAILABLE')
    .reduce((sum, s) => sum + s.commissionAmountBRL, 0);

  const copyToClipboard = (text: string) => {
     navigator.clipboard.writeText(text);
     alert(`Code ${text} copied!`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 px-4 py-8 animate-fade-in pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
               <Users className="w-6 h-6 text-purple-500" /> Programa de Parceiros
            </h1>
            <p className="text-sm text-zinc-400">
              Acompanhe donos, staff e influencers que estão indicando o BarberFlow.
            </p>
          </div>
          <div className="flex gap-3 text-xs">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-zinc-400">Parceiros ativos</p>
                <p className="font-semibold text-white">
                  {partners.filter(p => p.isActive).length}
                </p>
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-zinc-400">Comissão aprovada</p>
                <p className="font-semibold text-white">
                  R$ {totalApprovedCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-sm font-semibold text-white">Base de Parceiros</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="text-zinc-500 border-b border-zinc-800 bg-zinc-950/50">
                  <th className="py-3 pl-4 pr-2 font-medium">Nome</th>
                  <th className="py-3 px-2 font-medium">Tipo</th>
                  <th className="py-3 px-2 font-medium text-center">% Comissão</th>
                  <th className="py-3 px-2 font-medium">Códigos Ativos</th>
                  <th className="py-3 px-2 font-medium text-center">Vendas</th>
                  <th className="py-3 px-2 font-medium text-center">Status</th>
                  <th className="py-3 pr-4 pl-2 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {partners.map((p) => {
                  const partnerLinks = links.filter(l => l.partnerId === p.id && l.isActive);
                  const partnerSales = sales.filter(s => s.partnerId === p.id);

                  return (
                    <tr key={p.id} className="hover:bg-zinc-800/20 transition-colors">
                      <td className="py-3 pl-4 pr-2">
                        <div className="font-semibold text-zinc-200">{p.displayName}</div>
                        {p.tenantId && <div className="text-[10px] text-zinc-500">Tenant: {p.tenantId}</div>}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                           p.partnerType === 'PARTNER_PRO' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                           p.partnerType === 'OWNER' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                           p.partnerType === 'STAFF' ? 'bg-zinc-800 text-zinc-200 border-zinc-700' :
                           'bg-zinc-900 text-zinc-400 border-zinc-800'
                        }`}>
                           {p.partnerType}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center text-zinc-300 font-mono">
                        {p.baseCommissionPercent}%
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex flex-col gap-1">
                           {partnerLinks.length === 0 ? (
                              <span className="text-zinc-600 italic">Sem códigos</span>
                           ) : (
                              partnerLinks.map(l => (
                                 <button 
                                    key={l.id} 
                                    onClick={() => copyToClipboard(l.code)}
                                    className="flex items-center gap-1 text-[10px] bg-zinc-950 border border-zinc-700 px-1.5 py-0.5 rounded w-max hover:border-amber-500 transition-colors group"
                                    title="Click to Copy"
                                 >
                                    <Link2 className="w-3 h-3 text-zinc-500 group-hover:text-amber-500" />
                                    <span className="text-zinc-300 font-mono">{l.code}</span>
                                    <Copy className="w-2.5 h-2.5 text-zinc-600 group-hover:text-white opacity-0 group-hover:opacity-100" />
                                 </button>
                              ))
                           )}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`font-bold ${partnerSales.length > 0 ? 'text-white' : 'text-zinc-600'}`}>
                           {partnerSales.length}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => togglePartnerActive(p.id)}
                          className="inline-flex items-center gap-1 text-[11px] justify-center"
                        >
                          {p.isActive ? (
                            <>
                              <ToggleRight className="w-5 h-5 text-emerald-500" />
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-5 h-5 text-zinc-600" />
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 pr-4 pl-2 text-right">
                        <button
                          type="button"
                          onClick={() => generateReferralLink(p.id)}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-1.5 rounded-md bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition"
                        >
                          <Plus className="w-3 h-3" />
                          Novo Código
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
