'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, PropsWithChildren } from 'react';
import { SaasV2Tenant, SaasPlan, SaasPlanId, SaasV2FeatureKey } from '@/types';
import { SAAS_V2_MOCK_TENANTS, SAAS_PLANS_BR } from '@/constants';
import { getTenantPlanRepository } from '@/repositories';
import type { TenantRecord } from '@/repositories/tenantPlan/types';

interface SaasV2ContextType {
  tenants: SaasV2Tenant[];
  currentTenantId: string | null;

  plans: SaasPlan[];

  // Seleção
  setCurrentTenantId: (tenantId: string | null) => void;
  getCurrentTenant: () => SaasV2Tenant | undefined;
  getTenantById: (tenantId: string) => SaasV2Tenant | undefined;

  // Mutação básica
  updateTenant: (tenantId: string, partial: Partial<SaasV2Tenant>) => void;

  getPlanById: (planId: SaasPlanId) => SaasPlan | undefined;
  updatePlan: (planId: SaasPlanId, partial: Partial<SaasPlan>) => void;
  
  // Helper de Feature Gating Dinâmico
  planHasFeature: (planId: SaasPlanId, feature: SaasV2FeatureKey) => boolean;
}

const SaasV2Context = createContext<SaasV2ContextType | undefined>(undefined);

