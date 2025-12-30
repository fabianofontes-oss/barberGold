import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Layout específico para /setup
 * 
 * REGRAS:
 * - Usuário DEVE estar autenticado (tem sessão)
 * - Usuário NÃO precisa ter profile completo
 * - Se já tiver profile, redireciona para dashboard
 */
export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // Verifica se está autenticado
  const { data: { user }, error } = await supabase.auth.getUser();

  // Não está autenticado - redireciona para login
  if (error || !user) {
    redirect('/login');
  }

  // Verifica se já tem profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  // Se já tem profile completo, redireciona para dashboard
  if (profile && profile.name && profile.role) {
    redirect('/app/dashboard');
  }

  // Usuário autenticado sem profile - permite acesso ao setup
  return (
    <div className="min-h-screen bg-zinc-950">
      {children}
    </div>
  );
}
