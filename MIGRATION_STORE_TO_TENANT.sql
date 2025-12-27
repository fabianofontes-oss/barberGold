-- ============================================
-- MIGRATION: Converter stores → tenants e store_id → tenant_id
-- Execute este SQL no Supabase Dashboard (SQL Editor)
-- ============================================

-- PASSO 1: Criar tabela tenants (se não existir)
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subscription_status TEXT DEFAULT 'ACTIVE' CHECK (subscription_status IN ('ACTIVE', 'TRIAL', 'CANCELLED', 'SUSPENDED')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PASSO 2: Migrar dados de stores para tenants (se stores existir)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stores') THEN
    INSERT INTO public.tenants (id, name, slug, subscription_status, created_at)
    SELECT 
      id, 
      name, 
      LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g')),
      CASE status
        WHEN 'ACTIVE' THEN 'ACTIVE'
        WHEN 'TRIAL' THEN 'TRIAL'
        WHEN 'CANCELLED' THEN 'CANCELLED'
        WHEN 'SUSPENDED' THEN 'SUSPENDED'
        ELSE 'ACTIVE'
      END,
      created_at
    FROM public.stores
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Dados migrados de stores para tenants';
  END IF;
END $$;

-- PASSO 3: Alterar tabela services (se existir coluna store_id)
DO $$
BEGIN
  -- Verificar se a coluna store_id existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'services' AND column_name = 'store_id'
  ) THEN
    -- Remover constraint de FK antiga
    ALTER TABLE public.services DROP CONSTRAINT IF EXISTS services_store_id_fkey;
    
    -- Renomear coluna
    ALTER TABLE public.services RENAME COLUMN store_id TO tenant_id;
    
    -- Adicionar nova constraint de FK
    ALTER TABLE public.services 
    ADD CONSTRAINT services_tenant_id_fkey 
    FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Tabela services migrada: store_id → tenant_id';
  END IF;
END $$;

-- PASSO 4: Alterar tabela clients (se existir coluna store_id)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'store_id'
  ) THEN
    ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_store_id_fkey;
    ALTER TABLE public.clients RENAME COLUMN store_id TO tenant_id;
    ALTER TABLE public.clients 
    ADD CONSTRAINT clients_tenant_id_fkey 
    FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Tabela clients migrada: store_id → tenant_id';
  END IF;
END $$;

-- PASSO 5: Alterar tabela appointments (se existir coluna store_id)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'appointments' AND column_name = 'store_id'
  ) THEN
    ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_store_id_fkey;
    ALTER TABLE public.appointments RENAME COLUMN store_id TO tenant_id;
    ALTER TABLE public.appointments 
    ADD CONSTRAINT appointments_tenant_id_fkey 
    FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Tabela appointments migrada: store_id → tenant_id';
  END IF;
END $$;

-- PASSO 6: Alterar tabela sales (se existir coluna store_id)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sales' AND column_name = 'store_id'
  ) THEN
    ALTER TABLE public.sales DROP CONSTRAINT IF EXISTS sales_store_id_fkey;
    ALTER TABLE public.sales RENAME COLUMN store_id TO tenant_id;
    ALTER TABLE public.sales 
    ADD CONSTRAINT sales_tenant_id_fkey 
    FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Tabela sales migrada: store_id → tenant_id';
  END IF;
END $$;

-- PASSO 7: Alterar tabela staff (se existir coluna store_id)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'staff' AND column_name = 'store_id'
  ) THEN
    ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_store_id_fkey;
    ALTER TABLE public.staff RENAME COLUMN store_id TO tenant_id;
    ALTER TABLE public.staff 
    ADD CONSTRAINT staff_tenant_id_fkey 
    FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
    
    RAISE NOTICE 'Tabela staff migrada: store_id → tenant_id';
  END IF;
END $$;

-- PASSO 8: Recriar RLS policies para tenants
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own tenant" ON public.tenants;
CREATE POLICY "Users can view their own tenant"
  ON public.tenants FOR SELECT
  USING (id IN (SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Owners can update their tenant" ON public.tenants;
CREATE POLICY "Owners can update their tenant"
  ON public.tenants FOR UPDATE
  USING (id IN (
    SELECT tenant_id FROM public.profiles 
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

-- PASSO 9: Atualizar RLS policies de services
DROP POLICY IF EXISTS "Users can view services from their store" ON public.services;
DROP POLICY IF EXISTS "Staff can manage services" ON public.services;

CREATE POLICY "Users can view services from their tenant"
  ON public.services FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Staff can manage services"
  ON public.services FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()));

-- PASSO 10: Criar índices
CREATE INDEX IF NOT EXISTS idx_services_tenant ON public.services(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clients_tenant ON public.clients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_appointments_tenant ON public.appointments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sales_tenant ON public.sales(tenant_id);

-- Mensagem final
SELECT 'Migration concluída! Todas as tabelas agora usam tenant_id' as resultado;
