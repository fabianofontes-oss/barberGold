import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

type AppSupabaseClient = SupabaseClient<Database>;
type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type MappedTenant = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  logoUrl: string | null;
  planId: string;
  status: string;
  settings: any;
};

export function createTenantRepository(supabase: AppSupabaseClient) {
  return {
    async getTenant({ tenantId }: { tenantId: string }): Promise<MappedTenant | null> {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        logoUrl: data.logo_url,
        planId: data.plan_id,
        status: data.status,
        settings: data.settings,
      };
    },

    async updateTenant({ tenantId, input }: { tenantId: string; input: TablesUpdate<'tenants'> }) {
      const { error } = await supabase
        .from('tenants')
        .update(input)
        .eq('id', tenantId);

      if (error) throw error;
    },
  };
}
