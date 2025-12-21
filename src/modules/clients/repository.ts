import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

type AppSupabaseClient = SupabaseClient<Database>;
type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type MappedClient = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  birthDate: string | null;
  totalSpent: number;
  totalVisits: number;
  lastVisit: string | null;
  loyaltyPoints: number;
  loyaltyTier: string;
  tags: string[];
  notes: string | null;
  preferredStaffId: string | null;
  isActive: boolean;
  avatarUrl: string | null;
};

export type ClientDependent = {
  id: string;
  clientId: string;
  name: string;
  relationship: string | null;
  birthDate: string | null;
  preferredStaffId: string | null;
  notes: string | null;
};

export function createClientsRepository(supabase: AppSupabaseClient) {
  return {
    async listClients({ tenantId, search, isActive = true }: { 
      tenantId: string; 
      search?: string;
      isActive?: boolean;
    }): Promise<MappedClient[]> {
      let query = supabase
        .from('clients')
        .select(`
          id,
          name,
          phone,
          email,
          birth_date,
          total_spent,
          total_visits,
          last_visit,
          loyalty_points,
          loyalty_tier,
          tags,
          notes,
          preferred_staff_id,
          is_active,
          avatar_url
        `)
        .eq('tenant_id', tenantId)
        .eq('is_active', isActive)
        .order('name', { ascending: true });

      if (search) {
        query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        birthDate: row.birth_date,
        totalSpent: Number(row.total_spent ?? 0),
        totalVisits: Number(row.total_visits ?? 0),
        lastVisit: row.last_visit,
        loyaltyPoints: Number(row.loyalty_points ?? 0),
        loyaltyTier: row.loyalty_tier ?? 'BRONZE',
        tags: row.tags ?? [],
        notes: row.notes,
        preferredStaffId: row.preferred_staff_id,
        isActive: row.is_active ?? true,
        avatarUrl: row.avatar_url,
      }));
    },

    async getClientById({ tenantId, clientId }: { tenantId: string; clientId: string }): Promise<MappedClient | null> {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('id', clientId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        birthDate: data.birth_date,
        totalSpent: Number(data.total_spent ?? 0),
        totalVisits: Number(data.total_visits ?? 0),
        lastVisit: data.last_visit,
        loyaltyPoints: Number(data.loyalty_points ?? 0),
        loyaltyTier: data.loyalty_tier ?? 'BRONZE',
        tags: data.tags ?? [],
        notes: data.notes,
        preferredStaffId: data.preferred_staff_id,
        isActive: data.is_active ?? true,
        avatarUrl: data.avatar_url,
      };
    },

    async createClient({ input }: { input: TablesInsert<'clients'> }) {
      const { data, error } = await supabase
        .from('clients')
        .insert(input)
        .select('id')
        .single();

      if (error) throw error;
      return { id: data.id };
    },

    async updateClient({ clientId, input }: { clientId: string; input: TablesUpdate<'clients'> }) {
      const { error } = await supabase
        .from('clients')
        .update(input)
        .eq('id', clientId);

      if (error) throw error;
    },

    async deleteClient({ clientId }: { clientId: string }) {
      const { error } = await supabase
        .from('clients')
        .update({ is_active: false })
        .eq('id', clientId);

      if (error) throw error;
    },

    async listDependents({ clientId }: { clientId: string }): Promise<ClientDependent[]> {
      const { data, error } = await (supabase as any)
        .from('client_dependents')
        .select('*')
        .eq('client_id', clientId)
        .order('name', { ascending: true });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        clientId: row.client_id,
        name: row.name,
        relationship: row.relationship,
        birthDate: row.birth_date,
        preferredStaffId: row.preferred_staff_id,
        notes: row.notes,
      }));
    },

    async createDependent({ input }: { input: any }) {
      const { data, error } = await (supabase as any)
        .from('client_dependents')
        .insert(input)
        .select('id')
        .single();

      if (error) throw error;
      return { id: data.id };
    },

    async deleteDependent({ dependentId }: { dependentId: string }) {
      const { error } = await (supabase as any)
        .from('client_dependents')
        .delete()
        .eq('id', dependentId);

      if (error) throw error;
    },
  };
}
