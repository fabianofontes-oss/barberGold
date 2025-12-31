import { createClient } from '@/lib/supabase/client';
import type { ReferralPartner, ReferralSale, ReferralPartnerType, SaasPlanId } from '@/types';
import type { BillingInterval } from '@/domain/plans/types';
import type { ReferralsRepository } from './types';

const TABLE_PARTNERS = 'referral_partners';
const TABLE_SALES = 'referral_sales';
const TABLE_CONFIG = 'tenant_referral_config';

// Tipos para linhas do banco de dados
type PartnerRow = {
  id: string;
  tenant_id: string;
  staff_id?: string | null;
  display_name: string;
  partner_type: string;
  base_commission_percent: number;
  eligible_for_bonus: boolean;
  is_active: boolean;
  owner_share_percent?: number | null;
  staff_share_percent?: number | null;
};

type SaleRow = {
  id: string;
  referral_code: string;
  partner_id: string;
  referred_tenant_id: string;
  plan_id: string;
  billing_period: string;
  sale_value_brl: number;
  commission_base_brl: number;
  commission_percent: number;
  commission_amount_brl: number;
  eligible_for_bonus: boolean;
  status: string;
  created_at: string;
  paid_at?: string | null;
  available_at?: string | null;
  cancelled_at?: string | null;
  chargeback_at?: string | null;
  staff_share_percent?: number | null;
  owner_share_percent?: number | null;
  staff_commission_amount_brl?: number | null;
  owner_commission_amount_brl?: number | null;
};

export function createReferralsSupabaseRepository(): ReferralsRepository {
  return {
    async listPartners({ tenantId }) {
      const supabase = createClient();
      const { data, error } = await supabase.from(TABLE_PARTNERS).select('*').eq('tenant_id', tenantId);
      if (error) throw error;
      return (data ?? []).map((row: PartnerRow): ReferralPartner => ({
        id: String(row.id),
        tenantId: String(row.tenant_id),
        staffId: row.staff_id ? String(row.staff_id) : undefined,
        displayName: String(row.display_name ?? ''),
        partnerType: String(row.partner_type) as ReferralPartnerType,
        baseCommissionPercent: Number(row.base_commission_percent ?? 0),
        eligibleForBonus: Boolean(row.eligible_for_bonus ?? false),
        isActive: Boolean(row.is_active ?? true),
        ownerSharePercent: typeof row.owner_share_percent === 'number' ? row.owner_share_percent : undefined,
        staffSharePercent: typeof row.staff_share_percent === 'number' ? row.staff_share_percent : undefined,
      }));
    },

    async setPartnerActive({ tenantId: _tenantId, partnerId, isActive }) {
      const supabase = createClient();
      const { error } = await supabase.from(TABLE_PARTNERS).update({ is_active: isActive }).eq('id', partnerId);
      if (error) throw error;
    },

    async listSales({ tenantId }) {
      const supabase = createClient();
      const { data, error } = await supabase.from(TABLE_SALES).select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false });
      if (error) throw error;

      return (data ?? []).map((row: SaleRow): ReferralSale => ({
        id: String(row.id),
        referralCode: String(row.referral_code),
        partnerId: String(row.partner_id),
        referredTenantId: String(row.referred_tenant_id),
        planId: String(row.plan_id) as SaasPlanId,
        billingPeriod: String(row.billing_period) as BillingInterval,
        saleValueBRL: Number(row.sale_value_brl ?? 0),
        commissionBaseBRL: Number(row.commission_base_brl ?? 0),
        commissionPercent: Number(row.commission_percent ?? 0),
        commissionAmountBRL: Number(row.commission_amount_brl ?? 0),
        eligibleForBonus: Boolean(row.eligible_for_bonus ?? false),
        status: String(row.status) as ReferralSale['status'],
        createdAt: new Date(row.created_at),
        paidAt: row.paid_at ? new Date(row.paid_at) : new Date(row.created_at),
        availableAt: row.available_at ? new Date(row.available_at) : undefined,
        cancelledAt: row.cancelled_at ? new Date(row.cancelled_at) : undefined,
        chargebackAt: row.chargeback_at ? new Date(row.chargeback_at) : undefined,
        staffSharePercent: typeof row.staff_share_percent === 'number' ? row.staff_share_percent : undefined,
        ownerSharePercent: typeof row.owner_share_percent === 'number' ? row.owner_share_percent : undefined,
        staffCommissionAmountBRL: typeof row.staff_commission_amount_brl === 'number' ? row.staff_commission_amount_brl : undefined,
        ownerCommissionAmountBRL: typeof row.owner_commission_amount_brl === 'number' ? row.owner_commission_amount_brl : undefined,
      }));
    },

    async createSale({ tenantId, sale }) {
      const supabase = createClient();
      const payload = {
        id: sale.id,
        tenant_id: tenantId,
        referral_code: sale.referralCode,
        partner_id: sale.partnerId,
        referred_tenant_id: sale.referredTenantId,
        plan_id: sale.planId,
        billing_period: sale.billingPeriod,
        sale_value_brl: sale.saleValueBRL,
        commission_base_brl: sale.commissionBaseBRL,
        commission_percent: sale.commissionPercent,
        commission_amount_brl: sale.commissionAmountBRL,
        eligible_for_bonus: sale.eligibleForBonus,
        status: sale.status,
        paid_at: sale.paidAt?.toISOString?.(),
        available_at: sale.availableAt?.toISOString?.(),
        cancelled_at: sale.cancelledAt?.toISOString?.(),
        chargeback_at: sale.chargebackAt?.toISOString?.(),
        staff_share_percent: sale.staffSharePercent,
        owner_share_percent: sale.ownerSharePercent,
        staff_commission_amount_brl: sale.staffCommissionAmountBRL,
        owner_commission_amount_brl: sale.ownerCommissionAmountBRL,
      };

      const { error } = await supabase.from(TABLE_SALES).upsert(payload);
      if (error) throw error;
    },

    async resolveOwnerReferralCode({ tenantId }) {
      const supabase = createClient();
      const { data, error } = await supabase.from(TABLE_CONFIG).select('owner_referral_code').eq('tenant_id', tenantId).maybeSingle();
      if (error) throw error;
      return (data?.owner_referral_code ?? null) as string | null;
    },

    async setOwnerReferralCode({ tenantId, ownerReferralCode }) {
      const supabase = createClient();
      const { error } = await supabase.from(TABLE_CONFIG).upsert({ tenant_id: tenantId, owner_referral_code: ownerReferralCode });
      if (error) throw error;
    },

    async recordOwnerReferralLink({ tenantId, ownerReferralLink }) {
      const supabase = createClient();
      const { error } = await supabase.from(TABLE_CONFIG).upsert({ tenant_id: tenantId, owner_referral_link: ownerReferralLink });
      if (error) throw error;
    },
  };
}
