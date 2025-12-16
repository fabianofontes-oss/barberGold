'use client';

import React from 'react';
import { useBarber } from '@/context/BarberContext';
import { Trophy, ArrowRight, Copy, Check, Users, Info } from 'lucide-react';
import { buildReferralUrl, normalizeReferralCode } from '@/domain/referrals/link';

export const ReferralSettingsPanel: React.FC = () => {
  const { setView, shopSettings, updateShopSettings } = useBarber();

  const config = shopSettings.referralConfig || {
    enabled: true,
    ownerReferralCode: 'CODE',
    allowStaffToParticipate: false,
    programCommissionPercent: 20,
    staffSharePercent: 70,
    ownerSharePercent: 30,
  };

  const ownerCode = normalizeReferralCode(config.ownerReferralCode || 'CODE');
  const ownerLink = buildReferralUrl({ kind: 'OWNER', code: ownerCode });

  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ownerLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleStaff = () => {
    updateShopSettings({
      referralConfig: {
        ...config,
        allowStaffToParticipate: !config.allowStaffToParticipate,
        staffSharePercent: 70,
        ownerSharePercent: 30,
      },
    });
  };

  return (
    <div className="max-w-lg mx-auto py-6 px-4 sm:py-10 sm:px-0 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-8 flex flex-col">
         {/* Header */}
         <div className="text-center mb-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Programa de Indicações</h2>
            <p className="text-zinc-500 text-xs sm:text-sm">
               Indique e ganhe comissão sobre planos anuais.
            </p>
         </div>

         {/* Owner Link - sempre visível e destacado */}
         <div className="w-full bg-gradient-to-br from-emerald-950/30 to-zinc-950 border border-emerald-500/20 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
               <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Seu link exclusivo</span>
               <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">100% seu</span>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                readOnly
                value={ownerLink}
                className="flex-1 bg-black/60 border border-zinc-700 rounded-lg px-3 py-2.5 text-xs text-emerald-300 font-mono outline-none truncate"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                   copied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-900'
                }`}
              >
                {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar link</>}
              </button>
            </div>
         </div>

         {/* Regras resumidas */}
         <div className="flex items-start gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-3 mb-4 text-[10px] text-zinc-500">
            <Info className="w-4 h-4 text-zinc-600 flex-shrink-0 mt-0.5" />
            <span>
               Comissão apenas em <strong className="text-zinc-300">plano anual</strong>, no <strong className="text-zinc-300">primeiro pagamento</strong>. Liberação em <strong className="text-zinc-300">D+60</strong>.
            </span>
         </div>

         {/* Toggle da equipe */}
         <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-amber-500" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-white">Ativar links da equipe</p>
                   <p className="text-[10px] text-zinc-500 mt-0.5">
                     Split fixo: <strong className="text-amber-400">70%</strong> staff / <strong className="text-zinc-300">30%</strong> você
                   </p>
                 </div>
              </div>
              {/* Custom toggle switch */}
              <button
                type="button"
                onClick={handleToggleStaff}
                className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                   config.allowStaffToParticipate ? 'bg-amber-500' : 'bg-zinc-700'
                }`}
              >
                 <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    config.allowStaffToParticipate ? 'translate-x-6' : 'translate-x-1'
                 }`} />
              </button>
            </div>
         </div>
         
         <button 
            onClick={() => setView('REFERRALS')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-sm"
         >
            Ver painel completo <ArrowRight className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
};
