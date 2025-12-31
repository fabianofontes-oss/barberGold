import { CreditCard, Store } from 'lucide-react';

export function SocialProofSection() {
    return (
        <section className="border-y border-white/5 bg-[#141416] py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
                    <div className="max-w-md text-center lg:text-left">
                        <h3 className="text-2xl font-bold text-white mb-2">Usado pela elite</h3>
                        <p className="text-gray-400 text-sm">As barbearias mais lucrativas do paÃ­s rodam no nosso sistema operacional.</p>
                    </div>
                    
                    <div className="flex flex-1 w-full flex-col sm:flex-row gap-6 items-center justify-end">
                        <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-xl border border-white/5 w-full sm:w-auto">
                            <div className="p-3 bg-[#f79f08]/10 rounded-lg text-[#f79f08]">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Volume Mensal</p>
                                <p className="text-xl font-bold text-white font-mono">+ R$ 5 MilhÃµes</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-xl border border-white/5 w-full sm:w-auto">
                            <div className="p-3 bg-[#f79f08]/10 rounded-lg text-[#f79f08]">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Barbearias</p>
                                <p className="text-xl font-bold text-white font-mono">500+ Ativas</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Brand Logos */}
                <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="h-12 flex items-center justify-center font-bold text-xl text-white">BARBER<span className="font-light">KING</span></div>
                    <div className="h-12 flex items-center justify-center font-bold text-xl text-white">ROYAL<span className="font-light">CUTS</span></div>
                    <div className="h-12 flex items-center justify-center font-bold text-xl text-white">THE<span className="font-light">GENT</span></div>
                    <div className="h-12 flex items-center justify-center font-bold text-xl text-white">VINTAGE<span className="font-light">CLUB</span></div>
                    <div className="h-12 flex items-center justify-center font-bold text-xl text-white">SHARP<span className="font-light">&CO</span></div>
                    <div className="h-12 flex items-center justify-center font-bold text-xl text-white">ELITE<span className="font-light">GROOM</span></div>
                </div>
            </div>
        </section>
    );
}
