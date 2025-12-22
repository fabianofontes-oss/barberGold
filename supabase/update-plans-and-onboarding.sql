-- =============================================
-- ATUALIZAÇÃO: PLANOS E ONBOARDING
-- Execute este SQL APÓS o schema-complete.sql
-- Data: Dezembro 2025
-- =============================================

-- =============================================
-- 1. ATUALIZAR PLANOS (Novos preços e nomes)
-- =============================================

-- Deletar planos antigos
DELETE FROM public.saas_plans;

-- Inserir planos atualizados com preços corretos
INSERT INTO public.saas_plans (id, name, description, monthly_price_brl, yearly_price_brl, max_staff, max_locations, features, sort_order) VALUES

-- FREE (Grátis)
('FREE', 'FREE', 'Para começar sem compromisso', 
  0, 0, 1, 1, 
  '{
    "ONLINE_BOOKING": false,
    "LOYALTY": false,
    "ADVANCED_REPORTS": false,
    "MULTI_SHOP": false,
    "WEBSITE_PREMIUM": false,
    "COMMISSIONS": false,
    "BLIND_CASH_CLOSURE": false,
    "MAX_CLIENTS": 10,
    "MAX_APPOINTMENTS_MONTH": 30
  }'::jsonb, 
  1
),

-- SOLO (R$ 49,90/mês)
('SOLO', 'SOLO', 'Para profissionais autônomos', 
  49.90, 479.04, 1, 1, 
  '{
    "ONLINE_BOOKING": false,
    "LOYALTY": false,
    "ADVANCED_REPORTS": false,
    "MULTI_SHOP": false,
    "WEBSITE_PREMIUM": false,
    "COMMISSIONS": false,
    "BLIND_CASH_CLOSURE": false,
    "MAX_CLIENTS": 100,
    "MAX_APPOINTMENTS_MONTH": 200
  }'::jsonb, 
  2
),

-- SOLO PRO (R$ 79,90/mês) - MAIS POPULAR
('SOLO_PRO', 'SOLO PRO', 'Solo com recursos avançados', 
  79.90, 767.04, 1, 1, 
  '{
    "ONLINE_BOOKING": true,
    "LOYALTY": true,
    "ADVANCED_REPORTS": true,
    "MULTI_SHOP": false,
    "WEBSITE_PREMIUM": false,
    "COMMISSIONS": true,
    "BLIND_CASH_CLOSURE": true,
    "MAX_CLIENTS": 500,
    "MAX_APPOINTMENTS_MONTH": 1000,
    "WHATSAPP_INTEGRATION": true
  }'::jsonb, 
  3
),

-- TEAM (R$ 149,90/mês)
('TEAM', 'TEAM', 'Para pequenas equipes', 
  149.90, 1439.04, 5, 1, 
  '{
    "ONLINE_BOOKING": true,
    "LOYALTY": true,
    "ADVANCED_REPORTS": true,
    "MULTI_SHOP": false,
    "WEBSITE_PREMIUM": true,
    "COMMISSIONS": true,
    "BLIND_CASH_CLOSURE": true,
    "MAX_CLIENTS": -1,
    "MAX_APPOINTMENTS_MONTH": -1,
    "WHATSAPP_INTEGRATION": true,
    "INVENTORY_MANAGEMENT": true
  }'::jsonb, 
  4
),

-- PREMIUM (R$ 249,90/mês)
('PREMIUM', 'PREMIUM', 'Para barbearias em crescimento', 
  249.90, 2399.04, 10, 3, 
  '{
    "ONLINE_BOOKING": true,
    "LOYALTY": true,
    "ADVANCED_REPORTS": true,
    "MULTI_SHOP": true,
    "WEBSITE_PREMIUM": true,
    "COMMISSIONS": true,
    "BLIND_CASH_CLOSURE": true,
    "MAX_CLIENTS": -1,
    "MAX_APPOINTMENTS_MONTH": -1,
    "WHATSAPP_INTEGRATION": true,
    "INVENTORY_MANAGEMENT": true,
    "API_ACCESS": true,
    "CUSTOM_DASHBOARDS": true,
    "AUTO_BACKUP": true
  }'::jsonb, 
  5
),

