'use client';

import { 
    Calendar, 
    Users, 
    CreditCard, 
    PieChart, 
    Heart, 
    TrendingUp, 
    Package, 
    MessageCircle, 
    BarChart3, 
    Clock, 
    Shield, 
    Smartphone,
    Wallet,
    Bell,
    FileText,
    Settings,
    Gift,
    Target,
    Zap,
    Globe
} from 'lucide-react';

const allFeatures = [
    {
        category: 'Agendamento & Clientes',
        items: [
            { icon: Calendar, title: 'Agenda Online', desc: 'Agendamento 24/7 com link personalizado para seus clientes' },
            { icon: Users, title: 'CRM Completo', desc: 'Histórico de atendimentos, preferências e dados de cada cliente' },
            { icon: Bell, title: 'Lembretes Automáticos', desc: 'SMS e WhatsApp lembrando o cliente do horário marcado' },
            { icon: Clock, title: 'Lista de Espera', desc: 'Preencha cancelamentos automaticamente com clientes da fila' },
        ]
    },
    {
        category: 'Financeiro & Pagamentos',
        items: [
            { icon: Wallet, title: 'Controle de Caixa', desc: 'Entradas, saídas, sangrias e fechamento diário completo' },
            { icon: CreditCard, title: 'Múltiplas Formas', desc: 'PIX, cartão, dinheiro e vale - tudo registrado automaticamente' },
            { icon: PieChart, title: 'Smart Split', desc: 'Divisão automática de comissões entre barbeiros e casa' },
            { icon: BarChart3, title: 'Relatórios Financeiros', desc: 'DRE, fluxo de caixa e análise de lucratividade por período' },
        ]
    },
    {
        category: 'Crescimento & Fidelização',
        items: [
            { icon: Heart, title: 'Barber Club', desc: 'Planos de assinatura recorrente com débito automático' },
            { icon: TrendingUp, title: 'Smart Pricing', desc: 'Preços dinâmicos baseados em horário e demanda' },
            { icon: Gift, title: 'Programa de Indicação', desc: 'Recompense clientes que trazem novos clientes' },
            { icon: Target, title: 'Recuperação de Clientes', desc: 'Campanhas automáticas para clientes inativos' },
        ]
    },
    {
        category: 'Operação & Estoque',
        items: [
            { icon: Package, title: 'Gestão de Estoque', desc: 'Controle de produtos, baixa automática e alertas de reposição' },
            { icon: FileText, title: 'Catálogo de Serviços', desc: 'Serviços, combos e variações com preços personalizados' },
            { icon: Zap, title: 'PDV Inteligente', desc: 'Ponto de venda rápido e intuitivo para vendas de produtos' },
            { icon: Settings, title: 'Múltiplas Unidades', desc: 'Gerencie várias barbearias em um único painel' },
        ]
    },
    {
        category: 'Comunicação & Marketing',
        items: [
            { icon: MessageCircle, title: 'WhatsApp Business', desc: 'Integração nativa para confirmações e campanhas' },
            { icon: Globe, title: 'Página de Agendamento', desc: 'Site bonito e responsivo para sua barbearia' },
            { icon: Smartphone, title: 'App do Barbeiro', desc: 'Aplicativo para sua equipe ver agenda e comissões' },
            { icon: Shield, title: 'Gestão de Equipe', desc: 'Horários, folgas, metas e desempenho da equipe' },
        ]
    },
];

export function AllFeaturesSection() {
    return (
        <section className="py-24 bg-[#0a0a0c] border-t border-white/5" id="all-features">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-[#f79f08]/30 bg-[#f79f08]/10 text-[#f79f08] text-sm font-semibold mb-6">
                        Todos os Recursos
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Tudo que você precisa em um só lugar
                    </h2>
                    <p className="text-lg text-gray-400">
                        Mais de 20 funcionalidades projetadas especificamente para barbearias. Sem gambiarras, sem integrações complicadas.
                    </p>
                </div>

                <div className="space-y-16">
                    {allFeatures.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                            <h3 className="text-xl font-bold text-[#f79f08] mb-8 flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-[#f79f08]"></span>
                                {category.category}
                            </h3>
                            
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {category.items.map((feature, featureIndex) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div 
                                            key={featureIndex}
                                            className="group p-6 rounded-2xl bg-[#18181b] border border-white/5 hover:border-[#f79f08]/30 hover:bg-[#1c1c1f] transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-[#f79f08]/10 flex items-center justify-center mb-4 transition-colors">
                                                <Icon className="w-6 h-6 text-gray-400 group-hover:text-[#f79f08] transition-colors" />
                                            </div>
                                            <h4 className="text-white font-bold mb-2 group-hover:text-[#f79f08] transition-colors">
                                                {feature.title}
                                            </h4>
                                            <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">
                                                {feature.desc}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-500 mb-6">E muito mais sendo lançado todo mês...</p>
                    <a 
                        href="/register"
                        className="inline-flex items-center gap-2 bg-[#f79f08] hover:bg-[#d88b06] text-[#231c10] text-base font-bold py-4 px-8 rounded-lg transition-all shadow-[0_0_20px_rgba(247,159,8,0.2)] hover:shadow-[0_0_30px_rgba(247,159,8,0.3)]"
                    >
                        Começar Teste de 14 Dias Grátis
                    </a>
                </div>
            </div>
        </section>
    );
}
