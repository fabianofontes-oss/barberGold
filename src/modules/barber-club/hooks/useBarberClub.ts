'use client';

import { useCallback, useEffect, useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import type { MembershipPlan, Subscription, CreditUsage, ClubDashboardStats } from '../types';
import * as actions from '../actions';

export function useBarberClub() {
  const { shopProfile } = useBarber();
  const tenantId = shopProfile.slug || 'standalone';

  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [usageHistory, setUsageHistory] = useState<CreditUsage[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [p, s, u] = await Promise.all([
        actions.listPlans(tenantId),
        actions.listSubscriptions(tenantId),
        actions.listCreditUsage(tenantId),
      ]);
      setPlans(p);
      setSubscriptions(s);
      setUsageHistory(u);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  // ============================================
  // PLANOS
  // ============================================

  const createPlan = useCallback(
    async (data: Omit<MembershipPlan, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
      const plan = await actions.createCustomPlan(tenantId, data);
      setPlans((prev) => [...prev, plan]);
      return plan;
    },
    [tenantId]
  );

  const updatePlan = useCallback(
    async (planId: string, data: Partial<MembershipPlan>) => {
      const updated = await actions.updatePlan(tenantId, planId, data);
      if (updated) {
        setPlans((prev) => prev.map((p) => (p.id === planId ? updated : p)));
      }
      return updated;
    },
    [tenantId]
  );

  const deletePlan = useCallback(
    async (planId: string) => {
      await actions.deletePlan(tenantId, planId);
      setPlans((prev) => prev.filter((p) => p.id !== planId));
    },
    [tenantId]
  );

  // ============================================
  // ASSINATURAS
  // ============================================

  const subscribeClient = useCallback(
    async (clientId: string, planId: string) => {
      const sub = await actions.createSubscription(tenantId, clientId, planId);
      if (sub) {
        setSubscriptions((prev) => [...prev, sub]);
      }
      return sub;
    },
    [tenantId]
  );

  const cancelSubscription = useCallback(
    async (subscriptionId: string, reason?: string) => {
      const updated = await actions.cancelSubscription(tenantId, subscriptionId, reason);
      if (updated) {
        setSubscriptions((prev) => prev.map((s) => (s.id === subscriptionId ? updated : s)));
      }
      return updated;
    },
    [tenantId]
  );

  const getClientSubscription = useCallback(
    async (clientId: string) => {
      return actions.getClientSubscription(tenantId, clientId);
    },
    [tenantId]
  );

  // ============================================
  // RESGATE
  // ============================================

  const redeemCredit = useCallback(
    async (params: {
      clientId: string;
      serviceId: string;
      serviceName: string;
      servicePrice: number;
      staffId?: string;
      staffName?: string;
    }) => {
      const result = await actions.redeemCredit({ tenantId, ...params });
      if (result.success && result.usage) {
        setUsageHistory((prev) => [result.usage!, ...prev]);
        // Atualiza créditos restantes na subscription local
        setSubscriptions((prev) =>
          prev.map((s) =>
            s.clientId === params.clientId && s.status === 'ACTIVE'
              ? { ...s, creditsRemaining: s.creditsRemaining - 1 }
              : s
          )
        );
      }
      return result;
    },
    [tenantId]
  );

  // ============================================
  // STATS
  // ============================================

  const stats: ClubDashboardStats = {
    totalActiveSubscribers: subscriptions.filter((s) => s.status === 'ACTIVE').length,
    totalMRR: subscriptions
      .filter((s) => s.status === 'ACTIVE')
      .reduce((acc, s) => {
        const plan = plans.find((p) => p.id === s.planId);
        return acc + (plan?.monthlyPriceBRL ?? 0);
      }, 0),
    creditsUsedThisMonth: usageHistory.filter((u) => {
      const now = new Date();
      return u.usedAt.getMonth() === now.getMonth() && u.usedAt.getFullYear() === now.getFullYear();
    }).length,
    creditsRemainingThisMonth: subscriptions
      .filter((s) => s.status === 'ACTIVE')
      .reduce((acc, s) => acc + s.creditsRemaining, 0),
    churnRate: 0, // Placeholder
    averageTicketWithClub: 0, // Placeholder
    averageTicketWithoutClub: 0, // Placeholder
  };

  return {
    plans,
    subscriptions,
    usageHistory,
    stats,
    loading,
    reload,
    createPlan,
    updatePlan,
    deletePlan,
    subscribeClient,
    cancelSubscription,
    getClientSubscription,
    redeemCredit,
  };
}
