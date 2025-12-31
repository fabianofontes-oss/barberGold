'use client';

import React from 'react';
import { Lock, TrendingUp, Sparkles, BarChart2, Share2, Rocket } from 'lucide-react';

export const ReferralManager = () => {
   return (
      <div className="h-full flex flex-col items-center justify-center animate-fade-in pb-20 relative overflow-hidden">
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl mix-blend-screen"></div>
         </div>
         
         <div className="relative z-10 max-w-lg w-full bg-zinc-900/80 border border-zinc-800 p-8 md:p-12 rounded-3xl shadow-2xl text-center backdrop-blur-xl">
            <div className="w-24 h-24 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-zinc-800 shadow-inner group">
               <Lock className="w-10 h-10 text-zinc-600 group-hover:text-amber-500 transition-colors duration-500" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
               <TrendingUp className="w-8 h-8 text-amber-500" /> Growth Command
            </h2>
            
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-8 opacity-30"></div>

            <p className="text-zinc-400 mb-10 leading-relaxed text-sm md:text-base">
               O módulo de <b>Inteligência de Crescimento</b> está reservado para o futuro. 
               <br/>Aqui você poderá gerenciar campanhas, influencers e automação de marketing.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
               <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center gap-2 opacity-40 hover:opacity-60 transition-opacity">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  <div className="text-center">
                     <h4 className="font-bold text-zinc-300 text-xs">Social AI</h4>
                     <p className="text-[10px] text-zinc-600">Posts Automáticos</p>
                  </div>
               </div>
               <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center gap-2 opacity-40 hover:opacity-60 transition-opacity">
                  <Rocket className="w-6 h-6 text-emerald-400" />
                  <div className="text-center">
                     <h4 className="font-bold text-zinc-300 text-xs">Influencers</h4>
                     <p className="text-[10px] text-zinc-600">Gestão de Parceiros</p>
                  </div>
               </div>
               <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center gap-2 opacity-40 hover:opacity-60 transition-opacity">
                  <BarChart2 className="w-6 h-6 text-blue-400" />
                  <div className="text-center">
                     <h4 className="font-bold text-zinc-300 text-xs">Analytics</h4>
                     <p className="text-[10px] text-zinc-600">ROI em Tempo Real</p>
                  </div>
               </div>
               <div className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50 flex flex-col items-center gap-2 opacity-40 hover:opacity-60 transition-opacity">
                  <Share2 className="w-6 h-6 text-pink-400" />
                  <div className="text-center">
                     <h4 className="font-bold text-zinc-300 text-xs">Viralização</h4>
                     <p className="text-[10px] text-zinc-600">Links Rastreados</p>
                  </div>
               </div>
            </div>

            <button disabled className="w-full bg-zinc-800 text-zinc-500 font-bold py-4 rounded-xl border border-zinc-700 cursor-not-allowed tracking-wider uppercase text-xs hover:bg-zinc-800/80 transition-colors">
               Módulo Bloqueado
            </button>
         </div>
      </div>
   );
};
