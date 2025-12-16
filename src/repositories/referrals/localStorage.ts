import type { ReferralPartner, ReferralSale } from '@/types';
import type { ReferralsRepository } from './types';

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function key(tenantId: string, name: string) {
  return `bf:referrals:${tenantId}:${name}`;
}

export function createReferralsLocalStorageRepository(): ReferralsRepository {
  return {
    async listPartners({ tenantId }) {
      if (typeof window === 'undefined') return [];
      return safeParseJSON<ReferralPartner[]>(window.localStorage.getItem(key(tenantId, 'partners'))) ?? [];
    },

    async setPartnerActive({ tenantId, partnerId, isActive }) {
      if (typeof window === 'undefined') return;
      const prev = safeParseJSON<ReferralPartner[]>(window.localStorage.getItem(key(tenantId, 'partners'))) ?? [];
      const next = prev.map((p) => (p.id === partnerId ? { ...p, isActive } : p));
      window.localStorage.setItem(key(tenantId, 'partners'), JSON.stringify(next));
    },

    async listSales({ tenantId }) {
      if (typeof window === 'undefined') return [];
      const raw = safeParseJSON<any[]>(window.localStorage.getItem(key(tenantId, 'sales'))) ?? [];
      return raw.map((s) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        paidAt: new Date(s.paidAt),
        availableAt: s.availableAt ? new Date(s.availableAt) : undefined,
        cancelledAt: s.cancelledAt ? new Date(s.cancelledAt) : undefined,
        chargebackAt: s.chargebackAt ? new Date(s.chargebackAt) : undefined,
      })) as ReferralSale[];
    },

    async createSale({ tenantId, sale }) {
      if (typeof window === 'undefined') return;
      const prev = safeParseJSON<any[]>(window.localStorage.getItem(key(tenantId, 'sales'))) ?? [];
      const serializable = {
        ...sale,
        createdAt: sale.createdAt?.toISOString?.() ?? new Date().toISOString(),
        paidAt: sale.paidAt?.toISOString?.() ?? new Date().toISOString(),
        availableAt: sale.availableAt?.toISOString?.(),
        cancelledAt: sale.cancelledAt?.toISOString?.(),
        chargebackAt: sale.chargebackAt?.toISOString?.(),
      };
      window.localStorage.setItem(key(tenantId, 'sales'), JSON.stringify([serializable, ...prev]));
    },

    async resolveOwnerReferralCode({ tenantId }) {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem(key(tenantId, 'ownerReferralCode'));
    },

    async setOwnerReferralCode({ tenantId, ownerReferralCode }) {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key(tenantId, 'ownerReferralCode'), ownerReferralCode);
    },

    async recordOwnerReferralLink({ tenantId, ownerReferralLink }) {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key(tenantId, 'ownerReferralLink'), ownerReferralLink);
    },
  };
}
