'use client';

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-zinc-950 text-white`}>
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-red-500">Erro Crítico no Sistema</h2>
          <p className="mb-8 max-w-md text-zinc-400">
            Ocorreu um erro inesperado que impediu o carregamento da aplicação. Por favor, tente recarregar a página.
          </p>
          <button
            onClick={() => reset()}
            className="rounded-lg bg-amber-500 px-6 py-3 font-bold text-zinc-900 transition-colors hover:bg-amber-400"
          >
            Recarregar Aplicação
          </button>
        </div>
      </body>
    </html>
  );
}
