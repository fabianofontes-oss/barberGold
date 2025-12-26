import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/getCurrentProfile';

/**
 * Layout de proteção para rotas Super Admin
 * 
 * SEGURANÇA:
 * - Validação server-side obrigatória
 * - Apenas usuários com role = 'SUPER_ADMIN' podem acessar
 * - Redireciona automaticamente usuários não autorizados
 */
export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profileResult = await getCurrentProfile();

  // Não está logado - redireciona para login
  if (!profileResult || !profileResult.profile) {
    redirect('/login');
  }

  // Logado mas não é SUPER_ADMIN - redireciona para dashboard
  if (profileResult.profile.role !== 'SUPER_ADMIN') {
    redirect('/app/dashboard');
  }

  // É SUPER_ADMIN - permite acesso
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Banner de God Mode */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 text-center text-sm font-bold">
        🛡️ GOD MODE ATIVO - Super Admin Dashboard
      </div>
      {children}
    </div>
  );
}
