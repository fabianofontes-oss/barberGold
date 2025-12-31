import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/getCurrentProfile';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Componente server-side que protege rotas autenticadas
 * A configuração inicial (setup) agora é uma modal no dashboard
 */
export async function AuthGuard({ children }: AuthGuardProps) {
  const profileResult = await getCurrentProfile();

  // Não está logado
  if (!profileResult) {
    redirect('/login');
  }

  return <>{children}</>;
}
