/**
 * API Route: Criar sessão de checkout Stripe
 * 
 * POST /api/stripe/checkout
 * Body: { priceId: string, tenantId: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe/client'
import { STRIPE_CONFIG } from '@/lib/stripe/config'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { priceId, interval = 'month' } = body
    
    // Validar autenticação
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }
    
    // Buscar profile e tenant
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tenant_id, email, full_name')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile || !profile.tenant_id) {
      return NextResponse.json(
        { error: 'Profile ou tenant não encontrado' },
        { status: 400 }
      )
    }
    
    // Buscar tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('id, name, slug, stripe_customer_id')
      .eq('id', profile.tenant_id)
      .single()
    
    if (tenantError || !tenant) {
      return NextResponse.json(
        { error: 'Tenant não encontrado' },
        { status: 400 }
      )
    }
    
    const stripe = getStripeClient()
    
    // Criar ou recuperar customer
    let customerId = tenant.stripe_customer_id
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email || user.email || '',
        name: profile.full_name || tenant.name,
        metadata: {
          tenant_id: tenant.id,
          user_id: user.id,
        },
      })
      
      customerId = customer.id
      
      // Salvar customer_id no tenant
      await supabase
        .from('tenants')
        .update({ stripe_customer_id: customerId })
        .eq('id', tenant.id)
    }
    
    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: STRIPE_CONFIG.successUrl,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      metadata: {
        tenant_id: tenant.id,
        user_id: user.id,
      },
      subscription_data: {
        metadata: {
          tenant_id: tenant.id,
          user_id: user.id,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      locale: 'pt-BR',
    })
    
    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
    
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar checkout' },
      { status: 500 }
    )
  }
}

