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
 * @param requireProfile - Se true, redireciona para /app/setup se não tiver profile
 */
export async function AuthGuard({ children, requireProfile = true }: AuthGuardProps) {
  const profileResult = await getCurrentProfile();
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || headersList.get('x-pathname') || '';

  // Não está logado
  if (!profileResult) {
    redirect('/login');
  }

  // Logado mas sem profile
  // IMPORTANTE: Não redirecionar para /app/setup se já estiver em /app/setup (evita loop)
  if (requireProfile && !profileResult.profile && !pathname.includes('/app/setup')) {
    redirect('/app/setup');
  }

  return <>{children}</>;
}
