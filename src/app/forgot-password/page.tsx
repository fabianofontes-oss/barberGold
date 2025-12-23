'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Scissors, ArrowLeft, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        const supabase = createClient();
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/app/settings/password`,
            });

            if (resetError) {
                setError(resetError.message);
                return;
            }

            setSuccess(true);
        } catch (err) {
            setError('Ocorreu um erro ao tentar enviar o link de recuperação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col bg-[#231c0f] overflow-x-hidden antialiased">
            {/* Background Image with Overlay */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074"
                        alt="Dark moody barbershop interior"
                        fill
                        className="object-cover opacity-20 blur-[2px] scale-105"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#231c0f] via-[#231c0f]/95 to-[#231c0f]"></div>
            </div>
            
            {/* Main Layout Container */}
            <div className="flex h-full grow flex-col relative z-10 items-center justify-center p-4">
                {/* Central Card */}
                <div className="flex flex-col w-full max-w-[480px] bg-[#231c10] rounded-xl border border-[#4a3e2a] shadow-2xl overflow-hidden backdrop-blur-sm">
                    {/* Logo / Brand Area */}
                    <div className="flex justify-center pt-10 pb-2">
                        <div className="h-20 w-20 bg-gradient-to-br from-[#f79f08] to-[#cc8400] rounded-xl flex items-center justify-center shadow-lg shadow-[#f79f08]/10 rotate-3 border-b-4 border-b-[#9e6b00]">
                            <Scissors className="text-[#231c0f] w-10 h-10" />
                        </div>
                    </div>
                    
                    {/* Page Heading */}
                    <div className="flex flex-col gap-3 p-6 pb-2 text-center">
                        <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight">Forgot Password?</h1>
                        <p className="text-[#ccb58f] text-sm font-normal leading-relaxed px-4">
                            Don&apos;t worry, it happens. Enter the email associated with your BarberGOLD account.
                        </p>
                    </div>
                    
                    {/* Form Fields */}
                    <div className="flex flex-col gap-5 p-8 pt-4">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                                Link de recuperação enviado com sucesso! Verifique seu e-mail.
                            </div>
                        )}
                        
                        <form onSubmit={handleReset} className="flex flex-col gap-5">
                            {/* Email TextField */}
                            <label className="flex flex-col min-w-40 flex-1 gap-2">
                                <p className="text-white text-sm font-medium leading-normal ml-1">Email Address</p>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                    disabled={loading || success}
                                    className="w-full rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#f79f08] border border-[#695430] bg-[#342a18] focus:border-[#f79f08] h-14 placeholder:text-[#ccb58f]/50 px-4 text-base font-normal leading-normal transition-colors disabled:opacity-50"
                                />
                            </label>
                            
                            {/* Primary Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading || success}
                                    className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#f79f08] hover:bg-[#ffad1f] text-[#231c10] text-base font-bold leading-normal tracking-wide transition-all transform active:scale-[0.98] shadow-lg shadow-[#f79f08]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                            Enviando...
                                        </>
                                    ) : 'Send Reset Link'}
                                </button>
                            </div>
                        </form>
                        
                        {/* Divider */}
                        <div className="flex items-center gap-4 py-1">
                            <div className="h-[1px] flex-1 bg-[#4a3e2a]"></div>
                            <span className="text-[#ccb58f] text-[10px] font-bold uppercase tracking-widest opacity-60">OR</span>
                            <div className="h-[1px] flex-1 bg-[#4a3e2a]"></div>
                        </div>
                        
                        {/* Secondary Button (Back to Login) */}
                        <div>
                            <Link
                                href="/login"
                                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent hover:bg-[#342a18] text-[#ccb58f] hover:text-white text-sm font-bold leading-normal tracking-wide transition-colors gap-2 group"
                            >
                                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                <span>Back to Login</span>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Decorative bottom edge */}
                    <div className="h-1 w-full bg-gradient-to-r from-[#231c10] via-[#f79f08]/50 to-[#231c10]"></div>
                </div>
                
                {/* Simple Footer */}
                <p className="mt-8 text-[#ccb58f]/40 text-xs font-medium tracking-wide">
                    BARBERGOLD MANAGEMENT SYSTEMS
                </p>
            </div>
        </div>
    );
}
