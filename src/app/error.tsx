'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Captured by Error Boundary:', error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-950 p-6 text-center text-white">
      <div className="max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-red-500">Ops! Algo deu errado.</h2>
        <p className="text-zinc-400">
          Não conseguimos carregar esta página. Isso pode ser um problema temporário ou de conexão.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="rounded-lg bg-zinc-900 p-4 text-left font-mono text-xs text-red-300">
            {error.message}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-amber-500 px-6 py-2 font-bold text-zinc-900 transition-colors hover:bg-amber-400"
          >
            Tentar Novamente
          </button>

          <Link
            href="/"
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-6 py-2 font-bold text-white transition-colors hover:bg-zinc-700"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
