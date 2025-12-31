'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log to Sentry
        console.error('Global error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                    Algo deu errado
                </h2>

                <p className="text-zinc-400 mb-6">
                    Ocorreu um erro inesperado. Nossa equipe foi notificada.
                </p>

                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 mb-6 text-left">
                        <p className="text-xs font-mono text-red-400">
                            {error.message}
                        </p>
                    </div>
                )}

                <button
                    onClick={reset}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold py-3 px-6 rounded-xl transition-all"
                >
                    Tentar novamente
                </button>
            </div>
        </div>
    );
}
