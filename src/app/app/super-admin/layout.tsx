import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/getCurrentProfile';

/**
 * Layout de proteÃ§Ã£o para rotas Super Admin
 * 
 * SEGURANÃ‡A:
 * - ValidaÃ§Ã£o server-side obrigatÃ³ria
 * - Apenas usuÃ¡rios com role = 'SUPER_ADMIN' podem acessar
 * - Redireciona automaticamente usuÃ¡rios nÃ£o autorizados
 */
export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profileResult = await getCurrentProfile();

  // NÃ£o estÃ¡ logado - redireciona para login
  if (!profileResult || !profileResult.profile) {
    redirect('/login');
  }

  // Logado mas nÃ£o Ã© SUPER_ADMIN - redireciona para dashboard
  if (profileResult.profile.role !== 'SUPER_ADMIN') {
    redirect('/app/dashboard');
  }

  // Ã‰ SUPER_ADMIN - permite acesso
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Banner de God Mode */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 text-center text-sm font-bold">
        ðŸ›¡ï¸ GOD MODE ATIVO - Super Admin Dashboard
      </div>
      {children}
    </div>
  );
}
