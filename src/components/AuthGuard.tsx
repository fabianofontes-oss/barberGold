import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/getCurrentProfile';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Componente server-side que protege rotas autenticadas
 * A configuraÃ§Ã£o inicial (setup) agora Ã© uma modal no dashboard
 */
export async function AuthGuard({ children }: AuthGuardProps) {
  const profileResult = await getCurrentProfile();

  // NÃ£o estÃ¡ logado
  if (!profileResult) {
    redirect('/login');
  }

  return <>{children}</>;
}
