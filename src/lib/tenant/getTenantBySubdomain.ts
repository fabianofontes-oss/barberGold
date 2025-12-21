import { createClient } from '@/lib/supabase/server';

export async function getTenantBySubdomain(subdomain: string) {
  if (!subdomain || subdomain === 'www' || subdomain === 'admin') {
    return null;
  }

  const supabase = await createClient();
  
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', subdomain)
    .eq('status', 'ACTIVE')
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar tenant por subdomain:', error);
    return null;
  }

  return tenant;
}
