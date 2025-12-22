# 🔄 ATUALIZAÇÃO DO BANCO DE DADOS

**Data:** 22 de Dezembro de 2025  
**Arquivo:** `supabase/update-plans-and-onboarding.sql`

---

## 🎯 O QUE FOI ATUALIZADO

Criado novo SQL que **DEVE SER EXECUTADO** após o `schema-complete.sql`.

---

## 📊 1. PLANOS ATUALIZADOS

### ❌ Planos Antigos (Removidos)
```
FREE    - R$ 0
SOLO    - R$ 49
SOLO_PRO - R$ 59
EQUIPE  - R$ 79
STUDIO  - R$ 119
ENTERPRISE - R$ 899 (preço sob consulta)
```

### ✅ Planos Novos (Instalados)
```
FREE       - R$ 0 (grátis para sempre)
SOLO       - R$ 49,90/mês ou R$ 479,04/ano
SOLO PRO   - R$ 79,90/mês ou R$ 767,04/ano  ⭐ MAIS POPULAR
TEAM       - R$ 149,90/mês ou R$ 1.439,04/ano
PREMIUM    - R$ 249,90/mês ou R$ 2.399,04/ano
ENTERPRISE - R$ 499,90/mês ou R$ 4.799,04/ano
```

### 💰 Diferenças de Preço
- **Desconto anual:** 20% (2 meses grátis)
- **Preços mensais:** Atualizados para R$ 49,90, R$ 79,90, etc.
- **Novos limites:** Definidos por plano

---

## 🆕 2. NOVOS CAMPOS ADICIONADOS

### Tabela `tenants`

**Stripe Integration:**
```sql
stripe_customer_id           TEXT UNIQUE
stripe_subscription_id       TEXT UNIQUE
subscription_status          TEXT
subscription_current_period_end TIMESTAMPTZ
demo_data_populated          BOOLEAN DEFAULT FALSE
```

**Status possíveis:**
- `active` - Assinatura ativa
- `trialing` - Em período de trial
- `past_due` - Pagamento atrasado
- `canceled` - Cancelada
- `incomplete` - Pagamento incompleto
- `unpaid` - Não pago

### Tabela `profiles`

**Onboarding:**
```sql
tours_completed      JSONB DEFAULT '{
  "dashboard": false,
  "clients": false,
  "appointments": false,
  "sales": false
}'
onboarding_completed BOOLEAN DEFAULT FALSE
```

---

## 📋 3. FEATURES POR PLANO

### FREE (Grátis)
```json
{
  "MAX_CLIENTS": 10,
  "MAX_APPOINTMENTS_MONTH": 30,
  "ONLINE_BOOKING": false,
  "COMMISSIONS": false,
  "LOYALTY": false
}
```

### SOLO (R$ 49,90)
```json
{
  "MAX_CLIENTS": 100,
  "MAX_APPOINTMENTS_MONTH": 200,
  "ONLINE_BOOKING": false,
  "COMMISSIONS": false
}
```

### SOLO PRO (R$ 79,90) ⭐
```json
{
  "MAX_CLIENTS": 500,
  "MAX_APPOINTMENTS_MONTH": 1000,
  "ONLINE_BOOKING": true,
  "COMMISSIONS": true,
  "LOYALTY": true,
  "WHATSAPP_INTEGRATION": true
}
```

### TEAM (R$ 149,90)
```json
{
  "MAX_CLIENTS": -1,  // Ilimitado
  "MAX_APPOINTMENTS_MONTH": -1,  // Ilimitado
  "max_staff": 5,
  "INVENTORY_MANAGEMENT": true,
  "ONLINE_BOOKING": true,
  "COMMISSIONS": true
}
```

### PREMIUM (R$ 249,90)
```json
{
  "max_staff": 10,
  "max_locations": 3,
  "API_ACCESS": true,
  "CUSTOM_DASHBOARDS": true,
  "AUTO_BACKUP": true,
  "MULTI_SHOP": true
}
```

### ENTERPRISE (R$ 499,90)
```json
{
  "max_staff": 999,  // Ilimitado
  "max_locations": 999,  // Ilimitado
  "WHITE_LABEL": true,
  "DEDICATED_SERVER": true,
  "SLA_GUARANTEE": true,
  "ACCOUNT_MANAGER": true
}
```

---

