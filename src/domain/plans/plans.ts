import { BillingInterval, PlanDefinition, PlanId } from './types';

export const PLANS_BR: PlanDefinition[] = [
  {
    id: 'FREE',
    name: 'Free',
    monthlyPriceBRL: 0,
    annualPriceBRL: 0,
    order: 1,
    limits: { maxStaff: 1, maxLocations: 1 },
  },
  {
    id: 'SOLO',
    name: 'Solo',
    monthlyPriceBRL: 49,
    annualPriceBRL: 490,
    order: 2,
    limits: { maxStaff: 1, maxLocations: 1 },
  },
  {
    id: 'SOLO_PRO',
    name: 'Solo Pro',
    monthlyPriceBRL: 59,
    annualPriceBRL: 590,
    order: 3,
    limits: { maxStaff: 1, maxLocations: 1 },
  },
  {
    id: 'EQUIPE',
    name: 'Equipe',
    monthlyPriceBRL: 79,
    annualPriceBRL: 790,
    order: 4,
    limits: { maxStaff: 3, maxLocations: 1 },
  },
  {
    id: 'STUDIO',
    name: 'Studio',
    monthlyPriceBRL: 119,
    annualPriceBRL: 1190,
    order: 5,
    limits: { maxStaff: 6, maxLocations: 2 },
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    monthlyPriceBRL: 0,
    annualPriceBRL: 0,
    order: 6,
    limits: { maxStaff: 999, maxLocations: 999 },
  },
];

export function getPlanDefinition(planId: PlanId | null | undefined): PlanDefinition | undefined {
  if (!planId) return undefined;
  return PLANS_BR.find((p) => p.id === planId);
}

export function getPlanPriceBRL(planId: PlanId, billingInterval: BillingInterval): number {
  const plan = getPlanDefinition(planId);
  if (!plan) return 0;
  return billingInterval === 'ANNUAL' ? plan.annualPriceBRL : plan.monthlyPriceBRL;
}

export function annualPriceFromMonthly(monthlyPriceBRL: number): number {
  return monthlyPriceBRL * 10;
}
