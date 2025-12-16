import { useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { SaasPlan, SaasPlanId, SaasV2TenantStatus, ShopProfile, Tenant, ViewState } from '@/types';
import { SAAS_PLANS_BR } from '@/constants';

export type TenantPlanSliceParams = {
  currentTenantId: string | null;
  setCurrentTenantId: (tenantId: string | null) => void;
  getTenantById: (tenantId: string) => { id: string; status: SaasV2TenantStatus; planId: SaasPlanId; shopName: string } | undefined;

  tenants: Tenant[];
  setTenants: Dispatch<SetStateAction<Tenant[]>>;

  setView: (view: ViewState) => void;
  setShopProfile: Dispatch<SetStateAction<ShopProfile>>;
};

export type TenantPlanSlice = {
  saasPlans: SaasPlan[];
  addSaasPlan: (plan: SaasPlan) => void;
  updateSaasPlan: (plan: SaasPlan) => void;

  currentTenantId: string | null;
  currentTenantStatus?: SaasV2TenantStatus;
  currentTenantPlanId?: SaasPlanId;
  isImpersonating: boolean;

  updateTenantPlan: (tenantId: string, planId: SaasPlanId) => void;
  impersonateTenant: (tenantId: string) => void;
  exitImpersonation: () => void;
};

export function useTenantPlanSlice(params: TenantPlanSliceParams): TenantPlanSlice {
  const {
    currentTenantId,
    setCurrentTenantId,
    getTenantById,
    tenants,
    setTenants,
    setView,
    setShopProfile,
  } = params;

  const [isImpersonating, setIsImpersonating] = useState(false);
  const [saasPlans, setSaasPlans] = useState<SaasPlan[]>(SAAS_PLANS_BR);

  const activeTenant = useMemo(() => {
    return currentTenantId ? getTenantById(currentTenantId) : undefined;
  }, [currentTenantId, getTenantById]);

  const currentTenantStatus = activeTenant?.status;
  const currentTenantPlanId = activeTenant?.planId;

  const updateTenantPlan = (tenantId: string, planId: SaasPlanId) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        const plan = saasPlans.find((p) => p.id === planId);
        const newMrr = plan ? plan.monthlyPriceBRL : t.monthlyFee;
        return { ...t, planId, monthlyFee: newMrr };
      })
    );
  };

  const impersonateTenant = (id: string) => {
    const tenantV2 = getTenantById(id);
    if (tenantV2) {
      setCurrentTenantId(id);
      setIsImpersonating(true);
      setShopProfile((prev) => ({ ...prev, name: tenantV2.shopName, slug: prev.slug || tenantV2.id }));
      setView('DASHBOARD');
      return;
    }

    const tenant = tenants.find((t) => t.id === id);
    if (tenant) {
      setShopProfile((prev) => ({ ...prev, name: tenant.name }));
      setView('DASHBOARD');
      alert(`Accessing ${tenant.name} as Admin...`);
    }
  };

  const exitImpersonation = () => {
    setIsImpersonating(false);
    setCurrentTenantId(null);
    setView('SUPER_OFFICE_V2');
  };

  const addSaasPlan = (plan: SaasPlan) => setSaasPlans((prev) => [...prev, plan]);
  const updateSaasPlan = (plan: SaasPlan) => setSaasPlans((prev) => prev.map((p) => (p.id === plan.id ? plan : p)));

  return {
    saasPlans,
    addSaasPlan,
    updateSaasPlan,
    currentTenantId,
    currentTenantStatus,
    currentTenantPlanId,
    isImpersonating,
    updateTenantPlan,
    impersonateTenant,
    exitImpersonation,
  };
}
