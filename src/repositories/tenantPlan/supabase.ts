import { createClient } from '@/lib/supabase/client';
import type { TenantPlanRepository, TenantRecord } from './types';

// TODO: Tabelas fantasmas - não existem no schema atual
// Usar 'tenants' ao invés de 'tenants_registry'
// Criar tabela 'app_session' ou usar localStorage para session
const TABLE_TENANTS = 'tenants'; // FIXME: era 'tenants_registry'
const TABLE_SESSION = 'app_session'; // FIXME: tabela não existe

export function createTenantPlanSupabaseRepository(): TenantPlanRepository {
  // TODO: Implementação temporariamente desabilitada - schema incompatível
  // Tabela 'tenants' tem campos diferentes (slug, owner_id) vs esperado (owner_name, billing_interval)
  // Usando localStorage como fallback até refatoração completa
  return {
    async getTenants() {
      // FIXME: Retorna array vazio - usar localStorage no SaasV2Context
      return [];
    },

    async upsertTenant(tenant) {
      // FIXME: No-op - dados persistidos via localStorage no SaasV2Context
      void tenant;
    },

    async updateTenant(tenantId, partial) {
      // FIXME: No-op - dados persistidos via localStorage no SaasV2Context
      void tenantId;
      void partial;
    },

    async getCurrentTenantId() {
      // FIXME: Tabela app_session não existe - usando localStorage como fallback
      if (typeof window === 'undefined') return null;
      return localStorage.getItem('currentTenantId');
    },

    async setCurrentTenantId(tenantId) {
      // FIXME: Tabela app_session não existe - usando localStorage como fallback
      if (typeof window === 'undefined') return;
      if (tenantId) {
        localStorage.setItem('currentTenantId', tenantId);
      } else {
        localStorage.removeItem('currentTenantId');
      }
    },
  };
}
