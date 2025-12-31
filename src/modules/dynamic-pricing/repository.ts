import type { PricingRule } from './types';

const STORAGE_KEY = (tenantId: string) => `bf:dynamicpricing:${tenantId}:rules`;

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function listRules(tenantId: string): Promise<PricingRule[]> {
  if (typeof window === 'undefined') return [];
  const raw = safeParseJSON<any[]>(localStorage.getItem(STORAGE_KEY(tenantId))) ?? [];
  return raw.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt),
    updatedAt: new Date(r.updatedAt),
  }));
}

export async function getRuleById(tenantId: string, ruleId: string): Promise<PricingRule | null> {
  const rules = await listRules(tenantId);
  return rules.find((r) => r.id === ruleId) ?? null;
}

export async function upsertRule(rule: PricingRule): Promise<void> {
  if (typeof window === 'undefined') return;
  const rules = await listRules(rule.tenantId);
  const exists = rules.some((r) => r.id === rule.id);

  const serialize = (r: PricingRule) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  });

  const next = exists
    ? rules.map((r) => (r.id === rule.id ? serialize(rule) : serialize(r)))
    : [...rules.map(serialize), serialize(rule)];

  localStorage.setItem(STORAGE_KEY(rule.tenantId), JSON.stringify(next));
}

export async function deleteRule(tenantId: string, ruleId: string): Promise<void> {
  if (typeof window === 'undefined') return;
  const rules = await listRules(tenantId);
  const next = rules
    .filter((r) => r.id !== ruleId)
    .map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  localStorage.setItem(STORAGE_KEY(tenantId), JSON.stringify(next));
}
