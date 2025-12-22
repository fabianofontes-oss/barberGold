# 🚀 GUIA DE DEPLOY - BARBERFLOW

**Última atualização:** Dezembro 2025

Este guia detalha todos os passos para fazer deploy do BarberFlow em produção.

---

## 📋 PRÉ-REQUISITOS

Antes de começar, você precisa ter:

- [ ] Conta no [Vercel](https://vercel.com) (gratuita)
- [ ] Conta no [Supabase](https://supabase.com) (gratuita)
- [ ] Conta no [Stripe](https://stripe.com) (gratuita para testar)
- [ ] Repositório Git (GitHub, GitLab ou Bitbucket)
- [ ] Domínio (opcional, mas recomendado)

---

## 1️⃣ SETUP DO SUPABASE

### Criar Projeto
1. Acesse https://app.supabase.com
2. Clique em "New Project"
3. Preencha:
   - **Name:** barberflow-prod
   - **Database Password:** [gere uma senha forte]
   - **Region:** South America (São Paulo)
4. Aguarde ~2 minutos até o projeto estar pronto

### Executar Migrations
1. No painel do Supabase, vá em **SQL Editor**
2. Abra o arquivo `supabase/schema-complete.sql` do projeto
3. Copie todo o conteúdo
4. Cole no SQL Editor
5. Clique em **Run** (F5)
6. ✅ Verifique se todas as tabelas foram criadas

7. **IMPORTANTE:** Execute também o SQL de atualização
8. Abra o arquivo `supabase/update-plans-and-onboarding.sql`
9. Copie e cole no SQL Editor
10. Clique em **Run** (F5)
11. ✅ Isso vai atualizar os planos para os valores corretos

### Configurar RLS (Row Level Security)
As policies já estão no schema. Verifique se foram criadas:
- Vá em **Authentication > Policies**
- Deve ter policies para: `tenants`, `profiles`, `clients`, `appointments`, `sales`, etc.

### Obter Credenciais
1. Vá em **Settings > API**
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. ⚠️ Guarde essas credenciais em segurança!

---

## 2️⃣ SETUP DO STRIPE

### Criar Conta
1. Acesse https://dashboard.stripe.com/register
2. Crie sua conta
3. Complete o onboarding básico
4. **Mantenha em modo TEST** por enquanto

### Obter API Keys
1. Vá em **Developers > API Keys**
2. Copie:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### Criar Produtos e Preços

#### Via Script Automático (RECOMENDADO) ⭐

Use o script `seed-stripe.js` para criar tudo automaticamente:

```bash
# 1. Instalar Stripe SDK
npm install stripe

# 2. Executar o seed
node seed-stripe.js sk_test_sua_chave_aqui

# 3. Copiar os Price IDs gerados e colar no .env.local
```

**Veja o guia completo:** `STRIPE_SEED_GUIDE.md`

---

#### Via Dashboard (Manual):
1. Vá em **Products > Add product**
2. Crie 5 produtos com os seguintes preços:

**SOLO:**
- Nome: BarberFlow Solo
- Preço Mensal: R$ 49,90
- Preço Anual: R$ 479,04
- Copie os Price IDs

**SOLO PRO:**
- Nome: BarberFlow Solo Pro
- Preço Mensal: R$ 79,90
- Preço Anual: R$ 767,04

**TEAM:**
- Nome: BarberFlow Team
- Preço Mensal: R$ 149,90
- Preço Anual: R$ 1.439,04

**PREMIUM:**
- Nome: BarberFlow Premium
- Preço Mensal: R$ 249,90
- Preço Anual: R$ 2.399,04

**ENTERPRISE:**
- Nome: BarberFlow Enterprise
- Preço Mensal: R$ 499,90
- Preço Anual: R$ 4.799,04

3. Copie todos os **Price IDs** (price_xxxxx)

### Configurar Webhook
1. Vá em **Developers > Webhooks**
2. Clique em **Add endpoint**
3. **Endpoint URL:** `https://seu-dominio.com/api/webhooks/stripe`
4. **Events to send:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Clique em **Add endpoint**
6. Copie o **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 3️⃣ DEPLOY NO VERCEL

### Conectar Repositório
1. Acesse https://vercel.com/new
2. Faça login com GitHub/GitLab
3. Selecione seu repositório `barberGold`
4. Clique em **Import**

### Configurar Build Settings
- **Framework Preset:** Next.js
- **Root Directory:** `./` (deixe em branco)
- **Build Command:** `npm run build` (padrão)
- **Output Directory:** `.next` (padrão)
- **Install Command:** `npm install` (padrão)

### Adicionar Environment Variables
Clique em **Environment Variables** e adicione:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Price IDs
STRIPE_PRICE_SOLO_MONTHLY=price_xxxxx
STRIPE_PRICE_SOLO_YEARLY=price_xxxxx
STRIPE_PRICE_SOLO_PRO_MONTHLY=price_xxxxx
STRIPE_PRICE_SOLO_PRO_YEARLY=price_xxxxx
STRIPE_PRICE_TEAM_MONTHLY=price_xxxxx
STRIPE_PRICE_TEAM_YEARLY=price_xxxxx
STRIPE_PRICE_PREMIUM_MONTHLY=price_xxxxx
STRIPE_PRICE_PREMIUM_YEARLY=price_xxxxx
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_xxxxx
STRIPE_PRICE_ENTERPRISE_YEARLY=price_xxxxx

# Site
NEXT_PUBLIC_SITE_URL=https://barber.gold
NEXT_PUBLIC_APP_MODE=production
```

### Deploy
1. Clique em **Deploy**
2. Aguarde ~2-3 minutos
3. ✅ Deploy concluído!
4. Você receberá uma URL: `https://seu-projeto.vercel.app`

---

## 4️⃣ CONFIGURAR DOMÍNIO (Opcional)

### Adicionar Domínio no Vercel
1. No projeto, vá em **Settings > Domains**
2. Clique em **Add**
3. Digite: `barber.gold`
4. Vercel vai te dar instruções de DNS

### Configurar DNS
No seu provedor de domínio (Registro.br, GoDaddy, etc.):

1. Adicione um registro **A**:
   - Name: `@`
   - Type: `A`
   - Value: `76.76.21.21` (IP da Vercel)

2. Adicione um registro **CNAME** para www:
   - Name: `www`
   - Type: `CNAME`
   - Value: `cname.vercel-dns.com`

3. Para subdomínios wildcard (`*.barber.gold`):
   - Name: `*`
   - Type: `A`
   - Value: `76.76.21.21`

### Aguardar Propagação
- Propagação de DNS pode levar de 5 minutos a 48 horas
- Vercel vai configurar SSL automaticamente (Let's Encrypt)
- Após propagação, acesse: https://barber.gold

---

## 5️⃣ ATUALIZAR WEBHOOK DO STRIPE

Agora que você tem o domínio real:

1. Vá em **Stripe > Developers > Webhooks**
2. Edite o webhook criado anteriormente
3. Atualize a URL para: `https://barber.gold/api/webhooks/stripe`
4. Salve

---

## 6️⃣ CONFIGURAR MONITORING (OPCIONAL)

### Vercel Analytics
1. No projeto Vercel, vá em **Analytics**
2. Clique em **Enable**
3. ✅ Analytics ativado automaticamente

### Sentry (Monitoramento de Erros)
1. Crie conta em https://sentry.io
2. Crie um projeto Next.js
3. Copie o **DSN**
4. Adicione no Vercel:
   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
   ```
5. Instale: `npm install @sentry/nextjs`
6. Execute: `npx @sentry/wizard -i nextjs`

---

## 7️⃣ ATIVAR MODO LIVE DO STRIPE

⚠️ **IMPORTANTE:** Só faça isso quando estiver 100% testado!

1. Complete o onboarding do Stripe:
   - Informações da empresa
   - Dados bancários
   - Documentos fiscais
   
2. Aguarde aprovação (pode levar alguns dias)

3. Após aprovado, mude para **Live mode**

4. Gere novas API keys (Live):
   - `pk_live_xxxxx`
   - `sk_live_xxxxx`

5. Atualize as env vars no Vercel:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxxxx
   STRIPE_SECRET_KEY=sk_live_xxxxx
   ```

6. Recrie os produtos em Live mode

7. Atualize os Price IDs

8. Atualize o webhook para Live mode

---

## 8️⃣ TESTAR EM PRODUÇÃO

### Checklist de Testes

- [ ] **Acesso Básico**
  - [ ] Site carrega (barber.gold)
  - [ ] Landing page funciona
  - [ ] Links de navegação funcionam

- [ ] **Cadastro de Tenant**
  - [ ] Criar nova barbearia
  - [ ] Validação de subdomain
  - [ ] Sugestões de nome funcionam

- [ ] **Autenticação**
  - [ ] Login funciona
  - [ ] Logout funciona
  - [ ] Recuperação de senha funciona
  - [ ] Session persiste

- [ ] **Dashboard**
  - [ ] Estatísticas carregam
  - [ ] Tour guiado aparece
  - [ ] Welcome modal funciona

- [ ] **CRUD Clientes**
  - [ ] Listar clientes
  - [ ] Criar cliente
  - [ ] Editar cliente
  - [ ] Deletar cliente
  - [ ] Busca funciona

- [ ] **CRUD Agendamentos**
  - [ ] Listar agendamentos
  - [ ] Criar agendamento
  - [ ] Editar agendamento
  - [ ] Cancelar agendamento
  - [ ] Completar agendamento

- [ ] **PDV/Vendas**
  - [ ] Adicionar items
  - [ ] Calcular total
  - [ ] Aplicar desconto
  - [ ] Processar venda
  - [ ] Histórico de vendas

- [ ] **Stripe/Pagamentos**
  - [ ] Página /pricing carrega
  - [ ] Checkout funciona
  - [ ] Webhook recebe eventos
  - [ ] Status do tenant atualiza
  - [ ] Billing portal funciona

- [ ] **Feature Gates**
  - [ ] Limites do FREE funcionam
  - [ ] Modal de upgrade aparece
  - [ ] Upgrade funciona

- [ ] **Mobile**
  - [ ] Responsivo em celular
  - [ ] Touch funciona
  - [ ] Menu mobile funciona

- [ ] **Performance**
  - [ ] Lighthouse Score > 85
  - [ ] Carregamento < 3s
  - [ ] Sem erros no console

---

## 9️⃣ PÓS-DEPLOY

### Monitorar Primeiras 24h
- [ ] Verificar logs da Vercel
- [ ] Monitorar webhooks do Stripe
- [ ] Verificar erros no Sentry
- [ ] Acompanhar analytics

### Configurar Backups (Supabase)
1. Vá em **Database > Backups**
2. Configure backups automáticos diários
3. Teste restore de um backup

### Documentar Credenciais
Guarde em local seguro (1Password, LastPass):
- Credenciais Supabase
- Credenciais Stripe
- Credenciais Vercel
- Senha do banco de dados
- Webhook secrets

---

## 🆘 TROUBLESHOOTING

### Deploy Falha no Vercel
**Erro:** Build failed
- Verifique logs de build
- Execute `npm run build` localmente
- Corrija erros TypeScript
- Verifique se todas as env vars estão configuradas

### Webhook Não Funciona
**Erro:** Webhooks returning 400/500
- Verifique URL do webhook
- Confirme que `STRIPE_WEBHOOK_SECRET` está correto
- Veja logs em: Vercel > Functions > /api/webhooks/stripe
- Teste com Stripe CLI: `stripe trigger checkout.session.completed`

### Subdomain Não Resolve
**Erro:** Subdomain não encontrado
- Confirme que DNS wildcard está configurado (`*.barber.gold`)
- Aguarde propagação DNS (até 48h)
- Teste com: `nslookup teste.barber.gold`

### Login Não Funciona
**Erro:** Redirect loop ou erro ao fazer login
- Confirme que `NEXT_PUBLIC_SITE_URL` está correto
- Verifique Supabase Auth URLs em: Authentication > URL Configuration
- Adicione redirect URLs: `https://barber.gold/**`

### Checkout Falha
**Erro:** Error ao criar checkout session
- Confirme que Price IDs estão corretos
- Verifique se Stripe keys são de Live mode (se em produção)
- Veja logs do webhook
- Teste com cartão: 4242 4242 4242 4242 (test mode)

---

## ✅ CHECKLIST FINAL

Antes de considerar o deploy completo:

- [ ] ✅ Supabase configurado
- [ ] ✅ Stripe configurado
- [ ] ✅ Deploy na Vercel feito
- [ ] ✅ Domínio configurado
- [ ] ✅ DNS propagado
- [ ] ✅ SSL ativo (HTTPS)
- [ ] ✅ Webhooks funcionando
- [ ] ✅ Todos os testes passando
- [ ] ✅ Monitoring configurado
- [ ] ✅ Backups configurados
- [ ] ✅ Credenciais guardadas
- [ ] ✅ Documentação atualizada

---

## 🎉 PARABÉNS!

Seu BarberFlow está no ar! 🚀

**Próximos Passos:**
1. Monitorar primeiros usuários
2. Coletar feedback
3. Iterar e melhorar
4. Marketing e divulgação
5. Escalar!

---

**Desenvolvido com 💙 para barbeiros que querem crescer**

*BarberFlow - Gestão Profissional para Barbearias Modernas*

