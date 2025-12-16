import { getAppMode } from '@/lib/appMode';

import { createTenantPlanLocalStorageRepository } from './tenantPlan/localStorage';
import { createTenantPlanSupabaseRepository } from './tenantPlan/supabase';
import type { TenantPlanRepository } from './tenantPlan/types';

import { createReferralsLocalStorageRepository } from './referrals/localStorage';
import { createReferralsSupabaseRepository } from './referrals/supabase';
import type { ReferralsRepository } from './referrals/types';

export function getTenantPlanRepository(): TenantPlanRepository {
  const mode = getAppMode();
  if (mode === 'PILOT') return createTenantPlanSupabaseRepository();
  return createTenantPlanLocalStorageRepository();
}

export function getReferralsRepository(): ReferralsRepository {
  const mode = getAppMode();
  if (mode === 'PILOT') return createReferralsSupabaseRepository();
  return createReferralsLocalStorageRepository();
}
