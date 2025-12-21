import { createClient } from '@/lib/supabase/client';
import type { ReferralPartner, ReferralSale } from '@/types';
import type { ReferralsRepository } from './types';

// TODO: Adaptar para usar tabelas corretas do schema
// Schema tem: referral_config, referral_links, referral_conversions
// Código espera: referral_partners, referral_sales, tenant_referral_config
// Por enquanto, comentando implementação e usando fallback localStorage
const TABLE_PARTNERS = 'referral_links'; // FIXME: era 'referral_partners'
const TABLE_SALES = 'referral_conversions'; // FIXME: era 'referral_sales'
const TABLE_CONFIG = 'referral_config'; // FIXME: era 'tenant_referral_config'

export function createReferralsSupabaseRepository(): ReferralsRepository {
  // TODO: Schema de referrals incompatível - desabilitando temporariamente
  // Usar localStorage via ReferralContext até refatoração completa
  return {
    async listPartners({ tenantId }) {
      void tenantId;
      return [];
    },

    async setPartnerActive({ tenantId, partnerId, isActive }) {
      void tenantId;
      void partnerId;
      void isActive;
    },

    async listSales({ tenantId }) {
      void tenantId;
      return [];
    },

    async createSale({ tenantId, sale }) {
      void tenantId;
      void sale;
    },

    async resolveOwnerReferralCode({ tenantId }) {
      void tenantId;
      return null;
    },

    async setOwnerReferralCode({ tenantId, ownerReferralCode }) {
      void tenantId;
      void ownerReferralCode;
    },

    async recordOwnerReferralLink({ tenantId, ownerReferralLink }) {
      void tenantId;
      void ownerReferralLink;
    },
  };
}
