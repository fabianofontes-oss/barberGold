const Stripe = require('stripe');

// 👇👇👇 COLE SUA CHAVE SK_TEST DENTRO DAS ASPAS ABAIXO 👇👇👇
const stripe = new Stripe('sk_test_51ShB5oFsUilypLmdTCryuTj92wOYt4gndc20KZlKKRewcaBzb3IHn8TmChm6CYXBpYcPSB1u3FvBMBcAgSW8yKWw00K40Yc79G'); 

const plans = [
  { id: 'SOLO', name: 'BarberFlow Solo', monthly: 4990, yearly: 47904 },
  { id: 'SOLO_PRO', name: 'BarberFlow Solo Pro', monthly: 7990, yearly: 76704 },
  { id: 'TEAM', name: 'BarberFlow Team', monthly: 14990, yearly: 143904 },
  { id: 'PREMIUM', name: 'BarberFlow Premium', monthly: 24990, yearly: 239904 },
  { id: 'ENTERPRISE', name: 'BarberFlow Enterprise', monthly: 49990, yearly: 479904 },
];

async function seed() {
  console.log('🚀 Iniciando...');
  console.log('\n👇 COPIE O RESULTADO ABAIXO PARA SEU ARQUIVO .ENV.LOCAL 👇\n');

  for (const plan of plans) {
    try {
      const product = await stripe.products.create({ 
        name: plan.name,
        metadata: { saas_plan_id: plan.id }
      });
      
      const priceMonth = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.monthly,
        currency: 'brl',
        recurring: { interval: 'month' },
        nickname: `${plan.name} Mensal`
      });

      const priceYear = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.yearly,
        currency: 'brl',
        recurring: { interval: 'year' },
        nickname: `${plan.name} Anual`
      });

      console.log(`STRIPE_PRICE_${plan.id}_MONTHLY=${priceMonth.id}`);
      console.log(`STRIPE_PRICE_${plan.id}_YEARLY=${priceYear.id}`);
      
    } catch (error) {
      console.error(`❌ Erro no plano ${plan.name}:`, error.message);
    }
  }
}

seed();