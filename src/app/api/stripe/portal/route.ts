/**
 * API Route: Criar sessão do Billing Portal Stripe
 * 
 * POST /api/stripe/portal
 */

import { NextRequest, NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe/client'
import { STRIPE_CONFIG } from '@/lib/stripe/config'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
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
      .select('tenant_id')
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
      .select('stripe_customer_id')
      .eq('id', profile.tenant_id)
      .single()
    
    if (tenantError || !tenant || !tenant.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Cliente Stripe não encontrado' },
        { status: 400 }
      )
    }
    
    const stripe = getStripeClient()
    
    // Criar sessão do portal
    const session = await stripe.billingPortal.sessions.create({
      customer: tenant.stripe_customer_id,
      return_url: STRIPE_CONFIG.billingPortalReturnUrl,
    })
    
    return NextResponse.json({
      success: true,
      url: session.url,
    })
    
  } catch (error: any) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar portal' },
      { status: 500 }
    )
  }
}


