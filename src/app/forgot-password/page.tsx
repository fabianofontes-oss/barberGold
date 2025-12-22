'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
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
        <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center p-8">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-[#18181b] border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-[#f79f08] rounded-2xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-[#0f0f11]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L3 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
                        <p className="text-gray-400">
                            Don&apos;t worry, it happens. Enter the email associated with your BarberGOLD account.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                            Link de recuperação enviado com sucesso! Verifique seu e-mail.
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleReset} className="space-y-6">
                        {/* Email */}
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
                                placeholder="Enter your registered email"
                                disabled={loading || success}
                                className="w-full px-4 py-3 bg-[#0f0f11] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f79f08] focus:border-transparent transition-all disabled:opacity-50"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full bg-[#f79f08] hover:bg-[#d88b06] text-[#0f0f11] font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(247,159,8,0.2)] hover:shadow-[0_0_30px_rgba(247,159,8,0.4)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-[#0f0f11]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enviando...
                                </>
                            ) : 'Send Reset Link'}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-[#18181b] text-gray-500 uppercase text-xs tracking-wider">OR</span>
                            </div>
                        </div>

                        {/* Back to Login */}
                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 w-full text-gray-300 hover:text-white transition-colors group"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Login</span>
                        </Link>
                    </form>
                </div>

                {/* Footer Text */}
                <p className="mt-8 text-center text-sm text-gray-600">
                    BARBERGOLD MANAGEMENT SYSTEMS
                </p>
            </div>
        </div>
    );
}
