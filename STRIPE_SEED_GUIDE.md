# 🎯 GUIA: SEED STRIPE AUTOMÁTICO

**Arquivo:** `seed-stripe.js`  
**Objetivo:** Criar produtos e preços no Stripe automaticamente

---

## 🚀 COMO USAR

### Passo 1: Pegar sua Secret Key do Stripe

1. Acesse: https://dashboard.stripe.com/apikeys
2. Copie sua **Secret key** (começa com `sk_test_...` ou `sk_live_...`)

### Passo 2: Executar o Script

**Opção A: Passar a key como argumento**
```bash
node seed-stripe.js sk_test_sua_chave_aqui
```

**Opção B: Usar variável de ambiente**
```bash
# Windows PowerShell
$env:STRIPE_SECRET_KEY="sk_test_sua_chave"; node seed-stripe.js

# Windows CMD
set STRIPE_SECRET_KEY=sk_test_sua_chave && node seed-stripe.js

# Mac/Linux
STRIPE_SECRET_KEY=sk_test_sua_chave node seed-stripe.js
```

### Passo 3: Copiar o Output

O script vai criar os produtos e mostrar algo assim:

```bash
🚀 Iniciando sincronização com Stripe...

👇 COPIE O RESULTADO ABAIXO PARA SEU .ENV 👇

# BarberGold Solo
STRIPE_PRICE_SOLO_MONTHLY=price_1OxxxxxxxxxxxM
STRIPE_PRICE_SOLO_YEARLY=price_1Oxxxxxxxxxxxy

# BarberGold Solo Pro
STRIPE_PRICE_SOLO_PRO_MONTHLY=price_1Oxxxxxxxxxxxp
STRIPE_PRICE_SOLO_PRO_YEARLY=price_1Oxxxxxxxxxxx0

# BarberGold Team
STRIPE_PRICE_TEAM_MONTHLY=price_1OxxxxxxxxxxxT
STRIPE_PRICE_TEAM_YEARLY=price_1Oxxxxxxxxxxx1

# BarberGold Premium
STRIPE_PRICE_PREMIUM_MONTHLY=price_1OxxxxxxxxxxxP
STRIPE_PRICE_PREMIUM_YEARLY=price_1Oxxxxxxxxxxx2

# BarberGold Enterprise
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_1OxxxxxxxxxxxE
STRIPE_PRICE_ENTERPRISE_YEARLY=price_1Oxxxxxxxxxxx3
```

### Passo 4: Adicionar no .env.local

Copie TODAS as linhas e cole no seu `.env.local`:

```env
# Stripe Price IDs (gerados pelo seed-stripe.js)
STRIPE_PRICE_SOLO_MONTHLY=price_1OxxxxxxxxxxxM
STRIPE_PRICE_SOLO_YEARLY=price_1Oxxxxxxxxxxxy
STRIPE_PRICE_SOLO_PRO_MONTHLY=price_1Oxxxxxxxxxxxp
STRIPE_PRICE_SOLO_PRO_YEARLY=price_1Oxxxxxxxxxxx0
STRIPE_PRICE_TEAM_MONTHLY=price_1OxxxxxxxxxxxT
STRIPE_PRICE_TEAM_YEARLY=price_1Oxxxxxxxxxxx1
STRIPE_PRICE_PREMIUM_MONTHLY=price_1OxxxxxxxxxxxP
STRIPE_PRICE_PREMIUM_YEARLY=price_1Oxxxxxxxxxxx2
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_1OxxxxxxxxxxxE
STRIPE_PRICE_ENTERPRISE_YEARLY=price_1Oxxxxxxxxxxx3
```

### Passo 5: No Vercel (Produção)

Adicione as mesmas variáveis no Vercel:
1. Vá em **Settings > Environment Variables**
2. Cole todas as variáveis
3. Deploy!

---

## 📊 O QUE O SCRIPT FAZ

Para cada plano:
1. ✅ Cria um **Produto** no Stripe
2. ✅ Cria um **Preço Mensal** (R$ XX,90/mês)
3. ✅ Cria um **Preço Anual** (R$ XXX,04/ano com 20% desconto)
4. ✅ Gera as variáveis de ambiente

