-- =============================================
-- MIGRATION: Adicionar colunas Stripe à tabela tenants
-- Data: 2024-12-22
-- Descrição: Adiciona colunas para integração com Stripe
-- =============================================

-- Adicionar colunas Stripe
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'TRIAL' CHECK (subscription_status IN ('ACTIVE', 'TRIAL', 'OVERDUE', 'SUSPENDED', 'CANCELLED'));

-- Criar índice para busca rápida por stripe_customer_id
CREATE INDEX IF NOT EXISTS idx_tenants_stripe_customer ON public.tenants(stripe_customer_id);

-- Comentários
COMMENT ON COLUMN public.tenants.stripe_customer_id IS 'ID do cliente no Stripe';
COMMENT ON COLUMN public.tenants.stripe_subscription_id IS 'ID da assinatura no Stripe';
COMMENT ON COLUMN public.tenants.subscription_status IS 'Status da assinatura (sincronizado com Stripe)';