## 🔧 4. ÍNDICES ADICIONADOS

Para melhorar performance:

```sql
-- Stripe
idx_tenants_stripe_customer
idx_tenants_stripe_subscription

-- Feature Gating (queries rápidas)
idx_clients_tenant_created
idx_appointments_tenant_date
idx_sales_tenant_created
```

---

## 🚀 COMO USAR

### No Setup Inicial
```bash
# 1. Execute o schema principal
supabase/schema-complete.sql

# 2. Execute a atualização (NOVO!)
supabase/update-plans-and-onboarding.sql
```

### Se Já Tem Banco Criado
```bash
# Execute APENAS a atualização
supabase/update-plans-and-onboarding.sql
```

**O SQL é seguro:**
- ✅ Usa `DO $$ BEGIN ... END $$` para evitar erros
- ✅ Verifica se campos já existem antes de criar
- ✅ Não quebra se executado múltiplas vezes
- ✅ Migra planos antigos automaticamente

---

## 🔄 MIGRAÇÃO AUTOMÁTICA

O SQL faz migração automática de planos:

```sql
EQUIPE → SOLO_PRO
STUDIO → PREMIUM
```

Tenants existentes com esses planos serão atualizados automaticamente.

---

## ✅ VERIFICAÇÃO

Ao final, o SQL mostra uma query de verificação:

```sql
SELECT 
  id,
  name,
  monthly_price_brl,
  yearly_price_brl,
  max_staff,
  max_locations
FROM public.saas_plans
ORDER BY sort_order;
```

**Resultado esperado:**
```
id          | name       | monthly | yearly  | staff | locations
------------|------------|---------|---------|-------|----------
FREE        | FREE       | 0       | 0       | 1     | 1
SOLO        | SOLO       | 49.90   | 479.04  | 1     | 1
SOLO_PRO    | SOLO PRO   | 79.90   | 767.04  | 1     | 1
TEAM        | TEAM       | 149.90  | 1439.04 | 5     | 1
PREMIUM     | PREMIUM    | 249.90  | 2399.04 | 10    | 3
ENTERPRISE  | ENTERPRISE | 499.90  | 4799.04 | 999   | 999
```

---

## 📍 PRÓXIMOS PASSOS

Após executar o SQL:

1. ✅ Verifique que os 6 planos foram criados
2. ✅ Configure os Price IDs do Stripe no `.env.local`
3. ✅ Teste o feature gating
4. ✅ Teste o sistema de onboarding

---

## 🆘 TROUBLESHOOTING

### Erro: "column already exists"
**Solução:** Normal! O SQL usa `IF NOT EXISTS`. Ignore.

### Erro: "plan_id violates check constraint"
**Solução:** O `check constraint` em `tenants.plan_id` precisa ser atualizado.

Execute antes do update:
```sql
ALTER TABLE public.tenants 
DROP CONSTRAINT IF EXISTS tenants_plan_id_check;

ALTER TABLE public.tenants 
ADD CONSTRAINT tenants_plan_id_check 
CHECK (plan_id IN ('FREE', 'SOLO', 'SOLO_PRO', 'TEAM', 'PREMIUM', 'ENTERPRISE'));
```

### Planos não aparecem
**Solução:** Verifique se você executou o SQL no projeto correto do Supabase.

```sql
-- Verificar planos instalados
SELECT * FROM public.saas_plans ORDER BY sort_order;
```

---

## 📝 CHANGELOG

**v2.0 (22/12/2025)**
- ✅ Planos atualizados com preços novos
- ✅ Campos Stripe adicionados
- ✅ Campos de onboarding adicionados
- ✅ Feature limits detalhados por plano
- ✅ Migração automática de planos antigos
- ✅ Índices de performance

**v1.0 (Anterior)**
- Schema inicial com 6 planos antigos

---

## ✨ RESUMO

**O que mudou:**
- ✅ 6 planos com preços atualizados
- ✅ Integração Stripe completa
- ✅ Sistema de onboarding
- ✅ Feature gating detalhado
- ✅ Performance otimizada

**Ação necessária:**
1. Execute `update-plans-and-onboarding.sql` no Supabase
2. Configure os Price IDs do Stripe
3. Teste!

---

**Documentação completa:** `DEPLOY_GUIDE.md`  
**Setup Stripe:** `STRIPE_SETUP.md`

