export type TenantPlanStatus = 'ACTIVE' | 'TRIAL' | 'OVERDUE' | 'SUSPENDED';

export type TenantPlanBillingInterval = 'MONTHLY' | 'ANNUAL';

export type TenantPlanId = 'FREE' | 'SOLO' | 'SOLO_PRO' | 'EQUIPE' | 'STUDIO' | 'ENTERPRISE';

export type TenantRecord = {
  id: string;
  shopName: string;
  ownerName: string;
  planId: TenantPlanId;
  billingInterval: TenantPlanBillingInterval;
  status: TenantPlanStatus;
  createdAt: string;
};

export type TenantPlanRepository = {
  getTenants: () => Promise<TenantRecord[]>;
  upsertTenant: (tenant: TenantRecord) => Promise<void>;
  updateTenant: (tenantId: string, partial: Partial<TenantRecord>) => Promise<void>;

  getCurrentTenantId: () => Promise<string | null>;
  setCurrentTenantId: (tenantId: string | null) => Promise<void>;
};
