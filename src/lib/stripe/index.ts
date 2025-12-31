import Stripe from 'stripe';

/**
 * Cliente Stripe para operações server-side
 * Requer STRIPE_SECRET_KEY configurada
 * 
 * Nota: A validação é feita em runtime (não em build time) para permitir builds
 * sem todas as env vars configuradas
 */

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      'STRIPE_SECRET_KEY não configurada. Configure esta variável de ambiente para usar integrações Stripe.'
    );
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
    appInfo: {
      name: 'BarberFlow SaaS',
      version: '0.1.0',
    },
    typescript: true,
  });
}

// Lazy initialization: só cria o cliente quando realmente usado
let _stripe: Stripe | null = null;

export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    if (!_stripe) {
      _stripe = getStripeClient();
    }
    return (_stripe as any)[prop];
  },
});

export const getStripeSession = async (priceId: string, tenantId: string, userId: string) => {
    // Cria sessão de checkout
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        subscription_data: {
            metadata: {
                tenantId,
                userId
            },
        },
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
        metadata: {
            tenantId,
            userId,
        },
    });

    return session;
};
