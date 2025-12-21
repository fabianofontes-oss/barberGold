import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

type AppSupabaseClient = SupabaseClient<Database>;
type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];

export type MappedCategory = {
  id: string;
  name: string;
  type: 'SERVICE' | 'PRODUCT';
  color: string | null;
  icon: string | null;
  sortOrder: number;
};

export function createCategoriesRepository(supabase: AppSupabaseClient) {
  return {
    async listCategories({ tenantId, type, isActive = true }: { 
      tenantId: string; 
      type?: 'SERVICE' | 'PRODUCT';
      isActive?: boolean;
    }): Promise<MappedCategory[]> {
      let query = supabase
        .from('categories')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', isActive)
        .order('sort_order', { ascending: true });

      if (type) query = query.eq('type', type);

      const { data, error } = await query;
      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type as 'SERVICE' | 'PRODUCT',
        color: row.color,
        icon: row.icon,
        sortOrder: Number(row.sort_order ?? 0),
      }));
    },

    async createCategory({ input }: { input: TablesInsert<'categories'> }) {
      const { data, error } = await supabase
        .from('categories')
        .insert(input)
        .select('id')
        .single();

      if (error) throw error;
      return { id: data.id };
    },

    async deleteCategory({ categoryId }: { categoryId: string }) {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: false })
        .eq('id', categoryId);

      if (error) throw error;
    },
  };
}
