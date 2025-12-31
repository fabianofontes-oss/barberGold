import Link from 'next/link';
import { Check, Minus } from 'lucide-react';

export function PricingComparisonSection() {
    const features = [
        { category: 'GestÃ£o Essencial' },
        { name: 'Agendamento Online', start: true, pro: true, empire: true },
        { name: 'CRM (GestÃ£o de Clientes)', start: true, pro: true, empire: true },
        { name: 'ConfirmaÃ§Ã£o via WhatsApp', start: false, pro: true, empire: true, highlight: true },
        { category: 'Financeiro & Lucro' },
        { name: 'Controle de Caixa', start: true, pro: true, empire: true },
        { name: 'Smart Split (ComissÃµes)', start: false, pro: true, empire: true, highlight: true },
        { name: 'Barber Club (Assinaturas)', start: false, pro: false, empire: true, highlight: true },
        { category: 'Escala & OperaÃ§Ã£o' },
        { name: 'GestÃ£o de Estoque', start: false, pro: true, empire: true },
        { name: 'MÃºltiplas Unidades', start: false, pro: false, empire: true },
        { name: 'Atendimento', start: 'Email', pro: 'Chat & Email', empire: 'Gerente VIP', isText: true },
    ];

    return (
        <section className="py-24 bg-[#0e0e10] border-t border-white/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Compare os Planos Lado a Lado</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Confira em detalhes o que cada plano oferece e escolha a ferramenta certa para o momento da sua barbearia.</p>
                </div>
                
                <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#18181b] shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr>
                                    <th className="p-6 bg-[#18181b] border-b border-white/5 text-gray-400 font-medium w-1/3 min-w-[240px]">Recursos & Funcionalidades</th>
                                    <th className="p-6 bg-[#18181b] border-b border-white/5 text-center w-1/5 min-w-[160px]">
                                        <div className="text-white font-bold text-lg mb-1">Start</div>
                                        <div className="text-gray-500 text-sm font-normal">R$ 89/mÃªs</div>
                                    </th>
                                    <th className="p-6 bg-[#202024] border-b border-[#f79f08]/20 border-t-4 border-t-[#f79f08] text-center w-1/5 min-w-[160px] relative">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f79f08] text-[#231c10] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-lg shadow-[#f79f08]/20">Recomendado</div>
                                        <div className="text-[#f79f08] font-bold text-xl mb-1" style={{ textShadow: '0 0 20px rgba(247, 159, 8, 0.3)' }}>Pro Gold</div>
                                        <div className="text-white text-sm font-normal">R$ 149/mÃªs</div>
                                    </th>
                                    <th className="p-6 bg-[#18181b] border-b border-white/5 text-center w-1/5 min-w-[160px]">
                                        <div className="text-white font-bold text-lg mb-1">Empire</div>
                                        <div className="text-gray-500 text-sm font-normal">R$ 299/mÃªs</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                                {features.map((feature, index) => {
                                    if (feature.category) {
                                        return (
                                            <tr key={index} className="bg-white/[0.02]">
                                                <td className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider" colSpan={4}>{feature.category}</td>
                                            </tr>
                                        );
                                    }
                                    
                                    return (
                                        <tr key={index} className="hover:bg-white/5 transition-colors group">
                                            <td className={`p-5 border-r border-white/5 group-hover:text-white transition-colors ${feature.highlight ? 'font-medium text-white/90' : ''}`}>
                                                {feature.name}
                                            </td>
                                            <td className="p-5 text-center border-r border-white/5">
                                                {feature.isText ? (
                                                    <span className="text-xs text-gray-500">{feature.start}</span>
                                                ) : feature.start ? (
                                                    <Check className="w-5 h-5 text-[#f79f08] mx-auto" />
                                                ) : (
                                                    <Minus className="w-5 h-5 text-gray-700 mx-auto" />
                                                )}
                                            </td>
                                            <td className="p-5 text-center border-r border-white/5 bg-[#202024]/50">
                                                {feature.isText ? (
                                                    <span className="text-xs text-white font-medium">{feature.pro}</span>
                                                ) : feature.pro ? (
                                                    <Check className="w-5 h-5 text-[#f79f08] mx-auto" />
                                                ) : (
                                                    <Minus className="w-5 h-5 text-gray-700 mx-auto" />
                                                )}
                                            </td>
                                            <td className="p-5 text-center">
                                                {feature.isText ? (
                                                    <span className="text-xs text-[#f79f08] font-bold">{feature.empire}</span>
                                                ) : feature.empire ? (
                                                    <Check className="w-5 h-5 text-[#f79f08] mx-auto" />
                                                ) : (
                                                    <Minus className="w-5 h-5 text-gray-700 mx-auto" />
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                
                                {/* Action Row */}
                                <tr className="bg-[#18181b]">
                                    <td className="p-5 border-r border-white/5"></td>
                                    <td className="p-5 text-center border-r border-white/5">
                                        <Link href="/register?plan=start" className="block w-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 rounded transition-colors">
                                            Escolher Start
                                        </Link>
                                    </td>
                                    <td className="p-5 text-center border-r border-white/5 bg-[#202024]/50">
                                        <Link href="/register?plan=pro" className="block w-full bg-[#f79f08] hover:bg-[#d88b06] text-[#231c10] text-xs font-bold py-2 rounded shadow-[0_0_20px_rgba(247,159,8,0.2)] transition-all">
                                            Escolher Pro
                                        </Link>
                                    </td>
                                    <td className="p-5 text-center">
                                        <Link href="/register?plan=empire" className="block w-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 rounded transition-colors">
                                            Escolher Empire
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
