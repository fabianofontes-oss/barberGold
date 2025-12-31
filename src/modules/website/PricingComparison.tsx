import Link from 'next/link';

export default function PricingComparison() {
    return (
        <section className="py-24 bg-[#0e0e10] border-t border-white/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Compare os Planos Lado a Lado
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Confira em detalhes o que cada plano oferece e escolha a ferramenta certa para o momento da sua barbearia.
                    </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#18181b] shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr>
                                    <th className="p-6 bg-[#18181b] border-b border-white/5 text-gray-400 font-medium w-1/3 min-w-[240px]">
                                        Recursos & Funcionalidades
                                    </th>
                                    <th className="p-6 bg-[#18181b] border-b border-white/5 text-center w-1/5 min-w-[160px]">
                                        <div className="text-white font-bold text-lg mb-1">Start</div>
                                        <div className="text-gray-500 text-sm font-normal">R$ 89/mês</div>
                                    </th>
                                    <th className="p-6 bg-[#202024] border-b border-[#f79f08]/20 border-t-4 border-t-[#f79f08] text-center w-1/5 min-w-[160px] relative">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f79f08] text-[#231c10] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-lg shadow-[#f79f08]/20">
                                            Recomendado
                                        </div>
                                        <div className="text-[#f79f08] font-bold text-xl mb-1" style={{ textShadow: '0 0 20px rgba(247, 159, 8, 0.3)' }}>
                                            Pro Gold
                                        </div>
                                        <div className="text-white text-sm font-normal">R$ 149/mês</div>
                                    </th>
                                    <th className="p-6 bg-[#18181b] border-b border-white/5 text-center w-1/5 min-w-[160px]">
                                        <div className="text-white font-bold text-lg mb-1">Empire</div>
                                        <div className="text-gray-500 text-sm font-normal">R$ 299/mês</div>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                                {/* Gestão Essencial */}
                                <tr className="bg-white/[0.02]">
                                    <td className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider" colSpan={4}>
                                        Gestão Essencial
                                    </td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="p-5 border-r border-white/5 group-hover:text-white transition-colors">Agendamento Online</td>
                                    <td className="p-5 text-center border-r border-white/5"><span className="text-[#f79f08] text-xl">✓</span></td>
                                    <td className="p-5 text-center border-r border-white/5 bg-[#202024]/50"><span className="text-[#f79f08] text-xl">✓</span></td>
                                    <td className="p-5 text-center"><span className="text-[#f79f08] text-xl">✓</span></td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="p-5 border-r border-white/5 group-hover:text-white transition-colors">CRM (Gestão de Clientes)</td>
                                    <td className="p-5 text-center border-r border-white/5"><span className="text-[#f79f08] text-xl">✓</span></td>
                                    <td className="p-5 text-center border-r border-white/5 bg-[#202024]/50"><span className="text-[#f79f08] text-xl">✓</span></td>
                                    <td className="p-5 text-center"><span className="text-[#f79f08] text-xl">✓</span></td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="p-5 border-r border-white/5 group-hover:text-white transition-colors font-medium">Confirmação via WhatsApp</td>
                                    <td className="p-5 text-center border-r border-white/5"><span className="text-gray-700 text-xl">−</span></td>
                                    <td className="p-5 text-center border-r border-white/5 bg-[#202024]/50"><span className="text-[#f79f08] text-xl">✓</span></td>
                                    <td className="p-5 text-center"><span className="text-[#f79f08] text-xl">✓</span></td>
                                </tr>

                                {/* Financeiro & Lucro */}
                                <tr className="bg-white/[0.02]">
                                    <td className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider" colSpan={4}>
                                        Financeiro & Lucro
                                    </td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="p-5 border-r border-white/5 group-hover:text-white transition-colors">Controle de Caixa</td>
                                    <td className="p-5 text-center border-r border-white/5"><span className="text-[#f79f08] text-xl">✓</span></td>
                                    <td className="p-5 text-center border-r border-white/5 bg-[#202024]/50"><span className="text-[#f79f08] text-xl">✓</span></td>
                                    <td className="p-5 text-center"><span className="text-[#f79f08] text-xl">✓</span></td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="p-5 border-r border-white/5 group-hover:text-white transition-colors font-medium text-white/90">Smart Split (Comissões)</td>
                                    <td className="p-5 text-center border-r border-white/5"><span className="text-gray-700 text-xl">−</span></td>
                                    <td className="p-5 text-center border-r border-white/5 bg-[#202024]/50"><span className="text-[#f79f08] text-xl">✓</span></td>
                                    <td className="p-5 text-center"><span className="text-[#f79f08] text-xl">✓</span></td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="p-5 border-r border-white/5 group-hover:text-white transition-colors font-medium text-white/90">Barber Club (Assinaturas)</td>
                                    <td className="p-5 text-center border-r border-white/5"><span className="text-gray-700 text-xl">−</span></td>
                                    <td className="p-5 text-center border-r border-white/5 bg-[#202024]/50"><span className="text-gray-700 text-xl">−</span></td>
                                    <td className="p-5 text-center"><span className="text-[#f79f08] text-xl">✓</span></td>
                                </tr>

                                {/* Escala & Operação */}
                                <tr className="bg-white/[0.02]">
                                    <td className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider" colSpan={4}>
                                        Escala & Operação
                                    </td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="p-5 border-r border-white/5 group-hover:text-white transition-colors">Gestão de Estoque</td>
                                    <td className="p-5 text-center border-r border-white/5"><span className="text-gray-700 text-xl">−</span></td>
                                    <td className="p-5 text-center border-r border-white/5 bg-[#202024]/50"><span className="text-[#f79f08] text-xl">✓</span></td>
                                    <td className="p-5 text-center"><span className="text-[#f79f08] text-xl">✓</span></td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="p-5 border-r border-white/5 group-hover:text-white transition-colors">Múltiplas Unidades</td>
                                    <td className="p-5 text-center border-r border-white/5"><span className="text-gray-700 text-xl">−</span></td>
                                    <td className="p-5 text-center border-r border-white/5 bg-[#202024]/50"><span className="text-gray-700 text-xl">−</span></td>
                                    <td className="p-5 text-center"><span className="text-[#f79f08] text-xl">✓</span></td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors group">
                                    <td className="p-5 border-r border-white/5 group-hover:text-white transition-colors">Atendimento</td>
                                    <td className="p-5 text-center border-r border-white/5 text-xs text-gray-500">Email</td>
                                    <td className="p-5 text-center border-r border-white/5 bg-[#202024]/50 text-xs text-white font-medium">Chat & Email</td>
                                    <td className="p-5 text-center text-xs text-[#f79f08] font-bold">Gerente VIP</td>
                                </tr>

                                {/* CTAs */}
                                <tr className="bg-[#18181b]">
                                    <td className="p-5 border-r border-white/5"></td>
                                    <td className="p-5 text-center border-r border-white/5">
                                        <Link href="/register" className="block w-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 rounded transition-colors">
                                            Escolher Start
                                        </Link>
                                    </td>
                                    <td className="p-5 text-center border-r border-white/5 bg-[#202024]/50">
                                        <Link href="/register" className="block w-full bg-[#f79f08] hover:bg-[#d88b06] text-[#231c10] text-xs font-bold py-2 rounded shadow-[0_0_20px_rgba(247,159,8,0.2)] transition-all">
                                            Escolher Pro
                                        </Link>
                                    </td>
                                    <td className="p-5 text-center">
                                        <Link href="/register" className="block w-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2 rounded transition-colors">
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