export const SaasV2Provider: React.FC<PropsWithChildren> = ({ children }) => {
  const tenantRepo = useMemo(() => getTenantPlanRepository(), []);

  const [tenants, setTenants] = useState<SaasV2Tenant[]>(SAAS_V2_MOCK_TENANTS);
  const [currentTenantId, setCurrentTenantIdState] = useState<string | null>(null);
  // Source of truth: SAAS_PLANS_BR
  const [plans, setPlans] = useState<SaasPlan[]>(SAAS_PLANS_BR);

  const mapRecordToTenant = (r: TenantRecord): SaasV2Tenant => {
    const createdAt = r.createdAt ? new Date(r.createdAt) : new Date();
    return {
      id: r.id,
      shopName: r.shopName,
      ownerName: r.ownerName,
      email: (r as any).email ?? '',
      phone: (r as any).phone ?? '',
      status: r.status,
      planId: r.planId,
      sizeTier: (r as any).sizeTier ?? 'SOLO',
      billingInterval: r.billingInterval,
      mrr: (r as any).mrr ?? 0,
      createdAt,
      country: (r as any).country ?? 'BR',
      defaultLanguage: (r as any).defaultLanguage ?? 'pt-BR',
      defaultCurrency: (r as any).defaultCurrency ?? 'BRL',
      billingDay: (r as any).billingDay ?? 1,
      lastPaymentDate: (r as any).lastPaymentDate ? new Date((r as any).lastPaymentDate) : undefined,
      nextDueDate: (r as any).nextDueDate ? new Date((r as any).nextDueDate) : undefined,
      overdueDays: (r as any).overdueDays,
      notesInternal: (r as any).notesInternal,
    };
  };

  const mapTenantToRecord = (t: SaasV2Tenant): TenantRecord => {
    return {
      id: t.id,
      shopName: t.shopName,
      ownerName: t.ownerName,
      planId: t.planId,
      billingInterval: t.billingInterval,
      status: t.status,
      createdAt: t.createdAt?.toISOString?.() ?? new Date().toISOString(),
      ...(t.email ? { email: t.email } : {}),
      ...(t.phone ? { phone: t.phone } : {}),
      ...(t.sizeTier ? { sizeTier: t.sizeTier } : {}),
      ...(typeof t.mrr === 'number' ? { mrr: t.mrr } : {}),
      ...(t.country ? { country: t.country } : {}),
      ...(t.defaultLanguage ? { defaultLanguage: t.defaultLanguage } : {}),
      ...(t.defaultCurrency ? { defaultCurrency: t.defaultCurrency } : {}),
      ...(typeof t.billingDay === 'number' ? { billingDay: t.billingDay } : {}),
      ...(t.lastPaymentDate ? { lastPaymentDate: t.lastPaymentDate.toISOString() } : {}),
      ...(t.nextDueDate ? { nextDueDate: t.nextDueDate.toISOString() } : {}),
      ...(typeof t.overdueDays === 'number' ? { overdueDays: t.overdueDays } : {}),
      ...(t.notesInternal ? { notesInternal: t.notesInternal } : {}),
    } as TenantRecord;
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const storedTenantId = await tenantRepo.getCurrentTenantId();
        if (!cancelled) setCurrentTenantIdState(storedTenantId);

        const storedTenants = await tenantRepo.getTenants();
        if (cancelled) return;

        if (storedTenants.length > 0) {
          setTenants(storedTenants.map(mapRecordToTenant));
          return;
        }

        // Seed DEMO/PILOT com os mocks existentes para manter UX sem crash
        setTenants(SAAS_V2_MOCK_TENANTS);
        await Promise.all(SAAS_V2_MOCK_TENANTS.map((t) => tenantRepo.upsertTenant(mapTenantToRecord(t))));
      } catch {
        // Se Supabase não estiver configurado no PILOT ainda, mantemos fallback local
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tenantRepo]);

  const getCurrentTenant = () => {
    if (!currentTenantId) return undefined;
    return tenants.find((t) => t.id === currentTenantId);
  };

  const getTenantById = (tenantId: string) => {
    return tenants.find((t) => t.id === tenantId);
  };

  const updateTenant = (tenantId: string, partial: Partial<SaasV2Tenant>) => {
    setTenants((prev) => {
      const next = prev.map((t) => {
        if (t.id !== tenantId) return t;

        const updatedTenant = { ...t, ...partial };

        // Auto-update MRR if plan changes and MRR wasn't manually overridden in this update
        if (partial.planId && typeof partial.mrr === 'undefined') {
          const newPlan = plans.find((p) => p.id === partial.planId);
          if (newPlan) {
            return { ...updatedTenant, mrr: newPlan.monthlyPriceBRL };
          }
        }

        return updatedTenant;
      });

      const updated = next.find((t) => t.id === tenantId);
      if (updated) {
        void tenantRepo.upsertTenant(mapTenantToRecord(updated));
      }

      return next;
    });
  };

  const setCurrentTenantId = (tenantId: string | null) => {
    setCurrentTenantIdState(tenantId);
    void tenantRepo.setCurrentTenantId(tenantId);
  };

  const getPlanById = (planId: SaasPlanId) => {
    return plans.find((p) => p.id === planId);
  };

  const updatePlan = (planId: SaasPlanId, partial: Partial<SaasPlan>) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? { ...p, ...partial }
          : p
      ),
    );
  };

  const planHasFeature = (planId: SaasPlanId, feature: SaasV2FeatureKey): boolean => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return false;
    // Map SaasPlanFeatureFlags to SaasV2FeatureKey if needed, but currently SaasPlan uses object flags
    // while SaasV2FeatureKey assumes string array check. 
    // Adapting for SaasPlan structure:
    return plan.featureFlags ? (plan.featureFlags[feature as keyof typeof plan.featureFlags] === true) : false;
  };

  return (
    <SaasV2Context.Provider
      value={{
        tenants,
        currentTenantId,
        setCurrentTenantId,
        getCurrentTenant,
        updateTenant,
        getTenantById,
        plans,
        getPlanById,
        updatePlan,
        planHasFeature,
      }}
    >
      {children}
    </SaasV2Context.Provider>
  );
};

export const useSaasV2 = (): SaasV2ContextType => {
  const ctx = useContext(SaasV2Context);
  if (!ctx) {
    throw new Error('useSaasV2 must be used within a SaasV2Provider');
  }
  return ctx;
};
