'use client';

import React, { createContext, useContext, useState, PropsWithChildren } from 'react';
import { ReferralPartner, ReferralLink, ReferralSale, ReferralSettings, SaasPlan, BillingPeriod, SaasPlanId } from '@/types';
import { MOCK_REFERRAL_PARTNERS, MOCK_REFERRAL_LINKS, MOCK_REFERRAL_SALES } from '@/constants';

interface ReferralContextType {
  partners: ReferralPartner[];
  links: ReferralLink[];
  sales: ReferralSale[];
  
  // Actions
  generateReferralLink: (partnerId: string) => string;
  togglePartnerActive: (partnerId: string) => void;
  processReferralSale: (
    referralCode: string, 
    referredTenantId: string, 
    plan: SaasPlan, 
    billingPeriod: BillingPeriod
  ) => ReferralSale | null;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const ReferralProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [partners, setPartners] = useState<ReferralPartner[]>(MOCK_REFERRAL_PARTNERS);
  const [links, setLinks] = useState<ReferralLink[]>(MOCK_REFERRAL_LINKS);
  const [sales, setSales] = useState<ReferralSale[]>(MOCK_REFERRAL_SALES);

  const generateReferralLink = (partnerId: string) => {
    const partner = partners.find(p => p.id === partnerId);
    if (!partner) throw new Error('Partner not found');

    const prefix = partner.displayName.substring(0, 3).toUpperCase();
    const unique = Math.floor(Math.random() * 9999).toString();
    const newCode = `${prefix}${unique}`;

    const newLink: ReferralLink = {
      id: Math.random().toString(36).substr(2, 9),
      code: newCode,
      partnerId,
      region: 'BR', // Defaulting for now
      createdAt: new Date(),
      isActive: true
    };

    setLinks(prev => [...prev, newLink]);
    return newCode;
  };

  const togglePartnerActive = (partnerId: string) => {
    setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, isActive: !p.isActive } : p));
  };

  const processReferralSale = (
    referralCode: string, 
    referredTenantId: string, 
    plan: SaasPlan, 
    billingPeriod: BillingPeriod
  ): ReferralSale | null => {
    
    // Find the link
    const link = links.find(l => l.code === referralCode && l.isActive);
    if (!link) return null;

    // Find the partner
    const partner = partners.find(p => p.id === link.partnerId && p.isActive);
    if (!partner) return null;

    // Somente planos ANUAIS geram comissão no modelo atual
    if (billingPeriod !== 'ANNUAL') {
      console.warn('Monthly billing does not generate referral commission in this program version');
      return null;
    }

    const saleValueBRL = plan.yearlyPriceBRL;
    const commissionPercent = partner.baseCommissionPercent;
    const commissionBaseBRL = saleValueBRL;
    const commissionAmountBRL = (commissionBaseBRL * commissionPercent) / 100;

    // --- LOGICA DE SPLIT (STAFF vs OWNER) ---
    // Fallback se nada estiver configurado no Partner
    const DEFAULT_STAFF_SHARE = 60;
    const DEFAULT_OWNER_SHARE = 40;

    let staffSharePercent: number | undefined;
    let ownerSharePercent: number | undefined;
    let staffCommissionAmountBRL: number | undefined;
    let ownerCommissionAmountBRL: number | undefined;

    // Caso 1: indicação feita pelo DONO (partnerType OWNER)
    if (partner.partnerType === 'OWNER') {
      // Dono recebe 100% da comissão gerada (ou o que estiver configurado no partner, geralmente 100/0)
      ownerSharePercent = partner.ownerSharePercent ?? 100;
      staffSharePercent = partner.staffSharePercent ?? 0;
      
      ownerCommissionAmountBRL = commissionAmountBRL;
      staffCommissionAmountBRL = 0;
    }
    // Caso 2: indicação feita pelo STAFF
    else if (partner.partnerType === 'STAFF') {
      // Usa a configuração gravada no Partner (que veio do referralConfig da barbearia na criação)
      const staffPct = partner.staffSharePercent ?? DEFAULT_STAFF_SHARE;
      const ownerPct = partner.ownerSharePercent ?? DEFAULT_OWNER_SHARE;

      staffSharePercent = staffPct;
      ownerSharePercent = ownerPct;

      staffCommissionAmountBRL = (commissionAmountBRL * staffPct) / 100;
      ownerCommissionAmountBRL = (commissionAmountBRL * ownerPct) / 100;
    }
    // Outros tipos (INFLUENCER, AGENCY)
    else {
      // Influencer fica com tudo (que é definido no baseCommissionPercent), não há split interno de barbearia
      ownerSharePercent = partner.ownerSharePercent ?? 0;
      staffSharePercent = partner.staffSharePercent ?? 0;
      staffCommissionAmountBRL = 0;
      ownerCommissionAmountBRL = 0;
    }

    const sale: ReferralSale = {
      id: `refs_${Math.random().toString(36).substr(2, 9)}`,
      referralCode,
      partnerId: partner.id,
      referredTenantId,
      planId: plan.id,
      billingPeriod,
      saleValueBRL,
      commissionBaseBRL,
      commissionPercent,
      commissionAmountBRL,
      eligibleForBonus: partner.eligibleForBonus,
      status: 'PENDING', // D+30 to approve usually
      createdAt: new Date(),
      
      // Campos de split
      staffSharePercent,
      ownerSharePercent,
      staffCommissionAmountBRL,
      ownerCommissionAmountBRL,
    };

    setSales(prev => [sale, ...prev]);
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
