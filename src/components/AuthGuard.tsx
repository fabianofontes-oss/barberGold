import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/getCurrentProfile';

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

  // Não está logado
  if (!profileResult) {
    redirect('/login');
  }

  // Logado mas sem profile
  if (requireProfile && !profileResult.profile) {
    redirect('/app/setup');
  }

  return <>{children}</>;
}
