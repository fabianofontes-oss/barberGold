'use client';

import React from 'react';
import { useBarber } from '@/context/BarberContext';
import { Trophy, ArrowRight, Copy } from 'lucide-react';
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ownerLink);
    alert('Link copiado para a área de transferência!');
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
    <div className="max-w-2xl mx-auto py-10 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center flex flex-col items-center">
         <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
            <Trophy className="w-8 h-8 text-emerald-500" />
         </div>
         <h2 className="text-xl font-bold text-white mb-2">Área de Indicações</h2>
         <p className="text-zinc-400 text-sm mb-8 max-w-sm">
            Controle o programa de indicações: seu link do owner é sempre ativo e você pode (opcionalmente) liberar links para a equipe.
         </p>

         <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 mb-6 text-left">
            <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2">Seu link (Owner)</p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={ownerLink}
                className="flex-1 bg-black/40 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-bold text-xs flex items-center gap-2"
              >
                <Copy className="w-4 h-4" /> Copiar
              </button>
            </div>
            <p className="text-[10px] text-zinc-600 mt-3 leading-relaxed">
              Comissão apenas em <strong className="text-zinc-300">plano anual</strong>, apenas no <strong className="text-zinc-300">primeiro pagamento anual</strong>. Liberação em <strong className="text-zinc-300">D+60</strong>.
            </p>
         </div>

         <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white">Links da equipe</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Quando ativado: split fixo <strong className="text-zinc-300">70%</strong> staff / <strong className="text-zinc-300">30%</strong> owner.
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.allowStaffToParticipate}
                onChange={handleToggleStaff}
                className="w-5 h-5 accent-amber-500"
              />
            </div>
         </div>
         
         <button 
            onClick={() => setView('REFERRALS')}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
         >
            Ir para Indicações <ArrowRight className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
};
