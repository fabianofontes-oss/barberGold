import { createClient } from '@/lib/supabase/client';
import { ClientDB, ClientInsert, ClientUpdate, ClientWithStats } from './types';

export class ClientsRepository {
  private supabase = createClient();

  async list(storeId: string, filters?: { search?: string; tags?: string[] }) {
    let query = this.supabase
      .from('clients')
      .select(`
        *,
        appointments!inner(
          id,
          status,
          date,
          total_amount
        )
      `)
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Calcular estatísticas
    const clientsWithStats: ClientWithStats[] = (data || []).map(client => {
      const appointments = client.appointments || [];
      const completedAppointments = appointments.filter((apt: any) => apt.status === 'COMPLETED');
      
      return {
        ...client,
        totalSpent: completedAppointments.reduce((sum: number, apt: any) => sum + (apt.total_amount || 0), 0),
        visitCount: completedAppointments.length,
        lastVisit: completedAppointments[0]?.date || null,
        loyaltyPoints: Math.floor(completedAppointments.reduce((sum: number, apt: any) => sum + (apt.total_amount || 0), 0) / 10),
      };
    });

    return clientsWithStats;
  }

  async getById(id: string, storeId: string): Promise<ClientDB | null> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .eq('store_id', storeId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(client: any, storeId: string): Promise<ClientDB> {
    const { data, error } = await this.supabase
      .from('clients')
      .insert({
        name: client.name,
        phone: client.phone,
        email: client.email || null,
        birth_date: client.birthDate || null,
        document: client.document || null,
        tags: client.tags || [],
        notes: client.notes || null,
        preferred_staff_id: client.preferredStaffId || null,
        store_id: storeId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: ClientUpdate, storeId: string): Promise<ClientDB> {
    const { data, error } = await this.supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .eq('store_id', storeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string, storeId: string): Promise<void> {
    const { error } = await this.supabase
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('store_id', storeId);

    if (error) throw error;
  }

  async checkPhoneExists(phone: string, storeId: string, excludeId?: string): Promise<boolean> {
    let query = this.supabase
      .from('clients')
      .select('id')
      .eq('phone', phone)
      .eq('store_id', storeId);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data } = await query;
    return (data?.length || 0) > 0;
  }

  async getStats(storeId: string) {
    const { data: clients, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('store_id', storeId);

    if (error) throw error;

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthCount = clients?.filter((c: ClientDB) => new Date(c.created_at) >= thisMonth).length || 0;
    const lastMonthCount = clients?.filter((c: ClientDB) => new Date(c.created_at) >= lastMonth && new Date(c.created_at) < thisMonth).length || 0;

    return {
      total: clients?.length || 0,
      thisMonth: thisMonthCount,
      lastMonth: lastMonthCount,
      growth: lastMonthCount > 0 ? ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100 : 0
    };
  }
}
