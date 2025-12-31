import { AppMode } from '@/lib/appMode';

export type ReferralPartnerType = 'OWNER' | 'STAFF' | 'PARTNER_GENERAL' | 'PARTNER_PRO';

export type ReferralCommissionStatus = 'PENDING' | 'AVAILABLE' | 'CANCELLED' | 'ADJUSTED';

export type ReferralProgramConfig = {
  programCommissionPercent: number; // ex: 20%
  staffEnabled: boolean;
  staffSplitPercent: { staff: 70; owner: 30 };
  partnerGeneralPercent: 15;
  partnerProPercent: 18;
  payoutDelayDays: 60;
  proBonus: {
    targetAnnualSales: 100;
    windowDays: 365;
    bonusAmountBRL: 5000;
  };
  appMode: AppMode;
};

export type ReferralLinkKind = 'OWNER' | 'STAFF' | 'PARTNER';

export type ReferralLinkInput = {
  kind: ReferralLinkKind;
  code: string;
};

export type ReferralSaleInput = {
  referralCode: string;
  partnerType: ReferralPartnerType;
  annualValueBRL: number;

  isAnnual: boolean;
  isFirstAnnualPayment: boolean;
  isNewCustomer: boolean;

  paidAt: Date;
  chargebackAt?: Date;
  cancelledAt?: Date;

  referrerCpfCnpj?: string;
  referredCpfCnpj?: string;
};

export type ReferralSaleComputed = {
  commissionBaseBRL: number;
  commissionPercent: number;
  commissionAmountBRL: number;

  ownerCommissionAmountBRL: number;
  staffCommissionAmountBRL: number;

  status: ReferralCommissionStatus;
  availableAt: Date;

  shouldBlock: boolean;
  warnings: string[];
};
