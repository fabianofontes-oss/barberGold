'use client';

import React, { useEffect, useState } from 'react';
import { Crown, CreditCard, Check } from 'lucide-react';
import { useBarberClub } from '../hooks/useBarberClub';
import type { Subscription, MembershipPlan } from '../types';

interface ClubCreditBadgeProps {
  clientId: string;
  onRedeemCredit?: (params: {
    subscriptionId: string;
    creditsRemaining: number;
    plan: MembershipPlan;
  }) => void;
  serviceId?: string;
  serviceName?: string;
  servicePrice?: number;
  staffId?: string;
  staffName?: string;
  disabled?: boolean;
}

export const ClubCreditBadge: React.FC<ClubCreditBadgeProps> = ({
  clientId,
  onRedeemCredit,
  serviceId,
  serviceName,
  servicePrice,
  staffId,
  staffName,
  disabled,
}) => {
  const { getClientSubscription, plans, redeemCredit } = useBarberClub();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setRedeemed(false);

    (async () => {
      const sub = await getClientSubscription(clientId);
      if (!cancelled) {
        setSubscription(sub);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clientId, getClientSubscription]);

  if (loading) {
    return null;
  }

  if (!subscription || subscription.status !== 'ACTIVE') {
    return null;
  }

  const plan = plans.find((p) => p.id === subscription.planId);
  if (!plan) return null;

  const handleRedeem = async () => {
    if (!serviceId || !serviceName || typeof servicePrice !== 'number') {
      // Apenas notifica o parent sobre a disponibilidade
      onRedeemCredit?.({
        subscriptionId: subscription.id,
        creditsRemaining: subscription.creditsRemaining,
        plan,
      });
      return;
    }

    setRedeeming(true);
    const result = await redeemCredit({
      clientId,
      serviceId,
      serviceName,
      servicePrice,
      staffId,
      staffName,
    });

    setRedeeming(false);

    if (result.success) {
      setRedeemed(true);
      setSubscription((prev) =>
        prev ? { ...prev, creditsRemaining: prev.creditsRemaining - 1 } : null
      );
    } else {
      alert(result.message);
    }
  };

  if (subscription.creditsRemaining <= 0) {
    return (
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-2 flex items-center gap-2">
        <Crown className="w-4 h-4 text-purple-500" />
        <span className="text-xs text-zinc-400">
          <strong className="text-white">{plan.name}</strong> â€” Sem crÃ©ditos restantes
        </span>
      </div>
    );
  }

  return (
    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Crown className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">{plan.name}</p>
            <p className="text-[10px] text-purple-300">
              <CreditCard className="w-3 h-3 inline mr-1" />
              {subscription.creditsRemaining} crÃ©dito{subscription.creditsRemaining !== 1 ? 's' : ''} disponÃ­vel
            </p>
          </div>
        </div>

        {redeemed ? (
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
            <Check className="w-4 h-4" /> Usado!
          </div>
        ) : (
          <button
            onClick={handleRedeem}
            disabled={disabled || redeeming}
            className="px-3 py-1.5 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all"
          >
            {redeeming ? 'Resgatando...' : 'Usar CrÃ©dito'}
          </button>
        )}
      </div>
    </div>
  );
};
