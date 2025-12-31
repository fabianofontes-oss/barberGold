import { PLAN_FEATURES } from './features';
import { PlanFeatureKey, PlanId, PlanLimits, TenantLike } from './types';
import { getPlanDefinition } from './plans';

export function hasFeature(tenant: TenantLike | null | undefined, feature: PlanFeatureKey): boolean {
  const planId = (tenant?.planId ?? 'FREE') as PlanId;
  const features = PLAN_FEATURES[planId] ?? [];
  return features.includes(feature);
}

export function getPlanLimits(planId: PlanId): PlanLimits {
  return getPlanDefinition(planId)?.limits ?? { maxStaff: 0, maxLocations: 0 };
}

export function isSubscriptionActive(status: TenantLike['status']): boolean {
  return status === 'ACTIVE' || status === 'TRIAL' || status == null;
}
