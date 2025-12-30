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

  console.log('[Setup Layout] User:', user?.id, user?.email);

  // Não está autenticado - redireciona para login
  if (error || !user) {
    console.log('[Setup Layout] Não autenticado, redirecionando para /login');
    redirect('/login');
  }

  // Verifica se já tem profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  console.log('[Setup Layout] Profile:', profile?.id, 'Name:', profile?.name, 'Role:', profile?.role, 'Error:', profileError?.code);

  // Se já tem profile completo, redireciona para dashboard
  if (profile && profile.name && profile.role) {
    console.log('[Setup Layout] Profile completo encontrado, redirecionando para /app/dashboard');
    redirect('/app/dashboard');
  }
  
  console.log('[Setup Layout] Permitindo acesso ao setup (sem profile completo)');

  // Usuário autenticado sem profile - permite acesso ao setup
  return (
    <div className="min-h-screen bg-zinc-950">
      {children}
    </div>
  );
}
