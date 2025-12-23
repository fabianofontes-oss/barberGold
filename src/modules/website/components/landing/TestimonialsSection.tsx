import { Star } from 'lucide-react';

export function TestimonialsSection() {
    const testimonials = [
        {
            quote: '"Eu perdia cerca de R$ 3.000 por mês só com gente que marcava e não vinha. Implementei a cobrança antecipada do BarberGOLD e o prejuízo zerou na mesma semana."',
            name: 'Carlos Mendez',
            role: 'Dono da Vintage Club',
            featured: false
        },
        {
            quote: '"O Barber Club foi a virada de chave. Tenho 150 assinantes pagando R$ 89 todo mês. Eu começo o mês já com as contas pagas antes de cortar o primeiro cabelo."',
            name: 'Ricardo Silva',
            role: 'CEO da Barbearia Black',
            featured: true
        },
        {
            quote: '"O controle financeiro é absurdo. Eu achava que estava lucrando, mas o Smart Split me mostrou onde o dinheiro estava vazando nas comissões. Recomendo demais."',
            name: 'André Lucca',
            role: 'Fundador da Mustache',
            featured: false
        }
    ];

    return (
        <section className="py-24 bg-[#141416] border-t border-white/5" id="testimonials">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">O que os donos dizem</h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div 
                            key={index}
                            className={`bg-[#18181b] p-8 rounded-2xl border border-white/5 flex flex-col ${
                                testimonial.featured ? 'transform md:-translate-y-4 shadow-xl shadow-[#f79f08]/5' : ''
                            }`}
                        >
                            {/* Stars */}
                            <div className="flex gap-1 text-[#f79f08] mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            
                            <p className="text-gray-300 italic mb-6 flex-1">{testimonial.quote}</p>
                            
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gray-600"></div>
                                <div>
                                    <p className="text-white font-bold text-sm">{testimonial.name}</p>
                                    <p className="text-gray-500 text-xs">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
