import { useState } from 'react';
import type { ReferralSource } from '@/types';
import { MOCK_REFERRALS } from '@/constants';

export type ReferralSlice = {
  referrals: ReferralSource[];
  addReferralSource: (source: Omit<ReferralSource, 'id' | 'stats'>) => void;
  updateReferralSource: (source: ReferralSource) => void;
  deleteReferralSource: (id: string) => void;
};

export function useReferralSlice(): ReferralSlice {
  const [referrals, setReferrals] = useState<ReferralSource[]>(MOCK_REFERRALS);

  const addReferralSource: ReferralSlice['addReferralSource'] = (source) => {
    setReferrals((prev) => [
      ...prev,
      {
        ...source,
        id: Math.random().toString(36).substr(2, 9),
        stats: { clicks: 0, conversions: 0, revenueGenerated: 0 },
      },
    ]);
  };

  const updateReferralSource: ReferralSlice['updateReferralSource'] = (source) => {
    setReferrals((prev) => prev.map((src) => (src.id === source.id ? source : src)));
  };

  const deleteReferralSource: ReferralSlice['deleteReferralSource'] = (id) => {
    setReferrals((prev) => prev.filter((s) => s.id !== id));
  };

  return { referrals, addReferralSource, updateReferralSource, deleteReferralSource };
}
