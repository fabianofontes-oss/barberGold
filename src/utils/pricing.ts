import { SAAS_V2_BR_PRICING } from '@/constants';
import { SaasV2Tenant, SaasV2PlanId, SaasV2SizeTier, SaasV2BillingInterval } from '@/types';

export function getSuggestedMonthlyPriceForTenantBR(tenant: SaasV2Tenant): number | null {
  if (tenant.country !== 'BR') return null;
  
  const byTier = SAAS_V2_BR_PRICING[tenant.sizeTier];
  if (!byTier) return null;
  
  const price = byTier[tenant.planId];
  return typeof price === 'number' ? price : null;
}

export function getPlanPriceBR(
  planId: SaasV2PlanId,
  sizeTier: SaasV2SizeTier,
  billing: SaasV2BillingInterval
): { amount: number; monthlyEquivalent: number } | null {
  const byTier = SAAS_V2_BR_PRICING[sizeTier];
  if (!byTier) return null;
  const monthly = byTier[planId];
  if (typeof monthly !== 'number') return null;

  if (billing === 'MONTHLY') {
    return { amount: monthly, monthlyEquivalent: monthly };
  }

  const annual = monthly * 10;
  const equivalent = annual / 12;
  return { amount: annual, monthlyEquivalent: equivalent };
}
