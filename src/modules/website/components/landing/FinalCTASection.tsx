import Link from 'next/link';

export function FinalCTASection() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0f0f11] relative border-t border-white/5">
            <div 
                className="absolute inset-0 pointer-events-none" 
                style={{ background: 'radial-gradient(circle at center, rgba(247, 159, 8, 0.05) 0%, transparent 70%)' }}
            ></div>
            
            <div className="mx-auto max-w-4xl text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                    Pare de ser refÃ©m do WhatsApp.
                </h2>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                    Profissionalize sua gestÃ£o, elimine erros manuais e veja seu lucro crescer. Teste sem compromisso.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/register"
                        className="bg-[#f79f08] hover:bg-[#d88b06] text-[#231c10] text-lg font-bold py-4 px-10 rounded-lg transition-all shadow-[0_0_20px_rgba(247,159,8,0.2)] transform hover:scale-105"
                    >
                        ComeÃ§ar Teste de 14 Dias
                    </Link>
                </div>
                
                <p className="mt-6 text-sm text-gray-500">Sem cartÃ£o de crÃ©dito â€¢ Cancelamento a qualquer momento</p>
            </div>
        </section>
    );
}
