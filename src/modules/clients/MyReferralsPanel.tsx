'use client';

import React, { useMemo } from 'react';
import { useReferral } from '@/context/ReferralContext';
import { useBarber } from '@/context/BarberContext';
import { useCurrentReferralPartner } from '@/hooks/useCurrentReferralPartner';
import { Link2, DollarSign, Users, AlertCircle, Copy, Check, TrendingUp, Share2 } from 'lucide-react';

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

  // --- Early returns apÃ³s todos os hooks ---
  if (!currentUser) return null;

  // --- 1. STAFF VIEW ---
  if (!isOwner) {
    if (!partner) {
      return (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-zinc-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-white text-sm">Programa de indicaÃ§Ãµes indisponÃ­vel</p>
              <p className="text-zinc-400 mt-1 leading-relaxed">
                PeÃ§a para o dono da barbearia ativar o programa e criar um link para vocÃª.
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
              Indique barbearias e ganhe comissÃ£o no primeiro pagamento anual (liberaÃ§Ã£o D+60).
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
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">Seu CÃ³digo</p>
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
          <p className="text-[10px] text-zinc-500 font-bold uppercase mb-3">ComissÃµes</p>
          {staffMySales.length === 0 ? (
            <p className="text-xs text-zinc-500">Nenhuma comissÃ£o registrada ainda.</p>
          ) : (
            <div className="space-y-2">
              {staffMySales.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-zinc-400 truncate">{s.referralCode}</p>
                    <p className="text-[10px] text-zinc-600">Libera em: {s.availableAt ? new Date(s.availableAt).toLocaleDateString('pt-BR') : 'â€”'}</p>
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

  // FunÃ§Ã£o para compartilhar link
  const handleShare = (code: string) => {
    const shareUrl = `https://barberflow.app/r/${code}`;
    const shareText = `ðŸš€ ConheÃ§a o BarberFlow! Use meu cÃ³digo ${code} e comece a faturar mais na sua barbearia!`;
    
    if (navigator.share) {
      navigator.share({ title: 'BarberFlow - IndicaÃ§Ã£o', text: shareText, url: shareUrl });
    } else {
      // Fallback: abre WhatsApp
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    }
  };

  // --- 2. OWNER VIEW ---
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-900 p-5 text-xs text-zinc-200 space-y-6 shadow-lg relative overflow-hidden group">
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-1000 pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-1">IndicaÃ§Ãµes & Rede</p>
          <h2 className="text-xl font-bold text-white">Performance de Parceiro</h2>
          <p className="text-zinc-400 mt-1 max-w-md">Acompanhe seus ganhos diretos e a receita gerada pela sua equipe.</p>
        </div>
        
        {/* Total Recebido + Link ao lado */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 bg-zinc-950/80 p-3 rounded-xl border border-emerald-500/20">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400"><DollarSign className="w-6 h-6" /></div>
            <div>
              <p className="text-[10px] text-emerald-400/70 font-bold uppercase">Total Recebido</p>
              <p className="text-2xl font-bold text-emerald-400">R$ {ownerTotals.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          {/* Link ao lado do Total */}
          {ownerMyLinks.length > 0 && (
            <div className="flex items-center gap-3 bg-zinc-950/80 p-3 rounded-xl border border-emerald-500/20">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 flex-shrink-0"><Link2 className="w-4 h-4" /></div>
              <div className="min-w-0">
                <p className="text-[10px] text-emerald-400/70 font-bold uppercase">Seu CÃ³digo</p>
                <p className="text-sm font-mono font-bold text-white">{ownerMyLinks[0].code}</p>
              </div>
              <button type="button" onClick={() => handleShare(ownerMyLinks[0].code)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-900 text-[10px] font-bold flex items-center gap-2 transition-all">
                Compartilhar <Share2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <div className="bg-zinc-950/50 border border-emerald-500/10 p-4 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-400 mb-1"><Link2 className="w-4 h-4 text-emerald-400" /><span className="font-bold text-xs uppercase">Direto (VocÃª)</span></div>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold text-white">{ownerTotals.directCount}</span>
            <span className="text-sm font-bold text-emerald-400">+ R$ {ownerTotals.direct.toFixed(2)}</span>
          </div>
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-emerald-500" style={{ width: `${ownerTotals.total > 0 ? (ownerTotals.direct / ownerTotals.total) * 100 : 0}%` }}></div>
          </div>
        </div>

        <div className="bg-zinc-950/50 border border-emerald-500/10 p-4 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-400 mb-1"><Users className="w-4 h-4 text-purple-400" /><span className="font-bold text-xs uppercase">Equipe (Rede)</span></div>
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold text-white">{ownerTotals.networkCount}</span>
            <span className="text-sm font-bold text-purple-400">+ R$ {ownerTotals.network.toFixed(2)}</span>
          </div>
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-purple-500" style={{ width: `${ownerTotals.total > 0 ? (ownerTotals.network / ownerTotals.total) * 100 : 0}%` }}></div>
          </div>
        </div>

        <div className="bg-zinc-950/50 border border-emerald-500/10 p-4 rounded-xl flex flex-col justify-center gap-1">
          <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1"><TrendingUp className="w-4 h-4 text-emerald-400" /> Performance</div>
          <p className="text-xs text-zinc-400 leading-relaxed">VocÃª ganha <span className="text-emerald-400 font-bold">100%</span> das suas indicaÃ§Ãµes diretas e uma parte das indicaÃ§Ãµes da equipe.</p>
        </div>
      </div>
    </div>
  );
};
