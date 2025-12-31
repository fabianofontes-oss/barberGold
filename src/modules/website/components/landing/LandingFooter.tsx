import Link from 'next/link';

export function LandingFooter() {
    return (
        <footer className="py-8 bg-black border-t border-white/10">
            <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                <div className="mb-4 md:mb-0">
                    <span className="font-bold text-gray-500">BarberGOLD © 2025</span>
                </div>
                <div className="flex gap-6">
                    <Link href="/termos" className="hover:text-[#f79f08] transition-colors">
                        Termos de Uso
                    </Link>
                    <Link href="/privacidade" className="hover:text-[#f79f08] transition-colors">
                        Privacidade
                    </Link>
                    <a href="mailto:contato@barbergold.com" className="hover:text-[#f79f08] transition-colors">
                        Contato
                    </a>
                </div>
            </div>
        </footer>
    );
}
