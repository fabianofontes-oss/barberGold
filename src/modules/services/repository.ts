import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

type AppSupabaseClient = SupabaseClient<Database>;
type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type MappedService = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
  categoryId: string | null;
  imageUrl: string | null;
  isActive: boolean;
  allowOnlineBooking: boolean;
  sortOrder: number;
};

export function createServicesRepository(supabase: AppSupabaseClient) {
  return {
    async listServices({ tenantId, isActive, categoryId }: { 
      tenantId: string; 
      isActive?: boolean;
      categoryId?: string;
    }): Promise<MappedService[]> {
      let query = supabase
        .from('services')
        .select(`
          id,
          name,
          description,
          price,
          duration_minutes,
          category_id,
          image_url,
          is_active,
          allow_online_booking,
          sort_order
        `)
        .eq('tenant_id', tenantId)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (isActive !== undefined) {
        query = query.eq('is_active', isActive);
      }

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: Number(row.price),
        durationMinutes: Number(row.duration_minutes ?? 30),
        categoryId: row.category_id,
        imageUrl: row.image_url,
        isActive: row.is_active ?? true,
        allowOnlineBooking: row.allow_online_booking ?? true,
        sortOrder: Number(row.sort_order ?? 0),
      }));
    },

    async createService({ input }: { input: TablesInsert<'services'> }) {
      const { data, error } = await supabase
        .from('services')
        .insert(input)
        .select('id')
        .single();

      if (error) throw error;
      return { id: data.id };
    },

    async updateService({ serviceId, input }: { serviceId: string; input: TablesUpdate<'services'> }) {
      const { error } = await supabase
        .from('services')
        .update(input)
        .eq('id', serviceId);

      if (error) throw error;
    },

    async deleteService({ serviceId }: { serviceId: string }) {
      const { error } = await supabase
        .from('services')
        .update({ is_active: false })
        .eq('id', serviceId);

      if (error) throw error;
    },
  };
}
