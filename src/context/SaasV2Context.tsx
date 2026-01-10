'use client';

import React, { createContext, useContext, useState, PropsWithChildren } from 'react';
import { SaasV2Tenant, SaasPlan, SaasPlanId, SaasV2FeatureKey } from '@/types';
import { SAAS_V2_MOCK_TENANTS, SAAS_PLANS_BR } from '@/constants';

interface SaasV2ContextType {
  tenants: SaasV2Tenant[];
  currentTenantId: string | null;
  plans: SaasPlan[];
  setCurrentTenantId: (tenantId: string | null) => void;
  getCurrentTenant: () => SaasV2Tenant | undefined;
  getTenantById: (tenantId: string) => SaasV2Tenant | undefined;
  updateTenant: (tenantId: string, partial: Partial<SaasV2Tenant>) => void;
  getPlanById: (planId: SaasPlanId) => SaasPlan | undefined;
  updatePlan: (planId: SaasPlanId, partial: Partial<SaasPlan>) => void;
  planHasFeature: (planId: SaasPlanId, feature: SaasV2FeatureKey) => boolean;
}

const SaasV2Context = createContext<SaasV2ContextType | undefined>(undefined);

export const SaasV2Provider: React.FC<PropsWithChildren> = ({ children }) => {
  const [tenants, setTenants] = useState<SaasV2Tenant[]>(SAAS_V2_MOCK_TENANTS);
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null);
  const [plans, setPlans] = useState<SaasPlan[]>(SAAS_PLANS_BR);

  const getCurrentTenant = () => {
    if (!currentTenantId) return undefined;
    return tenants.find((t) => t.id === currentTenantId);
  };

  const getTenantById = (tenantId: string) => {
    return tenants.find((t) => t.id === tenantId);
  };

  const updateTenant = (tenantId: string, partial: Partial<SaasV2Tenant>) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === tenantId ? { ...t, ...partial } : t))
    );
  };

  const getPlanById = (planId: SaasPlanId) => {
    return plans.find((p) => p.id === planId);
  };

  const updatePlan = (planId: SaasPlanId, partial: Partial<SaasPlan>) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, ...partial } : p))
    );
  };

  const planHasFeature = (planId: SaasPlanId, feature: SaasV2FeatureKey): boolean => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return false;
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
