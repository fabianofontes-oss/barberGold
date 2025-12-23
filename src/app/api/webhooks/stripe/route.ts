import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

/**
 * Webhook do Stripe para processar eventos de pagamento
 * Requer SUPABASE_SERVICE_ROLE_KEY para bypass de RLS
 */

export async function POST(req: Request) {
    // Validar env obrigatórias (runtime)
    if (!env.NEXT_PUBLIC_SUPABASE_URL) {
        return new NextResponse('NEXT_PUBLIC_SUPABASE_URL não configurada', { status: 500 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return new NextResponse('SUPABASE_SERVICE_ROLE_KEY não configurada', { status: 500 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        return new NextResponse('STRIPE_WEBHOOK_SECRET não configurada', { status: 500 });
    }

    // Configurar Supabase Admin (bypassa RLS para operações de webhook)
    const supabaseAdmin = createClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET! // Safe: validado acima
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === 'checkout.session.completed') {
        const tenantId = session.metadata.tenantId;

        // Atualizar Tenant para status ATIVO
        if (tenantId) {
            const { error } = await supabaseAdmin
                .from('tenants')
                .update({
                    subscription_status: 'ACTIVE',
                    stripe_subscription_id: session.subscription,
                    stripe_customer_id: session.customer
                })
                .eq('id', tenantId);

            if (error) {
                console.error('Erro ao atualizar tenant:', error);
                return new NextResponse(`Database Error: ${error.message}`, { status: 500 });
            }
        }
    }

    return new NextResponse(null, { status: 200 });
}
