'use server';

function uuid(): string {
  return crypto.randomUUID();
}
import { addMonths } from 'date-fns';
import type { MembershipPlan, Subscription, CreditUsage, PlanSuggestion } from './types';
import * as repo from './repository';

// ============================================
// PLANOS
// ============================================

export async function createPlanFromSuggestion(
  tenantId: string,
  suggestion: PlanSuggestion,
  overrides?: Partial<MembershipPlan>
): Promise<MembershipPlan> {
  const now = new Date();
  const plan: MembershipPlan = {
    id: uuid(),
    tenantId,
    name: suggestion.name,
    description: suggestion.description,
    monthlyPriceBRL: suggestion.monthlyPriceBRL,
    monthlyCredits: suggestion.monthlyCredits,
    eligibleServiceIds: [],
    extraServiceDiscountPercent: suggestion.extraServiceDiscountPercent,
    productDiscountPercent: suggestion.productDiscountPercent,
    perks: [...suggestion.perks],
    isActive: true,
    displayOrder: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };

  await repo.upsertPlan(plan);
  return plan;
}

export async function createCustomPlan(
  tenantId: string,
  data: Omit<MembershipPlan, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>
): Promise<MembershipPlan> {
  const now = new Date();
  const plan: MembershipPlan = {
    id: uuid(),
    tenantId,
    createdAt: now,
    updatedAt: now,
    ...data,
  };

  await repo.upsertPlan(plan);
  return plan;
}

export async function updatePlan(
  tenantId: string,
  planId: string,
  data: Partial<MembershipPlan>
): Promise<MembershipPlan | null> {
  const existing = await repo.getPlanById(tenantId, planId);
  if (!existing) return null;

  const updated: MembershipPlan = {
    ...existing,
    ...data,
    id: existing.id,
    tenantId: existing.tenantId,
    createdAt: existing.createdAt,
    updatedAt: new Date(),
  };

  await repo.upsertPlan(updated);
  return updated;
}

export async function deletePlan(tenantId: string, planId: string): Promise<void> {
  await repo.deletePlan(tenantId, planId);
}

export async function listPlans(tenantId: string): Promise<MembershipPlan[]> {
  return repo.listPlans(tenantId);
}

// ============================================
// ASSINATURAS
// ============================================

export async function createSubscription(
  tenantId: string,
  clientId: string,
  planId: string
): Promise<Subscription | null> {
  const plan = await repo.getPlanById(tenantId, planId);
  if (!plan) return null;

  const now = new Date();
  const periodEnd = addMonths(now, 1);

  const sub: Subscription = {
    id: uuid(),
    tenantId,
    clientId,
    planId,
    status: 'ACTIVE',
    startDate: now,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    creditsRemaining: plan.monthlyCredits,
    lastPaymentDate: now,
    nextPaymentDate: periodEnd,
    createdAt: now,
    updatedAt: now,
  };

  await repo.upsertSubscription(sub);
  return sub;
}

export async function cancelSubscription(
  tenantId: string,
  subscriptionId: string,
  reason?: string
): Promise<Subscription | null> {
  const subs = await repo.listSubscriptions(tenantId);
  const sub = subs.find((s) => s.id === subscriptionId);
  if (!sub) return null;

  const updated: Subscription = {
    ...sub,
    status: 'CANCELLED',
    cancelledAt: new Date(),
    cancelReason: reason,
    updatedAt: new Date(),
  };

  await repo.upsertSubscription(updated);
  return updated;
}

export async function getClientSubscription(
  tenantId: string,
  clientId: string
): Promise<Subscription | null> {
  return repo.getSubscriptionByClientId(tenantId, clientId);
}

export async function listSubscriptions(tenantId: string): Promise<Subscription[]> {
  return repo.listSubscriptions(tenantId);
}

// ============================================
// RESGATE DE CRÉDITOS
// ============================================

export async function redeemCredit(params: {
  tenantId: string;
  clientId: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  staffId?: string;
  staffName?: string;
}): Promise<{ success: boolean; message: string; usage?: CreditUsage }> {
  const sub = await repo.getSubscriptionByClientId(params.tenantId, params.clientId);

  if (!sub) {
    return { success: false, message: 'Cliente não possui assinatura ativa.' };
  }

  if (sub.status !== 'ACTIVE') {
    return { success: false, message: `Assinatura com status ${sub.status}. Não é possível resgatar créditos.` };
  }

  if (sub.creditsRemaining <= 0) {
    return { success: false, message: 'Sem créditos disponíveis neste período.' };
  }

  // Deduz crédito
  const updatedSub: Subscription = {
    ...sub,
    creditsRemaining: sub.creditsRemaining - 1,
    updatedAt: new Date(),
  };
  await repo.upsertSubscription(updatedSub);

  // Registra uso
  const usage: CreditUsage = {
    id: uuid(),
    subscriptionId: sub.id,
    clientId: params.clientId,
    tenantId: params.tenantId,
    serviceId: params.serviceId,
    serviceName: params.serviceName,
    staffId: params.staffId,
    staffName: params.staffName,
    savedAmountBRL: params.servicePrice,
    usedAt: new Date(),
  };
  await repo.recordCreditUsage(usage);

  return {
    success: true,
    message: `Crédito resgatado! Restam ${updatedSub.creditsRemaining} créditos.`,
    usage,
  };
}

export async function listCreditUsage(tenantId: string): Promise<CreditUsage[]> {
  return repo.listCreditUsage(tenantId);
}
