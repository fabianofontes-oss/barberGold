import { DEFAULT_REFERRAL_PROGRAM_CONFIG, computeReferralSale } from './rules';

export function runReferralsRulesSelfcheck(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  const must = (condition: boolean, message: string) => {
    if (!condition) errors.push(message);
  };

  const cfg = { ...DEFAULT_REFERRAL_PROGRAM_CONFIG, staffEnabled: true, appMode: 'demo' as const };

  const baseInput = {
    referralCode: 'CODE',
    annualValueBRL: 790,
    isAnnual: true,
    isFirstAnnualPayment: true,
    isNewCustomer: true,
    paidAt: new Date('2025-01-01T00:00:00Z'),
  };

  const owner = computeReferralSale(cfg, { ...baseInput, partnerType: 'OWNER' });
  must(owner.commissionPercent === 20, 'OWNER deve usar programCommissionPercent (20)');
  must(owner.ownerCommissionAmountBRL === owner.commissionAmountBRL, 'OWNER deve receber 100%');

  const staff = computeReferralSale(cfg, { ...baseInput, partnerType: 'STAFF' });
  must(staff.staffCommissionAmountBRL > 0, 'STAFF deve ter comissÃ£o quando habilitado');
  must(
    Math.round(staff.staffCommissionAmountBRL + staff.ownerCommissionAmountBRL) === Math.round(staff.commissionAmountBRL),
    'Split 70/30 deve somar 100% da comissÃ£o'
  );

  const partnerGeneral = computeReferralSale(cfg, { ...baseInput, partnerType: 'PARTNER_GENERAL' });
  must(partnerGeneral.commissionPercent === 15, 'Parceiro Geral deve ser 15%');

  const partnerPro = computeReferralSale(cfg, { ...baseInput, partnerType: 'PARTNER_PRO' });
  must(partnerPro.commissionPercent === 18, 'Parceiro PRO deve ser 18%');

  const monthly = computeReferralSale(cfg, { ...baseInput, partnerType: 'OWNER', isAnnual: false });
  must(monthly.commissionAmountBRL === 0, 'Mensal nÃ£o deve gerar comissÃ£o');

  return { ok: errors.length === 0, errors };
}
