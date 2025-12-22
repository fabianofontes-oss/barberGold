import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_mock_key', {
    apiVersion: '2025-12-15.clover', // Use a versão mais recente compatível com a lib installed
    appInfo: {
        name: 'BarberFlow SaaS',
        version: '0.1.0',
    },
    typescript: true,
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
