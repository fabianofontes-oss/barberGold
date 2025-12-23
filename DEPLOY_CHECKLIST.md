# 🚀 Checklist de Deploy - BarberGOLD

## ✅ Código Pronto (Concluído)

### P1 - Tarefas Críticas
- ✅ Rota `/auth/callback` criada para OAuth e password recovery
- ✅ Página `/app/settings/password` para reset de senha
- ✅ `AuthGuard` aplicado em todas as rotas `/app/*`
- ✅ Migration SQL para colunas Stripe (`001_add_stripe_columns.sql`)
- ✅ Webhook Stripe ajustado e validado
- ✅ Fallbacks perigosos removidos (sk_test_mock_key, service_role_key_mock)
- ✅ stripeKey removido do client-side

### P2 - Qualidade de Código
- ✅ Tipagem forte em repositórios Supabase
- ✅ Redução de uso de `any`
- ✅ Warnings ESLint corrigidos (unused vars, alt em imagens)
- ✅ `images.remotePatterns` configurado

### P0 - Bloqueantes
- ✅ Migration SQL para tabelas faltantes (`002_fix_schema_tables.sql`)
- ✅ Links placeholder corrigidos

---

## 📋 Ações Necessárias no Supabase

### 1. Executar Migrations (OBRIGATÓRIO)

Acesse o **Supabase Dashboard > SQL Editor** e execute na ordem:

#### Migration 1: Colunas Stripe
```sql
-- Arquivo: supabase/migrations/001_add_stripe_columns.sql
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'TRIAL' 
  CHECK (subscription_status IN ('ACTIVE', 'TRIAL', 'OVERDUE', 'SUSPENDED', 'CANCELLED'));

CREATE INDEX IF NOT EXISTS idx_tenants_stripe_customer ON public.tenants(stripe_customer_id);
```

#### Migration 2: Tabelas Faltantes
```sql
-- Arquivo: supabase/migrations/002_fix_schema_tables.sql
-- Execute o arquivo completo (160 linhas)
-- Cria: tenants_registry view, app_session, referral_partners, referral_sales, tenant_referral_config
```

### 2. Verificar Schema Base

Confirme que a tabela `tenants` tem estas colunas:
- `id`, `created_at`, `name`, `slug`, `owner_id`, `plan_id`, `status`
- `settings`, `logo_url`, `phone`, `address`, `instagram`
- `stripe_customer_id`, `stripe_subscription_id`, `subscription_status` (após migration 1)

---

## 🔐 Variáveis de Ambiente (Deploy)

Configure estas variáveis na plataforma de deploy (Vercel/Netlify/outro):

### Obrigatórias
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # Para webhooks

# Stripe
STRIPE_SECRET_KEY=sk_live_... # NÃO usar sk_test em prod
STRIPE_WEBHOOK_SECRET=whsec_... # Do Stripe Dashboard

# App
NEXT_PUBLIC_APP_MODE=prod
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
```

### Opcionais
```bash
# Outras integrações futuras
```

---

## 🔗 Configurar Webhook Stripe

1. Acesse **Stripe Dashboard > Developers > Webhooks**
2. Clique em **Add endpoint**
3. URL: `https://seu-dominio.com/api/webhooks/stripe`
4. Eventos para escutar:
   - `checkout.session.completed`
5. Copie o **Signing secret** e configure como `STRIPE_WEBHOOK_SECRET`

---

## ✅ Testes Pré-Lançamento

### Fluxo de Autenticação
- [ ] Criar conta (signup) com email/senha
- [ ] Login com email/senha
- [ ] Login com Google OAuth
- [ ] Reset de senha (forgot password → email → callback → trocar senha)
- [ ] Proteção de rotas (tentar acessar `/app/dashboard` sem login)
- [ ] Redirecionamento após login bem-sucedido

### Fluxo de Pagamento (se aplicável)
- [ ] Criar sessão de checkout no Stripe
- [ ] Completar pagamento de teste
- [ ] Verificar se webhook atualizou `subscription_status` na tabela `tenants`

### Multi-tenancy
- [ ] Criar 2 tenants diferentes
- [ ] Verificar que usuário A não vê dados do usuário B
- [ ] Testar RLS (Row Level Security)

---

## 🎯 Status Atual

**Código:** ✅ 100% Pronto para Produção

**Banco de Dados:** ⏳ Aguardando execução das migrations

**Deploy:** ⏳ Aguardando configuração de env vars

**Stripe:** ⏳ Aguardando configuração de webhook

---

## 📝 Próximos Passos

1. Executar migrations no Supabase
2. Configurar env vars na plataforma de deploy
3. Fazer deploy
4. Configurar webhook Stripe
5. Testar fluxos end-to-end
6. **Lançar! 🚀**

---

## 🆘 Troubleshooting

### Erro: "SUPABASE_SERVICE_ROLE_KEY não configurada"
- Configure a variável de ambiente no deploy
- Verifique se está usando o valor correto do Supabase Dashboard > Settings > API

### Erro: "Webhook Error: No signatures found"
- Verifique se `STRIPE_WEBHOOK_SECRET` está configurado
- Confirme que o endpoint está acessível publicamente

### Erro: "Database Error: column does not exist"
- Execute as migrations SQL no Supabase
- Verifique se as migrations foram aplicadas com sucesso

---

**Última atualização:** 23/12/2024
**Commits importantes:**
- `730e7e7` - feat: implementar P1 (auth, schema, secrets)
- `5536fb8` - refactor: implementar P2 (tipagem, linting, performance)
- `7691ff2` - feat: implementar P0 bloqueantes
- `11d4bd5` - fix: corrigir migration (DROP POLICY IF EXISTS)
