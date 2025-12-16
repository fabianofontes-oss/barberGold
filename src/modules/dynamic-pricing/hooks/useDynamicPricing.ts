'use client';

import { useCallback, useEffect, useState } from 'react';
import { useBarber } from '@/context/BarberContext';
import type { PricingRule, RuleSuggestion, PriceCalculation } from '../types';
import * as repo from '../repository';
import { calculateDynamicPrice } from '../engine';

function uuid(): string {
  return crypto.randomUUID();
}

export function useDynamicPricing() {
  const { shopProfile } = useBarber();
  const tenantId = shopProfile.slug || 'standalone';

  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const r = await repo.listRules(tenantId);
      setRules(r);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  // ============================================
  // CRUD
  // ============================================

  const createRule = useCallback(
    async (data: Omit<PricingRule, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date();
      const rule: PricingRule = {
        id: uuid(),
        tenantId,
        createdAt: now,
        updatedAt: now,
        ...data,
      };
      await repo.upsertRule(rule);
      setRules((prev) => [...prev, rule]);
      return rule;
    },
    [tenantId]
  );

  const createFromSuggestion = useCallback(
    async (suggestion: RuleSuggestion) => {
      return createRule({
        name: suggestion.name,
        type: suggestion.type,
        percentModifier: suggestion.percentModifier,
        daysOfWeek: suggestion.daysOfWeek,
        startTime: suggestion.startTime,
        endTime: suggestion.endTime,
        serviceIds: [],
        isActive: true,
        priority: 0,
      });
    },
    [createRule]
  );

  const updateRule = useCallback(
    async (ruleId: string, data: Partial<PricingRule>) => {
      const existing = rules.find((r) => r.id === ruleId);
      if (!existing) return null;

      const updated: PricingRule = {
        ...existing,
        ...data,
        id: existing.id,
        tenantId: existing.tenantId,
        createdAt: existing.createdAt,
        updatedAt: new Date(),
      };

      await repo.upsertRule(updated);
      setRules((prev) => prev.map((r) => (r.id === ruleId ? updated : r)));
      return updated;
    },
    [rules]
  );

  const deleteRule = useCallback(
    async (ruleId: string) => {
      await repo.deleteRule(tenantId, ruleId);
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
    },
    [tenantId]
  );

  const toggleRule = useCallback(
    async (ruleId: string) => {
      const rule = rules.find((r) => r.id === ruleId);
      if (rule) {
        await updateRule(ruleId, { isActive: !rule.isActive });
      }
    },
    [rules, updateRule]
  );

  // ============================================
  // CÁLCULO
  // ============================================

  const calculatePrice = useCallback(
    (params: { originalPrice: number; serviceId: string; dateTime: Date }): PriceCalculation => {
      return calculateDynamicPrice({ ...params, rules });
    },
    [rules]
  );

  // ============================================
  // STATS
  // ============================================

  const activeRulesCount = rules.filter((r) => r.isActive).length;
  const surgeRulesCount = rules.filter((r) => r.type === 'SURGE' && r.isActive).length;
  const dealRulesCount = rules.filter((r) => r.type === 'DEAL' && r.isActive).length;

  return {
    rules,
    loading,
    reload,
    createRule,
    createFromSuggestion,
    updateRule,
    deleteRule,
    toggleRule,
    calculatePrice,
    stats: {
      activeRulesCount,
      surgeRulesCount,
      dealRulesCount,
    },
  };
}
