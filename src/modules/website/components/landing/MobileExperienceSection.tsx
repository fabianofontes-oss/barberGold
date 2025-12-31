import { Smartphone, MessageCircle } from 'lucide-react';

export function MobileExperienceSection() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f11] relative overflow-hidden">
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[500px] bg-gradient-to-r from-[#0f0f11] via-[#f79f08]/5 to-[#0f0f11] pointer-events-none"></div>
            
            <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-16 relative z-10">
                {/* Phone Mockup */}
                <div className="lg:w-1/2">
                    <div className="relative w-full max-w-sm mx-auto">
                        <div className="relative border-8 border-[#2d2d30] rounded-[3rem] overflow-hidden shadow-2xl bg-[#0f0f11]">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#2d2d30] rounded-b-xl z-20"></div>
                            
                            {/* Phone Content */}
                            <div className="bg-[#0f0f11] h-[600px] w-full pt-12 px-6 flex flex-col gap-4">
                                {/* Header */}
                                <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                                    <div 
                                        className="w-10 h-10 rounded-full bg-gray-700 bg-cover bg-center"
                                        style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDc-RJJTK8lKGxDzLMMfRjuh2m6vAX50cpbScJasKfBBLI5jOaG8EK9iPijnuwsuuylQnnbHZdSQjR_eQIC9L_kBE77qijfgFH0Cep3Mz0b8QBxqdGpRaZbrfHIUwu1y045j4jwx7L7ti_Zo9yzkgA1g4OwwMHeB8c9U-IL0LZUuEJl306-b_gTU1mzymGyssNMwijklnmIos_7pW5jwLdyW0_uh3CWlcYF9h-Xv59uuxujuSA8JupkCW7aYxyFEzzrt3iaHhpRxY0')` }}
                                    ></div>
                                    <div>
                                        <div className="h-2 w-24 bg-gray-700 rounded mb-1"></div>
                                        <div className="h-2 w-16 bg-gray-800 rounded"></div>
                                    </div>
                                </div>
                                
                                {/* Chat Messages */}
                                <div className="flex flex-col gap-3 mt-4">
                                    <div className="self-start bg-[#1f1f22] p-3 rounded-2xl rounded-tl-none max-w-[85%]">
                                        <p className="text-xs text-gray-300">OlÃ¡ JoÃ£o! Seu corte estÃ¡ confirmado para amanhÃ£ Ã s 15h. Deseja adicionar uma Barboterapia com 20% OFF?</p>
                                    </div>
                                    <div className="self-end bg-[#f79f08] p-3 rounded-2xl rounded-tr-none max-w-[85%]">
                                        <p className="text-xs text-[#231c10] font-bold">Sim, pode adicionar!</p>
                                    </div>
                                    <div className="self-start bg-[#1f1f22] p-3 rounded-2xl rounded-tl-none max-w-[85%] flex flex-col gap-2">
                                        <p className="text-xs text-gray-300">Perfeito! Atualizado. AtÃ© amanhÃ£ ðŸ‘Š</p>
                                    </div>
                                </div>
                                
                                {/* Payment Card */}
                                <div className="mt-auto mb-8 bg-[#1f1f22] p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-400">Resumo</span>
                                        <span className="text-xs text-white font-bold">R$ 85,00</span>
                                    </div>
                                    <button className="w-full bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-3 rounded-lg transition-colors">
                                        Pagar via PIX
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Text Content */}
                <div className="lg:w-1/2">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">Zero Barreira de Entrada para seu cliente.</h2>
                    <p className="text-lg text-gray-400 mb-8">EsqueÃ§a aplicativos que ninguÃ©m baixa. O BarberGOLD funciona onde seu cliente jÃ¡ estÃ¡.</p>
                    
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">Sem Login, Sem App</h4>
                                <p className="text-sm text-gray-400 mt-1">Seu cliente agenda atravÃ©s de um link simples e bonito, sem precisar criar conta ou lembrar senha.</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">AutomaÃ§Ã£o WhatsApp</h4>
                                <p className="text-sm text-gray-400 mt-1">Lembretes automÃ¡ticos, confirmaÃ§Ãµes e recuperaÃ§Ã£o de clientes inativos direto no &apos;Zap&apos;.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
