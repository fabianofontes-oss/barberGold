import Stripe from 'stripe';

/**
 * Cliente Stripe para operaÃ§Ãµes server-side
 * Requer STRIPE_SECRET_KEY configurada
 * 
 * Nota: A validaÃ§Ã£o Ã© feita em runtime (nÃ£o em build time) para permitir builds
 * sem todas as env vars configuradas
 */

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      'STRIPE_SECRET_KEY nÃ£o configurada. Configure esta variÃ¡vel de ambiente para usar integraÃ§Ãµes Stripe.'
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

// Lazy initialization: sÃ³ cria o cliente quando realmente usado
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
    // Cria sessÃ£o de checkout
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
