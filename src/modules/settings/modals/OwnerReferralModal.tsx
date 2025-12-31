'use client';


import React from 'react';
import { X, Check } from 'lucide-react';

interface OwnerReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerReferralLink: string;
}

export const OwnerReferralModal: React.FC<OwnerReferralModalProps> = ({
  isOpen,
  onClose,
  ownerReferralLink,
}) => {
  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ownerReferralLink);
    alert('Link copiado para a área de transferência!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-800 p-6 shadow-2xl animate-fade-in relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-2">Seu link de indicação</h3>
        
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
          Sempre que uma barbearia assinar um plano anual usando esse link, você recebe
          <span className="text-emerald-400 font-bold"> 100% da comissão</span> dessa venda.
        </p>

        <div className="flex items-center gap-2 mb-6">
          <input
            readOnly
            value={ownerReferralLink}
            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-300 outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-3 text-sm font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-900 transition-all shadow-lg shadow-emerald-500/20"
          >
            Copiar
          </button>
        </div>

        <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800">
           <p className="text-xs text-zinc-500 text-center">
              Dica: Compartilhe em grupos de barbeiros no WhatsApp ou no seu Instagram.
           </p>
        </div>
      </div>
    </div>
  );
};
