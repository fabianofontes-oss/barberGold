-- =============================================
-- BARBERFLOW - SCHEMA DO BANCO DE DADOS
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- =============================================

-- Habilita UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: tenants (Barbearias/Lojas)
-- =============================================
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT DEFAULT 'FREE',
  status TEXT DEFAULT 'TRIAL' CHECK (status IN ('ACTIVE', 'TRIAL', 'SUSPENDED', 'CANCELLED')),
  settings JSONB DEFAULT '{}'::jsonb,
  logo_url TEXT,
  phone TEXT,
  address TEXT,
  instagram TEXT
);

-- =============================================
-- TABELA: profiles (Funcionários/Staff)
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'STAFF' CHECK (role IN ('OWNER', 'ADMIN', 'BARBER', 'ASSISTANT', 'STAFF')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  commission_rate NUMERIC(5,2) DEFAULT 50.00,
  is_active BOOLEAN DEFAULT TRUE,
  work_schedule JSONB DEFAULT '[]'::jsonb,
  
  UNIQUE(tenant_id, user_id)
);

-- =============================================
-- TABELA: clients (Clientes)
-- =============================================
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  birth_date DATE,
  total_spent NUMERIC(10,2) DEFAULT 0,
  loyalty_points INTEGER DEFAULT 0,
  last_visit TIMESTAMPTZ,
  notes TEXT,
  referral_code TEXT,
  referred_by TEXT
);

-- Índice para busca rápida por tenant
CREATE INDEX idx_clients_tenant ON public.clients(tenant_id);
CREATE INDEX idx_clients_phone ON public.clients(tenant_id, phone);

-- =============================================
-- TABELA: services (Serviços)
-- =============================================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_services_tenant ON public.services(tenant_id);

-- =============================================
-- TABELA: products (Produtos)
-- =============================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  cost_price NUMERIC(10,2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_products_tenant ON public.products(tenant_id);

-- =============================================
-- TABELA: appointments (Agendamentos)
-- =============================================
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'BLOCKED')),
  notes TEXT
);

CREATE INDEX idx_appointments_tenant ON public.appointments(tenant_id);
CREATE INDEX idx_appointments_date ON public.appointments(tenant_id, scheduled_at);
CREATE INDEX idx_appointments_staff ON public.appointments(staff_id, scheduled_at);

-- =============================================
-- TABELA: sales (Vendas)
-- =============================================
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'OTHER')),
  tip NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  notes TEXT
);

CREATE INDEX idx_sales_tenant ON public.sales(tenant_id);
CREATE INDEX idx_sales_date ON public.sales(tenant_id, created_at);

-- =============================================
-- TABELA: sale_items (Itens da Venda)
-- =============================================
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('SERVICE', 'PRODUCT')),
  item_id UUID NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1
);

CREATE INDEX idx_sale_items_sale ON public.sale_items(sale_id);

-- =============================================
-- TABELA: expenses (Despesas)
-- =============================================
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL,
  expense_date DATE NOT NULL,
  notes TEXT
);

CREATE INDEX idx_expenses_tenant ON public.expenses(tenant_id);
CREATE INDEX idx_expenses_date ON public.expenses(tenant_id, expense_date);

-- =============================================
-- ROW LEVEL SECURITY (RLS) - MULTI-TENANT
-- =============================================

-- Habilita RLS em todas as tabelas
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS RLS: tenants
-- =============================================
CREATE POLICY "Owners can view their tenant"
  ON public.tenants FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can update their tenant"
  ON public.tenants FOR UPDATE
  USING (owner_id = auth.uid());

-- =============================================
-- POLÍTICAS RLS: profiles
-- =============================================
CREATE POLICY "Users can view profiles of their tenant"
  ON public.profiles FOR SELECT
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE owner_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Owners can manage profiles"
  ON public.profiles FOR ALL
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE owner_id = auth.uid()
    )
  );

-- =============================================
-- POLÍTICAS RLS: clients
-- =============================================
CREATE POLICY "Staff can view clients of their tenant"
  ON public.clients FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage clients of their tenant"
  ON public.clients FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- POLÍTICAS RLS: services
-- =============================================
CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Owners can manage services"
  ON public.services FOR ALL
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE owner_id = auth.uid()
    )
  );

-- =============================================
-- POLÍTICAS RLS: products
-- =============================================
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Owners can manage products"
  ON public.products FOR ALL
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE owner_id = auth.uid()
    )
  );

-- =============================================
-- POLÍTICAS RLS: appointments
-- =============================================
CREATE POLICY "Staff can view appointments of their tenant"
  ON public.appointments FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage appointments of their tenant"
  ON public.appointments FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- POLÍTICAS RLS: sales
-- =============================================
CREATE POLICY "Staff can view sales of their tenant"
  ON public.sales FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can create sales"
  ON public.sales FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- POLÍTICAS RLS: sale_items
-- =============================================
CREATE POLICY "Users can view sale_items via sale"
  ON public.sale_items FOR SELECT
  USING (
    sale_id IN (
      SELECT id FROM public.sales WHERE tenant_id IN (
        SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert sale_items"
  ON public.sale_items FOR INSERT
  WITH CHECK (
    sale_id IN (
      SELECT id FROM public.sales WHERE tenant_id IN (
        SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

-- =============================================
-- POLÍTICAS RLS: expenses
-- =============================================
CREATE POLICY "Owners can view expenses"
  ON public.expenses FOR SELECT
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can manage expenses"
  ON public.expenses FOR ALL
  USING (
    tenant_id IN (
      SELECT id FROM public.tenants WHERE owner_id = auth.uid()
    )
  );

-- =============================================
-- FIM DO SCHEMA
-- =============================================
