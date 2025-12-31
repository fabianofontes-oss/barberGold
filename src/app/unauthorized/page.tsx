'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-3">403</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Acesso Negado</h2>
        
        {/* Message */}
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Você não tem permissão para acessar esta área. 
          Esta página é restrita a administradores do sistema.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/app/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-lg transition-all"
          >
            <Home className="w-4 h-4" />
            Ir para Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-zinc-600 mt-8">
          Se você acredita que deveria ter acesso, entre em contato com o administrador do sistema.
        </p>
      </div>
    </div>
  );
}
