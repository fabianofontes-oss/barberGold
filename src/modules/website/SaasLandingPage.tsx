'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Scissors, CheckCircle2, TrendingUp, Shield, Globe, Users,
  Zap, AlertTriangle, DollarSign, Calculator, CalendarCheck, Link, Menu, X
} from 'lucide-react';
import { Testimonials } from '@/components/marketing/Testimonials';

export const SaasLandingPage = () => {
  const router = useRouter();
  const [slugInput, setSlugInput] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Calculadora de Perda (Simulação Visual)
  const lostMoney = 3200; // Valor fictício de perda mensal sem sistema

  return (
    <div className="min-h-screen bg-black font-sans text-zinc-100 overflow-x-hidden selection:bg-amber-500 selection:text-black">
      
      {/* --- NAVBAR FLUTUANTE --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
           <div className="flex items-center gap-3 relative z-50">
              <div className="w-10 h-10 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                 <Scissors className="w-6 h-6 text-black" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Barber.App</span>
           </div>
           
           {/* DESKTOP MENU */}
           <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
              <a href="#features" className="hover:text-white transition-colors">Recursos</a>
              <a href="#pain" className="hover:text-white transition-colors">Por que usar?</a>
              <a href="#pricing" className="hover:text-white transition-colors">Planos</a>
           </div>

           {/* DESKTOP ACTIONS */}
           <div className="hidden md:flex gap-4 items-center">
              <button onClick={() => router.push('/login')} className="text-sm font-bold text-zinc-300 hover:text-white transition-colors">
                 Login
              </button>
              <button onClick={() => router.push('/register')} className="bg-white hover:bg-zinc-200 text-black font-bold py-2.5 px-6 rounded-full text-sm transition-all hover:scale-105 shadow-lg shadow-white/10">
                 Começar Agora
              </button>
           </div>

           {/* MOBILE HAMBURGER */}
           <button 
              className="md:hidden text-zinc-300 hover:text-white relative z-50 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
           >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>

        {/* MOBILE MENU OVERLAY */}
        {isMobileMenuOpen && (
           <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8 p-6 md:hidden animate-fade-in">
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-zinc-300 hover:text-white">Recursos</a>
              <a href="#pain" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-zinc-300 hover:text-white">Por que usar?</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-zinc-300 hover:text-white">Planos</a>
              <hr className="w-20 border-zinc-800" />
              <button onClick={() => { router.push('/login'); setIsMobileMenuOpen(false); }} className="text-xl font-bold text-white">Login</button>
              <button onClick={() => { router.push('/register'); setIsMobileMenuOpen(false); }} className="w-full max-w-xs bg-amber-500 text-black font-bold py-4 rounded-xl text-lg shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                 Começar Agora
              </button>
           </div>
        )}
      </nav>

      {/* --- HERO SECTION: IMPONÊNCIA --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
         {/* Efeitos de Fundo */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[1000px] h-[300px] md:h-[600px] bg-amber-500/20 rounded-full blur-[80px] md:blur-[120px] -z-10 opacity-30 animate-pulse-slow"></div>
         
         <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-full px-3 py-1.5 md:px-4 md:py-1.5 mb-6 md:mb-8 backdrop-blur-md animate-fade-in-up">
               <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               <span className="text-[10px] md:text-xs font-bold text-zinc-300 uppercase tracking-wide">Nova Versão 2.0 Disponível</span>
            </div>

            {/* Responsive Typography: smaller on mobile, huge on desktop */}
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-extrabold tracking-tight mb-6 md:mb-8 text-white leading-[1.1] animate-fade-in-up" style={{animationDelay: '100ms'}}>
               O sistema operacional<br className="hidden md:block"/>
               da sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Barbearia.</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed animate-fade-in-up font-light" style={{animationDelay: '200ms'}}>
               Garanta seu link exclusivo <b>barber.app</b> e transforme seguidores em agendamentos automáticos.
            </p>

            {/* DOMAIN CLAIM INPUT (Responsive Stack) */}
            <div className="max-w-lg mx-auto mb-12 animate-fade-in-up" style={{animationDelay: '300ms'}}>
               <div className="flex flex-col sm:flex-row bg-zinc-900/80 backdrop-blur-md border border-zinc-700 p-2 rounded-2xl shadow-2xl focus-within:border-amber-500/50 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all">
                  <div className="flex items-center px-4 py-3 sm:py-0 border-b sm:border-b-0 sm:border-r border-zinc-800 justify-center sm:justify-start">
                     <span className="text-zinc-500 font-bold font-mono text-lg">barber.app/</span>
                  </div>
                  <input 
                     type="text" 
                     placeholder="sua-barbearia"
                     value={slugInput}
                     onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                     className="flex-1 bg-transparent border-none text-white font-bold text-lg px-4 py-3 focus:outline-none placeholder:text-zinc-700 text-center sm:text-left"
                  />
                  <button 
                     onClick={() => router.push('/register')}
                     className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 px-6 rounded-xl transition-all whitespace-nowrap active:scale-95"
                  >
                     Reservar Link
                  </button>
               </div>
               <p className="mt-3 text-xs text-zinc-500 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Grátis por 14 dias. Sem cartão.
               </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 px-4">
               {/* Fake Logos for Social Proof */}
               {['BARBER KINGS', 'VINTAGE CUTS', 'ELITE GROOMING', 'THE GENTLEMAN'].map(brand => (
                  <span key={brand} className="text-xs md:text-sm font-bold text-zinc-500 tracking-widest">{brand}</span>
               ))}
            </div>
         </div>
      </section>

      {/* --- SECTION: THE PAIN (O Custo do Caos) --- */}
      <section id="pain" className="py-16 md:py-24 bg-zinc-950 border-y border-white/5 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 md:order-1">
               <div className="flex items-center gap-2 text-red-500 font-bold mb-4 uppercase tracking-wider text-sm">
                  <AlertTriangle className="w-4 h-4" /> Alerta Financeiro
               </div>
               <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  Pare de perder clientes no WhatsApp.
               </h2>
               <p className="text-zinc-400 text-base md:text-lg mb-8 leading-relaxed">
                  Sem um link de agendamento rápido, você perde 30% dos clientes que desistem de esperar você responder &quot;tem horário?&quot;.
               </p>
               
               <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                     <div className="bg-red-500/10 p-2 rounded-lg text-red-500 flex-shrink-0"><Users className="w-5 h-5" /></div>
                     <div>
                        <h4 className="text-white font-bold">No-Shows (Furos)</h4>
                        <p className="text-zinc-500 text-sm">Lembretes automáticos reduzem furos em 80%.</p>
                     </div>
                  </li>
                  <li className="flex items-start gap-4">
                     <div className="bg-red-500/10 p-2 rounded-lg text-red-500 flex-shrink-0"><Calculator className="w-5 h-5" /></div>
                     <div>
                        <h4 className="text-white font-bold">Erros de Comissão</h4>
                        <p className="text-zinc-500 text-sm">Cálculo automático de splits e aluguel de cadeira.</p>
                     </div>
                  </li>
               </ul>
            </div>

            {/* Visual da "Perda" */}
            <div className="order-1 md:order-2 bg-zinc-900 border border-red-900/30 rounded-3xl p-6 md:p-8 relative">
               <div className="absolute top-0 right-0 p-4">
                  <div className="flex items-center gap-2 text-red-500 text-xs font-bold bg-red-500/10 px-3 py-1 rounded-full animate-pulse">
                     <TrendingUp className="w-3 h-3" /> Prejuízo Acumulado
                  </div>
               </div>
               
               <div className="text-center py-8">
                  <p className="text-zinc-500 mb-2">Estimativa de perda mensal sem sistema</p>
                  <div className="text-5xl md:text-6xl font-bold text-white mb-2 flex items-center justify-center gap-1">
                     <span className="text-zinc-600 text-3xl md:text-4xl">R$</span> {lostMoney}
                  </div>
                  <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                     Baseado em 4 furos semanais + 2h de gestão manual/dia.
                  </p>
               </div>

               <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-zinc-400 text-sm">Custo da Solução Barber.App</span>
                     <span className="text-emerald-500 font-bold">R$ 89,00/mês</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[5%]"></div>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2 text-center">O sistema se paga no primeiro &quot;No-Show&quot; evitado.</p>
               </div>
            </div>
         </div>
      </section>

      {/* --- SECTION: BENTO GRID FEATURES --- */}
      <section id="features" className="py-16 md:py-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 md:mb-16">
               <h2 className="text-3xl md:text-5xl font-bold mb-6">Controle Total do Seu Império</h2>
               <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
                  Cada detalhe foi pensado para barbearias de alto padrão.
               </p>
            </div>

            {/* Responsive Grid: Stacks on mobile, Bento on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 auto-rows-min md:h-[800px]">
               
               {/* FEATURE 1: AGENDA (Large Left) */}
               <div className="md:col-span-2 md:row-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden group hover:border-amber-500/50 transition-all min-h-[400px]">
                  <div className="relative z-10">
                     <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 text-amber-500">
                        <CalendarCheck className="w-6 h-6" />
                     </div>
                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Agenda Inteligente</h3>
                     <p className="text-zinc-400 mb-6 max-w-md text-sm md:text-base">
                        Evite buracos na agenda. O sistema envia lembretes automáticos e cobra taxas de reserva para clientes novos.
                     </p>
                     <ul className="space-y-2 text-sm text-zinc-300 mb-8">
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Confirmação via WhatsApp</li>
                        <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Lista de Espera Automática</li>
                     </ul>
                  </div>
                  
                  {/* Mock UI */}
                  <div className="absolute right-0 bottom-0 w-3/4 md:w-2/3 h-2/3 bg-zinc-950 rounded-tl-3xl border-t border-l border-zinc-800 p-4 shadow-2xl translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform">
                     <div className="flex gap-2 mb-4">
                        <div className="bg-zinc-900 px-3 py-1 rounded-full text-xs text-zinc-400 border border-zinc-800">Hoje</div>
                        <div className="bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold">Agenda Cheia</div>
                     </div>
                     <div className="space-y-2">
                        {[1,2,3].map(i => (
                           <div key={i} className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800/50">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
                                 <div className="h-2 w-24 bg-zinc-800 rounded"></div>
                              </div>
                              <div className="h-2 w-12 bg-emerald-500/20 rounded"></div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* FEATURE 2: FINANCEIRO (Top Right) */}
               <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between group hover:border-emerald-500/50 transition-all min-h-[250px]">
                  <div>
                     <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 text-emerald-500">
                        <DollarSign className="w-5 h-5" />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Split de Pagamento</h3>
                     <p className="text-zinc-400 text-sm">
                        O sistema divide automaticamente: parte para a barbearia, parte para o barbeiro. Fim das planilhas.
                     </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                     <Zap className="w-3 h-3" /> Pagamento: R$ 100 → R$ 50/R$ 50
                  </div>
               </div>

               {/* FEATURE 3: SITE (Bottom Right) */}
               <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between group hover:border-blue-500/50 transition-all min-h-[250px]">
                  <div>
                     <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 text-blue-500">
                        <Globe className="w-5 h-5" />
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Link Curto & Próprio</h3>
                     <p className="text-zinc-400 text-sm">
                        Pare de mandar link feio. Use <b>barber.app/seu-nome</b> ou conecte seu domínio <b>.com.br</b>.
                     </p>
                  </div>
                  <div className="mt-4 bg-zinc-950 p-2 rounded-lg border border-zinc-800 flex items-center gap-2">
                     <Link className="w-3 h-3 text-zinc-500" />
                     <span className="text-xs font-mono text-white">barber.app/vintage</span>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-16 md:py-24 bg-zinc-950/50">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 md:mb-16">
               <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Barbeiros Que Já <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Transformaram</span> Seus Negócios
               </h2>
               <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
                  Veja o que nossos clientes têm a dizer sobre o BarberGold
               </p>
            </div>

            <Testimonials variant="carousel" showPlan={true} className="mb-8" />

            <div className="text-center mt-12">
               <p className="text-zinc-500 text-sm">
                  Junte-se a <span className="text-amber-500 font-bold">500+ barbearias</span> que já usam o BarberGold
               </p>
            </div>
         </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-16 md:py-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 md:mb-16">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Investimento Simples</h2>
               <p className="text-zinc-400">Sem taxas de instalação. Sem fidelidade.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               {/* BASIC */}
               <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2">Start</h3>
                  <p className="text-sm text-zinc-500 mb-6">Para quem está começando.</p>
                  <div className="mb-6">
                     <span className="text-4xl font-bold text-white">R$ 89</span>
                     <span className="text-zinc-500">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                     <li className="flex gap-3 text-sm text-zinc-300"><CheckCircle2 className="w-5 h-5 text-zinc-600"/> 1 Barbeiro</li>
                     <li className="flex gap-3 text-sm text-zinc-300"><CheckCircle2 className="w-5 h-5 text-zinc-600"/> Link <b>barber.app</b></li>
                     <li className="flex gap-3 text-sm text-zinc-300"><CheckCircle2 className="w-5 h-5 text-zinc-600"/> Agenda Online</li>
                  </ul>
                  <button onClick={() => router.push('/register')} className="w-full py-3 rounded-xl border border-zinc-700 text-white font-bold hover:bg-zinc-800 transition-all">Começar</button>
               </div>

               {/* PRO (DESTACADO) */}
               <div className="bg-zinc-900 border-2 border-amber-500 rounded-3xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(245,158,11,0.1)] transform md:scale-105 z-10 order-first md:order-none">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">Mais Escolhido</div>
                  <h3 className="text-xl font-bold text-white mb-2">Pro Gold</h3>
                  <p className="text-sm text-zinc-400 mb-6">Para barbearias em crescimento.</p>
                  <div className="mb-6">
                     <span className="text-5xl font-bold text-white">R$ 149</span>
                     <span className="text-zinc-500">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                     <li className="flex gap-3 text-sm text-white font-bold"><CheckCircle2 className="w-5 h-5 text-amber-500"/> Até 5 Barbeiros</li>
                     <li className="flex gap-3 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-amber-500"/> Domínio Próprio (.com.br)</li>
                     <li className="flex gap-3 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-amber-500"/> Disparos WhatsApp</li>
                     <li className="flex gap-3 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-amber-500"/> Financeiro Completo</li>
                  </ul>
                  <button onClick={() => router.push('/register')} className="w-full py-4 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all shadow-lg active:scale-95">Testar Grátis (14 dias)</button>
               </div>

               {/* EMPIRE */}
               <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col">
                  <h3 className="text-xl font-bold text-white mb-2">Empire</h3>
                  <p className="text-sm text-zinc-500 mb-6">Para grandes redes.</p>
                  <div className="mb-6">
                     <span className="text-4xl font-bold text-white">R$ 299</span>
                     <span className="text-zinc-500">/mês</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                     <li className="flex gap-3 text-sm text-zinc-300"><CheckCircle2 className="w-5 h-5 text-zinc-600"/> Barbeiros Ilimitados</li>
                     <li className="flex gap-3 text-sm text-zinc-300"><CheckCircle2 className="w-5 h-5 text-zinc-600"/> Múltiplas Unidades</li>
                     <li className="flex gap-3 text-sm text-zinc-300"><CheckCircle2 className="w-5 h-5 text-zinc-600"/> API Aberta</li>
                  </ul>
                  <button onClick={() => router.push('/contact')} className="w-full py-3 rounded-xl border border-zinc-700 text-white font-bold hover:bg-zinc-800 transition-all">Falar com Consultor</button>
               </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-16 md:py-24 relative overflow-hidden text-center px-6">
         <div className="absolute inset-0 bg-gradient-to-t from-amber-600/20 to-transparent z-0"></div>
         <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-6xl font-bold text-white mb-6">Domine sua região.</h2>
            <p className="text-lg md:text-xl text-zinc-300 mb-10">Junte-se a mais de 500 barbearias que já modernizaram sua gestão.</p>
            <button onClick={() => router.push('/register')} className="bg-white text-black font-bold py-4 px-12 rounded-full text-lg hover:scale-105 transition-transform shadow-2xl active:scale-95">
               Começar Teste Grátis
            </button>
            <p className="mt-6 text-sm text-zinc-500">Sem cartão • Cancele quando quiser</p>
         </div>
      </section>

      {/* Footer Links */}
      <footer className="py-12 border-t border-zinc-900 bg-black text-center text-zinc-600 text-sm">
         <p>&copy; 2024 Barber.App SaaS. Feito para quem domina a navalha.</p>
         <button onClick={() => router.push('/pricing')} className="mt-4 text-xs text-zinc-700 hover:text-amber-500 flex items-center justify-center gap-1 mx-auto">
            <Shield className="w-3 h-3" /> HQ Access
         </button>
      </footer>
    </div>
  );
};