---

## 💰 PLANOS CRIADOS

| Plano | Mensal | Anual | Desconto |
|-------|--------|-------|----------|
| SOLO | R$ 49,90 | R$ 479,04 | 20% |
| SOLO PRO | R$ 79,90 | R$ 767,04 | 20% |
| TEAM | R$ 149,90 | R$ 1.439,04 | 20% |
| PREMIUM | R$ 249,90 | R$ 2.399,04 | 20% |
| ENTERPRISE | R$ 499,90 | R$ 4.799,04 | 20% |

**Nota:** FREE não precisa de produto Stripe (é grátis).

---

## 🔍 VERIFICAR NO STRIPE

Após executar, verifique no Stripe Dashboard:

1. **Products:** https://dashboard.stripe.com/products
   - Você verá 5 produtos: Solo, Solo Pro, Team, Premium, Enterprise

2. **Prices:** Cada produto terá 2 preços
   - Mensal: R$ XX,90/mês
   - Anual: R$ XXX,04/ano

---

## 🆘 TROUBLESHOOTING

### Erro: "Cannot find module 'stripe'"

**Solução:** Instale a biblioteca Stripe
```bash
npm install stripe
```

### Erro: "Secret key não fornecida"

**Solução:** Passe a key como argumento
```bash
node seed-stripe.js sk_test_sua_chave_aqui
```

### Erro: "Invalid API Key provided"

**Solução:** Verifique se você copiou a key correta do Stripe Dashboard

### Erro: "Product already exists"

**Solução:** O script não tem lógica de update. Para recriar:
1. Delete os produtos manualmente no Stripe Dashboard
2. Execute o script novamente

---

## 🔄 MODO TEST vs LIVE

### Test Mode (Desenvolvimento)
```bash
# Use key que começa com sk_test_
node seed-stripe.js sk_test_xxxxx
```
- Produtos criados em **Test Mode**
- Não cobra cartões reais
- Perfeito para desenvolvimento

### Live Mode (Produção)
```bash
# Use key que começa com sk_live_
node seed-stripe.js sk_live_xxxxx
```
- Produtos criados em **Live Mode**
- ⚠️ Cobra cartões reais!
- Use apenas em produção

---

## ✅ CHECKLIST

- [ ] Instalou `npm install stripe`
- [ ] Pegou a Secret Key do Stripe
- [ ] Executou `node seed-stripe.js sk_test_...`
- [ ] Copiou os Price IDs gerados
- [ ] Adicionou no `.env.local`
- [ ] Testou um checkout
- [ ] Funcionou! 🎉

---

## 📝 EXEMPLO COMPLETO

```bash
# 1. Instalar stripe
npm install stripe

# 2. Executar seed
node seed-stripe.js sk_test_51xxxxxxxxxxxxxxxxxx

# 3. Output
🚀 Iniciando sincronização com Stripe...
👇 COPIE O RESULTADO ABAIXO PARA SEU .ENV 👇

# BarberGold Solo
STRIPE_PRICE_SOLO_MONTHLY=price_1OxxxxM
STRIPE_PRICE_SOLO_YEARLY=price_1Oxxxxxr

# ... (copiar tudo)

# 4. Colar no .env.local
# 5. Reiniciar servidor (npm run dev)
# 6. Testar checkout em /pricing
# 7. Sucesso! ✅
```

---

## 🎯 PRÓXIMOS PASSOS

Após executar este script:

1. ✅ Produtos criados no Stripe
2. ✅ Price IDs copiados no .env
3. ⏩ Configure o Webhook (veja `STRIPE_SETUP.md`)
4. ⏩ Teste o checkout flow
5. ⏩ Deploy na Vercel

---

**Documentação relacionada:**
- `STRIPE_SETUP.md` - Setup completo do Stripe
- `DEPLOY_GUIDE.md` - Deploy em produção
- `README.md` - Overview do projeto

---

**🚀 Script criado para facilitar sua vida!**

*Criado com 💙 para o BarberGold*

