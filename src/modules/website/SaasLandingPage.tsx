'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SaasLandingPage() {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [reservedSlug, setReservedSlug] = useState('');

    const handleSlugReservation = (e: React.FormEvent) => {
        e.preventDefault();
        if (reservedSlug.trim()) {
            router.push(`/register?slug=${reservedSlug.trim().toLowerCase()}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f11] text-white font-sans selection:bg-[#f79f08] selection:text-black overflow-x-hidden">
            {/* HEADER */}
            <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0f0f11]/90 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <svg className="w-8 h-8 text-[#f79f08]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L3 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                            </svg>
                            <span className="text-xl font-bold">Barber<span className="text-[#f79f08]">GOLD</span></span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Recursos</a>
                            <a href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Preços</a>
                            <a href="#faq" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">FAQ</a>
                            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="text-sm font-bold bg-[#f79f08] hover:bg-[#d88b06] text-[#0f0f11] px-6 py-2 rounded-lg transition-all shadow-[0_0_20px_rgba(247,159,8,0.2)] hover:shadow-[0_0_30px_rgba(247,159,8,0.4)]"
                            >
                                Começar Teste
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-300 hover:text-white"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-white/10">
                            <nav className="flex flex-col gap-4">
                                <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white">Recursos</a>
                                <a href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white">Preços</a>
                                <a href="#faq" className="text-sm font-medium text-gray-300 hover:text-white">FAQ</a>
                                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white">Login</Link>
                                <Link href="/register" className="text-sm font-bold bg-[#f79f08] text-[#0f0f11] px-6 py-2 rounded-lg text-center">
                                    Começar Teste
                                </Link>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#f79f08] rounded-full blur-[120px] opacity-20"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f79f08] rounded-full blur-[120px] opacity-10"></div>

                <div className="relative mx-auto max-w-7xl">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-sm text-gray-300">Nova versão 3.0 disponível</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            O Sistema Operacional da{' '}
                            <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-[#f79f08] to-[#fbbf24]"
                                style={{ textShadow: '0 0 40px rgba(247, 159, 8, 0.3)' }}
                            >
                                Barbearia Moderna
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                            Pare de perder dinheiro com no-shows, comissões erradas e planilhas ultrapassadas.
                            Transforme sua barbearia em uma máquina de lucro.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link
                                href="/register"
                                className="px-8 py-4 bg-[#f79f08] hover:bg-[#d88b06] text-[#0f0f11] font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(247,159,8,0.2)] hover:shadow-[0_0_30px_rgba(247,159,8,0.4)] hover:scale-105"
                            >
                                Começar Teste de 14 Dias
                            </Link>
                            <a
                                href="#features"
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-lg transition-all"
                            >
                                Ver Demonstração →
                            </a>
                        </div>

                        {/* Slug Reservation Input */}
                        <form onSubmit={handleSlugReservation} className="max-w-md mx-auto mb-8">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                                <span className="text-gray-500 text-sm pl-2">barber.gold/</span>
                                <input
                                    type="text"
                                    value={reservedSlug}
                                    onChange={(e) => setReservedSlug(e.target.value)}
                                    placeholder="sua-marca"
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#f79f08] hover:bg-[#d88b06] text-[#0f0f11] font-bold rounded transition-all"
                                >
                                    Reservar
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Reserve seu link personalizado agora</p>
                        </form>

                        {/* Social Proof */}
                        <div className="flex items-center justify-center gap-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-[#0f0f11]"></div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-400">Junte-se a <span className="text-[#f79f08] font-bold">+500 donos de barbearia</span></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="py-24 bg-[#0a0a0c]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Muito mais que uma agenda
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Controle total do seu negócio em uma única plataforma
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature Cards */}
                        {[
                            { title: 'Agenda Inteligente', desc: 'Agendamento online 24/7 com confirmação automática via WhatsApp' },
                            { title: 'Gestão Financeira', desc: 'Controle de caixa, comissões e lucro em tempo real' },
                            { title: 'Barber Club', desc: 'Transforme clientes em assinantes e garanta receita recorrente' },
                            { title: 'Smart Pricing', desc: 'Preços dinâmicos baseados em demanda e horário' },
                            { title: 'Vendas & Estoque', desc: 'Controle completo de produtos e vendas' },
                            { title: 'Relatórios Premium', desc: 'Analytics avançados para tomada de decisão' },
                        ].map((feature, i) => (
                            <div key={i} className="p-6 bg-[#18181b] border border-white/5 rounded-2xl hover:border-[#f79f08]/50 hover:-translate-y-2 transition-all duration-300">
                                <div className="w-12 h-12 bg-[#f79f08]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-2xl">✓</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="py-24 bg-[#0a0a0c]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Planos que se pagam no primeiro dia
                        </h2>
                        <p className="text-lg text-gray-400">
                            Escolha a potência ideal para o seu negócio. Sem fidelidade, cancele quando quiser.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {/* Start Plan */}
                        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-8 hover:border-[#f79f08]/50 hover:-translate-y-2 transition-all duration-300">
                            <h3 className="text-xl font-bold text-white mb-2">Start</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">R$ 89</span>
                                <span className="text-gray-500">/mês</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-8">Ideal para barbearias em crescimento</p>
                            <Link
                                href="/register?plan=start"
                                className="block w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg border border-white/10 transition-colors text-center"
                            >
                                Escolher Start
                            </Link>
                        </div>

                        {/* Pro Gold Plan (Highlighted) */}
                        <div className="relative bg-[#18181b] border-2 border-[#f79f08] rounded-2xl p-8 scale-105 shadow-[0_0_40px_rgba(247,159,8,0.3)]">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#f79f08] text-[#0f0f11] text-xs font-bold px-4 py-1 rounded-full">
                                MAIS POPULAR
                            </div>
                            <h3 className="text-xl font-bold text-[#f79f08] mb-2" style={{ textShadow: '0 0 20px rgba(247, 159, 8, 0.3)' }}>
                                Pro Gold
                            </h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">R$ 149</span>
                                <span className="text-gray-500">/mês</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-8">Para barbearias que querem lucrar mais</p>
                            <Link
                                href="/register?plan=pro"
                                className="block w-full bg-[#f79f08] hover:bg-[#d88b06] text-[#0f0f11] font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(247,159,8,0.2)] transition-all text-center"
                            >
                                Escolher Pro Gold
                            </Link>
                        </div>

                        {/* Empire Plan */}
                        <div className="bg-[#18181b] border border-white/5 rounded-2xl p-8 hover:border-[#f79f08]/50 hover:-translate-y-2 transition-all duration-300">
                            <h3 className="text-xl font-bold text-white mb-2">Empire</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">R$ 299</span>
                                <span className="text-gray-500">/mês</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-8">Para redes e grandes operações</p>
                            <Link
                                href="/register?plan=empire"
                                className="block w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg border border-white/10 transition-colors text-center"
                            >
                                Escolher Empire
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section id="faq" className="py-24 bg-[#0f0f11]">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Perguntas Frequentes</h2>
                    <div className="space-y-4">
                        {[
                            { q: 'Preciso instalar algum programa?', a: 'Não. O BarberGOLD é 100% online e roda direto no navegador.' },
                            { q: 'Consigo migrar meus dados?', a: 'Sim! Nossa equipe importa seus clientes e histórico gratuitamente.' },
                            { q: 'O teste é realmente grátis?', a: 'Sim, 14 dias totalmente grátis, sem cartão de crédito.' },
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

            {/* FINAL CTA */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f79f08]/20 to-transparent"></div>
                <div className="relative mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Pare de ser refém do WhatsApp
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Comece hoje e veja seu lucro aumentar em 14 dias ou seu dinheiro de volta.
                    </p>
                    <Link
                        href="/register"
                        className="inline-block px-10 py-4 bg-[#f79f08] hover:bg-[#d88b06] text-[#0f0f11] font-bold text-lg rounded-lg transition-all shadow-[0_0_30px_rgba(247,159,8,0.3)] hover:shadow-[0_0_50px_rgba(247,159,8,0.5)] hover:scale-105"
                    >
                        Começar Teste Grátis →
                    </Link>
                    <p className="text-sm text-gray-500 mt-4">Sem cartão • Cancelamento a qualquer momento</p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-[#0a0a0c] py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm mb-4">
                            © 2025 BarberGOLD. Todos os direitos reservados.
                        </p>
                        <div className="flex justify-center gap-6 text-sm">
                            <a href="#" className="hover:text-[#f79f08] transition-colors text-gray-400">Termos de Uso</a>
                            <a href="#" className="hover:text-[#f79f08] transition-colors text-gray-400">Privacidade</a>
                            <a href="#" className="hover:text-[#f79f08] transition-colors text-gray-400">Contato</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
