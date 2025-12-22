/**
 * Produtos e Planos do Stripe
 * 
 * Mapeia os planos do BarberFlow para produtos Stripe
 */

import { STRIPE_PRICES, getPriceId } from './config'

export interface StripePlan {
  slug: string
  name: string
  priceMonthly: number
  priceYearly: number
  stripePriceMonthly: string | null
  stripePriceYearly: string | null
  features: string[]
  popular?: boolean
  cta: string
}

/**
 * Definição completa dos planos
 * 
 * Preços com 20% de desconto no anual:
 * - Mensal: preço cheio
 * - Anual: preço mensal * 12 * 0.8
 */
export const STRIPE_PLANS: StripePlan[] = [
  {
    slug: 'free',
    name: 'FREE',
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceMonthly: null,
    stripePriceYearly: null,
    features: [
      '1 barbeiro/profissional',
      'Até 30 agendamentos/mês',
      'Gestão básica de clientes',
      'Agenda simples',
      'Sem comissões',
      'Sem agendamento online',
    ],
    cta: 'Começar Grátis',
  },
  {
    slug: 'solo',
    name: 'SOLO',
    priceMonthly: 49.90,
    priceYearly: 479.04, // 49.90 * 12 * 0.8
    stripePriceMonthly: STRIPE_PRICES.SOLO_MONTHLY,
    stripePriceYearly: STRIPE_PRICES.SOLO_YEARLY,
    features: [
      '1 barbeiro/profissional',
      'Agendamentos ilimitados',
      'Gestão completa de clientes',
      'PDV + vendas',
      'Relatórios básicos',
      'Suporte por email',
    ],
    cta: 'Começar Agora',
  },
  {
    slug: 'solo-pro',
    name: 'SOLO PRO',
    priceMonthly: 79.90,
    priceYearly: 767.04, // 79.90 * 12 * 0.8
    stripePriceMonthly: STRIPE_PRICES.SOLO_PRO_MONTHLY,
    stripePriceYearly: STRIPE_PRICES.SOLO_PRO_YEARLY,
    popular: true,
    features: [
      'Tudo do SOLO +',
      'Agendamento online para clientes',
      'Sistema de comissões',
      'Programa de fidelidade',
      'Relatórios avançados',
      'WhatsApp integrado',
      'Suporte prioritário',
    ],
    cta: 'Mais Popular',
  },
  {
    slug: 'team',
    name: 'TEAM',
    priceMonthly: 149.90,
    priceYearly: 1439.04, // 149.90 * 12 * 0.8
    stripePriceMonthly: STRIPE_PRICES.TEAM_MONTHLY,
    stripePriceYearly: STRIPE_PRICES.TEAM_YEARLY,
    features: [
      'Tudo do SOLO PRO +',
      'Até 5 barbeiros',
      'Gestão de estoque',
      'Múltiplas agendas',
      'Controle de caixa avançado',
      'Relatórios por profissional',
      'Customização avançada',
    ],
    cta: 'Para Times',
  },
  {
    slug: 'premium',
    name: 'PREMIUM',
    priceMonthly: 249.90,
    priceYearly: 2399.04, // 249.90 * 12 * 0.8
    stripePriceMonthly: STRIPE_PRICES.PREMIUM_MONTHLY,
    stripePriceYearly: STRIPE_PRICES.PREMIUM_YEARLY,
    features: [
      'Tudo do TEAM +',
      'Até 10 barbeiros',
      'Multi-unidade (3 unidades)',
      'API de integração',
      'Dashboards personalizados',
      'Backup automático',
      'Suporte 24/7',
    ],
    cta: 'Para Empresas',
  },
  {
    slug: 'enterprise',
    name: 'ENTERPRISE',
    priceMonthly: 499.90,
    priceYearly: 4799.04, // 499.90 * 12 * 0.8
    stripePriceMonthly: STRIPE_PRICES.ENTERPRISE_MONTHLY,
    stripePriceYearly: STRIPE_PRICES.ENTERPRISE_YEARLY,
    features: [
      'Tudo do PREMIUM +',
      'Barbeiros ilimitados',
      'Unidades ilimitadas',
      'White-label (marca própria)',
      'Servidor dedicado',
      'SLA garantido',
      'Gerente de conta dedicado',
      'Treinamento personalizado',
    ],
    cta: 'Falar com Vendas',
  },
]

/**
 * Busca plano pelo slug
 */
export function getPlanBySlug(slug: string): StripePlan | null {
  return STRIPE_PLANS.find(p => p.slug === slug) || null
}

/**
 * Busca plano pelo price_id do Stripe
 */
export function getPlanByPriceId(priceId: string): StripePlan | null {
  for (const plan of STRIPE_PLANS) {
    if (plan.stripePriceMonthly === priceId || plan.stripePriceYearly === priceId) {
      return plan
    }
  }
  return null
}

/**
 * Calcula economia anual em %
 */
export function getAnnualDiscount(): number {
  return 20 // 20% de desconto
}

/**
 * Formata preço em BRL
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

/**
 * Retorna todos os planos pagos (sem FREE)
 */
export function getPaidPlans(): StripePlan[] {
  return STRIPE_PLANS.filter(p => p.slug !== 'free')
}

