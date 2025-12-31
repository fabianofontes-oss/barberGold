import type { TenantPlanRepository, TenantRecord } from './types';

const STORAGE_KEY_TENANTS = 'bf:tenantPlan:tenants';
const STORAGE_KEY_CURRENT_TENANT_ID = 'bf:tenantPlan:currentTenantId';

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readTenants(): TenantRecord[] {
  if (typeof window === 'undefined') return [];
  const parsed = safeParseJSON<TenantRecord[]>(window.localStorage.getItem(STORAGE_KEY_TENANTS));
  return parsed ?? [];
}

function writeTenants(next: TenantRecord[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY_TENANTS, JSON.stringify(next));
}

export function createTenantPlanLocalStorageRepository(): TenantPlanRepository {
  return {
    async getTenants() {
      return readTenants();
    },

    async upsertTenant(tenant) {
      const prev = readTenants();
      const exists = prev.some((t) => t.id === tenant.id);
      const next = exists ? prev.map((t) => (t.id === tenant.id ? tenant : t)) : [tenant, ...prev];
      writeTenants(next);
    },

    async updateTenant(tenantId, partial) {
      const prev = readTenants();
      const next = prev.map((t) => (t.id === tenantId ? { ...t, ...partial } : t));
      writeTenants(next);
    },

    async getCurrentTenantId() {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem(STORAGE_KEY_CURRENT_TENANT_ID);
    },

    async setCurrentTenantId(tenantId) {
      if (typeof window === 'undefined') return;
      if (!tenantId) {
        window.localStorage.removeItem(STORAGE_KEY_CURRENT_TENANT_ID);
        return;
      }
      window.localStorage.setItem(STORAGE_KEY_CURRENT_TENANT_ID, tenantId);
    },
  };
}
