 
 import { useMemo } from 'react';
 import { useSaasV2 } from '@/context/SaasV2Context';
 import { hasFeature } from '@/domain/plans/gating';
 import { getPlanDefinition } from '@/domain/plans/plans';
 import type { PlanFeatureKey, PlanId } from '@/domain/plans/types';
 
 // Re-export type for convenience
 export type SaasFeatureKey = PlanFeatureKey;
 
 export const useFeatureGate = () => {
   const { getCurrentTenant } = useSaasV2();
 
   const currentTenant = getCurrentTenant();
   const planId = (currentTenant?.planId ?? 'FREE') as PlanId;
 
   const currentPlan = useMemo(() => {
     return getPlanDefinition(planId);
   }, [planId]);
 
   const canUseFeature = (feature: SaasFeatureKey): boolean => {
     // âš¡ OVERRIDE: Sistema 100% gratuito - Todas funcionalidades liberadas
     return true;
     
     // CÃ³digo original comentado (para reverter no futuro se necessÃ¡rio):
     // if (!currentTenant) return true;
     // return hasFeature({ planId }, feature);
   };
 
   return {
     currentPlan,
     canUseFeature,
   };
 };
