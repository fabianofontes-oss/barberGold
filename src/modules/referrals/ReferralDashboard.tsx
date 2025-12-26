'use client';


import React from 'react';
import { useBarber } from '@/context/BarberContext';
import { useReferral } from '@/context/ReferralContext';
import { Trophy, Copy, Users, Check, Lock, Percent, Plus, Banknote, Sparkles, TrendingUp, ArrowRight, AlertCircle, Info, Rocket, Zap, Unlock, AlertTriangle } from 'lucide-react';
import { OwnerReferralModal } from '@/modules/settings/modals/OwnerReferralModal';
import { buildReferralUrl, normalizeReferralCode } from '@/domain/referrals/link';

export const ReferralDashboard: React.FC = () => {
  const { shopSettings, updateShopSettings, currentUser } = useBarber();
  const { sales, partners } = useReferral();
  const [isOwnerModalOpen, setIsOwnerModalOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  if (!currentUser) return null;

  const config = shopSettings.referralConfig || {
    enabled: true,
    ownerReferralCode: 'CODE',
    allowStaffToParticipate: false,
    staffSharePercent: 70,
    ownerSharePercent: 30,
  };

  const handleToggleStaff = () => {
    updateShopSettings({
      referralConfig: {
        ...config,
        allowStaffToParticipate: !config.allowStaffToParticipate,
        staffSharePercent: 70, // Enforce Fixed
        ownerSharePercent: 30, // Enforce Fixed
      },
    });
  };

  const ownerLink = `https://barberflow.app/r/${config.ownerReferralCode || 'CODE'}`;
  const ownerCode = normalizeReferralCode(config.ownerReferralCode || 'CODE');
  const ownerUrl = buildReferralUrl({ kind: 'OWNER', code: ownerCode });

  const handleCopy = () => {
     navigator.clipboard.writeText(ownerUrl);
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  const ownerPartner = partners.find((p) => p.partnerType === 'OWNER');
  const ownerSales = sales.filter((s) => s.partnerId === ownerPartner?.id);

  // Only Owner sees this dashboard content
  if (currentUser.role !== 'OWNER') {
     return (
        <div className="h-full flex items-center justify-center text-zinc-500">
           Acesso restrito ao proprietário.
        </div>
     );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
         <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500 flex-shrink-0" /> Programa de Indicações
         </h1>
         <p className="text-zinc-400 text-xs sm:text-sm">
            Transforme sua rede de contatos em receita extra.
         </p>
      </div>

      {/* --- HERO BANNER: THE "ADVERTISEMENT" (OWNER) --- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-zinc-900 to-black border border-emerald-500/30 shadow-2xl group hover:border-emerald-500/50 transition-all duration-500">
         
         {/* Background FX */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
         <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
         <div className="absolute right-10 top-10 opacity-5 transform rotate-12 pointer-events-none">
            <Banknote className="w-64 h-64 text-emerald-400" />
         </div>

         <div className="relative z-10 flex flex-col lg:flex-row items-center p-5 sm:p-8 md:p-12 gap-6 sm:gap-10">
            
            {/* Left: Copywriting (The Pitch) */}
            <div className="flex-1 space-y-6 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Comissão Exclusiva de Dono</span>
               </div>
               
               <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                  Sua nova fonte de <br className="hidden sm:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Faturamento Extra.</span>
               </h2>
               
               <p className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Indique barbearias e receba comissão sobre o <strong className="text-white">1º pagamento anual</strong>. Suas indicações diretas = 100% pra você.
               </p>

               <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-300">
                     <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /></div>
                     Pagamento em dinheiro
                  </div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-300">
                     <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /></div>
                     Sem limites
                  </div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-300">
                     <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /></div>
                     D+60 segurança
                  </div>
               </div>
            </div>

            {/* Right: The Golden Ticket (The Link) */}
            <div className="w-full lg:max-w-md">
               <div className="bg-zinc-950/60 backdrop-blur-xl border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
                  {/* Glow behind card */}
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none"></div>
                  
                  <label className="block text-[10px] sm:text-xs font-bold text-zinc-500 uppercase mb-2 sm:mb-3 text-center tracking-widest">
                     Seu Link Exclusivo (Owner)
                  </label>
                  
                  <div className="bg-black/50 border border-zinc-700/50 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 flex items-center justify-center relative">
                     <p className="text-emerald-400 font-mono font-bold text-sm sm:text-lg truncate tracking-tight">
                        barberflow.app/r/<span className="text-white">{ownerCode}</span>
                     </p>
                  </div>

                  <button
                     onClick={handleCopy}
                     className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3 sm:py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 active:scale-95 mb-3 sm:mb-4 text-sm sm:text-base"
                  >
                     {copied ? (
                        <>Copiado! <Check className="w-4 h-4 sm:w-5 sm:h-5" /></>
                     ) : (
                        <>Copiar link <Copy className="w-4 h-4 sm:w-5 sm:h-5" /></>
                     )}
                  </button>
                  
                  <p className="text-[9px] sm:text-[10px] text-zinc-500 text-center leading-tight">
                     Comissão sobre 1º pagamento anual. Liberada em D+60 (segurança contra estornos).
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* --- STAFF PROGRAM SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
         <div className="lg:col-span-2">
            {!config.allowStaffToParticipate ? (
               // --- INACTIVE STATE (ALERT CARD) ---
               <div className="h-full rounded-3xl border border-amber-500/30 bg-amber-950/20 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-amber-500/50 transition-all">
                  {/* Alert Icon Background */}
                  <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-4 -translate-y-4 pointer-events-none">
                     <AlertTriangle className="w-32 h-32 text-amber-500" />
                  </div>
                  
                  <div className="w-16 h-16 bg-zinc-900 border border-amber-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-amber-900/10">
                     <Lock className="w-8 h-8 text-amber-500" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                     Multiplicação de Ganhos <span className="text-red-500">Desativada</span>
                  </h3>
                  
                  <p className="text-zinc-400 max-w-md mb-8 text-sm leading-relaxed">
                     Você está deixando dinheiro na mesa. Ative o programa para permitir que seus barbeiros vendam por você e receba <strong className="text-amber-500">30% de comissão</strong> sem esforço adicional.
                  </p>

                  <button 
                     onClick={handleToggleStaff}
                     className="bg-white text-zinc-900 hover:bg-zinc-200 font-bold py-3 px-8 rounded-xl shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                  >
                     <Zap className="w-4 h-4 text-amber-600 fill-current" /> Ativar Agora
                  </button>
               </div>
            ) : (
               // --- ACTIVE STATE (PREMIUM CARD) ---
               <div className="h-full rounded-3xl border p-8 transition-all relative overflow-hidden flex flex-col justify-between group bg-gradient-to-br from-orange-950 via-zinc-900 to-black border-orange-500/30">
                  {/* Background Glow */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                  
                  <div className="relative z-10 mb-6">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                           <Users className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="text-2xl font-bold text-white">Multiplique seus ganhos com o seu time</h3>
                           <p className="text-sm text-zinc-400 mt-1">Ative links individuais para cada barbeiro. Eles ganham por indicar e você ainda recebe uma parte.</p>
                        </div>
                     </div>
                     
                     <div className="text-zinc-400 text-sm leading-relaxed space-y-4">
                        <p>
                           Quando você ativa o programa para a equipe, cada colaborador (staff) recebe um link próprio para indicar outras barbearias para o BarberFlow.
                        </p>
                        <p>
                           Sempre que uma barbearia fechar um <strong className="text-white">PLANO ANUAL</strong> usando o link de um dos seus barbeiros, a comissão dessa venda é dividida automaticamente.
                        </p>
                        <p>
                           Nas indicações feitas pelos links da equipe, a mesma regra se aplica: a comissão é calculada sobre o primeiro pagamento do plano anual e é liberada em até 60 dias após a confirmação, sendo dividida automaticamente em 70% para o staff e 30% para você (dono).
                        </p>
                     </div>
                  </div>

                  <div className="relative z-10 flex items-center gap-4 mb-8">
                     <div className="flex-1 bg-zinc-950/80 border border-zinc-800 p-4 rounded-xl text-center shadow-lg">
                        <span className="block text-3xl font-bold text-white mb-1">70%</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Para o Barbeiro</span>
                     </div>
                     <div className="text-zinc-600 font-bold">+</div>
                     <div className="flex-1 bg-zinc-950/80 border border-orange-500/30 p-4 rounded-xl text-center relative overflow-hidden shadow-lg">
                        <div className="absolute inset-0 bg-orange-500/5"></div>
                        <span className="block text-3xl font-bold text-orange-500 mb-1 relative z-10">30%</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 relative z-10">Para Você (Dono)</span>
                     </div>
                  </div>

                  {/* Upsell / Fear Removal */}
                  <div className="relative z-10 bg-gradient-to-r from-orange-950/20 to-zinc-950/50 rounded-xl p-4 border border-orange-500/20 mb-6 text-sm">
                     <p className="text-zinc-400 mb-2 leading-relaxed">
                        Você não perde nada das suas indicações diretas: tudo o que for vendido pelo seu próprio link continua com a comissão inteira para você. A divisão 70/30 acontece apenas nas vendas feitas pelos links dos colaboradores.
                     </p>
                     <p className="text-orange-400 font-bold leading-relaxed flex gap-2">
                        <Rocket className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                           Sem ativar o programa para o time, você ganha R$ 0,00 sobre as indicações deles. Com o programa ativo, você passa a receber automaticamente 30% de tudo que o seu time trouxer.
                        </span>
                     </p>
                  </div>

                  {/* Toggle Button */}
                  <div className="relative z-10 bg-zinc-950/50 rounded-xl p-4 border border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                     <div className="text-xs text-zinc-400">
                        🟢 Seus barbeiros já podem acessar os links no painel deles.
                     </div>
                     <button
                        onClick={handleToggleStaff}
                        className="whitespace-nowrap px-6 py-2.5 rounded-lg text-xs font-bold transition-all border shadow-lg bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                     >
                        Desativar Equipe
                     </button>
                  </div>
               </div>
            )}
         </div>

         {/* SMALL STATS CARD */}
         <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
            <div className="relative z-10">
               <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 border border-zinc-700">
                  <TrendingUp className="w-8 h-8 text-white" />
               </div>
               <h3 className="text-white font-bold text-lg mb-2">Potencial de Ganho</h3>
               <p className="text-zinc-500 text-xs mb-6">
                  Se 5 barbeiros fizerem 1 venda por mês:
               </p>
               <div className="text-4xl font-bold text-emerald-500 mb-2">
                  R$ 1.250<span className="text-lg text-emerald-500/50">/mês</span>
               </div>
               <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider">
                  Renda passiva estimada
               </p>
            </div>
         </div>
      </div>

      {/* --- RULES CARD (collapsible on mobile) --- */}
      <details className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group">
         <summary className="p-4 sm:p-6 cursor-pointer flex items-center justify-between">
            <span className="text-white font-bold flex items-center gap-2 text-sm sm:text-lg">
               <Info className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" /> Ver regras do programa
            </span>
            <span className="text-zinc-500 text-xs group-open:rotate-180 transition-transform">▼</span>
         </summary>
         <ul className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-2 text-xs sm:text-sm text-zinc-400 list-disc list-outside pl-5 leading-relaxed">
            <li>Comissão apenas em <strong className="text-zinc-300">plano anual</strong>, no <strong className="text-zinc-300">1º pagamento</strong>.</li>
            <li>Liberada em <strong className="text-zinc-300">D+60</strong> (prazo de segurança contra estornos).</li>
            <li>Se houver estorno/cancelamento, a comissão é ajustada.</li>
            <li className="text-red-400/80">Proibida auto-indicação.</li>
         </ul>
      </details>

      {/* LISTA DE COMISSÕES (OWNER) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
         <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm sm:text-lg">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" /> Suas comissões
         </h3>
         {ownerSales.length === 0 ? (
            <div className="text-center py-8">
               <p className="text-zinc-500 text-sm mb-2">Nenhuma comissão ainda</p>
               <p className="text-zinc-600 text-xs">Compartilhe seu link e comece a ganhar!</p>
            </div>
         ) : (
            <div className="space-y-3">
               {/* Mobile: Cards */}
               <div className="block sm:hidden space-y-2">
                  {ownerSales.map((s) => (
                     <div key={s.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                           <span className="font-mono text-[10px] text-zinc-400">{s.referralCode}</span>
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              s.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400' :
                              s.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-red-500/10 text-red-400'
                           }`}>
                              {s.status === 'PENDING' ? 'Aguardando' : s.status === 'AVAILABLE' ? 'Disponível' : s.status}
                           </span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] text-zinc-500">
                              {s.status === 'PENDING' && s.availableAt ? `Libera ${new Date(s.availableAt).toLocaleDateString('pt-BR')}` : ''}
                           </span>
                           <span className="font-bold text-emerald-400 text-sm">
                              R$ {(s.ownerCommissionAmountBRL ?? s.commissionAmountBRL).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
               {/* Desktop: Table */}
               <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                     <thead>
                        <tr className="text-zinc-500 border-b border-zinc-800 text-xs">
                           <th className="py-2 text-left">Código</th>
                           <th className="py-2 text-left">Status</th>
                           <th className="py-2 text-left">Liberação</th>
                           <th className="py-2 text-right">Valor</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-800/50">
                        {ownerSales.map((s) => (
                           <tr key={s.id} className="text-zinc-300">
                              <td className="py-2 font-mono text-xs">{s.referralCode}</td>
                              <td className="py-2">
                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                    s.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    s.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                 }`}>
                                    {s.status === 'PENDING' ? 'Aguardando D+60' : s.status === 'AVAILABLE' ? 'Disponível' : s.status}
                                 </span>
                              </td>
                              <td className="py-2 text-xs text-zinc-400">
                                 {s.availableAt ? new Date(s.availableAt).toLocaleDateString('pt-BR') : '—'}
                              </td>
                              <td className="py-2 text-right font-bold text-emerald-400">
                                 R$ {(s.ownerCommissionAmountBRL ?? s.commissionAmountBRL).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </div>

      <OwnerReferralModal 
         isOpen={isOwnerModalOpen} 
         onClose={() => setIsOwnerModalOpen(false)} 
         ownerReferralLink={ownerUrl} 
      />
    </div>
  );
};
