'use client';

import { useEffect } from 'react';
import { AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';

export default function AppError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('App error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                    Erro na aplicação
                </h2>

                <p className="text-zinc-400 mb-6">
                    Ocorreu um erro. Tente novamente ou volte para o início.
                </p>

                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 mb-6 text-left">
                        <p className="text-xs font-mono text-red-400 break-words">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs font-mono text-zinc-500 mt-2">
                                ID: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={reset}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold py-3 px-6 rounded-xl transition-all"
                    >
                        Tentar novamente
                    </button>

                    <Link
                        href="/app/dashboard"
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Início
                    </Link>
                </div>
            </div>
        </div>
    );
}
