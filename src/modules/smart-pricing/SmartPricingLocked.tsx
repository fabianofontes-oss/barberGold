'use client';


import React, { useState } from 'react';
import { Lock, TrendingUp, Zap, Activity, BarChart2, Coins, Repeat, Crown, Gem, CreditCard, ArrowRight } from 'lucide-react';

export const SmartPricingLocked = () => {
   const [activeTab, setActiveTab] = useState<'PRICING' | 'SUBSCRIPTION'>('PRICING');

   return (
      <div className="h-full flex flex-col items-center justify-center animate-fade-in pb-20 relative overflow-hidden">
         {/* Background Stock Market Effect */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl mix-blend-screen animate-pulse duration-5000 ${activeTab === 'PRICING' ? 'bg-emerald-500/5' : 'bg-purple-500/5'}`}></div>
            <div className={`absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl mix-blend-screen ${activeTab === 'PRICING' ? 'bg-amber-500/5' : 'bg-blue-500/5'}`}></div>
            {/* Fake Chart Lines */}
            <svg className="absolute bottom-0 left-0 w-full h-64 opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0 100 L0 80 L10 70 L20 85 L30 60 L40 65 L50 40 L60 50 L70 20 L80 30 L90 10 L100 0 L100 100 Z" fill="url(#grad)" />
               <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                     <stop offset="0%" stopColor={activeTab === 'PRICING' ? '#f59e0b' : '#a855f7'} stopOpacity="1" />
                     <stop offset="100%" stopColor={activeTab === 'PRICING' ? '#f59e0b' : '#a855f7'} stopOpacity="0" />
                  </linearGradient>
               </defs>
            </svg>
         </div>
         
         <div className="relative z-10 max-w-2xl w-full bg-zinc-900/80 border border-zinc-800 p-8 rounded-3xl shadow-2xl text-center backdrop-blur-xl flex flex-col items-center">
            
            {/* Module Switcher Tabs */}
            <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 mb-8 w-full max-w-sm">
               <button 
                  onClick={() => setActiveTab('PRICING')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'PRICING' ? 'bg-zinc-800 text-amber-500 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                  <TrendingUp className="w-4 h-4" /> Dynamic Pricing
               </button>
               <button 
                  onClick={() => setActiveTab('SUBSCRIPTION')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'SUBSCRIPTION' ? 'bg-zinc-800 text-purple-500 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                  <Repeat className="w-4 h-4" /> Barber Club™
               </button>
            </div>

            {/* --- CONTENT: DYNAMIC PRICING --- */}
            {activeTab === 'PRICING' && (
               <div className="animate-fade-in w-full flex flex-col items-center">
                  <div className="w-20 h-20 bg-zinc-950 rounded-full flex items-center justify-center mb-6 border-4 border-zinc-800 shadow-inner group relative">
                     <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/30 animate-spin-slow"></div>
                     <TrendingUp className="w-8 h-8 text-amber-500" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-2">Smart Yield Engine</h2>
                  <div className="inline-block bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 mb-6">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                         <Activity className="w-3 h-3" /> Alpha Lab • Restricted
                      </span>
                  </div>

                  <p className="text-zinc-400 mb-8 text-sm leading-relaxed max-w-md">
                     O primeiro sistema de <b>Precificação Dinâmica</b> para barbearias.
                     Transforme sua agenda em uma bolsa de valores. Aumente preços na escassez, atraia volume na ociosidade.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-lg">
                     <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50 flex flex-col items-center hover:border-amber-500/30 transition-colors">
                        <Zap className="w-6 h-6 text-amber-500 mb-2" />
                        <span className="text-xs text-zinc-500 font-bold uppercase">Surge Pricing</span>
                        <span className="text-[10px] text-zinc-600">Lucro na Alta Demanda</span>
                     </div>
                     <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50 flex flex-col items-center hover:border-emerald-500/30 transition-colors">
                        <Coins className="w-6 h-6 text-emerald-500 mb-2" />
                        <span className="text-xs text-zinc-500 font-bold uppercase">Smart Deals</span>
                        <span className="text-[10px] text-zinc-600">Preenchimento de Vagas</span>
                     </div>
                  </div>
               </div>
            )}

            {/* --- CONTENT: SUBSCRIPTION CLUB --- */}
            {activeTab === 'SUBSCRIPTION' && (
               <div className="animate-fade-in w-full flex flex-col items-center">
                  <div className="w-20 h-20 bg-zinc-950 rounded-full flex items-center justify-center mb-6 border-4 border-zinc-800 shadow-inner group relative">
                     <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/30 animate-spin-slow"></div>
                     <Crown className="w-8 h-8 text-purple-500" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-2">Membership Economy</h2>
                  <div className="inline-block bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 mb-6">
                      <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest flex items-center gap-2">
                         <Gem className="w-3 h-3" /> Recurring Revenue Model
                      </span>
                  </div>

                  <p className="text-zinc-400 mb-8 text-sm leading-relaxed max-w-md">
                     Transforme clientes avulsos em <b>Assinantes Recorrentes</b>.
                     Garanta receita no dia 01 (MRR) e automatize o comissionamento por &quot;Créditos de Serviço&quot;.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-lg">
                     {/* MOCK PLAN CARD 1 */}
                     <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 relative group overflow-hidden text-left">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                           <Crown className="w-12 h-12 text-white" />
                        </div>
                        <h4 className="text-zinc-300 font-bold text-sm">Gold Member</h4>
                        <div className="flex items-baseline gap-1 mt-1 mb-2">
                           <span className="text-xl font-bold text-white">$89</span>
                           <span className="text-[10px] text-zinc-500">/mês</span>
                        </div>
                        <ul className="text-[10px] text-zinc-500 space-y-1">
                           <li className="flex items-center gap-1"><span className="text-emerald-500">✓</span> 2 Cortes / Mês</li>
                           <li className="flex items-center gap-1"><span className="text-emerald-500">✓</span> Barba Ilimitada</li>
                        </ul>
                     </div>

                     {/* MOCK PLAN CARD 2 */}
                     <div className="bg-gradient-to-br from-zinc-900 to-black p-4 rounded-xl border border-purple-500/30 relative group overflow-hidden text-left">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                           <Gem className="w-12 h-12 text-purple-500" />
                        </div>
                        <h4 className="text-white font-bold text-sm flex items-center gap-1">Black Card <span className="text-[8px] bg-purple-500 text-white px-1 rounded">VIP</span></h4>
                        <div className="flex items-baseline gap-1 mt-1 mb-2">
                           <span className="text-xl font-bold text-purple-400">$149</span>
                           <span className="text-[10px] text-zinc-500">/mês</span>
                        </div>
                        <ul className="text-[10px] text-zinc-400 space-y-1">
                           <li className="flex items-center gap-1"><span className="text-purple-500">✓</span> Cortes Ilimitados</li>
                           <li className="flex items-center gap-1"><span className="text-purple-500">✓</span> Bebida Grátis</li>
                        </ul>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-zinc-500 bg-zinc-950/50 px-4 py-2 rounded-lg border border-zinc-800">
                     <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> Cobrança Automática</span>
                     <span className="w-px h-3 bg-zinc-800"></span>
                     <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3" /> MRR Dashboard</span>
                  </div>
               </div>
            )}

            <button disabled className="mt-8 w-full max-w-md bg-zinc-800 text-zinc-500 font-bold py-4 rounded-xl border border-zinc-700 cursor-not-allowed uppercase tracking-wider text-xs flex items-center justify-center gap-2">
               <Lock className="w-3 h-3" /> Módulo em Fase de Teste
            </button>
         </div>
      </div>
   );
};
