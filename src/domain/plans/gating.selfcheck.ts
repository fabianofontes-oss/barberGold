import { hasFeature } from './gating';
import type { PlanId } from './types';

export function runPlansGatingSelfcheck(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  const t = (planId: PlanId) => ({ planId });

  const must = (condition: boolean, message: string) => {
    if (!condition) errors.push(message);
  };

  must(hasFeature(t('SOLO'), 'AGENDA') === true, 'SOLO deve ter AGENDA');
  must(hasFeature(t('SOLO'), 'ONLINE_BOOKING') === false, 'SOLO não deve ter ONLINE_BOOKING');

  must(hasFeature(t('SOLO_PRO'), 'ONLINE_BOOKING') === true, 'SOLO_PRO deve ter ONLINE_BOOKING');
  must(hasFeature(t('SOLO_PRO'), 'LOYALTY') === false, 'SOLO_PRO não deve ter LOYALTY');

  must(hasFeature(t('EQUIPE'), 'COMMISSIONS') === true, 'EQUIPE deve ter COMMISSIONS');
  must(hasFeature(t('EQUIPE'), 'BLIND_CASH_CLOSURE') === true, 'EQUIPE deve ter BLIND_CASH_CLOSURE');
  must(hasFeature(t('EQUIPE'), 'WEBSITE_PREMIUM') === false, 'EQUIPE não deve ter WEBSITE_PREMIUM');

  must(hasFeature(t('STUDIO'), 'WEBSITE_PREMIUM') === true, 'STUDIO deve ter WEBSITE_PREMIUM');

  return { ok: errors.length === 0, errors };
}
