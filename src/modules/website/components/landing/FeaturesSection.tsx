'use client';

import { useState } from 'react';
import { Heart, DollarSign, PieChart, Package, ArrowRight, CreditCard, Shield } from 'lucide-react';

export function FeaturesSection() {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        { 
            id: 0, 
            title: 'Barber Club', 
            desc: 'Crie planos de assinatura recorrente e garanta receita fixa todo mês.',
            icon: Heart,
            active: true
        },
        { 
            id: 1, 
            title: 'Smart Pricing', 
            desc: 'Ajuste automático de preços baseado na demanda e horários.',
            icon: DollarSign
        },
        { 
            id: 2, 
            title: 'Smart Split', 
            desc: 'Divisão automática e transparente de comissões para a equipe.',
            icon: PieChart
        },
        { 
            id: 3, 
            title: 'Vendas & Estoque', 
            desc: 'Controle total de produtos, vitrine e baixa automática.',
            icon: Package
        },
    ];

    return (
        <section className="py-24 bg-[#121214]" id="features">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Muito mais que uma agenda</h2>
                        <p className="text-xl text-gray-400">Módulos premium projetados para aumentar o LTV e automatizar sua gestão.</p>
                    </div>
                    <div>
                        <button className="text-[#f79f08] hover:text-white font-bold flex items-center gap-2 transition-colors">
                            Ver todos os recursos
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                
                <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                    {/* Feature List */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            const isActive = activeFeature === index;
                            
                            return (
                                <div 
                                    key={feature.id}
                                    onClick={() => setActiveFeature(index)}
                                    className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 ${
                                        isActive 
                                            ? 'bg-[#1c1c1f] border border-[#f79f08] ring-1 ring-[#f79f08]/30 shadow-[0_0_40px_rgba(247,159,8,0.15)]' 
                                            : 'bg-[#18181b] border border-white/5 hover:bg-[#1f1f22] hover:border-[#f79f08] hover:shadow-[0_10px_30px_-10px_rgba(247,159,8,0.2)]'
                                    }`}
                                >
                                    {isActive && <div className="absolute inset-0 bg-gradient-to-r from-[#f79f08]/5 to-transparent rounded-2xl"></div>}
                                    <div className="relative flex items-start gap-4">
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-colors ${
                                            isActive 
                                                ? 'bg-[#f79f08] text-[#121214] shadow-[#f79f08]/20' 
                                                : 'bg-white/5 text-gray-400 group-hover:bg-[#f79f08]/10 group-hover:text-[#f79f08]'
                                        }`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold mb-2 transition-colors ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                                {feature.title}
                                            </h3>
                                            <p className={`text-sm leading-relaxed transition-colors ${isActive ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}`}>
                                                {feature.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* Feature Showcase */}
                    <div className="lg:col-span-7 h-full min-h-[500px] lg:h-auto">
                        <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/10 bg-[#1a1a1d] shadow-2xl">
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBLYrbLeMM2VQsp19qISFlbcEM22WWo9nYI01lqdpll1OrgDdQvVshloIQw9KV9cECoV1U3sJ0I9wmvFE4P2ISH7ISWGOF0O4Tudwc8GApkF73g80o-ujk1L4S7WFP5LIl942oT5AiQ5goqHcxMvP8qIWtbQRxOr3e1O7tWJSO1SwU3bWFdsCecT7lQKJCeZdEKevScAcUNvMrqlmm5XdeMyz5QtIeRPOYqFV0dsXyeqRwwaxrhUj-hPtftDsNXKjVqE_THWDmk8RI')` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-[#121214]/60 to-transparent"></div>
                            
                            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f79f08]/20 border border-[#f79f08]/20 text-[#f79f08] text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
                                    <span className="w-2 h-2 rounded-full bg-[#f79f08] animate-pulse"></span>
                                    Módulo Premium
                                </div>
                                
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Transforme clientes em sócios</h3>
                                <p className="text-lg text-gray-300 mb-8 max-w-xl">
                                    Com o <strong>Barber Club</strong>, você cria planos de assinatura (como &quot;Corte Ilimitado&quot; ou &quot;Barba VIP&quot;) e debita automaticamente no cartão do cliente todo mês.
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase">Receita Recorrente</p>
                                            <p className="text-white font-bold">Previsibilidade de Caixa</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                                            <Shield className="w-5 h-5" />
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
    );
}
