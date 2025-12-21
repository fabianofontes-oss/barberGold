import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

type AppSupabaseClient = SupabaseClient<Database>;
type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type MappedStaff = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
  isActive: boolean;
  commissionModel: string;
  commissionRate: number;
  workSchedule: any;
};

export function createStaffRepository(supabase: AppSupabaseClient) {
  return {
    async listStaff({ tenantId, isActive }: { 
      tenantId: string; 
      isActive?: boolean;
    }): Promise<MappedStaff[]> {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          phone,
          avatar_url,
          bio,
          role,
          is_active,
          commission_model,
          commission_rate,
          work_schedule
        `)
        .eq('tenant_id', tenantId)
        .order('name', { ascending: true });

      if (isActive !== undefined) {
        query = query.eq('is_active', isActive);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        avatarUrl: row.avatar_url,
        bio: row.bio,
        role: row.role ?? 'STAFF',
        isActive: row.is_active ?? true,
        commissionModel: row.commission_model ?? 'PERCENTAGE',
        commissionRate: Number(row.commission_rate ?? 50),
        workSchedule: row.work_schedule ?? [],
      }));
    },

    async updateStaff({ staffId, input }: { staffId: string; input: TablesUpdate<'profiles'> }) {
      const { error } = await supabase
        .from('profiles')
        .update(input)
        .eq('id', staffId);

      if (error) throw error;
    },
  };
}
