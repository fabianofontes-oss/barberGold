import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/getCurrentProfile';
import { headers } from 'next/headers';

interface AuthGuardProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

/**
 * Componente server-side que protege rotas autenticadas
 * 
 * @param requireProfile - Se true, redireciona para /setup se não tiver profile
 */
export async function AuthGuard({ children, requireProfile = true }: AuthGuardProps) {
  const profileResult = await getCurrentProfile();
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';

  // Não está logado
  if (!profileResult) {
    redirect('/login');
  }

  // Logado mas sem profile
  // IMPORTANTE: Não redirecionar para /setup se já estiver em /setup (evita loop)
  const isSetupPage = pathname === '/setup' || pathname.startsWith('/setup/');
  
  if (requireProfile && !profileResult.profile && !isSetupPage) {
    redirect('/setup');
  }

  return <>{children}</>;
}
