-- =============================================
-- MIGRATION: Corrigir Schema - Adicionar Tabelas Faltantes
-- Data: 2024-12-23
-- Descrição: Adiciona tabelas e views necessárias para compatibilidade com o código
-- =============================================

-- View para compatibilidade (código chama tenants_registry mas tabela real é tenants)
CREATE OR REPLACE VIEW public.tenants_registry AS 
SELECT 
  id,
  name,
  slug,
  owner_id as owner_name,
  plan_id,
  status,
  created_at,
  'MONTHLY' as billing_interval
FROM public.tenants;

-- Tabela de Sessões (para gerenciamento de sessão multi-tenant)
CREATE TABLE IF NOT EXISTS public.app_session (
    id TEXT PRIMARY KEY DEFAULT 'singleton',
    current_tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    device_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sistema de Referrals - Configuração por Tenant
CREATE TABLE IF NOT EXISTS public.tenant_referral_config (
    tenant_id UUID PRIMARY KEY REFERENCES public.tenants(id) ON DELETE CASCADE,
    owner_referral_code TEXT UNIQUE,
    owner_referral_link TEXT,
    is_active BOOLEAN DEFAULT false,
    commission_percent NUMERIC(5,2) DEFAULT 10.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sistema de Referrals - Parceiros
CREATE TABLE IF NOT EXISTS public.referral_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    display_name TEXT NOT NULL,
    partner_type TEXT NOT NULL CHECK (partner_type IN ('OWNER', 'STAFF', 'PARTNER_GENERAL', 'PARTNER_PRO')),
    base_commission_percent NUMERIC(5,2) DEFAULT 10.00,
    eligible_for_bonus BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    owner_share_percent NUMERIC(5,2),
    staff_share_percent NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sistema de Referrals - Vendas
CREATE TABLE IF NOT EXISTS public.referral_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    referral_code TEXT NOT NULL,
    partner_id UUID NOT NULL REFERENCES public.referral_partners(id) ON DELETE CASCADE,
    referred_tenant_id UUID NOT NULL,
    plan_id TEXT NOT NULL,
    billing_period TEXT NOT NULL CHECK (billing_period IN ('MONTHLY', 'ANNUAL')),
    sale_value_brl NUMERIC(10,2) NOT NULL,
    commission_base_brl NUMERIC(10,2) NOT NULL,
    commission_percent NUMERIC(5,2) NOT NULL,
    commission_amount_brl NUMERIC(10,2) NOT NULL,
    eligible_for_bonus BOOLEAN DEFAULT false,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'AVAILABLE', 'CANCELLED', 'ADJUSTED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    available_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    chargeback_at TIMESTAMPTZ,
    staff_share_percent NUMERIC(5,2),
    owner_share_percent NUMERIC(5,2),
    staff_commission_amount_brl NUMERIC(10,2),
    owner_commission_amount_brl NUMERIC(10,2)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_referral_partners_tenant ON public.referral_partners(tenant_id);
CREATE INDEX IF NOT EXISTS idx_referral_partners_staff ON public.referral_partners(staff_id);
CREATE INDEX IF NOT EXISTS idx_referral_sales_tenant ON public.referral_sales(tenant_id);
CREATE INDEX IF NOT EXISTS idx_referral_sales_partner ON public.referral_sales(partner_id);
CREATE INDEX IF NOT EXISTS idx_referral_sales_code ON public.referral_sales(referral_code);
CREATE INDEX IF NOT EXISTS idx_app_session_user ON public.app_session(user_id);

-- Habilitar RLS
ALTER TABLE public.app_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_referral_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_sales ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para app_session
DROP POLICY IF EXISTS "Users can manage their own session" ON public.app_session;
CREATE POLICY "Users can manage their own session"
  ON public.app_session FOR ALL
  USING (user_id = auth.uid());

-- Políticas RLS para tenant_referral_config
DROP POLICY IF EXISTS "Owners can view their tenant referral config" ON public.tenant_referral_config;
CREATE POLICY "Owners can view their tenant referral config"
  ON public.tenant_referral_config FOR SELECT
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can manage their tenant referral config" ON public.tenant_referral_config;
CREATE POLICY "Owners can manage their tenant referral config"
  ON public.tenant_referral_config FOR ALL
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE owner_id = auth.uid()
    )
  );

-- Políticas RLS para referral_partners
DROP POLICY IF EXISTS "Users can view partners of their tenant" ON public.referral_partners;
CREATE POLICY "Users can view partners of their tenant"
  ON public.referral_partners FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can manage partners" ON public.referral_partners;
CREATE POLICY "Owners can manage partners"
  ON public.referral_partners FOR ALL
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE owner_id = auth.uid()
    )
  );

-- Políticas RLS para referral_sales
DROP POLICY IF EXISTS "Users can view sales of their tenant" ON public.referral_sales;
CREATE POLICY "Users can view sales of their tenant"
  ON public.referral_sales FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "System can create sales" ON public.referral_sales;
CREATE POLICY "System can create sales"
  ON public.referral_sales FOR INSERT
  WITH CHECK (true);

-- Comentários
COMMENT ON VIEW public.tenants_registry IS 'View de compatibilidade para código legado que referencia tenants_registry';
COMMENT ON TABLE public.app_session IS 'Gerenciamento de sessão multi-tenant por usuário';
COMMENT ON TABLE public.tenant_referral_config IS 'Configuração do sistema de referrals por tenant';
COMMENT ON TABLE public.referral_partners IS 'Parceiros do programa de referrals';
COMMENT ON TABLE public.referral_sales IS 'Vendas geradas por referrals';
