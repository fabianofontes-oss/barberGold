import { z } from 'zod';

// ============================================
// PLANOS DE ASSINATURA (configurados pelo dono)
// ============================================

export const MembershipPlanSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string().min(1, 'Nome obrigatório'),
  description: z.string().optional(),
  
  // Preço mensal definido pelo dono
  monthlyPriceBRL: z.number().min(0),
  
  // Créditos inclusos por mês
  monthlyCredits: z.number().int().min(1),
  
  // Serviços elegíveis (IDs) - vazio = todos
  eligibleServiceIds: z.array(z.string()).default([]),
  
  // Desconto em serviços extras (além dos créditos)
  extraServiceDiscountPercent: z.number().min(0).max(100).default(0),
  
  // Desconto em produtos
  productDiscountPercent: z.number().min(0).max(100).default(0),
  
  // Benefícios extras (ex: "Cerveja grátis", "Prioridade na fila")
  perks: z.array(z.string()).default([]),
  
  // Status
  isActive: z.boolean().default(true),
  
  // Ordem de exibição
  displayOrder: z.number().int().default(0),
  
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MembershipPlan = z.infer<typeof MembershipPlanSchema>;

// ============================================
// SUGESTÕES DE PLANOS (templates para o dono)
// ============================================

export type PlanSuggestion = {
  templateId: string;
  name: string;
  description: string;
  monthlyPriceBRL: number;
  monthlyCredits: number;
  extraServiceDiscountPercent: number;
  productDiscountPercent: number;
  perks: string[];
  tier: 'BASIC' | 'POPULAR' | 'PREMIUM';
};

export const PLAN_SUGGESTIONS: PlanSuggestion[] = [
  {
    templateId: 'basic',
    name: 'Plano Básico',
    description: 'Para quem corta 1x por mês',
    monthlyPriceBRL: 59,
    monthlyCredits: 1,
    extraServiceDiscountPercent: 10,
    productDiscountPercent: 5,
    perks: [],
    tier: 'BASIC',
  },
  {
    templateId: 'popular',
    name: 'Plano Mensal',
    description: 'Para quem mantém o visual em dia',
    monthlyPriceBRL: 99,
    monthlyCredits: 2,
    extraServiceDiscountPercent: 15,
    productDiscountPercent: 10,
    perks: ['Agendamento prioritário'],
    tier: 'POPULAR',
  },
  {
    templateId: 'premium',
    name: 'Plano VIP',
    description: 'Acesso ilimitado e benefícios exclusivos',
    monthlyPriceBRL: 179,
    monthlyCredits: 4,
    extraServiceDiscountPercent: 20,
    productDiscountPercent: 15,
    perks: ['Agendamento prioritário', 'Cerveja/café grátis', 'Barba inclusa'],
    tier: 'PREMIUM',
  },
];

// ============================================
// ASSINATURA DO CLIENTE
// ============================================

export const SubscriptionStatusSchema = z.enum([
  'ACTIVE',
  'PAUSED',
  'CANCELLED',
  'OVERDUE',
  'PENDING_PAYMENT',
]);

export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;

export const SubscriptionSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  clientId: z.string(),
  planId: z.string(),
  
  status: SubscriptionStatusSchema,
  
  // Data de início e renovação
  startDate: z.date(),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  
  // Créditos restantes no período atual
  creditsRemaining: z.number().int().min(0),
  
  // Histórico de pagamentos (simplificado)
  lastPaymentDate: z.date().optional(),
  nextPaymentDate: z.date().optional(),
  
  // Cancelamento
  cancelledAt: z.date().optional(),
  cancelReason: z.string().optional(),
  
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

// ============================================
// HISTÓRICO DE USO DE CRÉDITOS
// ============================================

export const CreditUsageSchema = z.object({
  id: z.string(),
  subscriptionId: z.string(),
  clientId: z.string(),
  tenantId: z.string(),
  
  // Serviço resgatado
  serviceId: z.string(),
  serviceName: z.string(),
  
  // Barbeiro que atendeu
  staffId: z.string().optional(),
  staffName: z.string().optional(),
  
  // Valor economizado (preço cheio - 0)
  savedAmountBRL: z.number(),
  
  usedAt: z.date(),
});

export type CreditUsage = z.infer<typeof CreditUsageSchema>;

// ============================================
// DASHBOARD STATS
// ============================================

export type ClubDashboardStats = {
  totalActiveSubscribers: number;
  totalMRR: number;
  creditsUsedThisMonth: number;
  creditsRemainingThisMonth: number;
  churnRate: number;
  averageTicketWithClub: number;
  averageTicketWithoutClub: number;
};
