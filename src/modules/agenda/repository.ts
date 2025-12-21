import type {
  Database,
  AppointmentRow,
  ClientRow,
  ServiceRow,
  ProfileRow,
  TenantRow,
  TablesInsert,
  TablesUpdate,
  ProfileRole,
  CommissionModel,
} from '@/lib/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

// =============================================
// TIPOS DO REPOSITÓRIO
// =============================================

export type AppSupabaseClient = SupabaseClient<Database>;

// Tipos de linha do DB (re-exportados para uso externo)
export type AgendaAppointmentRow = AppointmentRow;
export type AgendaClientRow = ClientRow;
export type AgendaServiceRow = ServiceRow;
export type AgendaProfileRow = ProfileRow;
export type AgendaTenantRow = TenantRow;

// Tipos mapeados para compatibilidade com o frontend existente
export type MappedService = {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  category: string | null;
  isActive: boolean;
  description: string | null;
  imageUrl: string | null;
  allowOnlineBooking: boolean;
};

export type MappedStaff = {
  id: string;
  tenantId: string;
  userId: string;
  role: ProfileRole;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  commissionModel: CommissionModel;
  commissionRate: number;
  isActive: boolean;
  workSchedule: unknown;
  dailyGoal: number;
  monthlyGoal: number;
};

export type MappedClient = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  birthDate: string | null;
  totalSpent: number;
  loyaltyPoints: number;
  lastVisit: string | null;
  notes: string | null;
  tags: string[];
  isActive: boolean;
};

export type MappedAppointment = {
  id: string;
  tenantId: string;
  clientId: string | null;
  clientName: string;
  staffId: string;
  serviceId: string;
  serviceName: string;
  scheduledAt: string;
  durationMinutes: number;
  price: number;
  status: AppointmentRow['status'];
  source: AppointmentRow['source'];
  notes: string | null;
  internalNotes: string | null;
  isRecurring: boolean;
};

// =============================================
// FACTORY DO REPOSITÓRIO
// =============================================

