import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/getCurrentProfile';
import { signOutAction } from '@/modules/auth/actions';
import { AlertTriangle, Copy, LogOut, Database } from 'lucide-react';

export default async function SetupPage() {
  const profileResult = await getCurrentProfile();

  // Se não está logado, redireciona para login
  if (!profileResult) {
    redirect('/login');
  }

  // Se já tem profile, redireciona para dashboard
  if (profileResult.profile) {
    redirect('/app/dashboard');
  }

  // Usuário logado mas sem profile - mostra instruções
  const userId = profileResult.user.id;
  const userEmail = profileResult.user.email;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-amber-500/10 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-amber-500/20">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Configuração Necessária</h1>
          <p className="text-zinc-400 text-sm">
            Seu usuário foi criado, mas você ainda não tem um perfil vinculado a uma barbearia.
          </p>
        </div>

        {/* Card com instruções */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="space-y-6">
            {/* User ID */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">
                Seu User ID (copie isso)
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-amber-400 font-mono text-sm break-all">
                  {userId}
                </code>
                <button
                  onClick={() => navigator.clipboard?.writeText(userId)}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  title="Copiar"
                >
                  <Copy className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">
                Email
              </label>
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-300 text-sm">
                {userEmail || 'N/A'}
              </div>
            </div>

            {/* Instruções */}
            <div className="border-t border-zinc-800 pt-6">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-zinc-500" />
                Próximos Passos
              </h3>
              <ol className="space-y-3 text-sm text-zinc-400">
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">1.</span>
                  <span>Acesse o Supabase Dashboard do projeto</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">2.</span>
                  <span>Vá em <strong className="text-zinc-300">SQL Editor</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">3.</span>
                  <span>
                    Execute o script <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-amber-400">supabase/seed/p0_pilot_seed.sql</code>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">4.</span>
                  <span>
                    Substitua <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">&lt;UUID_DO_AUTH_USER&gt;</code> pelo seu User ID acima
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">5.</span>
                  <span>Recarregue esta página</span>
                </li>
              </ol>
            </div>

            {/* Ações */}
            <div className="flex gap-3 pt-4">
              <a
                href="/app/dashboard"
                className="flex-1 py-3 rounded-xl font-bold text-center bg-amber-500 hover:bg-amber-400 text-zinc-900 transition-colors"
              >
                Tentar Novamente
              </a>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-600 text-xs mt-8">
          Precisa de ajuda? Consulte <code className="text-zinc-500">docs/supabase/README.md</code>
        </p>
      </div>
    </div>
  );
}
