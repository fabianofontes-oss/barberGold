
import { useMemo } from 'react';
import { SaasPlanId, SaasPlan, SaasV2FeatureKey } from '@/types';
import { SAAS_PLANS_BR } from '@/constants';
import { useSaasV2 } from '@/context/SaasV2Context';

// Re-export type for convenience
export type SaasFeatureKey = SaasV2FeatureKey;

const getPlanById = (planId: SaasPlanId | undefined): SaasPlan | undefined => {
  if (!planId) return undefined;
  return SAAS_PLANS_BR.find(p => p.id === planId);
};

export const useFeatureGate = () => {
  const { getCurrentTenant } = useSaasV2();
  
  // Get the current tenant from context (source of truth)
  const currentTenant = getCurrentTenant();

  // Resolve the full plan object based on the tenant's planId
  const currentPlan = useMemo(() => {
    return getPlanById(currentTenant?.planId);
  }, [currentTenant?.planId]);

  const canUseFeature = (feature: SaasFeatureKey): boolean => {
    // Se não há tenant/plano configurado, libera todas as features (modo standalone/dev)
    // Isso permite que o sistema funcione sem multi-tenancy configurado
    if (!currentPlan) return true;
    
    return Boolean(currentPlan.featureFlags?.[feature]);
  };

  return {
    currentPlan,
    canUseFeature,
  };
};
