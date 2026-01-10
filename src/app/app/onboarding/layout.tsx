import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Layout especifico para onboarding - NAO usa AuthGuard padrao
 * Verifica apenas se usuario esta logado (nao exige profile)
 */
export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Se nao esta logado, vai para login
  if (!user) {
    redirect('/login');
  }

  // Se ja tem profile configurado, vai para dashboard
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, tenant_id')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle();

  if (profile?.tenant_id) {
    // Ja tem tenant configurado, vai para dashboard
    redirect('/app/dashboard');
  }

  return <>{children}</>;
}
