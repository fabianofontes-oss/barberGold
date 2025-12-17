'use client';

import React, { useMemo } from 'react';
import { useReferral } from '@/context/ReferralContext';
import { useBarber } from '@/context/BarberContext';
import { useCurrentReferralPartner } from '@/hooks/useCurrentReferralPartner';
import { Link2, DollarSign, Users, AlertCircle, Copy, Check, TrendingUp } from 'lucide-react';

export const MyReferralsPanel: React.FC = () => {
  const { currentUser } = useBarber();
  const { partner } = useCurrentReferralPartner();
  const { partners, links, sales } = useReferral();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const isOwner = currentUser?.role === 'OWNER';

  // --- Hooks chamados incondicionalmente (antes de qualquer early return) ---
  
  // Staff data
  const staffMyLinks = useMemo(() => {
    if (!partner) return [];
    return links.filter((l) => l.partnerId === partner.id);
  }, [links, partner]);

  const staffMySales = useMemo(() => {
    if (!partner) return [];
    return sales.filter((s) => s.partnerId === partner.id);
  }, [sales, partner]);

  const staffTotals = useMemo(() => {
    const totalSalesCount = staffMySales.length;
    const totalCommission = staffMySales.reduce((sum, s) => sum + (s.staffCommissionAmountBRL || 0), 0);
    return { totalSalesCount, totalCommission };
  }, [staffMySales]);

  // Owner data
  const shopPartners = useMemo(() => {
    return partners.filter(p => {
      if (!p.tenantId) return false;
      if (partner && partner.tenantId) return p.tenantId === partner.tenantId;
      return false;
    });
  }, [partners, partner]);

  const staffPartners = useMemo(() => shopPartners.filter(p => p.partnerType === 'STAFF'), [shopPartners]);
  const staffPartnerIds = useMemo(() => staffPartners.map(p => p.id), [staffPartners]);

  const ownerSales = useMemo(() => sales.filter(s => s.partnerId === partner?.id), [sales, partner]);
  const teamSales = useMemo(() => sales.filter(s => staffPartnerIds.includes(s.partnerId)), [sales, staffPartnerIds]);

  const ownerTotals = useMemo(() => {
    const directCommission = ownerSales.reduce((sum, s) => sum + (s.ownerCommissionAmountBRL || s.commissionAmountBRL || 0), 0);
    const directCount = ownerSales.length;
    const networkCommission = teamSales.reduce((sum, s) => sum + (s.ownerCommissionAmountBRL || 0), 0);
    const networkCount = teamSales.length;
    return {
      direct: directCommission,
      directCount,
      network: networkCommission,
      networkCount,
      total: directCommission + networkCommission,
      totalCount: directCount + networkCount
    };
  }, [ownerSales, teamSales]);

  const ownerMyLinks = useMemo(() => links.filter(l => l.partnerId === partner?.id), [links, partner]);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- Early returns após todos os hooks ---
  if (!currentUser) return null;

  // --- 1. STAFF VIEW ---
  if (!isOwner) {
    if (!partner) {
      return (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-zinc-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-white text-sm">Programa de indicações indisponível</p>
              <p className="text-zinc-400 mt-1 leading-relaxed">
                Peça para o dono da barbearia ativar o programa e criar um link para você.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-xs text-zinc-200 space-y-5 shadow-lg relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-1000 pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-amber-500 mb-1">Growth Partner</p>
            <h2 className="text-lg font-bold text-white">Meus Resultados</h2>
            <p className="text-zinc-400 mt-1 max-w-sm">
              Indique barbearias e ganhe comissão no primeiro pagamento anual (liberação D+60).
            </p>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-right min-w-[80px]">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase">Indicados</span>
              <span className="text-lg font-bold text-white flex items-center justify-end gap-1">
                {staffTotals.totalSalesCount} <Users className="w-3 h-3 text-zinc-600" />
              </span>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-right min-w-[100px]">
              <span className="block text-[10px] text-zinc-500 font-bold uppercase">Sua Parte</span>
              <span className="text-lg font-bold text-emerald-400 flex items-center justify-end gap-1">
                <span className="text-xs font-normal text-emerald-500/70">R$</span>
                {staffTotals.totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-1 relative z-10">
          {staffMyLinks.length === 0 ? (
            <div className="p-3 text-center text-zinc-500 italic">Aguarde o dono gerar seu link.</div>
          ) : (
            <ul className="space-y-1">
              {staffMyLinks.map((link) => (
                <li key={link.id} className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-zinc-900 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 flex-shrink-0"><Link2 className="w-4 h-4" /></div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">Seu Código</p>
                      <p className="text-sm font-mono font-bold text-white truncate">{link.code}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => handleCopy(link.code, link.id)}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-2 transition-all ${
                      copiedId === link.id ? 'bg-emerald-500 text-zinc-900 border-emerald-500' : 'border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-white'
                    }`}>
                    {copiedId === link.id ? (<>Copiado <Check className="w-3 h-3" /></>) : (<>Copiar <Copy className="w-3 h-3" /></>)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 relative z-10">
          <p className="text-[10px] text-zinc-500 font-bold uppercase mb-3">Comissões</p>
          {staffMySales.length === 0 ? (
            <p className="text-xs text-zinc-500">Nenhuma comissão registrada ainda.</p>
          ) : (
            <div className="space-y-2">
              {staffMySales.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-zinc-400 truncate">{s.referralCode}</p>
                    <p className="text-[10px] text-zinc-600">Libera em: {s.availableAt ? new Date(s.availableAt).toLocaleDateString('pt-BR') : '—'}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      s.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      s.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>{s.status}</span>
                    <span className="font-bold text-emerald-400">R$ {(s.staffCommissionAmountBRL || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- 2. OWNER VIEW (Elegante - Compacto com destaque) ---
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-zinc-900 to-emerald-500/5 p-4 md:p-5 shadow-lg relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl">
              <Link2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] text-amber-400/70 uppercase font-bold tracking-wider">Programa de Indicações</p>
              <p className="text-lg font-bold text-white">Seus Resultados</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="text-center px-4 py-2 bg-zinc-950/50 rounded-xl border border-zinc-800">
              <p className="text-xl font-bold text-amber-400">{ownerTotals.directCount}</p>
              <p className="text-[9px] text-zinc-500 uppercase">Direto</p>
            </div>
            <div className="text-center px-4 py-2 bg-zinc-950/50 rounded-xl border border-zinc-800">
              <p className="text-xl font-bold text-purple-400">{ownerTotals.networkCount}</p>
              <p className="text-[9px] text-zinc-500 uppercase">Rede</p>
            </div>
          </div>
        </div>

        {/* Center: Total (destaque) */}
        <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/30 px-5 py-3 rounded-xl">
          <DollarSign className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="text-[9px] text-emerald-400/70 uppercase font-bold">Total Ganho</p>
            <p className="text-2xl font-bold text-emerald-400">R$ {ownerTotals.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* Right: Link */}
        {ownerMyLinks.length > 0 && (
          <div className="flex items-center gap-2 bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800">
            <div className="text-right">
              <p className="text-[9px] text-zinc-500 uppercase">Seu Código</p>
              <p className="font-mono font-bold text-amber-400">{ownerMyLinks[0].code}</p>
            </div>
            <button 
              type="button" 
              onClick={() => handleCopy(ownerMyLinks[0].code, ownerMyLinks[0].id)}
              className={`p-2 rounded-lg border transition-all ${
                copiedId === ownerMyLinks[0].id 
                  ? 'bg-emerald-500 text-zinc-900 border-emerald-500' 
                  : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
              }`}
            >
              {copiedId === ownerMyLinks[0].id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
