import { createClient } from '@/lib/supabase/client';
import type { TenantPlanRepository, TenantRecord } from './types';

const TABLE_TENANTS = 'tenants_registry';
const TABLE_SESSION = 'app_session';

export function createTenantPlanSupabaseRepository(): TenantPlanRepository {
  return {
    async getTenants() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from(TABLE_TENANTS)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: String(row.id),
        shopName: String(row.name ?? ''),
        ownerName: String(row.owner_name ?? ''),
        planId: String(row.plan_id ?? 'FREE') as TenantRecord['planId'],
        billingInterval: String(row.billing_interval ?? 'MONTHLY') as TenantRecord['billingInterval'],
        status: String(row.status ?? 'TRIAL') as TenantRecord['status'],
        createdAt: String(row.created_at ?? new Date().toISOString()),
      }));
    },

    async upsertTenant(tenant) {
      const supabase = createClient();
      const payload = {
        id: tenant.id,
        name: tenant.shopName,
        owner_name: tenant.ownerName,
        plan_id: tenant.planId,
        billing_interval: tenant.billingInterval,
        status: tenant.status,
      };

      const { error } = await supabase.from(TABLE_TENANTS).upsert(payload);
      if (error) throw error;
    },

    async updateTenant(tenantId, partial) {
      const supabase = createClient();

      const payload: Record<string, unknown> = {};
      if (typeof partial.shopName !== 'undefined') payload.name = partial.shopName;
      if (typeof partial.ownerName !== 'undefined') payload.owner_name = partial.ownerName;
      if (typeof partial.planId !== 'undefined') payload.plan_id = partial.planId;
      if (typeof partial.billingInterval !== 'undefined') payload.billing_interval = partial.billingInterval;
      if (typeof partial.status !== 'undefined') payload.status = partial.status;

      const { error } = await supabase.from(TABLE_TENANTS).update(payload).eq('id', tenantId);
      if (error) throw error;
    },

    async getCurrentTenantId() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from(TABLE_SESSION)
        .select('current_tenant_id')
        .eq('id', 'singleton')
        .maybeSingle();

      if (error) throw error;
      return (data?.current_tenant_id ?? null) as string | null;
    },

    async setCurrentTenantId(tenantId) {
      const supabase = createClient();
      const { error } = await supabase
        .from(TABLE_SESSION)
        .upsert({ id: 'singleton', current_tenant_id: tenantId });

      if (error) throw error;
    },
  };
}
