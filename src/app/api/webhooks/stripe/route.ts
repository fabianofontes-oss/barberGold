/**
 * Webhook Handler Stripe
 * 
 * Recebe eventos do Stripe e atualiza o banco de dados
 * 
 * Eventos tratados:
 * - checkout.session.completed: Nova assinatura criada
 * - customer.subscription.updated: Assinatura modificada
 * - customer.subscription.deleted: Assinatura cancelada
 * - invoice.payment_succeeded: Pagamento bem sucedido
 * - invoice.payment_failed: Falha no pagamento
 */

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { getStripeClient } from '@/lib/stripe/client'
import { STRIPE_CONFIG, parsePriceId } from '@/lib/stripe/config'
import { createClient } from '@/lib/supabase/server'

/**
 * Configuração do Edge Runtime
 */
export const runtime = 'nodejs'

/**
 * POST /api/webhooks/stripe
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')
    
    if (!signature) {
      console.error('Webhook: Missing stripe-signature header')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }
    
    const stripe = getStripeClient()
    
    // Verificar assinatura do webhook
    let event: Stripe.Event
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_CONFIG.webhookSecret
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }
    
    console.log(`[Webhook] Received event: ${event.type}`)
    
    // Processar evento
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break
      
      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`)
    }
    
    return NextResponse.json({ received: true })
    
  } catch (error: any) {
    console.error('[Webhook] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook error' },
      { status: 500 }
    )
  }
}

/**
 * Checkout completado - nova assinatura
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const tenantId = session.metadata?.tenant_id
    
    if (!tenantId) {
      console.error('[Webhook] Missing tenant_id in metadata')
      return
    }
    
    const supabase = await createClient()
    
    // Buscar subscription para pegar o price_id
    if (session.subscription) {
      const stripe = getStripeClient()
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      )
      
      const priceId = subscription.items.data[0]?.price.id
      const planInfo = priceId ? parsePriceId(priceId) : null
      
      // Atualizar tenant
      await supabase
        .from('tenants')
        .update({
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', tenantId)
      
      console.log(`[Webhook] Checkout completed for tenant ${tenantId}`)
      
      // Criar registro de invoice
      if (session.invoice) {
        await createInvoiceRecord(
          supabase,
          tenantId,
          session.invoice as string,
          subscription.id,
          'paid'
        )
      }
    }
    
  } catch (error) {
    console.error('[Webhook] handleCheckoutCompleted error:', error)
    throw error
  }
}

/**
 * Assinatura atualizada (upgrade/downgrade/renewal)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const tenantId = subscription.metadata?.tenant_id
    
    if (!tenantId) {
      console.error('[Webhook] Missing tenant_id in metadata')
      return
    }
    
    const supabase = await createClient()
    
    // Determinar status
    let status: 'active' | 'suspended' | 'cancelled' = 'active'
    
    if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
      status = 'cancelled'
    } else if (subscription.status === 'past_due' || subscription.status === 'incomplete') {
      status = 'suspended'
    }
    
    // Atualizar tenant
    await supabase
      .from('tenants')
      .update({
        stripe_subscription_id: subscription.id,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)
    
    console.log(`[Webhook] Subscription updated for tenant ${tenantId}: ${status}`)
    
  } catch (error) {
    console.error('[Webhook] handleSubscriptionUpdated error:', error)
    throw error
  }
}

/**
 * Assinatura cancelada
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const tenantId = subscription.metadata?.tenant_id
    
    if (!tenantId) {
      console.error('[Webhook] Missing tenant_id in metadata')
      return
    }
    
    const supabase = await createClient()
    
    // Downgrade para FREE
    await supabase
      .from('tenants')
      .update({
        status: 'active', // Mantém ativo mas sem plano pago
        stripe_subscription_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)
    
    console.log(`[Webhook] Subscription deleted for tenant ${tenantId} - downgraded to FREE`)
    
  } catch (error) {
    console.error('[Webhook] handleSubscriptionDeleted error:', error)
    throw error
  }
}

/**
 * Pagamento de fatura bem sucedido
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const tenantId = invoice.subscription_details?.metadata?.tenant_id
    
    if (!tenantId) {
      console.error('[Webhook] Missing tenant_id in invoice')
      return
    }
    
    const supabase = await createClient()
    
    // Criar/atualizar registro de invoice
    await createInvoiceRecord(
      supabase,
      tenantId,
      invoice.id,
      invoice.subscription as string | null,
      'paid'
    )
    
    // Garantir que tenant está ativo
    await supabase
      .from('tenants')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)
    
    console.log(`[Webhook] Invoice payment succeeded for tenant ${tenantId}`)
    
  } catch (error) {
    console.error('[Webhook] handleInvoicePaymentSucceeded error:', error)
    throw error
  }
}

/**
 * Falha no pagamento de fatura
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const tenantId = invoice.subscription_details?.metadata?.tenant_id
    
    if (!tenantId) {
      console.error('[Webhook] Missing tenant_id in invoice')
      return
    }
    
    const supabase = await createClient()
    
    // Criar/atualizar registro de invoice
    await createInvoiceRecord(
      supabase,
      tenantId,
      invoice.id,
      invoice.subscription as string | null,
      'failed'
    )
    
    // Suspender tenant após falha
    await supabase
      .from('tenants')
      .update({
        status: 'suspended',
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId)
    
    console.log(`[Webhook] Invoice payment failed for tenant ${tenantId} - suspended`)
    
    // TODO: Enviar email notificando falha no pagamento
    
  } catch (error) {
    console.error('[Webhook] handleInvoicePaymentFailed error:', error)
    throw error
  }
}

/**
 * Helper: Criar registro de invoice no banco
 */
async function createInvoiceRecord(
  supabase: any,
  tenantId: string,
  invoiceId: string,
  subscriptionId: string | null,
  status: 'paid' | 'failed'
) {
  try {
    const stripe = getStripeClient()
    const invoice = await stripe.invoices.retrieve(invoiceId)
    
    // Verificar se já existe
    const { data: existing } = await supabase
      .from('saas_invoices')
      .select('id')
      .eq('stripe_invoice_id', invoiceId)
      .single()
    
    if (existing) {
      // Atualizar
      await supabase
        .from('saas_invoices')
        .update({
          status,
          paid_at: status === 'paid' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_invoice_id', invoiceId)
    } else {
      // Criar novo
      await supabase
        .from('saas_invoices')
        .insert({
          tenant_id: tenantId,
          stripe_invoice_id: invoiceId,
          stripe_subscription_id: subscriptionId,
          amount: invoice.total / 100, // Converter de centavos
          currency: invoice.currency,
          status,
          invoice_pdf: invoice.invoice_pdf,
          hosted_invoice_url: invoice.hosted_invoice_url,
          paid_at: status === 'paid' ? new Date().toISOString() : null,
        })
    }
    
  } catch (error) {
    console.error('[Webhook] createInvoiceRecord error:', error)
    // Não fazer throw aqui para não quebrar o webhook
  }
}

