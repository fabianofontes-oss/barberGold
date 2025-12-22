const Stripe = require('stripe');
// Tenta pegar do .env ou espera argumento
const stripeKey = process.env.STRIPE_SECRET_KEY || process.argv[2];

if (!stripeKey) {
  console.error('❌ ERRO: Stripe Secret Key não fornecida.');
  console.error('Uso: node seed-stripe.js sk_test_...');
  process.exit(1);
}

const stripe = new Stripe(stripeKey);

const plans = [
  { id: 'SOLO', name: 'BarberFlow Solo', monthly: 4990, yearly: 47904 },
  { id: 'SOLO_PRO', name: 'BarberFlow Solo Pro', monthly: 7990, yearly: 76704 },
  { id: 'TEAM', name: 'BarberFlow Team', monthly: 14990, yearly: 143904 },
  { id: 'PREMIUM', name: 'BarberFlow Premium', monthly: 24990, yearly: 239904 },
  { id: 'ENTERPRISE', name: 'BarberFlow Enterprise', monthly: 49990, yearly: 479904 },
];

async function seed() {
  console.log('🚀 Iniciando sincronização com Stripe...');
  console.log('\n👇 COPIE O RESULTADO ABAIXO PARA SEU .ENV 👇\n');

  for (const plan of plans) {
    try {
      // 1. Criar Produto
      const product = await stripe.products.create({ 
        name: plan.name,
        metadata: { saas_plan_id: plan.id }
      });
      
      // 2. Criar Preços
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

      // Output formatado
      console.log(`# ${plan.name}`);
      console.log(`STRIPE_PRICE_${plan.id}_MONTHLY=${priceMonth.id}`);
      console.log(`STRIPE_PRICE_${plan.id}_YEARLY=${priceYear.id}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Erro em ${plan.name}:`, error.message);
    }
  }
}

seed();

