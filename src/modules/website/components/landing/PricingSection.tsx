import Link from 'next/link';
import { Check, CheckCircle } from 'lucide-react';

export function PricingSection() {
    const plans = [
        {
            name: 'Start',
            price: '89',
            description: 'Ideal para barbearias em crescimento que precisam organizar a casa.',
            features: [
                'Agenda Online e Links',
                'GestÃ£o de Clientes (CRM)',
                'Financeiro BÃ¡sico'
            ],
            highlighted: false,
            buttonText: 'Escolher Start',
            href: '/register?plan=start'
        },
        {
            name: 'Pro Gold',
            price: '149',
            description: 'A escolha da elite. AutomaÃ§Ã£o completa para maximizar o lucro.',
            features: [
                { text: 'Tudo do plano Start', bold: true },
                'Smart Split (ComissÃµes)',
                'ConfirmaÃ§Ã£o WhatsApp',
                'GestÃ£o de Estoque'
            ],
            highlighted: true,
            buttonText: 'Escolher Pro Gold',
            href: '/register?plan=pro'
        },
        {
            name: 'Empire',
            price: '299',
            description: 'Para redes de barbearias e empreendedores que querem dominar o mercado.',
            features: [
                'Tudo do plano Pro Gold',
                'Barber Club (Assinaturas)',
                'MÃºltiplas Unidades',
                'Gerente de Contas VIP'
            ],
            highlighted: false,
            buttonText: 'Escolher Empire',
            href: '/register?plan=empire'
        }
    ];

    return (
        <section className="py-24 bg-[#0a0a0c]" id="pricing">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Planos que se pagam no primeiro dia</h2>
                    <p className="text-lg text-gray-400">Escolha a potÃªncia ideal para o seu negÃ³cio. Sem fidelidade, cancele quando quiser.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, index) => (
                        <div 
                            key={index}
                            className={`rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                                plan.highlighted 
                                    ? 'bg-[#18181b] border border-[#f79f08]/30 hover:-translate-y-2 hover:border-[#f79f08] hover:shadow-[0_0_30px_rgba(247,159,8,0.25)] relative transform scale-105 md:scale-100 lg:scale-105 z-10' 
                                    : 'bg-[#18181b] border border-white/5 hover:border-[#f79f08]/50 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(247,159,8,0.2)]'
                            }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#f79f08] text-[#231c10] text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-[#f79f08]/30">
                                    Mais Popular
                                </div>
                            )}
                            
                            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">R$ {plan.price}</span>
                                <span className="text-gray-500">/mÃªs</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-8">{plan.description}</p>
                            
                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, featureIndex) => {
                                    const isObject = typeof feature === 'object';
                                    const text = isObject ? feature.text : feature;
                                    const isBold = isObject && feature.bold;
                                    
                                    return (
                                        <li key={featureIndex} className={`flex items-start gap-3 text-sm ${isBold ? 'text-white font-medium' : 'text-gray-300'}`}>
                                            {isBold ? (
                                                <CheckCircle className="w-5 h-5 text-[#f79f08] flex-shrink-0" />
                                            ) : (
                                                <Check className="w-5 h-5 text-[#f79f08] flex-shrink-0" />
                                            )}
                                            {text}
                                        </li>
                                    );
                                })}
                            </ul>
                            
                            <Link
                                href={plan.href}
                                className={`w-full font-bold py-3 rounded-lg text-center transition-all ${
                                    plan.highlighted 
                                        ? 'bg-[#f79f08] hover:bg-[#d88b06] text-[#231c10] shadow-[0_0_20px_rgba(247,159,8,0.2)]' 
                                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                }`}
                            >
                                {plan.buttonText}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
