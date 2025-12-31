'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, PropsWithChildren } from 'react';
import { ReferralPartner, ReferralLink, ReferralSale, BillingPeriod } from '@/types';
import { MOCK_REFERRAL_PARTNERS, MOCK_REFERRAL_SALES } from '@/constants';
import { useBarber } from '@/context/BarberContext';
import { useSaasV2 } from '@/context/SaasV2Context';
import { getAppMode } from '@/lib/appMode';
import { getReferralsRepository } from '@/repositories';
import { buildStaffReferralCode, normalizeReferralCode } from '@/domain/referrals/link';
import { DEFAULT_REFERRAL_PROGRAM_CONFIG, computeReferralSale } from '@/domain/referrals/rules';

interface ReferralContextType {
  partners: ReferralPartner[];
  links: ReferralLink[];
  sales: ReferralSale[];
  
  // Actions
  generateReferralLink: (partnerId: string) => string;
  togglePartnerActive: (partnerId: string) => void;
  processReferralSale: (params: {
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
  }) => ReferralSale | null;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const ReferralProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { shopSettings, currentUser, staff, shopProfile } = useBarber();
  const { currentTenantId } = useSaasV2();

  const repo = useMemo(() => getReferralsRepository(), []);

  const tenantKey = currentTenantId || shopProfile.slug || 'standalone';

  const [partnersState, setPartnersState] = useState<ReferralPartner[]>(MOCK_REFERRAL_PARTNERS);
  const [sales, setSales] = useState<ReferralSale[]>(MOCK_REFERRAL_SALES);
  const [ownerCodeOverride, setOwnerCodeOverride] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const storedOwnerCode = await repo.resolveOwnerReferralCode({ tenantId: tenantKey });
        if (!cancelled) setOwnerCodeOverride(storedOwnerCode);

        const storedPartners = await repo.listPartners({ tenantId: tenantKey });
        if (!cancelled && storedPartners.length > 0) setPartnersState(storedPartners);

