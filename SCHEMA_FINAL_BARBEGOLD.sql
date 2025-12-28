-- =============================================
-- BARBEGOLD - SCHEMA COMPLETO DEFINITIVO
-- Execute este SQL em um Supabase VAZIO
-- Versão: 3.0 - Multi-tenant SaaS com Stripe
-- =============================================

-- =============================================
-- 1. EXTENSÕES
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para busca por texto

-- =============================================
-- 2. FUNÇÕES AUXILIARES
-- =============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para obter tenant_id do usuário atual
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT tenant_id 
        FROM public.profiles 
        WHERE user_id = auth.uid()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 3. TABELAS CORE
-- =============================================

-- TABELA: tenants (Barbearias/Lojas)
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Informações Básicas
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Plano e Status  
    plan_id TEXT DEFAULT 'FREE' CHECK (plan_id IN ('FREE', 'SOLO', 'SOLO_PRO', 'EQUIPE', 'STUDIO', 'ENTERPRISE')),
    status TEXT DEFAULT 'TRIAL' CHECK (status IN ('ACTIVE', 'TRIAL', 'SUSPENDED', 'CANCELLED', 'OVERDUE')),
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    
    -- Stripe Integration
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    subscription_status TEXT CHECK (subscription_status IN ('ACTIVE', 'TRIAL', 'CANCELLED', 'PAST_DUE', 'INCOMPLETE', NULL)),
    
    -- Contato
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    
    -- Redes Sociais
    instagram TEXT,
    facebook TEXT,
    whatsapp TEXT,
    
    -- Branding
    logo_url TEXT,
    cover_url TEXT,
    
    -- Configurações (JSONB)
    settings JSONB DEFAULT '{
        "currency": "BRL",
        "timezone": "America/Sao_Paulo",
        "language": "pt-BR",
        "weekStartsOn": 0,
        "appointmentBuffer": 15,
        "allowOnlineBooking": true,
        "requireDeposit": false,
        "depositPercentage": 0
    }'::jsonb
);

-- View para compatibilidade com código legado que usa 'stores'
CREATE VIEW public.stores AS SELECT * FROM public.tenants;

-- TABELA: profiles (Funcionários/Staff)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informações Pessoais
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    
    -- Função e Permissões
    role TEXT DEFAULT 'PROFESSIONAL' CHECK (role IN ('OWNER', 'ADMIN', 'MANAGER', 'PROFESSIONAL', 'RECEPTIONIST', 'VIEWER')),
    is_active BOOLEAN DEFAULT true,
    
    -- Comissionamento
    commission_model TEXT DEFAULT 'PERCENTAGE' CHECK (commission_model IN ('PERCENTAGE', 'FIXED', 'MIXED')),
    service_commission_rate DECIMAL(5,2) DEFAULT 50.00 CHECK (service_commission_rate >= 0 AND service_commission_rate <= 100),
    product_commission_rate DECIMAL(5,2) DEFAULT 30.00 CHECK (product_commission_rate >= 0 AND product_commission_rate <= 100),
    rental_fee DECIMAL(10,2) DEFAULT 0,
    payment_frequency TEXT DEFAULT 'BIWEEKLY' CHECK (payment_frequency IN ('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY')),
    
    -- Horários de Trabalho (JSONB)
    working_hours JSONB DEFAULT '{
        "monday": {"enabled": true, "start": "09:00", "end": "18:00"},
        "tuesday": {"enabled": true, "start": "09:00", "end": "18:00"},
        "wednesday": {"enabled": true, "start": "09:00", "end": "18:00"},
        "thursday": {"enabled": true, "start": "09:00", "end": "18:00"},
        "friday": {"enabled": true, "start": "09:00", "end": "18:00"},
        "saturday": {"enabled": true, "start": "09:00", "end": "13:00"},
        "sunday": {"enabled": false}
    }'::jsonb,
    
    -- Configurações Pessoais
    preferences JSONB DEFAULT '{}'::jsonb,
    
    -- Compatibilidade: store_id aponta para tenant_id
    store_id UUID GENERATED ALWAYS AS (tenant_id) STORED
);

-- View para compatibilidade com código legado que usa 'staff'
CREATE VIEW public.staff AS SELECT * FROM public.profiles;

-- TABELA: clients (Clientes)
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Informações Pessoais
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    birth_date DATE,
    avatar_url TEXT,
    
    -- Endereço
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    
    -- Marketing
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    accepts_marketing BOOLEAN DEFAULT true,
    
    -- Fidelidade
    loyalty_points INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    visits_count INTEGER DEFAULT 0,
    last_visit_at TIMESTAMPTZ,
    
    -- Compatibilidade
    store_id UUID GENERATED ALWAYS AS (tenant_id) STORED
);

-- TABELA: service_categories (Categorias de Serviços)
CREATE TABLE public.service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    template_id UUID, -- Referência ao template original
    
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    icon TEXT,
    color TEXT,
    
    -- Compatibilidade
    store_id UUID GENERATED ALWAYS AS (tenant_id) STORED
);

-- TABELA: services (Serviços)
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
    template_id UUID, -- Referência ao template original
    
    -- Informações Básicas
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 30 CHECK (duration_minutes > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    
    -- Configurações
    is_active BOOLEAN DEFAULT true,
    is_combo BOOLEAN DEFAULT false,
    allow_online_booking BOOLEAN DEFAULT true,
    requires_confirmation BOOLEAN DEFAULT false,
    
    -- Visual
    image_url TEXT,
    color TEXT,
    
    -- Compatibilidade
    store_id UUID GENERATED ALWAYS AS (tenant_id) STORED
);

-- TABELA: bundle_items (Itens de Combo)
CREATE TABLE public.bundle_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    combo_service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    included_service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100)
);

-- TABELA: products (Produtos)
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Informações Básicas
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT,
    barcode TEXT,
    
    -- Preços
    cost_price DECIMAL(10,2) DEFAULT 0 CHECK (cost_price >= 0),
    sale_price DECIMAL(10,2) NOT NULL CHECK (sale_price >= 0),
    
    -- Estoque
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    min_stock INTEGER DEFAULT 0 CHECK (min_stock >= 0),
    
    -- Configurações
    is_active BOOLEAN DEFAULT true,
    track_stock BOOLEAN DEFAULT true,
    allow_negative_stock BOOLEAN DEFAULT false,
    
    -- Visual
    image_url TEXT,
    
    -- Compatibilidade
    store_id UUID GENERATED ALWAYS AS (tenant_id) STORED
);
