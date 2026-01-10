'use client';

import { useState, useCallback } from 'react';
import { PaymentMethod } from '@/types';
import type { ShopSettings } from '@/types';

const DEFAULT_SETTINGS: ShopSettings = {
  dailyRevenueGoal: 1000,
  returnReminderDays: 28,
  winBackDays: 60,
  fidelityThreshold: 2,
  messageTemplateOverdue: 'Ola {name}, ja faz {days} dias que nao te vemos! Agende agora: {booking_link}',
  messageTemplateWinBack: 'Ola {name}, saudades! Volte essa semana e ganhe 5% OFF! Agende: {booking_link}',
  enableBirthdayDiscount: true,
  enableWinBackDiscount: true,
  enableLoyaltyCard: true,
  enableReferralSystem: true,
  enableTipsReview: true,
  hideClientContactInfo: true,
  enableCashControl: false,
  discountAllocation: 'SHARED',
  queueDistributionRule: 'FAIRNESS',
  paymentSettings: {
    inStore: [PaymentMethod.CASH, PaymentMethod.CREDIT_CARD, PaymentMethod.DEBIT_CARD, PaymentMethod.PIX],
    online: [PaymentMethod.CREDIT_CARD, PaymentMethod.PIX],
  },
  website: {
    themeTemplate: 'PREMIUM',
    customColors: { primary: '#09090b', secondary: '#18181b', accent: '#f59e0b', text: '#ffffff', borderRadius: '0.75rem' },
    heroTitle: 'Estilo & Tradicao',
    heroSubtitle: 'A experiencia premium que voce merece.',
    heroImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2000',
    aboutTitle: 'Sobre Nos',
    aboutText: 'Fundada com a missao de resgatar a barbearia classica...',
    aboutImage: '',
    sectionOrder: ['HERO', 'ABOUT', 'SERVICES', 'PRODUCTS', 'GALLERY', 'REVIEWS', 'LOCATION'],
    showTeam: true,
    showServices: true,
    showLocation: true,
    coverOpacity: 0.5,
    gallery: [],
    externalReviews: [],
  },
  referralConfig: {
    enabled: true,
    ownerReferralCode: 'GOLD77',
    allowStaffToParticipate: false,
    staffSharePercent: 70,
    ownerSharePercent: 30,
  },
};

interface UseShopSettingsReturn {
  shopSettings: ShopSettings;
  updateShopSettings: (settings: Partial<ShopSettings>) => void;
}

export function useShopSettings(): UseShopSettingsReturn {
  const [shopSettings, setShopSettings] = useState<ShopSettings>(DEFAULT_SETTINGS);

  const updateShopSettings = useCallback((settings: Partial<ShopSettings>) => {
    setShopSettings((prev) => ({ ...prev, ...settings }));
  }, []);

  return { shopSettings, updateShopSettings };
}
