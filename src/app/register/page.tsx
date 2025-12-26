'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Scissors, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { validateSlug } from '@/lib/validation/reserved-slugs';

function RegisterForm() {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form State
    const [fullname, setFullname] = useState('');
    const [shopSlug, setShopSlug] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        const supabase = createClient();
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        if (!termsAccepted) {
            setError('Você deve aceitar os Termos de Serviço.');
            setLoading(false);
            return;
        }

        // Validar slug se foi preenchido
        if (shopSlug.trim()) {
            const slugValidation = validateSlug(shopSlug);
            if (!slugValidation.valid) {
                setError(slugValidation.error || 'Nome inválido');
                setLoading(false);
                return;
            }
        }

        try {
            // Usar slug escolhido pelo usuário ou gerar automaticamente
            let finalSlug = shopSlug.trim();
            
            if (!finalSlug) {
                // Se não preencheu, gera automaticamente a partir do nome
                finalSlug = fullname
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
                    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
                    .replace(/\s+/g, '-') // Substitui espaços por hífens
                    .replace(/-+/g, '-') // Remove hífens duplicados
                    .substring(0, 30) // Limita tamanho
                    + '-' + Math.floor(Math.random() * 10000); // Adiciona número aleatório
            } else {
                // Limpa o slug escolhido pelo usuário
                finalSlug = finalSlug
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9-]/g, '')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '') // Remove hífens no início/fim
                    .substring(0, 30);
            }

            const { error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullname,
                        slug: finalSlug,
                        plan: 'FREE', // SEMPRE FREE - Sistema gratuito
                    }
                }
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            // Success - Hard redirect para garantir que cookies sejam propagados
            window.location.href = '/app/dashboard';
        } catch (err) {
            setError('Ocorreu um erro inesperado ao tentar criar sua conta.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const supabase = createClient();
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) {
                setError(error.message);
                return;
            }
        } catch (err) {
            setError('Erro ao iniciar cadastro com Google.');
        }
    };

    return (
        <div className="min-h-screen bg-[#231c0f] flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 relative flex-col justify-between bg-[#1a150b] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070"
                        alt="Barber working"
                        fill
                        className="object-cover opacity-60 grayscale mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#231c0f] via-[#231c0f]/80 to-transparent"></div>
                </div>
                
                {/* Content Overlay */}
                <div className="relative z-10 p-12 flex flex-col h-full justify-between">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3 text-[#f79f08]">
                        <div className="size-8 rounded bg-[#f79f08]/20 flex items-center justify-center text-[#f79f08]">
                            <Sparkles className="size-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">BarberGOLD</span>
                    </Link>
                    
                    {/* Hero Text */}
                    <div className="max-w-md">
                        <h1 className="text-4xl font-black leading-tight tracking-tight mb-4 text-white">
                            Entre para o Padrão Ouro.
                        </h1>
                        <p className="text-[#ccb58f] text-lg font-medium leading-relaxed">
                            Gerencie sua barbearia com precisão e estilo. Organize agendamentos, gerencie equipe e faça seu negócio crescer com a plataforma feita para profissionais.
                        </p>
                        <div className="mt-8 flex gap-2">
                            <div className="h-1 w-12 rounded-full bg-[#f79f08]"></div>
                            <div className="h-1 w-4 rounded-full bg-[#342a18]"></div>
                            <div className="h-1 w-4 rounded-full bg-[#342a18]"></div>
                        </div>
                    </div>
                    
                    {/* Footer Text */}
                    <div className="text-sm text-[#ccb58f]/60">
                        © 2025 BarberGOLD Inc. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 xl:p-20 relative bg-[#231c0f]">
                {/* Mobile Header */}
                <div className="lg:hidden w-full flex justify-between items-center mb-8">
                    <Link href="/" className="flex items-center gap-2 text-white">
                        <Sparkles className="size-6 text-[#f79f08]" />
                        <span className="font-bold text-lg">BarberGOLD</span>
                    </Link>
                    <Link href="/login" className="text-sm font-bold text-[#f79f08] hover:text-white transition-colors">
                        Entrar
                    </Link>
                </div>
                
                <div className="w-full max-w-[480px] flex flex-col gap-8">
                    {/* Form Header */}
                    <div className="space-y-2">
                        <h2 className="text-white text-3xl font-bold leading-tight tracking-tight">Criar Conta</h2>
                        <p className="text-[#ccb58f] text-base">Preencha seus dados para começar.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="flex flex-col gap-5">
                        {/* Full Name */}
                        <label className="flex flex-col gap-2">
                            <span className="text-white text-sm font-medium leading-normal">Nome Completo</span>
                            <input
                                type="text"
                                required
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                placeholder="Ex: João Silva"
                                disabled={loading}
                                className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f79f08]/50 border border-[#695430] bg-[#342a18] focus:border-[#f79f08] h-12 placeholder:text-[#ccb58f]/50 px-4 text-base font-normal transition-all duration-200 disabled:opacity-50"
                            />
                        </label>

                        {/* Shop Slug */}
                        <label className="flex flex-col gap-2">
                            <span className="text-white text-sm font-medium leading-normal">Nome da sua Barbearia (URL)</span>
                            <div className="flex items-center gap-2 w-full rounded-lg border border-[#695430] bg-[#342a18] focus-within:border-[#f79f08] focus-within:ring-2 focus-within:ring-[#f79f08]/50 h-12 px-4 transition-all duration-200">
                                <input
                                    type="text"
                                    value={shopSlug}
                                    onChange={(e) => setShopSlug(e.target.value)}
                                    placeholder="barbearia-joao"
                                    disabled={loading}
                                    className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-[#ccb58f]/50 text-base font-normal disabled:opacity-50"
                                />
                                <span className="text-[#ccb58f]/50 text-sm whitespace-nowrap">.barber.gold</span>
                            </div>
                            <p className="text-xs text-[#ccb58f]/50">Escolha um nome único para sua barbearia (opcional)</p>
                        </label>

                        {/* Email Address */}
                        <label className="flex flex-col gap-2">
                            <span className="text-white text-sm font-medium leading-normal">Email</span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@suabarbearia.com"
                                disabled={loading}
                                className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f79f08]/50 border border-[#695430] bg-[#342a18] focus:border-[#f79f08] h-12 placeholder:text-[#ccb58f]/50 px-4 text-base font-normal transition-all duration-200 disabled:opacity-50"
                            />
                        </label>

                        {/* Password */}
                        <label className="flex flex-col gap-2">
                            <span className="text-white text-sm font-medium leading-normal">Senha</span>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Crie uma senha"
                                    disabled={loading}
                                    className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f79f08]/50 border border-[#695430] bg-[#342a18] focus:border-[#f79f08] h-12 placeholder:text-[#ccb58f]/50 pl-4 pr-12 text-base font-normal transition-all duration-200 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ccb58f] hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </label>

                        {/* Confirm Password */}
                        <label className="flex flex-col gap-2">
                            <span className="text-white text-sm font-medium leading-normal">Confirmar Senha</span>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirme sua senha"
                                    disabled={loading}
                                    className="w-full rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#f79f08]/50 border border-[#695430] bg-[#342a18] focus:border-[#f79f08] h-12 placeholder:text-[#ccb58f]/50 pl-4 pr-12 text-base font-normal transition-all duration-200 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ccb58f] hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </label>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-3 mt-2">
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    disabled={loading}
                                    className="w-5 h-5 rounded border-[#695430] bg-[#342a18] text-[#f79f08] focus:ring-[#f79f08]/50 focus:ring-offset-0 cursor-pointer disabled:opacity-50"
                                />
                            </div>
                            <label htmlFor="terms" className="text-sm font-normal text-[#ccb58f] leading-tight cursor-pointer select-none">
                                Eu concordo com os{' '}
                                <Link href="/termos" className="text-[#f79f08] hover:text-[#f79f08]/80 hover:underline">
                                    Termos de Serviço
                                </Link>
                                {' '}e{' '}
                                <Link href="/privacidade" className="text-[#f79f08] hover:text-[#f79f08]/80 hover:underline">
                                    Política de Privacidade
                                </Link>.
                            </label>
                        </div>

                        {/* Create Account Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#f79f08] hover:bg-[#f79f08]/90 active:bg-[#f79f08]/80 text-[#231c0f] text-base font-bold leading-normal tracking-wide transition-all shadow-[0_0_20px_rgba(247,159,8,0.15)] hover:shadow-[0_0_25px_rgba(247,159,8,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                    Processando...
                                </>
                            ) : 'Começar Grátis'}
                        </button>

                    </form>
                    
                    {/* Divider */}
                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-[#695430]/50"></div>
                        <span className="flex-shrink-0 mx-4 text-[#ccb58f] text-sm">Ou continue com</span>
                        <div className="flex-grow border-t border-[#695430]/50"></div>
                    </div>

                    {/* Google Button */}
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleGoogleLogin}
                        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg h-12 px-4 bg-[#342a18] hover:bg-[#342a18]/80 border border-[#695430] text-white text-sm font-bold leading-normal transition-all disabled:opacity-50"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>

                    {/* Login Link */}
                    <div className="text-center mt-2">
                        <p className="text-[#ccb58f] text-sm">
                            Já tem uma conta?{' '}
                            <Link href="/login" className="text-[#f79f08] font-bold hover:underline ml-1">
                                Entrar
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#231c0f] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#f79f08] animate-spin" />
            </div>
        }>
            <RegisterForm />
        </Suspense>
    );
}