-- ENTERPRISE (R$ 499,90/mês)
('ENTERPRISE', 'ENTERPRISE', 'Para redes e franquias', 
  499.90, 4799.04, 999, 999, 
  '{
    "ONLINE_BOOKING": true,
    "LOYALTY": true,
    "ADVANCED_REPORTS": true,
    "MULTI_SHOP": true,
    "WEBSITE_PREMIUM": true,
    "COMMISSIONS": true,
    "BLIND_CASH_CLOSURE": true,
    "MAX_CLIENTS": -1,
    "MAX_APPOINTMENTS_MONTH": -1,
    "WHATSAPP_INTEGRATION": true,
    "INVENTORY_MANAGEMENT": true,
    "API_ACCESS": true,
    "CUSTOM_DASHBOARDS": true,
    "AUTO_BACKUP": true,
    "WHITE_LABEL": true,
    "DEDICATED_SERVER": true,
    "SLA_GUARANTEE": true,
    "ACCOUNT_MANAGER": true
  }'::jsonb, 
  6
);

-- =============================================
-- 2. ADICIONAR CAMPOS DE ONBOARDING
-- =============================================

-- Adicionar campos de onboarding em profiles
-- (Se já existirem, esses comandos vão falhar silenciosamente)

-- Campo para rastrear tours completados
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'tours_completed'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN tours_completed JSONB DEFAULT '{
      "dashboard": false,
      "clients": false,
      "appointments": false,
      "sales": false
    }'::jsonb;
  END IF;
END $$;

-- Campo para rastrear se o welcome modal foi mostrado
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Campo para rastrear se dados demo foram populados
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tenants' AND column_name = 'demo_data_populated'
  ) THEN
    ALTER TABLE public.tenants 
    ADD COLUMN demo_data_populated BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- =============================================
-- 3. ADICIONAR CAMPOS STRIPE
-- =============================================

-- Adicionar campos do Stripe no tenant
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tenants' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE public.tenants 
    ADD COLUMN stripe_customer_id TEXT UNIQUE;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tenants' AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE public.tenants 
    ADD COLUMN stripe_subscription_id TEXT UNIQUE;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tenants' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE public.tenants 
    ADD COLUMN subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tenants' AND column_name = 'subscription_current_period_end'
  ) THEN
    ALTER TABLE public.tenants 
    ADD COLUMN subscription_current_period_end TIMESTAMPTZ;
  END IF;
END $$;

-- Criar índices para campos Stripe
CREATE INDEX IF NOT EXISTS idx_tenants_stripe_customer ON public.tenants(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_tenants_stripe_subscription ON public.tenants(stripe_subscription_id);

-- =============================================
-- 4. ATUALIZAR PLANOS DE TENANTS EXISTENTES
-- =============================================

-- Migrar planos antigos para novos IDs
UPDATE public.tenants 
SET plan_id = 'SOLO_PRO' 
WHERE plan_id = 'EQUIPE';

UPDATE public.tenants 
SET plan_id = 'PREMIUM' 
WHERE plan_id = 'STUDIO';

-- =============================================
-- 5. ÍNDICES ADICIONAIS PARA PERFORMANCE
-- =============================================

-- Índices para melhorar queries de feature gating
CREATE INDEX IF NOT EXISTS idx_clients_tenant_created ON public.clients(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant_date ON public.appointments(tenant_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_sales_tenant_created ON public.sales(tenant_id, created_at DESC);

-- =============================================
-- VERIFICAÇÃO: Listar planos instalados
-- =============================================

SELECT 
  id,
  name,
  monthly_price_brl,
  yearly_price_brl,
  max_staff,
  max_locations,
  sort_order
FROM public.saas_plans
ORDER BY sort_order;

-- =============================================
-- FIM DA ATUALIZAÇÃO
-- =============================================
-- 
-- PRÓXIMO PASSO: Configure os Price IDs do Stripe
-- no seu arquivo .env.local:
-- 
-- STRIPE_PRICE_SOLO_MONTHLY=price_xxxxx
-- STRIPE_PRICE_SOLO_YEARLY=price_xxxxx
-- STRIPE_PRICE_SOLO_PRO_MONTHLY=price_xxxxx
-- STRIPE_PRICE_SOLO_PRO_YEARLY=price_xxxxx
-- STRIPE_PRICE_TEAM_MONTHLY=price_xxxxx
-- STRIPE_PRICE_TEAM_YEARLY=price_xxxxx
-- STRIPE_PRICE_PREMIUM_MONTHLY=price_xxxxx
-- STRIPE_PRICE_PREMIUM_YEARLY=price_xxxxx
-- STRIPE_PRICE_ENTERPRISE_MONTHLY=price_xxxxx
-- STRIPE_PRICE_ENTERPRISE_YEARLY=price_xxxxx
-- 
-- =============================================

