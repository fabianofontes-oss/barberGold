'use client';

import { useState } from 'react';
import { signUpWithTenantAction, checkSlugAvailability } from '@/modules/auth/signUpAction';
import Link from 'next/link';
import { Scissors, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slug, setSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  async function handleSlugChange(value: string) {
    const normalized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(normalized);
    
    if (normalized.length >= 3) {
      setCheckingSlug(true);
      const { available } = await checkSlugAvailability(normalized);
      setSlugAvailable(available);
      setCheckingSlug(false);
    } else {
      setSlugAvailable(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await signUpWithTenantAction(formData);

    if (!result?.success) {
      setError(result?.error || 'Erro ao criar conta');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-zinc-950 z-0"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-amber-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-2xl shadow-amber-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Scissors className="w-10 h-10 text-zinc-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Criar sua Barbearia</h1>
          <p className="text-zinc-400">Comece grátis. Sem cartão de crédito.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Nome da Barbearia</label>
              <input
                name="shopName"
                type="text"
                required
                disabled={loading}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none transition-all disabled:opacity-50"
                placeholder="Barbearia do João"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Escolha seu endereço</label>
              <div className="flex items-center gap-2">
                <input
                  name="slug"
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  disabled={loading}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-l-xl py-3 px-4 text-white focus:border-amber-500 outline-none transition-all disabled:opacity-50"
                  placeholder="minhabarbearia"
                />
                <span className="px-4 py-3 bg-zinc-800 border border-zinc-800 rounded-r-xl text-zinc-400 text-sm whitespace-nowrap">
                  .barber.gold
                </span>
              </div>
              {checkingSlug && (
                <p className="mt-2 text-xs text-zinc-500 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Verificando...
                </p>
              )}
              {slugAvailable === false && (
                <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Este nome já está em uso
                </p>
              )}
              {slugAvailable === true && (
                <p className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Disponível!
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Seu Nome</label>
              <input
                name="ownerName"
                type="text"
                required
                disabled={loading}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none transition-all disabled:opacity-50"
                placeholder="João Silva"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">E-mail</label>
              <input
                name="email"
                type="email"
                required
                disabled={loading}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none transition-all disabled:opacity-50"
                placeholder="joao@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Senha</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                disabled={loading}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:border-amber-500 outline-none transition-all disabled:opacity-50"
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || slugAvailable === false}
              className="w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] bg-amber-500 hover:bg-amber-400 text-zinc-900 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Conta Grátis'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-center text-zinc-400 text-sm">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-amber-500 hover:text-amber-400 font-bold">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center text-zinc-600 text-xs mt-8">
          &copy; {new Date().getFullYear()} BarberFlow SaaS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
