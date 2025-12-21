import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

type AppSupabaseClient = SupabaseClient<Database>;
type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type MappedProduct = {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: number;
  costPrice: number | null;
  stock: number;
  minStock: number;
  categoryId: string | null;
  imageUrl: string | null;
  isActive: boolean;
};

export function createProductsRepository(supabase: AppSupabaseClient) {
  return {
    async listProducts({ tenantId, isActive, categoryId }: { 
      tenantId: string; 
      isActive?: boolean;
      categoryId?: string;
    }): Promise<MappedProduct[]> {
      let query = supabase
        .from('products')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name', { ascending: true });

      if (isActive !== undefined) query = query.eq('is_active', isActive);
      if (categoryId) query = query.eq('category_id', categoryId);

      const { data, error } = await query;
      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        sku: row.sku,
        price: Number(row.price),
        costPrice: row.cost_price ? Number(row.cost_price) : null,
        stock: Number(row.stock ?? 0),
        minStock: Number(row.min_stock ?? 0),
        categoryId: row.category_id,
        imageUrl: row.image_url,
        isActive: row.is_active ?? true,
      }));
    },

    async createProduct({ input }: { input: TablesInsert<'products'> }) {
      const { data, error } = await supabase
        .from('products')
        .insert(input)
        .select('id')
        .single();

      if (error) throw error;
      return { id: data.id };
    },

    async updateProduct({ productId, input }: { productId: string; input: TablesUpdate<'products'> }) {
      const { error } = await supabase
        .from('products')
        .update(input)
        .eq('id', productId);

      if (error) throw error;
    },

    async deleteProduct({ productId }: { productId: string }) {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', productId);

      if (error) throw error;
    },
  };
}