        const storedSales = await repo.listSales({ tenantId: tenantKey });
        if (!cancelled && storedSales.length > 0) setSales(storedSales);
      } catch {
        // Fallback silencioso: mantÃ©m mocks/memÃ³ria em caso de piloto sem schema/config
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [repo, tenantKey]);

  const referralConfig = shopSettings.referralConfig;
  const ownerCode = normalizeReferralCode(ownerCodeOverride || referralConfig?.ownerReferralCode || 'CODE');
  const staffEnabled = Boolean(referralConfig?.allowStaffToParticipate);

  const config = useMemo(() => {
    return {
      ...DEFAULT_REFERRAL_PROGRAM_CONFIG,
      staffEnabled,
      programCommissionPercent: referralConfig?.programCommissionPercent ?? DEFAULT_REFERRAL_PROGRAM_CONFIG.programCommissionPercent,
      appMode: getAppMode(),
    };
  }, [referralConfig?.allowStaffToParticipate, referralConfig?.programCommissionPercent, staffEnabled]);

  const derivedOwnerPartner: ReferralPartner | null = useMemo(() => {
    if (!currentUser || currentUser.role !== 'OWNER') return null;
    return {
      id: `refp_owner_${tenantKey}`,
      tenantId: tenantKey,
      displayName: `${currentUser.name} (Owner)`,
      partnerType: 'OWNER',
      baseCommissionPercent: config.programCommissionPercent,
      eligibleForBonus: false,
      isActive: true,
      ownerSharePercent: 100,
      staffSharePercent: 0,
    };
  }, [config.programCommissionPercent, currentUser, tenantKey]);

  const derivedStaffPartners: ReferralPartner[] = useMemo(() => {
    return (staff || [])
      .filter((s) => s.role !== 'SUPER_ADMIN' && s.role !== 'OWNER')
      .map((s) => ({
        id: `refp_staff_${tenantKey}_${s.id}`,
        tenantId: tenantKey,
        staffId: s.id,
        displayName: s.name,
        partnerType: 'STAFF',
        baseCommissionPercent: config.programCommissionPercent,
        eligibleForBonus: false,
        isActive: staffEnabled,
        ownerSharePercent: 30,
        staffSharePercent: 70,
      }));
  }, [config.programCommissionPercent, staff, staffEnabled, tenantKey]);

  const partners: ReferralPartner[] = useMemo(() => {
    const fixed = partnersState.filter((p) => p.partnerType === 'PARTNER_GENERAL' || p.partnerType === 'PARTNER_PRO');
    const owner = derivedOwnerPartner ? [derivedOwnerPartner] : [];
    return [...owner, ...derivedStaffPartners, ...fixed];
  }, [derivedOwnerPartner, derivedStaffPartners, partnersState]);

  const links: ReferralLink[] = useMemo(() => {
    const list: ReferralLink[] = [];

    if (derivedOwnerPartner) {
      list.push({
        id: `refl_owner_${derivedOwnerPartner.id}`,
        code: ownerCode,
        partnerId: derivedOwnerPartner.id,
        region: 'BR',
        createdAt: new Date(),
        isActive: true,
      });
    }

    derivedStaffPartners.forEach((p) => {
      const staffId = p.staffId || 'STAFF';
      list.push({
        id: `refl_staff_${p.id}`,
        code: buildStaffReferralCode(ownerCode, staffId),
        partnerId: p.id,
        region: 'BR',
        createdAt: new Date(),
        isActive: staffEnabled,
      });
    });

    // Parceiros externos (mock)
    partnersState
      .filter((p) => p.partnerType === 'PARTNER_GENERAL' || p.partnerType === 'PARTNER_PRO')
      .forEach((p) => {
        list.push({
          id: `refl_partner_${p.id}`,
          code: normalizeReferralCode(p.displayName.substring(0, 5)) + '01',
          partnerId: p.id,
          region: 'BR',
          createdAt: new Date(),
          isActive: p.isActive,
        });
      });

    return list;
  }, [derivedOwnerPartner, derivedStaffPartners, ownerCode, partnersState, staffEnabled]);

  const generateReferralLink = (partnerId: string) => {
    const partner = partners.find(p => p.id === partnerId);
    if (!partner) throw new Error('Partner not found');

    // OWNER: sempre o link principal
    if (partner.partnerType === 'OWNER') {
      return ownerCode;
    }

    // STAFF: link exclusivo baseado no owner
    if (partner.partnerType === 'STAFF') {
      return buildStaffReferralCode(ownerCode, partner.staffId || 'STAFF');
    }

    // Parceiros: gera cÃ³digo novo (mock)
    const prefix = normalizeReferralCode(partner.displayName.substring(0, 3) || 'PAR');
    const unique = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    const newCode = `${prefix}${unique}`;

    return newCode;
  };

  const togglePartnerActive = (partnerId: string) => {
    setPartnersState((prev) => {
      const next = prev.map((p) => (p.id === partnerId ? { ...p, isActive: !p.isActive } : p));
      const updated = next.find((p) => p.id === partnerId);
      if (updated) {
        void repo.setPartnerActive({ tenantId: tenantKey, partnerId, isActive: updated.isActive });
      }
      return next;
    });
  };

  const processReferralSale: ReferralContextType['processReferralSale'] = (params) => {
    const normalizedCode = normalizeReferralCode(params.referralCode);

    const link = links.find((l) => normalizeReferralCode(l.code) === normalizedCode && l.isActive);
    if (!link) return null;

    const partner = partners.find((p) => p.id === link.partnerId && p.isActive);
    if (!partner) return null;

    const computed = computeReferralSale(
      config,
      {
        referralCode: normalizedCode,
        partnerType: partner.partnerType,
        annualValueBRL: params.annualValueBRL,
        isAnnual: params.billingPeriod === 'ANNUAL',
        isFirstAnnualPayment: params.isFirstAnnualPayment,
        isNewCustomer: params.isNewCustomer,
        paidAt: params.paidAt,
        referrerCpfCnpj: params.referrerCpfCnpj,
        referredCpfCnpj: params.referredCpfCnpj,
      },
      new Date()
    );

    if (computed.shouldBlock) {
      return null;
    }

    const sale: ReferralSale = {
      id: `refs_${Math.random().toString(36).substr(2, 9)}`,
      referralCode: normalizedCode,
      partnerId: partner.id,
      referredTenantId: params.referredTenantId,
      planId: params.planId as any,
      billingPeriod: params.billingPeriod,
      saleValueBRL: params.annualValueBRL,
      commissionBaseBRL: computed.commissionBaseBRL,
      commissionPercent: computed.commissionPercent,
      commissionAmountBRL: computed.commissionAmountBRL,
      eligibleForBonus: partner.partnerType === 'PARTNER_PRO',
      status: computed.status,
      createdAt: new Date(),
      paidAt: params.paidAt,
      availableAt: computed.availableAt,
      cancelledAt: params.cancelledAt,
      chargebackAt: params.chargebackAt,
      staffSharePercent: partner.partnerType === 'STAFF' ? 70 : undefined,
      ownerSharePercent: partner.partnerType === 'STAFF' ? 30 : (partner.partnerType === 'OWNER' ? 100 : undefined),
      staffCommissionAmountBRL: partner.partnerType === 'STAFF' ? computed.staffCommissionAmountBRL : undefined,
      ownerCommissionAmountBRL: partner.partnerType === 'OWNER' || partner.partnerType === 'STAFF' ? computed.ownerCommissionAmountBRL : undefined,
    };

    setSales((prev) => {
      const next = [sale, ...prev];
      void repo.createSale({ tenantId: tenantKey, sale });
      return next;
    });
    return sale;
  };

  return (
    <ReferralContext.Provider value={{
      partners, links, sales, generateReferralLink, togglePartnerActive, processReferralSale
    }}>
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
};
