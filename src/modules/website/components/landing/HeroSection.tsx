'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, PlayCircle } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-[#f79f08]/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] bg-[#f79f08]/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Left Column - Text */}
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
                            <Link
                                href="/register"
                                className="bg-[#f79f08] hover:bg-[#d88b06] text-[#231c10] text-base font-bold py-4 px-8 rounded-md transition-all shadow-[0_0_20px_rgba(247,159,8,0.2)] flex items-center justify-center gap-2"
                            >
                                Começar Teste de 14 Dias
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a
                                href="#features"
                                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-base font-bold py-4 px-8 rounded-md transition-all flex items-center justify-center gap-2"
                            >
                                <PlayCircle className="w-5 h-5" />
                                Ver Demonstração
                            </a>
                        </div>
                        
                        <div className="pt-4 flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div 
                                        key={i} 
                                        className="h-8 w-8 rounded-full border-2 border-[#0f0f11] bg-gray-600"
                                    />
                                ))}
                            </div>
                            <p>Junte-se a +500 donos de barbearia</p>
                        </div>
                    </div>
                    
                    {/* Right Column - Dashboard Preview */}
                    <div className="relative lg:h-auto w-full flex justify-center lg:justify-end">
                        <div className="relative z-10 w-full max-w-[500px] rounded-2xl border border-white/10 bg-[#18181b] shadow-2xl shadow-black/50 overflow-hidden transform transition hover:scale-[1.01] duration-500">
                            {/* Browser Chrome */}
                            <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-[#1f1f23]">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                                <div className="mx-auto text-xs text-gray-500 font-mono">dashboard.barbergold.com</div>
                            </div>
                            
                            {/* Dashboard Content Placeholder */}
                            <div className="aspect-[4/3] w-full bg-[#18181b] relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#f79f08]/5 to-transparent"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f79f08]/10 flex items-center justify-center">
                                            <span className="text-[#f79f08] text-2xl font-bold">BG</span>
                                        </div>
                                        <p className="text-gray-500 text-sm">Dashboard Preview</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Stats */}
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
    );
}
