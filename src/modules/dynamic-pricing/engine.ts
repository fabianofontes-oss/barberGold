import type { PricingRule, DayOfWeek, PriceCalculation } from './types';

const DAY_MAP: Record<number, DayOfWeek> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function isTimeInRange(current: string, start: string, end: string): boolean {
  const c = timeToMinutes(current);
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);

  if (s <= e) {
    return c >= s && c < e;
  }
  // Overnight range (e.g., 22:00 - 02:00)
  return c >= s || c < e;
}

export function calculateDynamicPrice(params: {
  originalPrice: number;
  serviceId: string;
  dateTime: Date;
  rules: PricingRule[];
}): PriceCalculation {
  const { originalPrice, serviceId, dateTime, rules } = params;

  const dayOfWeek = DAY_MAP[dateTime.getDay()];
  const currentTime = `${String(dateTime.getHours()).padStart(2, '0')}:${String(dateTime.getMinutes()).padStart(2, '0')}`;

  // Filtra regras aplicáveis
  const applicableRules = rules
    .filter((r) => r.isActive)
    .filter((r) => r.daysOfWeek.includes(dayOfWeek))
    .filter((r) => isTimeInRange(currentTime, r.startTime, r.endTime))
    .filter((r) => r.serviceIds.length === 0 || r.serviceIds.includes(serviceId))
    .sort((a, b) => b.priority - a.priority);

  if (applicableRules.length === 0) {
    return {
      originalPrice,
      finalPrice: originalPrice,
      appliedRule: null,
      percentChange: 0,
      savings: 0,
    };
  }

  // Aplica a regra de maior prioridade
  const rule = applicableRules[0];
  const modifier = rule.percentModifier;
  const adjustment = originalPrice * modifier;
  const finalPrice = Math.max(0, originalPrice + adjustment);

  return {
    originalPrice,
    finalPrice: Math.round(finalPrice * 100) / 100,
    appliedRule: rule,
    percentChange: modifier * 100,
    savings: rule.type === 'DEAL' ? Math.abs(adjustment) : 0,
  };
}
