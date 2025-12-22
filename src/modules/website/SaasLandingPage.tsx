'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
   Check,
   Calendar,
   TrendingUp,
   Crown,
   Share2,
   Wallet,
   ChevronDown,
   Star,
   ArrowRight,
   Menu,
   X
} from 'lucide-react';

export default function SaasLandingPage() {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [slug, setSlug] = useState('');
   const router = useRouter();

   // Função para reservar o link
   const handleReserve = (e: React.FormEvent) => {
      e.preventDefault();
      if (!slug) return;
      const cleanSlug = slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      router.push(`/register?slug=${cleanSlug}`);
   };

   return (
      <div className="min-h-screen bg-[#0f0f11] text-white font-sans selection:bg-[#f79f08] selection:text-black">

         {/* HEADER */}
         <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0f0f11]/90 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <span className="text-[#f79f08]">
                     {/* Ícone Tesoura Simples */}
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><path d="M8.12 8.12 12 12" /><path d="M20 4 8.12 15.88" /><circle cx="6" cy="18" r="3" /><path d="M14.8 14.8 20 20" /></svg>
                  </span>
                  <span className="text-xl font-bold tracking-tight text-white">Barber<span className="text-[#f79f08]">GOLD</span></span>
               </div>

               {/* Desktop Nav */}
               <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                  <Link href="#features" className="hover:text-white transition-colors">Funcionalidades</Link>
                  <Link href="#pricing" className="hover:text-white transition-colors">Preços</Link>
                  <Link href="/login" className="text-white hover:text-[#f79f08] transition-colors">Login</Link>
                  <Link
                     href="/register"
                     className="bg-[#f79f08] hover:bg-[#d88b06] text-[#231c10] px-5 py-2 rounded-md font-bold transition-all shadow-[0_0_20px_rgba(247,159,8,0.2)]"
                  >
                     Começar Teste
                  </Link>
               </nav>

               {/* Mobile Menu Button */}
               <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  {isMobileMenuOpen ? <X /> : <Menu />}
               </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
               <div className="md:hidden bg-[#0f0f11] border-b border-white/10 p-4 flex flex-col gap-4">
                  <Link href="#features" className="text-gray-300">Funcionalidades</Link>
                  <Link href="#pricing" className="text-gray-300">Preços</Link>
                  <Link href="/login" className="text-white font-bold">Login</Link>
               </div>
            )}
         </header>

         {/* HERO SECTION */}
         <section className="relative pt-32 pb-20 px-4 overflow-hidden">
            {/* Glow Effects */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-[#f79f08]/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto max-w-4xl text-center relative z-10">
               <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-8">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs font-medium text-gray-300">Nova versão 2.0 disponível</span>
               </div>

               <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                  O Sistema Operacional da <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f79f08] to-[#ffbe4a]">
                     Barbearia Moderna.
                  </span>
               </h1>

               <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
                  Garanta seu link exclusivo <strong>barber.gold</strong> e transforme seguidores em agendamentos automáticos. Sem login para seu cliente.
               </p>

               {/* INPUT DE RESERVA (FUNCIONAL) */}
               <form onSubmit={handleReserve} className="max-w-md mx-auto relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#f79f08] to-[#ffbe4a] rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                  <div className="relative flex items-center bg-[#18181b] rounded-lg border border-white/10 p-2">
                     <span className="pl-4 text-gray-500 font-mono select-none">barber.gold/</span>
                     <input
                        type="text"
                        placeholder="sua-marca"
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600 font-medium ml-1"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                     />
                     <button type="submit" className="bg-[#f79f08] hover:bg-[#d88b06] text-black font-bold px-6 py-3 rounded-md transition-colors whitespace-nowrap">
                        Reservar Link
                     </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                     <Check className="w-3 h-3 text-green-500" /> Grátis por 14 dias. Sem cartão.
                  </p>
               </form>

               {/* Social Proof Simples */}
               <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                  <span className="font-bold text-xl">BARBER<span className="font-light">KING</span></span>
                  <span className="font-bold text-xl">ROYAL<span className="font-light">CUTS</span></span>
                  <span className="font-bold text-xl">THE<span className="font-light">GENT</span></span>
                  <span className="font-bold text-xl">VINTAGE<span className="font-light">CLUB</span></span>
               </div>
            </div>
         </section>

         {/* SECTION: PAIN POINTS (ROI) */}
         <section className="py-24 bg-[#0a0a0c] border-y border-white/5">
            <div className="container mx-auto px-4">
               <div className="grid md:grid-cols-2 gap-16 items-center">

                  {/* Esquerda: A Dor */}
                  <div>
                     <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold mb-6">
                        ALERTA FINANCEIRO
                     </div>
                     <h2 className="text-4xl font-bold mb-6">Pare de perder clientes no WhatsApp.</h2>
                     <p className="text-gray-400 text-lg mb-8">
                        Sem um link rápido, você perde 30% dos clientes que desistem de esperar você responder "tem horário?".
                     </p>

                     <div className="space-y-6">
                        <div className="flex gap-4">
                           <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                              <Calendar className="text-red-500" />
                           </div>
                           <div>
                              <h3 className="font-bold text-white">No-Shows (Furos)</h3>
                              <p className="text-sm text-gray-400">Lembretes automáticos reduzem furos em 80%.</p>
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                              <TrendingUp className="text-red-500" />
                           </div>
                           <div>
                              <h3 className="font-bold text-white">Erros de Comissão</h3>
                              <p className="text-sm text-gray-400">Cálculo automático de splits e aluguel de cadeira.</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Direita: O Card de Prejuízo (Mantido como você queria) */}
                  <div className="relative">
                     <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full"></div>
                     <div className="relative bg-[#18181b] border border-white/10 rounded-2xl p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                           <span className="text-gray-500 text-sm">Estimativa de perda mensal</span>
                           <span className="text-red-500 bg-red-500/10 px-2 py-1 rounded text-xs">Sem sistema</span>
                        </div>

                        <div className="text-center py-8 border-b border-white/5">
                           <div className="text-6xl font-bold text-white mb-2">R$ 3.200</div>
                           <p className="text-gray-500 text-sm">Baseado em 4 furos semanais + 2h de gestão.</p>
                        </div>

                        <div className="mt-8">
                           <div className="flex justify-between text-sm mb-2">
                              <span className="text-white font-medium">Custo do BarberGold</span>
                              <span className="text-[#f79f08] font-bold">R$ 89,00</span>
                           </div>
                           <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                              <div className="bg-[#f79f08] w-[5%] h-full"></div>
                           </div>
                           <p className="text-xs text-gray-500 mt-2 text-center">O sistema se paga no primeiro "No-Show" evitado.</p>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </section>

         {/* SECTION: FEATURES (BENTO GRID - Modulos Enterprise) */}
         <section id="features" className="py-24 bg-[#0f0f11]">
            <div className="container mx-auto px-4">
               <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">Mais que uma agenda</h2>
                  <p className="text-gray-400">Inteligência de negócio para quem quer lucrar de verdade.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
                  {/* Agenda (Big) */}
                  <div className="md:col-span-2 md:row-span-2 rounded-3xl p-8 bg-[#18181b] border border-white/5 hover:border-[#f79f08]/30 transition-all group relative overflow-hidden">
                     <div className="absolute top-4 right-4 p-2 bg-[#f79f08]/10 rounded-lg">
                        <Calendar className="text-[#f79f08]" />
                     </div>
                     <h3 className="text-2xl font-bold mb-2">Agenda Inteligente</h3>
                     <p className="text-gray-400 mb-8">Lista de espera automática e confirmação via WhatsApp.</p>
                     {/* Fake UI */}
                     <div className="bg-black/50 border border-white/5 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-gray-400">09:00</span> <span className="text-[#f79f08]">Confirmado</span></div>
                        <div className="h-2 bg-white/10 rounded-full w-3/4"></div>
                        <div className="flex justify-between text-sm mt-2"><span className="text-gray-400">10:00</span> <span className="text-green-500">Pago</span></div>
                        <div className="h-2 bg-white/10 rounded-full w-full"></div>
                     </div>
                  </div>

                  {/* Smart Pricing */}
                  <div className="md:col-span-1 md:row-span-2 rounded-3xl p-6 bg-[#18181b] border border-white/5 hover:border-green-500/30 transition-all">
                     <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                        <TrendingUp className="text-green-500" />
                     </div>
                     <h3 className="text-xl font-bold mb-2">Lucro Turbo ⚡</h3>
                     <p className="text-sm text-gray-400 mb-4">Preço dinâmico para horários de pico. Lucre 20% mais na sexta-feira.</p>
                     <div className="mt-auto bg-green-500/10 text-green-500 text-xs font-bold p-2 rounded text-center border border-green-500/20">
                        +R$ 1.500/mês
                     </div>
                  </div>

                  {/* Barber Club */}
                  <div className="md:col-span-1 md:row-span-1 rounded-3xl p-6 bg-[#18181b] border border-white/5 hover:border-purple-500/30 transition-all">
                     <div className="flex justify-between items-start mb-2">
                        <Crown className="text-purple-500" />
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">NOVO</span>
                     </div>
                     <h3 className="font-bold">Barber Club</h3>
                     <p className="text-xs text-gray-400">Crie planos de assinatura recorrente.</p>
                  </div>

                  {/* Split */}
                  <div className="md:col-span-1 md:row-span-1 rounded-3xl p-6 bg-[#18181b] border border-white/5 hover:border-blue-500/30 transition-all">
                     <Wallet className="text-blue-500 mb-2" />
                     <h3 className="font-bold">Split Auto</h3>
                     <p className="text-xs text-gray-400">Comissão cai direto na conta do barbeiro.</p>
                  </div>

                  {/* Viral */}
                  <div className="md:col-span-2 md:row-span-1 rounded-3xl p-6 bg-[#18181b] border border-white/5 flex items-center gap-6">
                     <div className="w-12 h-12 rounded-xl bg-[#f79f08]/10 flex items-center justify-center shrink-0">
                        <Share2 className="text-[#f79f08]" />
                     </div>
                     <div>
                        <h3 className="font-bold">Indique & Ganhe</h3>
                        <p className="text-sm text-gray-400">Seu cliente ganha pontos trazendo amigos. Marketing grátis.</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* SECTION: PRICING (PREÇOS) */}
         <section id="pricing" className="py-24 bg-[#0a0a0c] border-t border-white/5">
            <div className="container mx-auto px-4 text-center">
               <h2 className="text-4xl font-bold mb-16">Planos que se pagam no dia 01</h2>

               <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

                  {/* START */}
                  <div className="bg-[#18181b] rounded-2xl p-8 border border-white/5 flex flex-col text-left">
                     <h3 className="text-xl font-bold mb-2">Start</h3>
                     <div className="text-4xl font-bold mb-6">R$ 89<span className="text-sm text-gray-500 font-normal">/mês</span></div>
                     <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-300">
                        <li className="flex gap-2"><Check className="text-[#f79f08] w-4" /> Agenda Online</li>
                        <li className="flex gap-2"><Check className="text-[#f79f08] w-4" /> Gestão de Clientes</li>
                        <li className="flex gap-2"><Check className="text-[#f79f08] w-4" /> Financeiro Básico</li>
                     </ul>
                     <Link href="/register" className="block text-center w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-lg font-bold transition-colors">
                        Escolher Start
                     </Link>
                  </div>

                  {/* PRO GOLD (DESTAQUE) */}
                  <div className="bg-[#18181b] rounded-2xl p-8 border border-[#f79f08] relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(247,159,8,0.15)] flex flex-col text-left">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f79f08] text-black text-xs font-bold px-4 py-1 rounded-full uppercase">
                        Mais Escolhido
                     </div>
                     <h3 className="text-xl font-bold mb-2 text-[#f79f08]">Pro Gold</h3>
                     <div className="text-4xl font-bold mb-6">R$ 149<span className="text-sm text-gray-500 font-normal">/mês</span></div>
                     <ul className="space-y-4 mb-8 flex-1 text-sm text-white font-medium">
                        <li className="flex gap-2"><Check className="text-[#f79f08] w-4" /> <strong>Tudo do Start</strong></li>
                        <li className="flex gap-2"><Check className="text-[#f79f08] w-4" /> Confirmação WhatsApp</li>
                        <li className="flex gap-2"><Check className="text-[#f79f08] w-4" /> Smart Pricing (Lucro Turbo)</li>
                        <li className="flex gap-2"><Check className="text-[#f79f08] w-4" /> Split de Comissão</li>
                     </ul>
                     <Link href="/register" className="block text-center w-full bg-[#f79f08] hover:bg-[#d88b06] text-black py-3 rounded-lg font-bold transition-colors">
                        Escolher Pro Gold
                     </Link>
                  </div>

                  {/* EMPIRE */}
                  <div className="bg-[#18181b] rounded-2xl p-8 border border-white/5 flex flex-col text-left">
                     <h3 className="text-xl font-bold mb-2">Empire</h3>
                     <div className="text-4xl font-bold mb-6">R$ 299<span className="text-sm text-gray-500 font-normal">/mês</span></div>
                     <ul className="space-y-4 mb-8 flex-1 text-sm text-gray-300">
                        <li className="flex gap-2"><Check className="text-[#f79f08] w-4" /> Tudo do Pro Gold</li>
                        <li className="flex gap-2"><Check className="text-[#f79f08] w-4" /> Barber Club (Assinaturas)</li>
                        <li className="flex gap-2"><Check className="text-[#f79f08] w-4" /> Múltiplas Unidades</li>
                        <li className="flex gap-2"><Check className="text-[#f79f08] w-4" /> Gerente de Conta VIP</li>
                     </ul>
                     <Link href="/register" className="block text-center w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-lg font-bold transition-colors">
                        Escolher Empire
                     </Link>
                  </div>

               </div>
            </div>
         </section>

         {/* FOOTER CTA */}
         <section className="py-24 bg-[#0f0f11] border-t border-white/5 relative overflow-hidden text-center px-4">
            <div className="absolute inset-0 bg-[#f79f08]/5 pointer-events-none"></div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">Pare de ser refém do WhatsApp.</h2>
            <Link
               href="/register"
               className="inline-block bg-[#f79f08] hover:bg-[#d88b06] text-black text-lg font-bold py-4 px-10 rounded-lg shadow-[0_0_30px_rgba(247,159,8,0.3)] transition-all relative z-10 hover:scale-105"
            >
               Começar Teste de 14 Dias
            </Link>
            <p className="mt-6 text-sm text-gray-500 relative z-10">Sem cartão de crédito • Cancele quando quiser</p>
         </section>

         {/* Footer Simple */}
         <footer className="py-8 bg-black border-t border-white/10 text-center text-sm text-gray-600">
            <p>BarberGOLD © 2024. Todos os direitos reservados.</p>
         </footer>

      </div>
   );
}
