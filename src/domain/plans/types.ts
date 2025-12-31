export type PlanId = 'FREE' | 'SOLO' | 'SOLO_PRO' | 'EQUIPE' | 'STUDIO' | 'ENTERPRISE';

export type BillingInterval = 'MONTHLY' | 'ANNUAL';

export type PlanFeatureKey =
  | 'AGENDA'
  | 'PDV'
  | 'CLIENTS'
  | 'FINANCE_BASIC'
  | 'ONLINE_BOOKING'
  | 'LOYALTY'
  | 'ADVANCED_REPORTS'
  | 'COMMISSIONS'
  | 'BLIND_CASH_CLOSURE'
  | 'WEBSITE_PREMIUM'
  | 'MULTI_SHOP';

export type PlanStatus = 'ACTIVE' | 'TRIAL' | 'OVERDUE' | 'SUSPENDED';

export type PlanLimits = {
  maxStaff: number;
  maxLocations: number;
};

export type PlanDefinition = {
  id: PlanId;
  name: string;
  monthlyPriceBRL: number;
  annualPriceBRL: number;
  order: number;
  limits: PlanLimits;
};

export type TenantLike = {
  planId?: PlanId | null;
  status?: PlanStatus | null;
};
