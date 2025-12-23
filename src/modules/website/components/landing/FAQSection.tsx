'use client';

import { ChevronDown } from 'lucide-react';

export function FAQSection() {
    const faqs = [
        {
            question: 'Preciso instalar algum programa no computador?',
            answer: 'Não. O BarberGOLD é 100% online e roda direto no navegador, seja no PC, tablet ou celular. Seus dados ficam salvos na nuvem com segurança bancária.'
        },
        {
            question: 'Consigo migrar os dados do meu sistema antigo?',
            answer: 'Sim! Temos uma equipe dedicada a importação de dados. Trazemos sua lista de clientes, produtos e histórico.'
        },
        {
            question: 'O período de teste é realmente gratuito?',
            answer: 'Sim, 14 dias totalmente grátis, sem necessidade de cartão de crédito. Você testa todas as funcionalidades premium.'
        }
    ];

    return (
        <section className="py-24 bg-[#0f0f11]" id="faq">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-white text-center mb-12">Perguntas Frequentes</h2>
                
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <details 
                            key={index} 
                            className="group bg-[#18181b] rounded-lg border border-white/5 open:bg-white/5 transition-all"
                        >
                            <summary className="flex cursor-pointer items-center justify-between p-6 text-lg font-medium text-white marker:content-none list-none">
                                {faq.question}
                                <ChevronDown className="w-5 h-5 transition group-open:rotate-180" />
                            </summary>
                            <div className="px-6 pb-6 text-gray-400">
                                {faq.answer}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
