'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

function RegisterForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const supabase = createClient();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form State
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [shopSlug, setShopSlug] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('pro');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Read URL parameters on mount
    useEffect(() => {
        const urlSlug = searchParams.get('slug');
        const urlPlan = searchParams.get('plan');

        if (urlSlug) {
            setShopSlug(urlSlug);
        }
        if (urlPlan) {
            setSelectedPlan(urlPlan);
        }
    }, [searchParams]);

    const handleRegister = async (e: React.FormEvent) => {
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

        try {
            const { error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullname,
                        slug: shopSlug,
                        plan: selectedPlan,
                    }
                }
            });

            if (authError) {
                setError(authError.message);
                return;
            }

            // Success - Redirect to dashboard
            // Note: If email confirmation is enabled, we might need to show a "Check your email" message
            // But usually for MVPs we redirect directly or to a success page.
            router.push('/app/dashboard');
            router.refresh();
        } catch (err) {
            setError('Ocorreu um erro inesperado ao tentar criar sua conta.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
        } catch (err) {
            setError('Erro ao iniciar cadastro com Google.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f11] flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#18181b] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070"
                    alt="Professional Barber"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="relative z-20 flex flex-col justify-between p-12 text-white">
                    <Link href="/" className="flex items-center gap-3">
                        <svg className="w-10 h-10 text-[#f79f08]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L3 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                        </svg>
                        <span className="text-2xl font-bold">Barber<span className="text-[#f79f08]">GOLD</span></span>
                    </Link>

                    <div>
                        <h1 className="text-4xl font-bold mb-4 leading-tight">
                            Join the Gold Standard.
                        </h1>
                        <p className="text-gray-300 text-lg max-w-md">
                            Manage your shop with precision and style. Streamline appointments, manage staff, and grow your business with the platform built for professionals.
                        </p>
                        <div className="w-16 h-1 bg-[#f79f08] mt-6"></div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <Link href="/" className="lg:hidden flex items-center gap-2 mb-8 justify-center">
                        <svg className="w-8 h-8 text-[#f79f08]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L3 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                        </svg>
                        <span className="text-xl font-bold text-white">Barber<span className="text-[#f79f08]">GOLD</span></span>
                    </Link>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-gray-400">Enter your details below to get started.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name
                            </label>
                            <input
                                id="fullname"
                                type="text"
                                required
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                placeholder="e.g. James Cutter"
                                disabled={loading}
                                className="w-full px-4 py-3 bg-[#18181b] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f79f08] focus:border-transparent transition-all disabled:opacity-50"
                            />
                        </div>

                        {/* Barbershop Slug */}
                        {shopSlug && (
                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                                    Your Barbershop URL
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 text-sm">barber.gold/</span>
                                    <input
                                        id="slug"
                                        type="text"
                                        value={shopSlug}
                                        onChange={(e) => setShopSlug(e.target.value)}
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 bg-[#18181b] border border-[#f79f08]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f79f08] focus:border-transparent transition-all disabled:opacity-50"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Reserved from landing page</p>
                            </div>
                        )}

                        {/* Selected Plan */}
                        {selectedPlan && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Selected Plan
                                </label>
                                <div className="px-4 py-3 bg-[#f79f08]/10 border border-[#f79f08]/30 rounded-lg">
                                    <span className="text-[#f79f08] font-bold capitalize">{selectedPlan} Plan</span>
                                    <span className="text-gray-400 text-sm ml-2">
                                        {selectedPlan === 'start' && '- R$ 89/mês'}
                                        {selectedPlan === 'pro' && '- R$ 149/mês'}
                                        {selectedPlan === 'empire' && '- R$ 299/mês'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Email Address */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@barbershop.com"
                                disabled={loading}
                                className="w-full px-4 py-3 bg-[#18181b] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f79f08] focus:border-transparent transition-all disabled:opacity-50"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-[#18181b] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f79f08] focus:border-transparent transition-all pr-12 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-[#18181b] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f79f08] focus:border-transparent transition-all pr-12 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                disabled={loading}
                                className="w-4 h-4 mt-1 bg-[#18181b] border border-white/10 rounded text-[#f79f08] focus:ring-2 focus:ring-[#f79f08] focus:ring-offset-0 disabled:opacity-50"
                            />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                                I agree to the{' '}
                                <Link href="/terms" className="text-[#f79f08] hover:text-[#d88b06] transition-colors">
                                    Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-[#f79f08] hover:text-[#d88b06] transition-colors">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Create Account Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#f79f08] hover:bg-[#d88b06] text-[#0f0f11] font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(247,159,8,0.2)] hover:shadow-[0_0_30px_rgba(247,159,8,0.4)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-[#0f0f11]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processando...
                                </>
                            ) : 'Create Account'}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-[#0f0f11] text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Button */}
                        <button
                            type="button"
                            disabled={loading}
                            onClick={handleGoogleLogin}
                            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#f79f08] hover:text-[#d88b06] font-medium transition-colors">
                            Log In
                        </Link>
                    </p>

                    {/* Copyright */}
                    <p className="mt-6 text-center text-xs text-gray-600">
                        © 2025 BarberGOLD Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center">
                <div className="text-white">Carregando...</div>
            </div>
        }>
            <RegisterForm />
        </Suspense>
    );
}
