'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function SaasLandingPage() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   return (
      <div className="min-h-screen bg-[#0f0f11] text-white font-sans selection:bg-[#f79f08] selection:text-black overflow-x-hidden">

         {/* HEADER */}
         <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0f0f11]/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
               <div className="flex items-center gap-2">
                  <div className="text-[#f79f08]">
                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><path d="M8.12 8.12 12 12" /><path d="M20 4 8.12 15.88" /><circle cx="6" cy="18" r="3" /><path d="M14.8 14.8 20 20" /></svg>
                  </div>
                  <h2 className="text-white text-xl font-extrabold tracking-tight">Barber<span className="text-[#f79f08]">GOLD</span></h2>
               </div>

               <nav className="hidden md:flex items-center gap-8">
                  <a className="text-sm font-medium text-gray-300 hover:text-white transition-colors" href="#features">Funcionalidades</a>
                  <a className="text-sm font-medium text-gray-300 hover:text-white transition-colors" href="#pricing">Preços</a>
                  <a className="text-sm font-medium text-gray-300 hover:text-white transition-colors" href="#testimonials">Depoimentos</a>
                  <a className="text-sm font-medium text-gray-300 hover:text-white transition-colors" href="#faq">FAQ</a>
               </nav>

               <div className="flex items-center gap-4">
                  <Link className="hidden sm:block text-sm font-bold text-white hover:text-[#f79f08] transition-colors" href="/login">Login</Link>
                  <Link href="/register" className="bg-[#f79f08] hover:bg-[#d88b06] text-[#231c10] text-sm font-bold py-2 px-5 rounded-md transition-all shadow-[0_0_20px_rgba(247,159,8,0.2)]">
                     Começar Teste
                  </Link>
                  <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                     {isMobileMenuOpen ? <X /> : <Menu />}
                  </button>
               </div>
            </div>
         </header>

         {/* HERO SECTION */}
         <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-[#f79f08]/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] bg-[#f79f08]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="mx-auto max-w-7xl">
               <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                  <div className="flex flex-col gap-6 max-w-2xl">
                     <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 w-fit">
                        <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-medium text-gray-300">Nova versão 3.0 disponível</span>
                     </div>

                     <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
                        O Sistema Operacional da <span className="text-[#f79f08]" style={{ textShadow: '0 0 20px rgba(247, 159, 8, 0.3)' }}>Barbearia Moderna.</span>
                     </h1>

                     <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                        Agendamento automático, controle financeiro, clube de assinaturas e precificação inteligente. Transforme sua barbearia em uma máquina de lucro.
                     </p>

                     <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link href="/register" className="bg-[#f79f08] hover:bg-[#d88b06] text-[#231c10] text-base font-bold py-4 px-8 rounded-md transition-all shadow-[0_0_20px_rgba(247,159,8,0.2)] flex items-center justify-center gap-2">
                           Começar Teste de 14 Dias
                           <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </Link>
                        <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-base font-bold py-4 px-8 rounded-md transition-all flex items-center justify-center gap-2">
                           <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           Ver Demonstração
                        </button>
                     </div>

                     <div className="pt-4 flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex -space-x-2">
                           <div className="h-8 w-8 rounded-full border-2 border-[#0f0f11] bg-gray-600" style={{ backgroundImage: "url('https://i.pravatar.cc/150?img=1')", backgroundSize: 'cover' }}></div>
                           <div className="h-8 w-8 rounded-full border-2 border-[#0f0f11] bg-gray-600" style={{ backgroundImage: "url('https://i.pravatar.cc/150?img=2')", backgroundSize: 'cover' }}></div>
                           <div className="h-8 w-8 rounded-full border-2 border-[#0f0f11] bg-gray-600" style={{ backgroundImage: "url('https://i.pravatar.cc/150?img=3')", backgroundSize: 'cover' }}></div>
                        </div>
                        <p>Junte-se a +500 donos de barbearia</p>
                     </div>
                  </div>

                  <div className="relative lg:h-auto w-full flex justify-center lg:justify-end">
                     <div className="relative z-10 w-full max-w-[500px] rounded-2xl border border-white/10 bg-[#18181b] shadow-2xl shadow-black/50 overflow-hidden transform transition hover:scale-[1.01] duration-500">
                        <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-[#1f1f23]">
                           <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                           </div>
                           <div className="mx-auto text-xs text-gray-500 font-mono">dashboard.barbergold.com</div>
                        </div>
                        <div className="aspect-[4/3] w-full bg-[#18181b] relative">
                           <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1d] via-[#18181b] to-[#0f0f11] opacity-90"></div>
                           <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-transparent to-transparent"></div>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-4 bg-[#18181b]">
                           <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                              <p className="text-xs text-gray-400 mb-1">Faturamento Hoje</p>
                              <p className="text-xl font-bold text-white font-mono">R$ 2.450,00</p>
                           </div>
                           <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                              <p className="text-xs text-gray-400 mb-1">Agendamentos</p>
                              <p className="text-xl font-bold text-[#f79f08] font-mono">32 <span className="text-xs text-green-500 ml-1">▲ 12%</span></p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* STATS BAR */}
         <section className="border-y border-white/5 bg-[#141416] py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
               <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
                  <div className="max-w-md text-center lg:text-left">
                     <h3 className="text-2xl font-bold text-white mb-2">Usado pela elite</h3>
                     <p className="text-gray-400 text-sm">As barbearias mais lucrativas do país rodam no nosso sistema operacional.</p>
                  </div>
                  <div className="flex flex-1 w-full flex-col sm:flex-row gap-6 items-center justify-end">
                     <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-xl border border-white/5 w-full sm:w-auto">
                        <div className="p-3 bg-[#f79f08]/10 rounded-lg text-[#f79f08]">
                           <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Volume Mensal</p>
                           <p className="text-xl font-bold text-white font-mono">+ R$ 5 Milhões</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-xl border border-white/5 w-full sm:w-auto">
                        <div className="p-3 bg-[#f79f08]/10 rounded-lg text-[#f79f08]">
                           <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Barbearias</p>
                           <p className="text-xl font-bold text-white font-mono">500+ Ativas</p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="h-12 flex items-center justify-center font-bold text-xl text-white">BARBER<span className="font-light">KING</span></div>
                  <div className="h-12 flex items-center justify-center font-bold text-xl text-white">ROYAL<span className="font-light">CUTS</span></div>
                  <div className="h-12 flex items-center justify-center font-bold text-xl text-white">THE<span className="font-light">GENT</span></div>
                  <div className="h-12 flex items-center justify-center font-bold text-xl text-white">VINTAGE<span className="font-light">CLUB</span></div>
                  <div className="h-12 flex items-center justify-center font-bold text-xl text-white">SHARP<span className="font-light">&CO</span></div>
                  <div className="h-12 flex items-center justify-center font-bold text-xl text-white">ELITE<span className="font-light">GROOM</span></div>
               </div>
            </div>
         </section>

         {/* PAIN POINTS */}
         <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0f0f11]">
            <div className="mx-auto max-w-4xl text-center mb-16">
               <div className="inline-block px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-semibold mb-6">
                  Alerta de Prejuízo
               </div>
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Pare de perder dinheiro invisível</h2>
               <p className="text-lg text-gray-400">Todo mês sua barbearia sangra lucro com erros que você nem percebe. O BarberGOLD estanca esse sangramento no primeiro dia.</p>
            </div>
            <div className="mx-auto max-w-7xl grid md:grid-cols-3 gap-6">
               {[
                  { icon: "event_busy", title: "No-Shows Sem Multa", desc: "Clientes que marcam e não aparecem custam em média R$ 2.000/mês por cadeira. Nosso sistema cobra antecipado ou taxa de cancelamento automática." },
                  { icon: "calculate", title: "Comissões Erradas", desc: "Planilhas manuais geram erros de cálculo. Pagar comissão a mais ou a menos destrói seu caixa ou sua equipe. O Smart Split calcula centavos com precisão." },
                  { icon: "trending_down", title: "Horários Ociosos", desc: "Cadeiras vazias em horários de pico ou vale. O Smart Pricing ajusta preços dinamicamente para preencher sua agenda 100% do tempo." }
               ].map((item, i) => (
                  <div key={i} className="bg-[#18181b] border border-white/5 p-8 rounded-2xl relative overflow-hidden group hover:border-red-500/30 transition-colors">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/10 transition-all"></div>
                     <div className="text-4xl text-red-500 mb-6">⚠️</div>
                     <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                     <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* FEATURES */}
         <section className="py-24 bg-[#121214]" id="features">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
               <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                  <div className="max-w-2xl">
                     <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Muito mais que uma agenda</h2>
                     <p className="text-xl text-gray-400">Módulos premium projetados para aumentar o LTV e automatizar sua gestão.</p>
                  </div>
               </div>

               <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                  <div className="lg:col-span-5 flex flex-col gap-4">
                     <div className="group relative p-6 rounded-2xl bg-[#1c1c1f] border border-[#f79f08] ring-1 ring-[#f79f08]/30 shadow-[0_0_40px_rgba(247,159,8,0.15)] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_50px_-5px_rgba(247,159,8,0.3)]">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#f79f08]/5 to-transparent rounded-2xl"></div>
                        <div className="relative flex items-start gap-4">
                           <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#f79f08] text-[#121214] flex items-center justify-center shadow-lg shadow-[#f79f08]/20">
                              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                           </div>
                           <div>
                              <h3 className="text-xl font-bold text-white mb-2">Barber Club</h3>
                              <p className="text-sm text-gray-300 leading-relaxed">Crie planos de assinatura recorrente e garanta receita fixa todo mês.</p>
                           </div>
                        </div>
                     </div>

                     {[
                        { icon: "price_change", title: "Smart Pricing", desc: "Ajuste automático de preços baseado na demanda e horários.", color: "blue" },
                        { icon: "pie_chart", title: "Smart Split", desc: "Divisão automática e transparente de comissões para a equipe.", color: "purple" },
                        { icon: "inventory_2", title: "Vendas & Estoque", desc: "Controle total de produtos, vitrine e baixa automática.", color: "orange" }
                     ].map((feat, i) => (
                        <div key={i} className="group p-6 rounded-2xl bg-[#18181b] border border-white/5 cursor-pointer transition-all duration-300 hover:bg-[#1f1f22] hover:-translate-y-1.5 hover:border-[#f79f08] hover:shadow-[0_10px_30px_-10px_rgba(247,159,8,0.2)]">
                           <div className="flex items-start gap-4">
                              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 text-gray-400 group-hover:bg-${feat.color}-500/10 group-hover:text-${feat.color}-400 flex items-center justify-center transition-colors`}>
                                 <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              </div>
                              <div>
                                 <h3 className="text-xl font-bold text-gray-300 group-hover:text-white transition-colors mb-2">{feat.title}</h3>
                                 <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">{feat.desc}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="lg:col-span-7 h-full min-h-[500px] lg:h-auto">
                     <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/10 bg-[#1a1a1d] shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1d] via-[#18181b] to-[#0f0f11] opacity-90 transition-transform duration-700 hover:scale-105"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f79f08]/20 border border-[#f79f08]/20 text-[#f79f08] text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
                              <span className="w-2 h-2 rounded-full bg-[#f79f08] animate-pulse"></span>
                              Módulo Premium
                           </div>
                           <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Transforme clientes em sócios</h3>
                           <p className="text-lg text-gray-300 mb-8 max-w-xl">
                              Com o <strong>Barber Club</strong>, você cria planos de assinatura (como "Corte Ilimitado" ou "Barba VIP") e debita automaticamente no cartão do cliente todo mês.
                           </p>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                                    💰
                                 </div>
                                 <div>
                                    <p className="text-xs text-gray-400 uppercase">Receita Recorrente</p>
                                    <p className="text-white font-bold">Previsibilidade de Caixa</p>
                                 </div>
                              </div>
                              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                                    ✓
                                 </div>
                                 <div>
                                    <p className="text-xs text-gray-400 uppercase">Fidelização</p>
                                    <p className="text-white font-bold">Retenção Máxima</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* WHATSAPP SECTION */}
         <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f11] relative overflow-hidden">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[500px] bg-gradient-to-r from-[#0f0f11] via-[#f79f08]/5 to-[#0f0f11] pointer-events-none"></div>
            <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-16 relative z-10">
               <div className="lg:w-1/2">
                  <div className="relative w-full max-w-sm mx-auto">
                     <div className="relative border-8 border-[#2d2d30] rounded-[3rem] overflow-hidden shadow-2xl bg-[#0f0f11]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#2d2d30] rounded-b-xl z-20"></div>
                        <div className="bg-[#0f0f11] h-[600px] w-full pt-12 px-6 flex flex-col gap-4">
                           <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                              <div className="w-10 h-10 rounded-full bg-gray-700"></div>
                              <div>
                                 <div className="h-2 w-24 bg-gray-700 rounded mb-1"></div>
                                 <div className="h-2 w-16 bg-gray-800 rounded"></div>
                              </div>
                           </div>
                           <div className="flex flex-col gap-3 mt-4">
                              <div className="self-start bg-[#1f1f22] p-3 rounded-2xl rounded-tl-none max-w-[85%]">
                                 <p className="text-xs text-gray-300">Olá João! Seu corte está confirmado para amanhã às 15h. Deseja adicionar uma Barboterapia com 20% OFF?</p>
                              </div>
                              <div className="self-end bg-[#f79f08] p-3 rounded-2xl rounded-tr-none max-w-[85%]">
                                 <p className="text-xs text-[#231c10] font-bold">Sim, pode adicionar!</p>
                              </div>
                              <div className="self-start bg-[#1f1f22] p-3 rounded-2xl rounded-tl-none max-w-[85%]">
                                 <p className="text-xs text-gray-300">Perfeito! Atualizado. Até amanhã 👊</p>
                              </div>
                           </div>
                           <div className="mt-auto mb-8 bg-[#1f1f22] p-4 rounded-xl border border-white/5">
                              <div className="flex items-center justify-between mb-2">
                                 <span className="text-xs text-gray-400">Resumo</span>
                                 <span className="text-xs text-white font-bold">R$ 85,00</span>
                              </div>
                              <button className="w-full bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-3 rounded-lg">Pagar via PIX</button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="lg:w-1/2">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">Zero Barreira de Entrada para seu cliente.</h2>
                  <p className="text-lg text-gray-400 mb-8">Esqueça aplicativos que ninguém baixa. O BarberGOLD funciona onde seu cliente já está.</p>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                           📱
                        </div>
                        <div>
                           <h4 className="text-xl font-bold text-white">Sem Login, Sem App</h4>
                           <p className="text-sm text-gray-400 mt-1">Seu cliente agenda através de um link simples e bonito, sem precisar criar conta ou lembrar senha.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                           💬
                        </div>
                        <div>
                           <h4 className="text-xl font-bold text-white">Automação WhatsApp</h4>
                           <p className="text-sm text-gray-400 mt-1">Lembretes automáticos, confirmações e recuperação de clientes inativos direto no 'Zap'.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* PRICING */}
         <section className="py-24 bg-[#0a0a0c]" id="pricing">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
               <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Planos que se pagam no primeiro dia</h2>
                  <p className="text-lg text-gray-400">Escolha a potência ideal para o seu negócio. Sem fidelidade, cancele quando quiser.</p>
               </div>
               <div className="grid md:grid-cols-3 gap-8 items-start">
                  <div className="bg-[#18181b] border border-white/5 rounded-2xl p-8 flex flex-col hover:border-[#f79f08]/50 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(247,159,8,0.2)] transition-all duration-300 group relative">
                     <h3 className="text-xl font-bold text-white mb-2">Start</h3>
                     <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold text-white">R$ 89</span>
                        <span className="text-gray-500">/mês</span>
                     </div>
                     <p className="text-gray-400 text-sm mb-8">Ideal para barbearias em crescimento que precisam organizar a casa.</p>
                     <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-start gap-3 text-gray-300 text-sm"><span className="text-[#f79f08]">✓</span>Agenda Online e Links</li>
                        <li className="flex items-start gap-3 text-gray-300 text-sm"><span className="text-[#f79f08]">✓</span>Gestão de Clientes (CRM)</li>
                        <li className="flex items-start gap-3 text-gray-300 text-sm"><span className="text-[#f79f08]">✓</span>Financeiro Básico</li>
                     </ul>
                     <Link href="/register" className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg border border-white/10 transition-colors text-center">Escolher Start</Link>
                  </div>

                  <div className="bg-[#18181b] border border-[#f79f08]/30 rounded-2xl p-8 flex flex-col hover:-translate-y-2 hover:border-[#f79f08] hover:shadow-[0_0_30px_rgba(247,159,8,0.25)] transition-all duration-300 relative transform scale-105 md:scale-100 lg:scale-105 z-10">
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#f79f08] text-[#231c10] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-[#f79f08]/30">
                        Mais Popular
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">Pro Gold</h3>
                     <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold text-white">R$ 149</span>
                        <span className="text-gray-500">/mês</span>
                     </div>
                     <p className="text-gray-400 text-sm mb-8">A escolha da elite. Automação completa para maximizar o lucro.</p>
                     <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-start gap-3 text-white font-medium text-sm"><span className="text-[#f79f08]">✓</span>Tudo do plano Start</li>
                        <li className="flex items-start gap-3 text-gray-300 text-sm"><span className="text-[#f79f08]">✓</span>Smart Split (Comissões)</li>
                        <li className="flex items-start gap-3 text-gray-300 text-sm"><span className="text-[#f79f08]">✓</span>Confirmação WhatsApp</li>
                        <li className="flex items-start gap-3 text-gray-300 text-sm"><span className="text-[#f79f08]">✓</span>Gestão de Estoque</li>
                     </ul>
                     <Link href="/register" className="w-full bg-[#f79f08] hover:bg-[#d88b06] text-[#231c10] font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(247,159,8,0.2)] transition-all text-center">Escolher Pro Gold</Link>
                  </div>

                  <div className="bg-[#18181b] border border-white/5 rounded-2xl p-8 flex flex-col hover:border-[#f79f08]/50 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(247,159,8,0.2)] transition-all duration-300 group">
                     <h3 className="text-xl font-bold text-white mb-2">Empire</h3>
                     <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold text-white">R$ 299</span>
                        <span className="text-gray-500">/mês</span>
                     </div>
                     <p className="text-gray-400 text-sm mb-8">Para redes de barbearias e empreendedores que querem dominar o mercado.</p>
                     <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-start gap-3 text-gray-300 text-sm"><span className="text-[#f79f08]">✓</span>Tudo do plano Pro Gold</li>
                        <li className="flex items-start gap-3 text-gray-300 text-sm"><span className="text-[#f79f08]">✓</span>Barber Club (Assinaturas)</li>
                        <li className="flex items-start gap-3 text-gray-300 text-sm"><span className="text-[#f79f08]">✓</span>Múltiplas Unidades</li>
                        <li className="flex items-start gap-3 text-gray-300 text-sm"><span className="text-[#f79f08]">✓</span>Gerente de Contas VIP</li>
                     </ul>
                     <Link href="/register" className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg border border-white/10 transition-colors text-center">Escolher Empire</Link>
                  </div>
               </div>
            </div>
         </section>

         {/* FAQ */}
         <section className="py-24 bg-[#0f0f11]" id="faq">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
               <h2 className="text-3xl font-bold text-white text-center mb-12">Perguntas Frequentes</h2>
               <div className="space-y-4">
                  {[
                     { q: "Preciso instalar algum programa no computador?", a: "Não. O BarberGOLD é 100% online e roda direto no navegador, seja no PC, tablet ou celular. Seus dados ficam salvos na nuvem com segurança bancária." },
                     { q: "Consigo migrar os dados do meu sistema antigo?", a: "Sim! Temos uma equipe dedicada a importação de dados. Trazemos sua lista de clientes, produtos e histórico." },
                     { q: "O período de teste é realmente gratuito?", a: "Sim, 14 dias totalmente grátis, sem necessidade de cartão de crédito. Você testa todas as funcionalidades premium." }
                  ].map((faq, i) => (
                     <details key={i} className="group bg-[#18181b] rounded-lg border border-white/5 open:bg-white/5 transition-all">
                        <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-medium text-white list-none">
                           {faq.q}
                           <span className="transition group-open:rotate-180">▼</span>
                        </summary>
                        <div className="px-6 pb-6 text-gray-400">{faq.a}</div>
                     </details>
                  ))}
               </div>
            </div>
         </section>

         {/* CTA FINAL */}
         <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f11] relative border-t border-white/5">
            <div className="absolute inset-0 bg-[#f79f08]/5 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(247, 159, 8, 0.05) 0%, transparent 70%)' }}></div>
            <div className="mx-auto max-w-4xl text-center relative z-10">
               <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Pare de ser refém do WhatsApp.</h2>
               <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Profissionalize sua gestão, elimine erros manuais e veja seu lucro crescer. Teste sem compromisso.</p>
               <Link href="/register" className="inline-block bg-[#f79f08] hover:bg-[#d88b06] text-[#231c10] text-lg font-bold py-4 px-10 rounded-lg transition-all shadow-[0_0_20px_rgba(247,159,8,0.2)] transform hover:scale-105">
                  Começar Teste de 14 Dias
               </Link>
               <p className="mt-6 text-sm text-gray-500">Sem cartão de crédito • Cancelamento a qualquer momento</p>
            </div>
         </section>

         {/* FOOTER */}
         <footer className="py-8 bg-black border-t border-white/10">
            <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
               <div className="mb-4 md:mb-0">
                  <span className="font-bold text-gray-500">BarberGOLD © 2024</span>
               </div>
               <div className="flex gap-6">
                  <a className="hover:text-[#f79f08] transition-colors" href="#">Termos de Uso</a>
                  <a className="hover:text-[#f79f08] transition-colors" href="#">Privacidade</a>
                  <a className="hover:text-[#f79f08] transition-colors" href="#">Contato</a>
               </div>
            </div>
         </footer>

      </div>
   );
}
