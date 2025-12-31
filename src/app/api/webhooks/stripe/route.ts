import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';
import Stripe from 'stripe';

/**
 * Webhook do Stripe para processar eventos de pagamento
 * Requer SUPABASE_SERVICE_ROLE_KEY para bypass de RLS
 * 
 * Eventos suportados:
 * - checkout.session.completed: Nova assinatura (trial ou pagamento direto)
 * - customer.subscription.updated: Mudança de status (trial -> active, renovação, etc)
 * - customer.subscription.deleted: Cancelamento ou falha de pagamento
 * - customer.subscription.trial_will_end: Aviso 3 dias antes do fim do trial
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

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // Processar eventos
    switch (event.type) {
        // A: CLIENTE ASSINOU (Início do Trial ou Pagamento Direto)
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            
            if (session.mode === 'subscription') {
                const tenantId = session.metadata?.tenantId;
                const subscriptionId = session.subscription as string;
                const customerId = session.customer as string;

                if (tenantId) {
                    // Buscar detalhes da subscription para verificar se é trial
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    const isTrialing = subscription.status === 'trialing';

                    const { error } = await supabaseAdmin
                        .from('tenants')
                        .update({
                            subscription_status: isTrialing ? 'TRIAL' : 'ACTIVE',
                            stripe_subscription_id: subscriptionId,
                            stripe_customer_id: customerId,
                            trial_ends_at: isTrialing && subscription.trial_end 
                                ? new Date(subscription.trial_end * 1000).toISOString() 
                                : null
                        })
                        .eq('id', tenantId);

                    if (error) {
                        console.error('❌ Erro ao atualizar tenant:', error);
                        return new NextResponse('Internal Server Error', { status: 500 });
                    }
                    
                    console.log(`✅ Nova assinatura iniciada: ${subscriptionId} (${isTrialing ? 'TRIAL' : 'ACTIVE'})`);
                }
            }
            break;
        }

        // B: MUDANÇA DE STATUS (Trial acabou e virou pago, renovação, falha de pagamento)
        case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            // Mapear status do Stripe para status do sistema
            let subscriptionStatus: string;
            switch (subscription.status) {
                case 'active':
                    subscriptionStatus = 'ACTIVE';
                    break;
                case 'trialing':
                    subscriptionStatus = 'TRIAL';
                    break;
                case 'past_due':
                    subscriptionStatus = 'OVERDUE';
                    break;
                case 'canceled':
                case 'unpaid':
                    subscriptionStatus = 'SUSPENDED';
                    break;
                default:
                    subscriptionStatus = 'TRIAL';
            }

            const { error } = await supabaseAdmin
                .from('tenants')
                .update({
                    subscription_status: subscriptionStatus,
                    trial_ends_at: subscription.status === 'trialing' && subscription.trial_end
                        ? new Date(subscription.trial_end * 1000).toISOString()
                        : null
                })
                .eq('stripe_customer_id', customerId);

            if (error) {
                console.error('❌ Erro ao atualizar subscription:', error);
            } else {
                console.log(`🔄 Assinatura atualizada. Status: ${subscriptionStatus}`);
            }
            break;
        }

        // C: CLIENTE CANCELOU (ou cartão falhou várias vezes)
        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            const { error } = await supabaseAdmin
                .from('tenants')
                .update({
                    subscription_status: 'CANCELLED',
                    stripe_subscription_id: null
                })
                .eq('stripe_customer_id', customerId);

            if (error) {
                console.error('❌ Erro ao cancelar subscription:', error);
            } else {
                console.log(`❌ Assinatura cancelada: ${subscription.id}`);
            }
            break;
        }

        // D: AVISO DE FIM DE TRIAL (3 dias antes)
        case 'customer.subscription.trial_will_end': {
            const subscription = event.data.object as Stripe.Subscription;
            console.log(`⚠️ Trial acaba em 3 dias: ${subscription.id}`);
            // TODO: Implementar envio de email de aviso
            break;
        }

        default:
            console.log(`🤷 Evento não tratado: ${event.type}`);
    }

    return new NextResponse(null, { status: 200 });
}
