'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Scissors, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    // Verifica se hÃ¡ um token vÃ¡lido na URL ou sessÃ£o
    const validateToken = async () => {
      const supabase = createClient();
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setError('Link invÃ¡lido ou expirado. Solicite um novo link de recuperaÃ§Ã£o.');
          setTokenValid(false);
        } else if (session) {
          setTokenValid(true);
        } else {
          setError('Link invÃ¡lido ou expirado. Solicite um novo link de recuperaÃ§Ã£o.');
          setTokenValid(false);
        }
      } catch (err) {
        setError('Erro ao validar link. Tente novamente.');
        setTokenValid(false);
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ValidaÃ§Ãµes
    if (password.length < 6) {
      setError('A senha deve ter no mÃ­nimo 6 caracteres');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas nÃ£o coincidem');
      setLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      
      // Redireciona para login apÃ³s 2 segundos
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError('Erro ao redefinir senha. Tente novamente.');
      setLoading(false);
    }
  };

  // Tela de validaÃ§Ã£o do token
  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#231c0f]">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#f79f08] mx-auto mb-4" />
          <p className="text-zinc-400">Validando link de recuperaÃ§Ã£o...</p>
        </div>
      </div>
    );
  }

  // Tela de sucesso
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#231c0f]">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Senha Redefinida!</h1>
          <p className="text-zinc-400 mb-6">
            Sua senha foi alterada com sucesso. Redirecionando para o login...
          </p>
          <Loader2 className="animate-spin h-6 w-6 text-[#f79f08] mx-auto" />
        </div>
      </div>
    );
  }

  // Tela de erro de token
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#231c0f]">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Link InvÃ¡lido</h1>
          <p className="text-zinc-400 mb-6">{error}</p>
          <Link
            href="/forgot-password"
            className="inline-block w-full py-3 bg-[#f79f08] hover:bg-[#d88b06] text-[#231c10] font-bold rounded-lg transition-all"
          >
            Solicitar Novo Link
          </Link>
        </div>
      </div>
    );
  }

  // FormulÃ¡rio de redefiniÃ§Ã£o de senha
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#231c0f]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-amber-500 p-3 rounded-xl">
              <Scissors className="w-8 h-8 text-zinc-950" />
            </div>
            <h1 className="text-3xl font-bold text-white">BarberGOLD</h1>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Redefinir Senha</h2>
          <p className="text-zinc-400">Digite sua nova senha</p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* Nova Senha */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Nova Senha *
              </label>
              <div className="flex w-full items-stretch rounded-lg focus-within:ring-2 focus-within:ring-[#f79f08] focus-within:border-[#f79f08] border border-zinc-700 bg-zinc-800 h-14 overflow-hidden transition-colors">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="MÃ­nimo 6 caracteres"
                  disabled={loading}
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden border-none bg-transparent text-white focus:outline-none focus:ring-0 placeholder:text-zinc-500 px-4 text-base font-normal leading-normal h-full disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-400 hover:text-[#f79f08] flex items-center justify-center pr-4 pl-2 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Confirmar Nova Senha *
              </label>
              <div className="flex w-full items-stretch rounded-lg focus-within:ring-2 focus-within:ring-[#f79f08] focus-within:border-[#f79f08] border border-zinc-700 bg-zinc-800 h-14 overflow-hidden transition-colors">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite a senha novamente"
                  disabled={loading}
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden border-none bg-transparent text-white focus:outline-none focus:ring-0 placeholder:text-zinc-500 px-4 text-base font-normal leading-normal h-full disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-zinc-400 hover:text-[#f79f08] flex items-center justify-center pr-4 pl-2 transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#f79f08] hover:bg-[#d88b06] text-[#231c10] font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#f79f08]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Redefinindo...
                </>
              ) : (
                'Redefinir Senha'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-[#f79f08] hover:underline text-sm font-medium">
              Voltar para o Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#231c0f]">
        <Loader2 className="animate-spin h-12 w-12 text-[#f79f08]" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
