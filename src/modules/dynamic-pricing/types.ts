import { z } from 'zod';

// ============================================
// DIAS DA SEMANA
// ============================================

export const DayOfWeekSchema = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]);

export type DayOfWeek = z.infer<typeof DayOfWeekSchema>;

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'Segunda',
  TUESDAY: 'TerÃ§a',
  WEDNESDAY: 'Quarta',
  THURSDAY: 'Quinta',
  FRIDAY: 'Sexta',
  SATURDAY: 'SÃ¡bado',
  SUNDAY: 'Domingo',
};

// ============================================
// REGRAS DE PRECIFICAÃ‡ÃƒO
// ============================================

export const PricingRuleTypeSchema = z.enum(['SURGE', 'DEAL']);

export type PricingRuleType = z.infer<typeof PricingRuleTypeSchema>;

export const PricingRuleSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string().min(1),
  
  type: PricingRuleTypeSchema,
  
  // Modificador de preÃ§o (positivo = aumento, negativo = desconto)
  // Ex: 0.20 = +20%, -0.15 = -15%
  percentModifier: z.number().min(-0.99).max(1),
  
  // Dias da semana aplicÃ¡veis
  daysOfWeek: z.array(DayOfWeekSchema),
  
  // HorÃ¡rio de inÃ­cio e fim (formato HH:mm)
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  
  // ServiÃ§os aplicÃ¡veis (vazio = todos)
  serviceIds: z.array(z.string()).default([]),
  
  // Status
  isActive: z.boolean().default(true),
  
  // Prioridade (maior = aplicada primeiro em caso de conflito)
  priority: z.number().int().default(0),
  
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PricingRule = z.infer<typeof PricingRuleSchema>;

// ============================================
// SUGESTÃ•ES DE REGRAS (templates para o dono)
// ============================================

export type RuleSuggestion = {
  templateId: string;
  name: string;
  type: PricingRuleType;
  percentModifier: number;
  daysOfWeek: DayOfWeek[];
  startTime: string;
  endTime: string;
  description: string;
};

export const RULE_SUGGESTIONS: RuleSuggestion[] = [
  {
    templateId: 'saturday_morning_surge',
    name: 'SÃ¡bado ManhÃ£ Premium',
    type: 'SURGE',
    percentModifier: 0.20,
    daysOfWeek: ['SATURDAY'],
    startTime: '09:00',
    endTime: '12:00',
    description: '+20% no horÃ¡rio mais concorrido',
  },
  {
    templateId: 'monday_deal',
    name: 'Segunda Tranquila',
    type: 'DEAL',
    percentModifier: -0.15,
    daysOfWeek: ['MONDAY'],
    startTime: '14:00',
    endTime: '18:00',
    description: '-15% para atrair clientes na segunda',
  },
  {
    templateId: 'weekday_afternoon_deal',
    name: 'Tarde Promocional',
    type: 'DEAL',
    percentModifier: -0.10,
    daysOfWeek: ['TUESDAY', 'WEDNESDAY', 'THURSDAY'],
    startTime: '14:00',
    endTime: '16:00',
    description: '-10% para preencher horÃ¡rios ociosos',
  },
  {
    templateId: 'friday_evening_surge',
    name: 'Sexta Ã  Noite',
    type: 'SURGE',
    percentModifier: 0.15,
    daysOfWeek: ['FRIDAY'],
    startTime: '18:00',
    endTime: '21:00',
    description: '+15% antes do fim de semana',
  },
];

// ============================================
// RESULTADO DO CÃLCULO DE PREÃ‡O
// ============================================

export type PriceCalculation = {
  originalPrice: number;
  finalPrice: number;
  appliedRule: PricingRule | null;
  percentChange: number;
  savings: number;
};
