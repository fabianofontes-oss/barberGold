'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Scissors, Lock, Mail, ArrowRight, ChevronLeft, Loader2 } from 'lucide-react';
import { signInWithPasswordAction } from '@/modules/auth/actions';

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha email e senha');
      return;
    }

    startTransition(async () => {
      const result = await signInWithPasswordAction(email, password);
      
      if (!result.success) {
        setError(result.error || 'Erro ao fazer login');
        return;
      }

      // Redireciona para o app após login
      router.push('/app/dashboard');
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-zinc-950 z-0"></div>
      
      <button 
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 z-20 text-zinc-500 hover:text-white flex items-center gap-1 text-sm font-bold transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Voltar para Home
      </button>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-amber-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-2xl shadow-amber-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Scissors className="w-10 h-10 text-zinc-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">BarberFlow</h1>
          <p className="text-zinc-400">Entre para gerenciar seu negócio.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg text-center font-bold">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isPending}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-amber-500 outline-none transition-all disabled:opacity-50"
                  placeholder="seu@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isPending}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-amber-500 outline-none transition-all disabled:opacity-50"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isPending}
              className="w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] bg-amber-500 hover:bg-amber-400 text-zinc-900 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-[10px] text-zinc-500 text-center uppercase font-bold">
              Não tem conta?
            </p>
            <p className="text-xs text-zinc-400 text-center mt-2">
              Entre em contato com o administrador para criar sua conta.
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
