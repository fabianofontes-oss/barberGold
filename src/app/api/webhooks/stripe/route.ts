import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Configurar Supabase Admin (para liberar acesso sem estar logado)
// Configurar Supabase Admin (para liberar acesso sem estar logado)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'service_role_key_mock'
);

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === 'checkout.session.completed') {
        const tenantId = session.metadata.tenantId;

        // Atualizar Tenant para status ATIVO
        if (tenantId) {
            await supabaseAdmin
                .from('tenants')
                .update({
                    subscription_status: 'active',
                    stripe_subscription_id: session.subscription,
                    stripe_customer_id: session.customer
                })
                .eq('id', tenantId);
        }
    }

    return new NextResponse(null, { status: 200 });
}
