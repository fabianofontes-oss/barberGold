# 🔐 Configuração do Stripe

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao seu `.env.local`:

```bash
# ============================================
# STRIPE CONFIGURATION
# ============================================

# Chaves da API Stripe (Dashboard > Developers > API Keys)
STRIPE_SECRET_KEY=sk_test_xxxxx  # Modo test: sk_test_ | Modo live: sk_live_
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxx  # Modo test: pk_test_ | Modo live: pk_live_

# Webhook Secret (Dashboard > Developers > Webhooks)
# Após criar o webhook endpoint, copie o "Signing secret"
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# ============================================
# PRICE IDs (Dashboard > Products)
# ============================================

# SOLO (R$ 49,90/mês ou R$ 479,04/ano)
STRIPE_PRICE_SOLO_MONTHLY=price_xxxxx
STRIPE_PRICE_SOLO_YEARLY=price_xxxxx

# SOLO PRO (R$ 79,90/mês ou R$ 767,04/ano)
STRIPE_PRICE_SOLO_PRO_MONTHLY=price_xxxxx
STRIPE_PRICE_SOLO_PRO_YEARLY=price_xxxxx

# TEAM (R$ 149,90/mês ou R$ 1.439,04/ano)
STRIPE_PRICE_TEAM_MONTHLY=price_xxxxx
STRIPE_PRICE_TEAM_YEARLY=price_xxxxx

# PREMIUM (R$ 249,90/mês ou R$ 2.399,04/ano)
STRIPE_PRICE_PREMIUM_MONTHLY=price_xxxxx
STRIPE_PRICE_PREMIUM_YEARLY=price_xxxxx

# ENTERPRISE (R$ 499,90/mês ou R$ 4.799,04/ano)
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_xxxxx
STRIPE_PRICE_ENTERPRISE_YEARLY=price_xxxxx
```

## 📋 Passo a Passo: Setup Completo

### 1. Criar Conta Stripe

1. Acesse https://dashboard.stripe.com/register
2. Crie sua conta (use email corporativo)
3. Preencha informações da empresa
4. Ative modo de teste (toggle no canto superior direito)

### 2. Obter API Keys

1. Acesse: Dashboard > Developers > API Keys
2. Copie:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`
3. ⚠️ NUNCA commite a Secret Key!

### 3. Criar Produtos e Preços

Execute o script para criar automaticamente:

```bash
npm run stripe:setup-products
```

Ou crie manualmente:

#### Produto: SOLO
- Nome: BarberFlow Solo
- Descrição: Plano individual com recursos essenciais
- Preços:
  - Mensal: R$ 49,90 (recurring: monthly)
  - Anual: R$ 479,04 (recurring: yearly)

#### Produto: SOLO PRO
- Nome: BarberFlow Solo Pro
- Descrição: Plano individual avançado com agendamento online
- Preços:
  - Mensal: R$ 79,90
  - Anual: R$ 767,04

#### Produto: TEAM
- Nome: BarberFlow Team
- Descrição: Para equipes com até 5 profissionais
- Preços:
  - Mensal: R$ 149,90
  - Anual: R$ 1.439,04

#### Produto: PREMIUM
- Nome: BarberFlow Premium
- Descrição: Para empresas com até 10 profissionais
- Preços:
  - Mensal: R$ 249,90
  - Anual: R$ 2.399,04

#### Produto: ENTERPRISE
- Nome: BarberFlow Enterprise
- Descrição: Para grandes redes com recursos ilimitados
- Preços:
  - Mensal: R$ 499,90
  - Anual: R$ 4.799,04

Após criar cada preço, copie o **Price ID** (price_xxxxx) para o .env.local

### 4. Configurar Webhook

1. Acesse: Dashboard > Developers > Webhooks
2. Clique em "Add endpoint"
3. URL do endpoint:
   - **Local (desenvolvimento)**: Use Stripe CLI (ver abaixo)
   - **Produção**: `https://seu-dominio.com/api/webhooks/stripe`
4. Selecione eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copie o **Signing secret** (whsec_xxxxx) → `STRIPE_WEBHOOK_SECRET`

### 5. Testar Localmente (Stripe CLI)

#### Instalar Stripe CLI:

```bash
# Windows (via Scoop)
scoop install stripe

# macOS (via Homebrew)
brew install stripe/stripe-cli/stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

#### Fazer login:

```bash
stripe login
```

#### Forward webhooks para localhost:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Isso vai gerar um **webhook secret** temporário. Use-o no `.env.local` durante desenvolvimento.

#### Testar webhook:

```bash
stripe trigger checkout.session.completed
```

### 6. Cartões de Teste

Use esses números para testar no modo test:

**Sucesso:**
- `4242 4242 4242 4242` (Visa)
- `5555 5555 5555 4444` (Mastercard)
- Qualquer CVC (ex: 123)
- Qualquer data futura (ex: 12/34)

**Falha:**
- `4000 0000 0000 0002` (Cartão recusado)

### 7. Ativar Modo Produção

Quando estiver pronto:

1. Complete o onboarding no Stripe (informações fiscais, bancárias)
2. Ative sua conta (Stripe vai revisar)
3. Troque modo de Test para Live (toggle no Dashboard)
4. Copie as chaves LIVE (sk_live_ e pk_live_)
5. Atualize .env.local com chaves de produção
6. Recrie o webhook para URL de produção
7. Atualize `STRIPE_WEBHOOK_SECRET` com o novo secret

## 🧪 Testar Fluxo Completo

### 1. Checkout
```bash
# Abra a página de pricing
http://localhost:3000/pricing

# Clique em "Assinar" de qualquer plano
# Use cartão de teste: 4242 4242 4242 4242
# Complete o checkout
```

### 2. Webhook
```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 3: Trigger webhook
stripe trigger checkout.session.completed
```

### 3. Billing Portal
```bash
# Após assinar, vá para:
http://localhost:3000/app/settings/billing

# Clique em "Gerenciar Assinatura"
# Você será redirecionado para o Stripe Billing Portal
# Teste: cancelar, atualizar pagamento, ver faturas
```

## 📊 Monitoramento

### Logs do Webhook
```bash
# Ver logs em tempo real
stripe logs tail

# Filtrar por evento
stripe logs tail --filter-event-type checkout.session.completed
```

### Dashboard Stripe
- **Payments**: Ver todas as transações
- **Subscriptions**: Ver todas as assinaturas ativas
- **Customers**: Ver todos os clientes
- **Events**: Histórico de todos os eventos (útil para debug)

## 🚨 Troubleshooting

### Webhook não está funcionando
- Verifique se `STRIPE_WEBHOOK_SECRET` está correto
- Confirme que o endpoint está respondendo 200
- Veja logs em: Dashboard > Developers > Webhooks > Attempts

### Checkout retorna erro
- Confirme que `price_id` está correto
- Verifique se cliente tem `stripe_customer_id`
- Veja logs no console do navegador

### Assinatura não atualiza tenant
- Verifique se webhook está recebendo eventos
- Confirme que `tenant_id` está nos metadata
- Veja logs do servidor

## 📚 Recursos

- [Stripe Docs](https://stripe.com/docs)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Testing Cards](https://stripe.com/docs/testing)
- [Checkout](https://stripe.com/docs/payments/checkout)
- [Billing Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)


