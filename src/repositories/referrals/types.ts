import type { BillingPeriod, ReferralPartner, ReferralSale } from '@/types';

export type ReferralSaleCreateInput = {
  referralCode: string;
  referredTenantId: string;
  planId: string;
  billingPeriod: BillingPeriod;
  annualValueBRL: number;
  isFirstAnnualPayment: boolean;
  isNewCustomer: boolean;
  paidAt: Date;
  cancelledAt?: Date;
  chargebackAt?: Date;
  referrerCpfCnpj?: string;
  referredCpfCnpj?: string;
};

export type ReferralsRepository = {
  listPartners: (params: { tenantId: string }) => Promise<ReferralPartner[]>;
  setPartnerActive: (params: { tenantId: string; partnerId: string; isActive: boolean }) => Promise<void>;

  listSales: (params: { tenantId: string }) => Promise<ReferralSale[]>;
  createSale: (params: { tenantId: string; sale: ReferralSale }) => Promise<void>;

  resolveOwnerReferralCode: (params: { tenantId: string }) => Promise<string | null>;
  setOwnerReferralCode: (params: { tenantId: string; ownerReferralCode: string }) => Promise<void>;

  recordOwnerReferralLink: (params: { tenantId: string; ownerReferralLink: string }) => Promise<void>;
};