export function createAgendaRepository(supabase: AppSupabaseClient) {
  return {
    // -----------------------------------------
    // TENANT
    // -----------------------------------------
    async getTenantById({ tenantId }: { tenantId: string }) {
      const { data, error } = await supabase
        .from('tenants')
        .select('id, name, slug, plan_id, status, settings')
        .eq('id', tenantId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    // -----------------------------------------
    // CLIENTS
    // -----------------------------------------
    async listClients({ tenantId }: { tenantId: string }): Promise<MappedClient[]> {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id,
          name,
          phone,
          email,
          birth_date,
          total_spent,
          loyalty_points,
          last_visit,
          notes,
          tags,
          is_active
        `)
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      // Mapeia snake_case → camelCase para compatibilidade frontend
      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        birthDate: row.birth_date,
        totalSpent: row.total_spent,
        loyaltyPoints: row.loyalty_points,
        lastVisit: row.last_visit,
        notes: row.notes,
        tags: row.tags ?? [],
        isActive: row.is_active,
      }));
    },

    async getClientById({ tenantId, clientId }: { tenantId: string; clientId: string }) {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, phone, email')
        .eq('tenant_id', tenantId)
        .eq('id', clientId)
        .maybeSingle();

      if (error) throw error;
      return data;
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

    // -----------------------------------------
    // SERVICES
    // -----------------------------------------
    async listServices({ tenantId }: { tenantId: string }): Promise<MappedService[]> {
      const { data, error } = await supabase
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
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      // Mapeia para formato esperado pelo frontend
      // NOTA: category_id → category (string) - precisaria de JOIN para nome real
      // Por enquanto retorna category_id como category para não quebrar
      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        price: Number(row.price),
        durationMinutes: row.duration_minutes,
        category: row.category_id, // TODO: fazer JOIN com categories para pegar nome
        isActive: row.is_active,
        description: row.description,
        imageUrl: row.image_url,
        allowOnlineBooking: row.allow_online_booking,
      }));
    },

    async getServiceById({ tenantId, serviceId }: { tenantId: string; serviceId: string }) {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, price, duration_minutes, category_id')
        .eq('tenant_id', tenantId)
        .eq('id', serviceId)
        .maybeSingle();

      if (error) throw error;

      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        durationMinutes: data.duration_minutes,
        categoryId: data.category_id,
      };
    },

    // -----------------------------------------
    // STAFF (Profiles)
    // -----------------------------------------
    async listStaff({ tenantId }: { tenantId: string }): Promise<MappedStaff[]> {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          tenant_id,
          user_id,
          role,
          name,
          email,
          phone,
          avatar_url,
          commission_model,
          commission_rate,
          is_active,
          work_schedule,
          daily_goal,
          monthly_goal
        `)
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        tenantId: row.tenant_id,
        userId: row.user_id,
        role: row.role,
        name: row.name,
        email: row.email,
        phone: row.phone,
        avatarUrl: row.avatar_url,
        commissionModel: row.commission_model,
        commissionRate: Number(row.commission_rate),
        isActive: row.is_active,
        workSchedule: row.work_schedule,
        dailyGoal: Number(row.daily_goal),
        monthlyGoal: Number(row.monthly_goal),
      }));
    },

    async getStaffById({ tenantId, staffId }: { tenantId: string; staffId: string }) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role, commission_rate')
        .eq('tenant_id', tenantId)
        .eq('id', staffId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    // -----------------------------------------
    // APPOINTMENTS
    // -----------------------------------------
    async listAppointments({
      tenantId,
      start,
      end,
    }: {
      tenantId: string;
      start: string;
      end: string;
    }): Promise<AgendaAppointmentRow[]> {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          created_at,
          updated_at,
          tenant_id,
          client_id,
          staff_id,
          service_id,
          scheduled_at,
          duration_minutes,
          price,
          status,
          source,
          notes,
          internal_notes,
          confirmed_at,
          reminder_sent_at,
          cancelled_at,
          cancellation_reason,
          is_recurring,
          recurrence_rule,
          parent_appointment_id
        `)
        .eq('tenant_id', tenantId)
        .gte('scheduled_at', start)
        .lt('scheduled_at', end)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;

      return (data ?? []) as AgendaAppointmentRow[];
    },

    /**
     * Lista appointments com dados de client e service já resolvidos
     * Útil para exibição na UI sem precisar de lookups adicionais
     */
    async listAppointmentsWithDetails({
      tenantId,
      start,
      end,
      clientsMap,
      servicesMap,
    }: {
      tenantId: string;
      start: string;
      end: string;
      clientsMap: Map<string, { name: string }>;
      servicesMap: Map<string, { name: string; durationMinutes: number }>;
    }): Promise<MappedAppointment[]> {
      const rows = await this.listAppointments({ tenantId, start, end });

      return rows.map((row) => {
        const isBlocked = row.status === 'BLOCKED';
        const client = row.client_id ? clientsMap.get(row.client_id) : null;
        const service = servicesMap.get(row.service_id);

        return {
          id: row.id,
          tenantId: row.tenant_id,
          clientId: row.client_id,
          clientName: isBlocked ? (row.notes ?? 'Bloqueio') : (client?.name ?? 'Cliente não encontrado'),
          staffId: row.staff_id,
          serviceId: row.service_id,
          serviceName: isBlocked ? 'Bloqueio' : (service?.name ?? 'Serviço não encontrado'),
          scheduledAt: row.scheduled_at,
          durationMinutes: row.duration_minutes,
          price: Number(row.price),
          status: row.status,
          source: row.source,
          notes: row.notes,
          internalNotes: row.internal_notes,
          isRecurring: row.is_recurring,
        };
      });
    },

    async createAppointment({ input }: { input: TablesInsert<'appointments'> }) {
      const { data, error } = await supabase
        .from('appointments')
        .insert(input)
        .select('id')
        .single();

      if (error) throw error;
      return { id: data.id };
    },

    async createAppointments({ rows }: { rows: TablesInsert<'appointments'>[] }) {
      const { data, error } = await supabase
        .from('appointments')
        .insert(rows)
        .select('id');

      if (error) throw error;
      return (data ?? []).map((r) => r.id);
    },

    async updateAppointment({
      appointmentId,
      tenantId,
      patch,
    }: {
      appointmentId: string;
      tenantId: string;
      patch: TablesUpdate<'appointments'>;
    }) {
      const { error } = await supabase
        .from('appointments')
        .update(patch)
        .eq('tenant_id', tenantId)
        .eq('id', appointmentId);

      if (error) throw error;
    },

    async getAppointmentById({ tenantId, appointmentId }: { tenantId: string; appointmentId: string }) {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('id', appointmentId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    // -----------------------------------------
    // BLOCKED TIME (Serviço especial para bloqueios)
    // -----------------------------------------
    async findOrCreateBlockedService({ tenantId }: { tenantId: string }) {
      // Primeiro tenta encontrar o serviço de bloqueio existente
      const { data: existing, error: findError } = await supabase
        .from('services')
        .select('id, name, price, duration_minutes')
        .eq('tenant_id', tenantId)
        .eq('name', 'Blocked Time')
        .maybeSingle();

      if (findError) throw findError;

      if (existing?.id) {
        return { id: existing.id };
      }

      // Cria o serviço de bloqueio se não existir
      const { data: created, error: createError } = await supabase
        .from('services')
        .insert({
          tenant_id: tenantId,
          name: 'Blocked Time',
          price: 0,
          duration_minutes: 30,
          is_active: false, // Não aparece na lista de serviços normais
          allow_online_booking: false,
        })
        .select('id')
        .single();

      if (createError) throw createError;
      return { id: created.id };
    },

    // -----------------------------------------
    // CATEGORIES (para lookup de nomes)
    // -----------------------------------------
    async listCategories({ tenantId, type }: { tenantId: string; type?: 'SERVICE' | 'PRODUCT' }) {
      let query = supabase
        .from('categories')
        .select('id, name, type, color, icon, sort_order')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data ?? [];
    },
  };
}
