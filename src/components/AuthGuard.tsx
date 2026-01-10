import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/auth/getCurrentProfile';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Componente server-side que protege rotas autenticadas
 * Redireciona para login se nao autenticado
 * Redireciona para onboarding se nao tem profile/tenant configurado
 */
export async function AuthGuard({ children }: AuthGuardProps) {
  const profileResult = await getCurrentProfile();

  // Nao esta logado (sem sessao)
  if (!profileResult) {
    redirect('/login');
  }

  // Esta logado mas nao tem profile/tenant configurado
  // Isso pode acontecer se o trigger falhou ou esta em processamento
  if (!profileResult.profile || !profileResult.tenantId) {
    redirect('/app/onboarding');
  }

  return <>{children}</>;
}
