-- =============================================
-- RESET E SETUP COMPLETO DO BANCO
-- Execute este arquivo no Supabase SQL Editor
-- =============================================

-- PASSO 1: Limpar tudo que existe
-- =============================================

-- Desabilitar temporariamente as checagens de FK
SET session_replication_role = 'replica';

-- Dropar todas as tabelas se existirem
DROP TABLE IF EXISTS public.loyalty_stamps CASCADE;
DROP TABLE IF EXISTS public.loyalty_cards CASCADE;
DROP TABLE IF EXISTS public.queue_entries CASCADE;
DROP TABLE IF EXISTS public.commissions CASCADE;
DROP TABLE IF EXISTS public.cash_registers CASCADE;
DROP TABLE IF EXISTS public.sale_items CASCADE;
DROP TABLE IF EXISTS public.sales CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.inventory_movements CASCADE;
DROP TABLE IF EXISTS public.inventory CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.tenants CASCADE;

-- Reabilitar checagens de FK
SET session_replication_role = 'origin';

-- =============================================
-- PASSO 2: Criar estrutura simplificada para MVP
-- =============================================

-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de Lojas/Tenants (simplificada)
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  plan_id TEXT DEFAULT 'FREE',
  status TEXT DEFAULT 'ACTIVE',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Funcionários
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  role TEXT DEFAULT 'BARBER',
  email TEXT,
  phone TEXT,
  commission_model TEXT DEFAULT 'PERCENTAGE',
  service_commission_rate NUMERIC(5,2) DEFAULT 50.00,
  product_commission_rate NUMERIC(5,2) DEFAULT 10.00,
  chair_rental_amount NUMERIC(10,2),
  work_schedule JSONB,
  smart_break JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Clientes
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  birth_date DATE,
  document TEXT,
  tags TEXT[],
  notes TEXT,
  preferred_staff_id UUID REFERENCES public.staff(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Serviços
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Agendamentos
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id),
  staff_id UUID NOT NULL REFERENCES public.staff(id),
  service_id UUID NOT NULL REFERENCES public.services(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'SCHEDULED',
  total_amount NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Vendas
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id),
  staff_id UUID NOT NULL REFERENCES public.staff(id),
  appointment_id UUID REFERENCES public.appointments(id),
  total_amount NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2),
  tip_amount NUMERIC(10,2),
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'COMPLETED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Itens da Venda
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('SERVICE', 'PRODUCT')),
  item_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PASSO 3: Criar índices para performance
-- =============================================

CREATE INDEX idx_stores_owner ON public.stores(owner_id);
CREATE INDEX idx_staff_store ON public.staff(store_id);
CREATE INDEX idx_clients_store ON public.clients(store_id);
CREATE INDEX idx_services_store ON public.services(store_id);
CREATE INDEX idx_appointments_store ON public.appointments(store_id);
CREATE INDEX idx_appointments_date ON public.appointments(date);
CREATE INDEX idx_sales_store ON public.sales(store_id);

-- =============================================
-- PASSO 4: RLS (Row Level Security) Básico
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- Política simples: usuários podem ver dados da sua loja
CREATE POLICY "Users can view their store data" ON public.stores
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Users can manage their store staff" ON public.staff
  FOR ALL USING (
    store_id IN (
      SELECT id FROM public.stores WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their store clients" ON public.clients
  FOR ALL USING (
    store_id IN (
      SELECT id FROM public.stores WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their store services" ON public.services
  FOR ALL USING (
    store_id IN (
      SELECT id FROM public.stores WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their store appointments" ON public.appointments
  FOR ALL USING (
    store_id IN (
      SELECT id FROM public.stores WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their store sales" ON public.sales
  FOR ALL USING (
    store_id IN (
      SELECT id FROM public.stores WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can view sale items" ON public.sale_items
  FOR ALL USING (
    sale_id IN (
      SELECT id FROM public.sales WHERE store_id IN (
        SELECT id FROM public.stores WHERE owner_id = auth.uid()
      )
    )
  );

-- =============================================
-- PASSO 5: Dados iniciais para teste
-- =============================================

-- Criar uma loja padrão para o usuário admin (será executado após login)
-- O ID do usuário será preenchido quando ele fizer login pela primeira vez
