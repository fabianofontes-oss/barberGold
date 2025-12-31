import { Star } from 'lucide-react';

export function TestimonialsSection() {
    const testimonials = [
        {
            quote: '"Eu perdia cerca de R$ 3.000 por mÃªs sÃ³ com gente que marcava e nÃ£o vinha. Implementei a cobranÃ§a antecipada do BarberGOLD e o prejuÃ­zo zerou na mesma semana."',
            name: 'Carlos Mendez',
            role: 'Dono da Vintage Club',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4kDkxb3gDgt38xA1SF7nJ2XcYwt4Ody0WoLBc9fMVhqmlO4_QTDXrz1vCPo3jfncdXWUrC2aAOSO1KZ0bmv8WQD2n9oA29XkS_9v-v4Cf40IqGT0GVVm2d0Fva9akSIvYQt59LSsTaxzfwB6EKmAYucghATe6LEXF1roS1lFeslXeTf1FukVme7rTS4XOUVhrE02OELju_xZDAagPNcG36wqDNuoGEgUhtIE__OLYNhVffcfgQsNM-wvl7y4HJ9ke4DdWOHvFv7M',
            featured: false
        },
        {
            quote: '"O Barber Club foi a virada de chave. Tenho 150 assinantes pagando R$ 89 todo mÃªs. Eu comeÃ§o o mÃªs jÃ¡ com as contas pagas antes de cortar o primeiro cabelo."',
            name: 'Ricardo Silva',
            role: 'CEO da Barbearia Black',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3OTr4zFHD35ssn7s3udqUNpO0sT29RcCphZnPV39J3R_j8dkQD0OLmun_afgEeuF3OSHCGCIGQAZ8UVBV4L2kUU7i9dKBAj3nlrzVhjZZMxJuxtFR2FeE2JIvWwu_Q2RyvddblBmL1hvNGusYPabNMPehrwMYOjrlpDsIpE34qMV9zwS44T2gtEJ1JWPcIRwtoIakXuRJOWnAFoipM0L9SEGcZYU-5eOa6dNDCjFgeMx1KJ3CWuO94is_AznUVKoeTa838Obh800',
            featured: true
        },
        {
            quote: '"O controle financeiro Ã© absurdo. Eu achava que estava lucrando, mas o Smart Split me mostrou onde o dinheiro estava vazando nas comissÃµes. Recomendo demais."',
            name: 'AndrÃ© Lucca',
            role: 'Fundador da Mustache',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB14xirx1c38h6PG_7y2pq5CPMxG3dzgvuRCcPj8azFeFHhNhE_5VMReiNR0E2rma3OTKhlbdIkbHVxWy68jU6011LkkL_NnXGQR6rKCU8mPnRIS6BwgQNcXM_qEQPODRGyBMJQn1ugRu7_SwfiQeHTXNkbOBWm3Lp_OwHGQWynlUAYqIuLmGppDkZDxT2OgOd0xb1j29-Eida_gCaiuWeiv1miIkx1hcaZMY6O4kx9JsI_VYEOdYnIBQNAJuJJma2Y54WXeDXGC9E',
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
                                <div 
                                    className="h-12 w-12 rounded-full bg-gray-600 bg-cover bg-center"
                                    style={{ backgroundImage: `url('${testimonial.image}')` }}
                                ></div>
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
