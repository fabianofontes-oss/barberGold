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
  TUESDAY: 'Terça',
  WEDNESDAY: 'Quarta',
  THURSDAY: 'Quinta',
  FRIDAY: 'Sexta',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};

// ============================================
// REGRAS DE PRECIFICAÇÃO
// ============================================

export const PricingRuleTypeSchema = z.enum(['SURGE', 'DEAL']);

export type PricingRuleType = z.infer<typeof PricingRuleTypeSchema>;

export const PricingRuleSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string().min(1),
  
  type: PricingRuleTypeSchema,
  
  // Modificador de preço (positivo = aumento, negativo = desconto)
  // Ex: 0.20 = +20%, -0.15 = -15%
  percentModifier: z.number().min(-0.99).max(1),
  
  // Dias da semana aplicáveis
  daysOfWeek: z.array(DayOfWeekSchema),
  
  // Horário de início e fim (formato HH:mm)
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  
  // Serviços aplicáveis (vazio = todos)
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
// SUGESTÕES DE REGRAS (templates para o dono)
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
    name: 'Sábado Manhã Premium',
    type: 'SURGE',
    percentModifier: 0.20,
    daysOfWeek: ['SATURDAY'],
    startTime: '09:00',
    endTime: '12:00',
    description: '+20% no horário mais concorrido',
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
    description: '-10% para preencher horários ociosos',
  },
  {
    templateId: 'friday_evening_surge',
    name: 'Sexta à Noite',
    type: 'SURGE',
    percentModifier: 0.15,
    daysOfWeek: ['FRIDAY'],
    startTime: '18:00',
    endTime: '21:00',
    description: '+15% antes do fim de semana',
  },
];

// ============================================
// RESULTADO DO CÁLCULO DE PREÇO
// ============================================

export type PriceCalculation = {
  originalPrice: number;
  finalPrice: number;
  appliedRule: PricingRule | null;
  percentChange: number;
  savings: number;
};
