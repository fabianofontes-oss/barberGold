/**
 * Cliente Stripe Server-Side
 * 
 * Inicializa o Stripe SDK para uso em Server Actions e API Routes
 */

import Stripe from 'stripe'
import { STRIPE_CONFIG } from './config'

// Singleton do cliente Stripe
let stripeInstance: Stripe | null = null

/**
 * Retorna instância do Stripe (singleton)
 */
export function getStripeClient(): Stripe {
  if (stripeInstance) {
    return stripeInstance
  }
  
  if (!STRIPE_CONFIG.secretKey) {
    throw new Error('STRIPE_SECRET_KEY não configurada. Adicione ao .env.local')
  }
  
  stripeInstance = new Stripe(STRIPE_CONFIG.secretKey, {
    apiVersion: '2024-11-20.acacia',
    typescript: true,
    appInfo: {
      name: 'BarberFlow',
      version: '1.0.0',
      url: 'https://barber.gold',
    },
  })
  
  return stripeInstance
}

/**
 * Alias para manter consistência
 */
export const stripe = getStripeClient()

