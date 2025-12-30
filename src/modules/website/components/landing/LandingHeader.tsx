'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scissors, Menu, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function LandingHeader() {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                setIsAuthenticated(!!user);
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error);
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    const handleLoginClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isAuthenticated) {
            router.push('/app/dashboard');
        } else {
            router.push('/login');
        }
    };

    return (
        <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0f0f11]/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="text-[#f79f08]">
                        <Scissors className="w-8 h-8" />
                    </div>
                    <h2 className="text-white text-xl font-extrabold tracking-tight">
                        Barber<span className="text-[#f79f08]">GOLD</span>
                    </h2>
                </Link>
                
                <nav className="hidden md:flex items-center gap-8">
                    <a className="text-sm font-medium text-gray-300 hover:text-white transition-colors" href="#features">Funcionalidades</a>
                    <a className="text-sm font-medium text-gray-300 hover:text-white transition-colors" href="#pricing">Preços</a>
                    <a className="text-sm font-medium text-gray-300 hover:text-white transition-colors" href="#testimonials">Depoimentos</a>
                    <a className="text-sm font-medium text-gray-300 hover:text-white transition-colors" href="#faq">FAQ</a>
                </nav>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleLoginClick}
                        className="hidden sm:block text-sm font-bold text-white hover:text-[#f79f08] transition-colors"
                    >
                        {isAuthenticated ? 'Dashboard' : 'Login'}
                    </button>
                    <Link 
                        href="/register"
                        className="bg-[#f79f08] hover:bg-[#d88b06] text-[#231c10] text-sm font-bold py-2 px-5 rounded-md transition-all shadow-[0_0_20px_rgba(247,159,8,0.2)]"
                    >
                        Começar Teste
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-300 hover:text-white"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden py-4 px-4 border-t border-white/10 bg-[#0f0f11]">
                    <nav className="flex flex-col gap-4">
                        <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Funcionalidades</a>
                        <a href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Preços</a>
                        <a href="#testimonials" className="text-sm font-medium text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Depoimentos</a>
                        <a href="#faq" className="text-sm font-medium text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
                        <button 
                            onClick={(e) => {
                                setIsMobileMenuOpen(false);
                                handleLoginClick(e);
                            }}
                            className="text-sm font-medium text-gray-300 hover:text-white text-left"
                        >
                            {isAuthenticated ? 'Dashboard' : 'Login'}
                        </button>
                        <Link href="/register" className="text-sm font-bold bg-[#f79f08] text-[#0f0f11] px-6 py-2 rounded-lg text-center">
                            Começar Teste
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
