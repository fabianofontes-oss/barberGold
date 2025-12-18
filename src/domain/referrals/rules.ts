import { isProdMode } from '@/lib/appMode';
import {
  ReferralProgramConfig,
  ReferralSaleComputed,
  ReferralSaleInput,
  ReferralPartnerType,
  ReferralCommissionStatus,
} from './types';

export const DEFAULT_REFERRAL_PROGRAM_CONFIG: ReferralProgramConfig = {
  programCommissionPercent: 20,
  staffEnabled: false,
  staffSplitPercent: { staff: 70, owner: 30 },
  partnerGeneralPercent: 15,
  partnerProPercent: 18,
  payoutDelayDays: 60,
  proBonus: {
    targetAnnualSales: 100,
    windowDays: 365,
    bonusAmountBRL: 5000,
  },
  appMode: 'demo',
};

export function addDaysSafe(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function normalizeCpfCnpj(value: string): string {
  return value.replace(/\D/g, '');
}

export function isSelfReferral(referrerCpfCnpj?: string, referredCpfCnpj?: string): boolean {
  if (!referrerCpfCnpj || !referredCpfCnpj) return false;
  const a = normalizeCpfCnpj(referrerCpfCnpj);
  const b = normalizeCpfCnpj(referredCpfCnpj);
  if (!a || !b) return false;
  return a === b;
}

export function getReferralCommissionStatus(params: {
  now: Date;
  paidAt: Date;
  availableAt: Date;
  chargebackAt?: Date;
  cancelledAt?: Date;
}): ReferralCommissionStatus {
  const { now, availableAt, chargebackAt, cancelledAt } = params;
  if (chargebackAt || cancelledAt) return 'CANCELLED';
  if (now >= availableAt) return 'AVAILABLE';
  return 'PENDING';
}

export function getCommissionPercentForPartnerType(config: ReferralProgramConfig, partnerType: ReferralPartnerType): number {
  if (partnerType === 'PARTNER_GENERAL') return config.partnerGeneralPercent;
  if (partnerType === 'PARTNER_PRO') return config.partnerProPercent;
  return config.programCommissionPercent;
}

export function computeReferralSale(config: ReferralProgramConfig, input: ReferralSaleInput, now: Date = new Date()): ReferralSaleComputed {
  const warnings: string[] = [];

  // V1: comissão apenas para novos clientes
  if (!input.isNewCustomer) {
    return {
      commissionBaseBRL: 0,
      commissionPercent: 0,
      commissionAmountBRL: 0,
      ownerCommissionAmountBRL: 0,
      staffCommissionAmountBRL: 0,
      status: 'CANCELLED',
      availableAt: addDaysSafe(input.paidAt, config.payoutDelayDays),
      shouldBlock: false,
      warnings: ['V1: comissão apenas para novos clientes.'],
    };
  }

  // Apenas sobre planos anuais e apenas no primeiro pagamento anual
  if (!input.isAnnual || !input.isFirstAnnualPayment) {
    return {
      commissionBaseBRL: 0,
      commissionPercent: 0,
      commissionAmountBRL: 0,
      ownerCommissionAmountBRL: 0,
      staffCommissionAmountBRL: 0,
      status: 'CANCELLED',
      availableAt: addDaysSafe(input.paidAt, config.payoutDelayDays),
      shouldBlock: false,
      warnings: ['Comissão apenas sobre plano anual e apenas no primeiro pagamento anual.'],
    };
  }

  const self = isSelfReferral(input.referrerCpfCnpj, input.referredCpfCnpj);
  const shouldBlock = self && (config.appMode === 'prod' || isProdMode());
  if (self) warnings.push('Auto-indicação detectada (placeholder).');

  const percent = getCommissionPercentForPartnerType(config, input.partnerType);
  const base = input.annualValueBRL;
  const amount = (base * percent) / 100;

  let ownerAmount = 0;
  let staffAmount = 0;

  if (input.partnerType === 'OWNER') {
    ownerAmount = amount;
  } else if (input.partnerType === 'STAFF') {
    const staffEnabled = config.staffEnabled;
    if (!staffEnabled) {
      warnings.push('Links de equipe desativados pelo dono.');
      ownerAmount = 0;
      staffAmount = 0;
    } else {
      staffAmount = (amount * config.staffSplitPercent.staff) / 100;
      ownerAmount = (amount * config.staffSplitPercent.owner) / 100;
    }
  } else {
    // Parceiros ficam com 100% da comissão deles
    ownerAmount = 0;
    staffAmount = 0;
  }

  const availableAt = addDaysSafe(input.paidAt, config.payoutDelayDays);
  const status = getReferralCommissionStatus({
    now,
    paidAt: input.paidAt,
    availableAt,
    chargebackAt: input.chargebackAt,
    cancelledAt: input.cancelledAt,
  });

  return {
    commissionBaseBRL: base,
    commissionPercent: percent,
    commissionAmountBRL: amount,
    ownerCommissionAmountBRL: ownerAmount,
    staffCommissionAmountBRL: staffAmount,
    status,
    availableAt,
    shouldBlock,
    warnings,
  };
}
