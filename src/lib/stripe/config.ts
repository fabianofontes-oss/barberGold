/**
 * Configuração do Stripe
 * 
 * Centraliza todas as configurações e constantes do Stripe
 */

export const STRIPE_CONFIG = {
  // API Keys (do .env)
  secretKey: process.env.STRIPE_SECRET_KEY!,
  publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  
  // URLs
  successUrl: process.env.NEXT_PUBLIC_SITE_URL + '/app/dashboard?checkout=success',
  cancelUrl: process.env.NEXT_PUBLIC_SITE_URL + '/pricing?checkout=cancelled',
  
  // Configurações
  currency: 'brl',
  billingPortalReturnUrl: process.env.NEXT_PUBLIC_SITE_URL + '/app/settings/billing',
} as const

/**
 * IDs dos produtos/prices do Stripe
 * 
 * IMPORTANTE: Após criar os produtos no Stripe Dashboard,
 * substitua esses IDs pelos IDs reais (price_xxxxx)
 */
export const STRIPE_PRICES = {
  FREE: null, // Free não tem price_id
  
  // SOLO (R$ 49,90/mês ou R$ 479,04/ano)
  SOLO_MONTHLY: process.env.STRIPE_PRICE_SOLO_MONTHLY || 'price_solo_monthly',
  SOLO_YEARLY: process.env.STRIPE_PRICE_SOLO_YEARLY || 'price_solo_yearly',
  
  // SOLO PRO (R$ 79,90/mês ou R$ 767,04/ano)
  SOLO_PRO_MONTHLY: process.env.STRIPE_PRICE_SOLO_PRO_MONTHLY || 'price_solo_pro_monthly',
  SOLO_PRO_YEARLY: process.env.STRIPE_PRICE_SOLO_PRO_YEARLY || 'price_solo_pro_yearly',
  
  // TEAM (R$ 149,90/mês ou R$ 1.439,04/ano)
  TEAM_MONTHLY: process.env.STRIPE_PRICE_TEAM_MONTHLY || 'price_team_monthly',
  TEAM_YEARLY: process.env.STRIPE_PRICE_TEAM_YEARLY || 'price_team_yearly',
  
  // PREMIUM (R$ 249,90/mês ou R$ 2.399,04/ano)
  PREMIUM_MONTHLY: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || 'price_premium_monthly',
  PREMIUM_YEARLY: process.env.STRIPE_PRICE_PREMIUM_YEARLY || 'price_premium_yearly',
  
  // ENTERPRISE (R$ 499,90/mês ou R$ 4.799,04/ano)
  ENTERPRISE_MONTHLY: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_enterprise_monthly',
  ENTERPRISE_YEARLY: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || 'price_enterprise_yearly',
} as const

/**
 * Mapeamento de plan_id para Stripe price_id
 */
export function getPriceId(planSlug: string, interval: 'month' | 'year'): string | null {
  const key = `${planSlug.toUpperCase()}_${interval === 'month' ? 'MONTHLY' : 'YEARLY'}` as keyof typeof STRIPE_PRICES
  return STRIPE_PRICES[key] || null
}

/**
 * Extrai plan_slug e interval de um price_id
 */
export function parsePriceId(priceId: string): { planSlug: string; interval: 'month' | 'year' } | null {
  for (const [key, value] of Object.entries(STRIPE_PRICES)) {
    if (value === priceId) {
      const [plan, interval] = key.split('_')
      
      // Tratar SOLO_PRO
      const planSlug = key.startsWith('SOLO_PRO') 
        ? 'SOLO_PRO' 
        : plan
      
      return {
        planSlug: planSlug.toLowerCase().replace('_', '-'),
        interval: interval === 'MONTHLY' ? 'month' : 'year',
      }
    }
  }
  
  return null
}

/**
 * Validação de configuração
 */
export function validateStripeConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!STRIPE_CONFIG.secretKey || STRIPE_CONFIG.secretKey === 'your-stripe-secret-key') {
    errors.push('STRIPE_SECRET_KEY não configurada')
  }
  
  if (!STRIPE_CONFIG.publicKey || STRIPE_CONFIG.publicKey === 'your-stripe-public-key') {
    errors.push('NEXT_PUBLIC_STRIPE_PUBLIC_KEY não configurada')
  }
  
  if (!STRIPE_CONFIG.webhookSecret) {
    errors.push('STRIPE_WEBHOOK_SECRET não configurada')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

