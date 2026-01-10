import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Layout especifico para onboarding
 * Verifica se usuario esta logado e se ja completou o onboarding (tem servicos)
 */
export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Se nao esta logado, vai para login
  if (!user) {
    redirect('/login');
  }

  // Buscar profile do usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, tenant_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle();

  // Se nao tem profile, deixa acessar onboarding
  if (!profile?.tenant_id) {
    return <>{children}</>;
  }

  // Verificar se ja tem servicos cadastrados (onboarding completo)
  const { count } = await supabase
    .from('services')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', profile.tenant_id);

  // Se ja tem servicos, vai para dashboard
  if (count && count > 0) {
    redirect('/app/dashboard');
  }

  // Nao tem servicos ainda - mostrar onboarding
  return <>{children}</>;
}
