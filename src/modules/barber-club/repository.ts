import type { MembershipPlan, Subscription, CreditUsage } from './types';

// ============================================
// CHAVES LOCALSTORAGE (DEMO MODE)
// ============================================

function planKey(tenantId: string) {
  return `bf:barberclub:${tenantId}:plans`;
}

function subscriptionKey(tenantId: string) {
  return `bf:barberclub:${tenantId}:subscriptions`;
}

function usageKey(tenantId: string) {
  return `bf:barberclub:${tenantId}:usage`;
}

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ============================================
// PLANOS
// ============================================

export async function listPlans(tenantId: string): Promise<MembershipPlan[]> {
  if (typeof window === 'undefined') return [];
  const raw = safeParseJSON<any[]>(localStorage.getItem(planKey(tenantId))) ?? [];
  return raw.map((p) => ({
    ...p,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
  }));
}

export async function getPlanById(tenantId: string, planId: string): Promise<MembershipPlan | null> {
  const plans = await listPlans(tenantId);
  return plans.find((p) => p.id === planId) ?? null;
}

export async function upsertPlan(plan: MembershipPlan): Promise<void> {
  if (typeof window === 'undefined') return;
  const plans = await listPlans(plan.tenantId);
  const exists = plans.some((p) => p.id === plan.id);
  
  const serializable = {
    ...plan,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
  };
  
  const next = exists
    ? plans.map((p) => (p.id === plan.id ? serializable : { ...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() }))
    : [...plans.map((p) => ({ ...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() })), serializable];
  
  localStorage.setItem(planKey(plan.tenantId), JSON.stringify(next));
}

export async function deletePlan(tenantId: string, planId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  const plans = await listPlans(tenantId);
  const next = plans.filter((p) => p.id !== planId).map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));
  localStorage.setItem(planKey(tenantId), JSON.stringify(next));
}

// ============================================
// ASSINATURAS
// ============================================

export async function listSubscriptions(tenantId: string): Promise<Subscription[]> {
  if (typeof window === 'undefined') return [];
  const raw = safeParseJSON<any[]>(localStorage.getItem(subscriptionKey(tenantId))) ?? [];
  return raw.map((s) => ({
    ...s,
    startDate: new Date(s.startDate),
    currentPeriodStart: new Date(s.currentPeriodStart),
    currentPeriodEnd: new Date(s.currentPeriodEnd),
    lastPaymentDate: s.lastPaymentDate ? new Date(s.lastPaymentDate) : undefined,
    nextPaymentDate: s.nextPaymentDate ? new Date(s.nextPaymentDate) : undefined,
    cancelledAt: s.cancelledAt ? new Date(s.cancelledAt) : undefined,
    createdAt: new Date(s.createdAt),
    updatedAt: new Date(s.updatedAt),
  }));
}

export async function getSubscriptionByClientId(tenantId: string, clientId: string): Promise<Subscription | null> {
  const subs = await listSubscriptions(tenantId);
  return subs.find((s) => s.clientId === clientId && s.status === 'ACTIVE') ?? null;
}

export async function upsertSubscription(sub: Subscription): Promise<void> {
  if (typeof window === 'undefined') return;
  const subs = await listSubscriptions(sub.tenantId);
  const exists = subs.some((s) => s.id === sub.id);
  
  const serialize = (s: Subscription) => ({
    ...s,
    startDate: s.startDate.toISOString(),
    currentPeriodStart: s.currentPeriodStart.toISOString(),
    currentPeriodEnd: s.currentPeriodEnd.toISOString(),
    lastPaymentDate: s.lastPaymentDate?.toISOString(),
    nextPaymentDate: s.nextPaymentDate?.toISOString(),
    cancelledAt: s.cancelledAt?.toISOString(),
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  });
  
  const next = exists
    ? subs.map((s) => (s.id === sub.id ? serialize(sub) : serialize(s)))
    : [...subs.map(serialize), serialize(sub)];
  
  localStorage.setItem(subscriptionKey(sub.tenantId), JSON.stringify(next));
}

// ============================================
// USO DE CRÃ‰DITOS
// ============================================

export async function listCreditUsage(tenantId: string): Promise<CreditUsage[]> {
  if (typeof window === 'undefined') return [];
  const raw = safeParseJSON<any[]>(localStorage.getItem(usageKey(tenantId))) ?? [];
  return raw.map((u) => ({
    ...u,
    usedAt: new Date(u.usedAt),
  }));
}

export async function recordCreditUsage(usage: CreditUsage): Promise<void> {
  if (typeof window === 'undefined') return;
  const list = await listCreditUsage(usage.tenantId);
  const serializable = {
    ...usage,
    usedAt: usage.usedAt.toISOString(),
  };
  localStorage.setItem(usageKey(usage.tenantId), JSON.stringify([serializable, ...list.map((u) => ({ ...u, usedAt: u.usedAt.toISOString() }))]));
}
