import { CalendarX, Calculator, TrendingDown } from 'lucide-react';

export function ProblemSection() {
    const problems = [
        {
            icon: CalendarX,
            title: 'No-Shows Sem Multa',
            description: 'Clientes que marcam e não aparecem custam em média R$ 2.000/mês por cadeira. Nosso sistema cobra antecipado ou taxa de cancelamento automática.'
        },
        {
            icon: Calculator,
            title: 'Comissões Erradas',
            description: 'Planilhas manuais geram erros de cálculo. Pagar comissão a mais ou a menos destrói seu caixa ou sua equipe. O Smart Split calcula centavos com precisão.'
        },
        {
            icon: TrendingDown,
            title: 'Horários Ociosos',
            description: 'Cadeiras vazias em horários de pico ou vale. O Smart Pricing ajusta preços dinamicamente para preencher sua agenda 100% do tempo.'
        }
    ];

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0f0f11]">
            <div className="mx-auto max-w-4xl text-center mb-16">
                <div className="inline-block px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-semibold mb-6">
                    Alerta de Prejuízo
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Pare de perder dinheiro invisível</h2>
                <p className="text-lg text-gray-400">
                    Todo mês sua barbearia sangra lucro com erros que você nem percebe. O BarberGOLD estanca esse sangramento no primeiro dia.
                </p>
            </div>
            
            <div className="mx-auto max-w-7xl grid md:grid-cols-3 gap-6">
                {problems.map((problem, index) => {
                    const Icon = problem.icon;
                    return (
                        <div 
                            key={index}
                            className="bg-[#18181b] border border-white/5 p-8 rounded-2xl relative overflow-hidden group hover:border-red-500/30 transition-colors"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/10 transition-all"></div>
                            <Icon className="w-10 h-10 text-red-500 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">{problem.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{problem.description}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
