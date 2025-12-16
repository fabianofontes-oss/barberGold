'use client';

import React from 'react';
import { useBarber } from '@/context/BarberContext';
import { Trophy, ArrowRight } from 'lucide-react';

export const ReferralSettingsPanel: React.FC = () => {
  const { setView } = useBarber();

  return (
    <div className="max-w-2xl mx-auto py-10 animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center flex flex-col items-center">
         <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
            <Trophy className="w-8 h-8 text-emerald-500" />
         </div>
         <h2 className="text-xl font-bold text-white mb-2">Área de Indicações Atualizada</h2>
         <p className="text-zinc-400 text-sm mb-8 max-w-sm">
            O Programa de Indicações agora tem uma área exclusiva no menu principal para facilitar o acompanhamento dos seus ganhos.
         </p>
         
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
