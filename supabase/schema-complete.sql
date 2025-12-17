-- =============================================
-- BARBERFLOW - SCHEMA COMPLETO DO BANCO DE DADOS
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- Versão: 2.0 - Multi-tenant SaaS
-- =============================================

-- Habilita extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- MÓDULO 1: CORE (Tenants & Auth)
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
  
  -- Configurações Gerais (JSONB para flexibilidade)
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

CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_owner ON public.tenants(owner_id);

-- TABELA: profiles (Funcionários/Staff)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informações
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  
  -- Função
  role TEXT DEFAULT 'STAFF' CHECK (role IN ('OWNER', 'ADMIN', 'MANAGER', 'BARBER', 'ASSISTANT', 'RECEPTIONIST', 'STAFF')),
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Comissão
  commission_model TEXT DEFAULT 'PERCENTAGE' CHECK (commission_model IN ('PERCENTAGE', 'FIXED', 'TIERED', 'NONE')),
  commission_rate NUMERIC(5,2) DEFAULT 50.00,
  commission_config JSONB DEFAULT '{}'::jsonb,
  
  -- Agenda
  work_schedule JSONB DEFAULT '[
    {"day": 0, "enabled": false, "start": "09:00", "end": "18:00", "breaks": []},
    {"day": 1, "enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
    {"day": 2, "enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
    {"day": 3, "enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
    {"day": 4, "enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
    {"day": 5, "enabled": true, "start": "09:00", "end": "18:00", "breaks": [{"start": "12:00", "end": "13:00"}]},
    {"day": 6, "enabled": true, "start": "09:00", "end": "15:00", "breaks": []}
  ]'::jsonb,
  
  -- Metas
  daily_goal NUMERIC(10,2) DEFAULT 0,
  monthly_goal NUMERIC(10,2) DEFAULT 0,
  
  UNIQUE(tenant_id, user_id)
);

CREATE INDEX idx_profiles_tenant ON public.profiles(tenant_id);
CREATE INDEX idx_profiles_user ON public.profiles(user_id);

-- =============================================
-- MÓDULO 2: CATÁLOGO (Services & Products)
-- =============================================

-- TABELA: categories (Categorias)
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('SERVICE', 'PRODUCT')),
  color TEXT DEFAULT '#f59e0b',
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_categories_tenant ON public.categories(tenant_id);

-- TABELA: services (Serviços)
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  
  -- Configurações
  is_active BOOLEAN DEFAULT TRUE,
  allow_online_booking BOOLEAN DEFAULT TRUE,
  requires_deposit BOOLEAN DEFAULT FALSE,
  deposit_amount NUMERIC(10,2) DEFAULT 0,
  
  -- Comissão específica (override do padrão do staff)
  commission_override NUMERIC(5,2),
  
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_services_tenant ON public.services(tenant_id);
CREATE INDEX idx_services_category ON public.services(category_id);

-- TABELA: products (Produtos)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  barcode TEXT,
  
  -- Preços
  price NUMERIC(10,2) NOT NULL,
  cost_price NUMERIC(10,2) DEFAULT 0,
  
  -- Estoque
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 5,
  track_stock BOOLEAN DEFAULT TRUE,
  
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_products_tenant ON public.products(tenant_id);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_sku ON public.products(tenant_id, sku);

-- =============================================
-- MÓDULO 3: CLIENTES (CRM)
-- =============================================

-- TABELA: clients (Clientes)
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Informações Básicas
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  cpf TEXT,
  
  -- Data de Nascimento
  birth_date DATE,
  
  -- Endereço
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  
  -- Avatar
  avatar_url TEXT,
  
  -- Estatísticas (desnormalizado para performance)
  total_spent NUMERIC(10,2) DEFAULT 0,
  total_visits INTEGER DEFAULT 0,
  last_visit TIMESTAMPTZ,
  average_ticket NUMERIC(10,2) DEFAULT 0,
  
  -- Fidelidade
  loyalty_points INTEGER DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'BRONZE' CHECK (loyalty_tier IN ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND')),
  
  -- Indicação
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  
  -- Tags e Notas
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  
  -- Preferências
  preferred_staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  preferred_services UUID[] DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_blocked BOOLEAN DEFAULT FALSE,
  blocked_reason TEXT
);

CREATE INDEX idx_clients_tenant ON public.clients(tenant_id);
CREATE INDEX idx_clients_phone ON public.clients(tenant_id, phone);
CREATE INDEX idx_clients_email ON public.clients(tenant_id, email);
CREATE INDEX idx_clients_referral_code ON public.clients(referral_code);

-- =============================================
-- MÓDULO 4: AGENDAMENTO
-- =============================================

-- TABELA: appointments (Agendamentos)
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Relacionamentos
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  
  -- Data/Hora
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  
  -- Preço
  price NUMERIC(10,2) NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'SCHEDULED' CHECK (status IN (
    'SCHEDULED',    -- Agendado
    'CONFIRMED',    -- Confirmado pelo cliente
    'IN_PROGRESS',  -- Em andamento
    'COMPLETED',    -- Concluído
    'CANCELLED',    -- Cancelado
    'NO_SHOW',      -- Não compareceu
    'BLOCKED'       -- Bloqueio de agenda
  )),
  
  -- Fonte do agendamento
  source TEXT DEFAULT 'MANUAL' CHECK (source IN ('MANUAL', 'ONLINE', 'WHATSAPP', 'INSTAGRAM', 'PHONE')),
  
  -- Recorrência
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT, -- RRULE format
  parent_appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  
  -- Notas
  notes TEXT,
  internal_notes TEXT,
  
  -- Confirmação
  confirmed_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,
  
  -- Cancelamento
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT
);

CREATE INDEX idx_appointments_tenant ON public.appointments(tenant_id);
CREATE INDEX idx_appointments_scheduled ON public.appointments(tenant_id, scheduled_at);
CREATE INDEX idx_appointments_staff ON public.appointments(staff_id, scheduled_at);
CREATE INDEX idx_appointments_client ON public.appointments(client_id);
CREATE INDEX idx_appointments_status ON public.appointments(tenant_id, status);

-- =============================================
-- MÓDULO 5: VENDAS & PDV
-- =============================================

-- TABELA: sales (Vendas)
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Relacionamentos
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  
  -- Valores
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  discount_type TEXT CHECK (discount_type IN ('PERCENTAGE', 'FIXED')),
  discount_reason TEXT,
  tip NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  
  -- Pagamento
  payment_method TEXT NOT NULL CHECK (payment_method IN ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'VOUCHER', 'LOYALTY', 'MIXED', 'OTHER')),
  payment_details JSONB DEFAULT '{}'::jsonb, -- Para pagamentos mistos
  
  -- Status
  status TEXT DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'REFUNDED', 'PARTIALLY_REFUNDED')),
  
  -- Notas
  notes TEXT,
  
  -- Fechamento de Caixa
  cash_closure_id UUID REFERENCES public.cash_closures(id) ON DELETE SET NULL
);

CREATE INDEX idx_sales_tenant ON public.sales(tenant_id);
CREATE INDEX idx_sales_date ON public.sales(tenant_id, created_at);
CREATE INDEX idx_sales_client ON public.sales(client_id);
CREATE INDEX idx_sales_staff ON public.sales(staff_id);

-- TABELA: sale_items (Itens da Venda)
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  
  item_type TEXT NOT NULL CHECK (item_type IN ('SERVICE', 'PRODUCT')),
  item_id UUID NOT NULL,
  
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  
  -- Comissão calculada
  commission_rate NUMERIC(5,2),
  commission_amount NUMERIC(10,2),
  
  -- Staff que executou (pode ser diferente do vendedor)
  executed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE INDEX idx_sale_items_sale ON public.sale_items(sale_id);

-- =============================================
-- MÓDULO 6: FINANCEIRO
-- =============================================

-- TABELA: cash_closures (Fechamento de Caixa)
CREATE TABLE public.cash_closures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Período
  opened_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ,
  
  -- Quem fechou
  closed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Valores Esperados (calculado)
  expected_cash NUMERIC(10,2) DEFAULT 0,
  expected_card NUMERIC(10,2) DEFAULT 0,
  expected_pix NUMERIC(10,2) DEFAULT 0,
  expected_total NUMERIC(10,2) DEFAULT 0,
  
  -- Valores Informados (pelo operador)
  actual_cash NUMERIC(10,2),
  actual_card NUMERIC(10,2),
  actual_pix NUMERIC(10,2),
  actual_total NUMERIC(10,2),
  
  -- Diferença
  difference NUMERIC(10,2),
  
  -- Status
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'REVIEWED')),
  
  -- Blind Close (fechamento cego)
  is_blind BOOLEAN DEFAULT FALSE,
  
  notes TEXT
);

CREATE INDEX idx_cash_closures_tenant ON public.cash_closures(tenant_id);
CREATE INDEX idx_cash_closures_date ON public.cash_closures(tenant_id, opened_at);

-- TABELA: expenses (Despesas)
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(10,2) NOT NULL,
  
  category TEXT NOT NULL CHECK (category IN (
    'RENT', 'UTILITIES', 'SUPPLIES', 'EQUIPMENT', 'MARKETING',
    'SALARIES', 'TAXES', 'MAINTENANCE', 'OTHER'
  )),
  
  expense_date DATE NOT NULL,
  payment_method TEXT,
  
  -- Recorrência
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  
  -- Comprovante
  receipt_url TEXT,
  
  notes TEXT
);

CREATE INDEX idx_expenses_tenant ON public.expenses(tenant_id);
CREATE INDEX idx_expenses_date ON public.expenses(tenant_id, expense_date);
CREATE INDEX idx_expenses_category ON public.expenses(tenant_id, category);

-- TABELA: commissions (Comissões)
CREATE TABLE public.commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
  sale_item_id UUID REFERENCES public.sale_items(id) ON DELETE SET NULL,
  
  -- Valores
  sale_amount NUMERIC(10,2) NOT NULL,
  commission_rate NUMERIC(5,2) NOT NULL,
  commission_amount NUMERIC(10,2) NOT NULL,
  
  -- Pagamento
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'CANCELLED')),
  paid_at TIMESTAMPTZ,
  
  -- Período
  reference_date DATE NOT NULL
);

CREATE INDEX idx_commissions_tenant ON public.commissions(tenant_id);
CREATE INDEX idx_commissions_staff ON public.commissions(staff_id);
CREATE INDEX idx_commissions_date ON public.commissions(tenant_id, reference_date);
CREATE INDEX idx_commissions_status ON public.commissions(tenant_id, status);

-- =============================================
-- MÓDULO 7: WEBSITE & BRAND
-- =============================================

-- TABELA: website_config (Configuração do Site)
CREATE TABLE public.website_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID UNIQUE NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Tema
  theme_template TEXT DEFAULT 'PREMIUM' CHECK (theme_template IN ('PREMIUM', 'CLASSIC', 'CUSTOM')),
  premium_background TEXT DEFAULT 'DARK' CHECK (premium_background IN ('DARK', 'GRAY', 'LIGHT')),
  
  -- Cores Customizadas (quando theme_template = 'CUSTOM')
  custom_colors JSONB DEFAULT '{
    "primary": "#09090b",
    "secondary": "#18181b",
    "accent": "#f59e0b",
    "text": "#ffffff",
    "borderRadius": "1rem"
  }'::jsonb,
  
  -- Hero Section
  hero_title TEXT DEFAULT 'Bem-vindo à Nossa Barbearia',
  hero_subtitle TEXT DEFAULT 'Tradição, estilo e qualidade em cada corte',
  hero_image TEXT,
  cover_opacity NUMERIC(3,2) DEFAULT 0.5,
  
  -- About Section
  about_title TEXT DEFAULT 'Sobre Nós',
  about_text TEXT,
  about_image TEXT,
  
  -- Layout (ordem das seções)
  section_order TEXT[] DEFAULT ARRAY['HERO', 'SERVICES', 'ABOUT', 'TEAM', 'GALLERY', 'REVIEWS', 'PRODUCTS', 'LOCATION'],
  
  -- Galeria
  gallery JSONB DEFAULT '[]'::jsonb,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Analytics
  google_analytics_id TEXT,
  facebook_pixel_id TEXT
);

CREATE INDEX idx_website_config_tenant ON public.website_config(tenant_id);

-- TABELA: website_reviews (Avaliações do Site)
CREATE TABLE public.website_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
  
  -- Avaliação
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  -- Visibilidade
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Resposta do dono
  owner_reply TEXT,
  replied_at TIMESTAMPTZ
);

CREATE INDEX idx_website_reviews_tenant ON public.website_reviews(tenant_id);
CREATE INDEX idx_website_reviews_published ON public.website_reviews(tenant_id, is_published);

-- =============================================
-- MÓDULO 8: FIDELIDADE (Loyalty / Barber Club)
-- =============================================

-- TABELA: loyalty_config (Configuração de Fidelidade)
CREATE TABLE public.loyalty_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID UNIQUE NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  is_enabled BOOLEAN DEFAULT TRUE,
  
  -- Regras de pontos
  points_per_currency NUMERIC(5,2) DEFAULT 1, -- 1 ponto por R$1 gasto
  points_currency_value NUMERIC(10,2) DEFAULT 1, -- R$1 por ponto
  
  -- Multiplicadores por tier
  tier_multipliers JSONB DEFAULT '{
    "BRONZE": 1,
    "SILVER": 1.25,
    "GOLD": 1.5,
    "PLATINUM": 2,
    "DIAMOND": 3
  }'::jsonb,
  
  -- Thresholds para subir de tier (pontos acumulados)
  tier_thresholds JSONB DEFAULT '{
    "BRONZE": 0,
    "SILVER": 500,
    "GOLD": 1500,
    "PLATINUM": 5000,
    "DIAMOND": 15000
  }'::jsonb,
  
  -- Expiração de pontos (dias, 0 = nunca expira)
  points_expiration_days INTEGER DEFAULT 365
);

-- TABELA: loyalty_transactions (Transações de Pontos)
CREATE TABLE public.loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  
  -- Tipo
  type TEXT NOT NULL CHECK (type IN ('EARN', 'REDEEM', 'EXPIRE', 'ADJUST', 'BONUS')),
  
  -- Valores
  points INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  
  -- Referência
  sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
  
  description TEXT,
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_loyalty_transactions_tenant ON public.loyalty_transactions(tenant_id);
CREATE INDEX idx_loyalty_transactions_client ON public.loyalty_transactions(client_id);

-- TABELA: loyalty_rewards (Recompensas)
CREATE TABLE public.loyalty_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Custo em pontos
  points_cost INTEGER NOT NULL,
  
  -- Tipo de recompensa
  reward_type TEXT NOT NULL CHECK (reward_type IN ('SERVICE', 'PRODUCT', 'DISCOUNT_PERCENTAGE', 'DISCOUNT_FIXED', 'FREE_ITEM')),
  reward_value NUMERIC(10,2), -- Valor do desconto ou ID do item
  reward_item_id UUID, -- ID do serviço ou produto (se aplicável)
  
  -- Limites
  min_tier TEXT DEFAULT 'BRONZE',
  max_redemptions_per_client INTEGER,
  total_available INTEGER,
  
  -- Período
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_loyalty_rewards_tenant ON public.loyalty_rewards(tenant_id);

-- =============================================
-- MÓDULO 9: INDICAÇÕES (Referrals)
-- =============================================

-- TABELA: referral_config (Configuração de Indicações)
CREATE TABLE public.referral_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID UNIQUE NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  is_enabled BOOLEAN DEFAULT TRUE,
  
  -- Recompensa para quem indica
  referrer_reward_type TEXT DEFAULT 'PERCENTAGE' CHECK (referrer_reward_type IN ('PERCENTAGE', 'FIXED', 'POINTS')),
  referrer_reward_value NUMERIC(10,2) DEFAULT 10, -- 10% ou R$10 ou 100 pontos
  
  -- Recompensa para quem é indicado
  referee_reward_type TEXT DEFAULT 'PERCENTAGE' CHECK (referee_reward_type IN ('PERCENTAGE', 'FIXED', 'POINTS', 'NONE')),
  referee_reward_value NUMERIC(10,2) DEFAULT 10,
  
  -- Regras
  min_purchase_amount NUMERIC(10,2) DEFAULT 0, -- Valor mínimo para validar indicação
  max_referrals_per_month INTEGER, -- Limite de indicações por mês
  
  -- Código do dono (para indicar a barbearia)
  owner_referral_code TEXT UNIQUE
);

-- TABELA: referral_links (Links de Indicação)
CREATE TABLE public.referral_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Quem criou o link
  referrer_type TEXT NOT NULL CHECK (referrer_type IN ('CLIENT', 'STAFF', 'PARTNER')),
  referrer_id UUID NOT NULL, -- client_id ou staff_id
  
  -- Código único
  code TEXT UNIQUE NOT NULL,
  
  -- Estatísticas
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  total_revenue NUMERIC(10,2) DEFAULT 0,
  
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_referral_links_tenant ON public.referral_links(tenant_id);
CREATE INDEX idx_referral_links_code ON public.referral_links(code);

-- TABELA: referral_conversions (Conversões de Indicação)
CREATE TABLE public.referral_conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  referral_link_id UUID NOT NULL REFERENCES public.referral_links(id) ON DELETE CASCADE,
  
  -- Novo cliente
  new_client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  
  -- Venda que validou
  sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
  sale_amount NUMERIC(10,2),
  
  -- Recompensas
  referrer_reward NUMERIC(10,2),
  referee_reward NUMERIC(10,2),
  
  -- Status
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VALIDATED', 'PAID', 'CANCELLED'))
);

CREATE INDEX idx_referral_conversions_tenant ON public.referral_conversions(tenant_id);
CREATE INDEX idx_referral_conversions_link ON public.referral_conversions(referral_link_id);

-- =============================================
-- MÓDULO 10: GORJETAS (Tips)
-- =============================================

-- TABELA: tips (Gorjetas)
CREATE TABLE public.tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  sale_id UUID REFERENCES public.sales(id) ON DELETE SET NULL,
  staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  
  -- Avaliação junto com a gorjeta
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT
);

CREATE INDEX idx_tips_tenant ON public.tips(tenant_id);
CREATE INDEX idx_tips_staff ON public.tips(staff_id);

-- =============================================
-- MÓDULO 11: NOTIFICAÇÕES
-- =============================================

-- TABELA: notifications (Notificações)
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Destinatário
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('STAFF', 'CLIENT')),
  recipient_id UUID NOT NULL,
  
  -- Conteúdo
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  
  -- Tipo
  type TEXT NOT NULL CHECK (type IN (
    'APPOINTMENT_REMINDER',
    'APPOINTMENT_CONFIRMED',
    'APPOINTMENT_CANCELLED',
    'LOYALTY_POINTS_EARNED',
    'LOYALTY_TIER_UP',
    'BIRTHDAY',
    'PROMOTION',
    'SYSTEM'
  )),
  
  -- Metadados
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Canal de envio
  sent_via TEXT[] DEFAULT '{}' -- ['push', 'email', 'sms', 'whatsapp']
);

CREATE INDEX idx_notifications_tenant ON public.notifications(tenant_id);
CREATE INDEX idx_notifications_recipient ON public.notifications(recipient_type, recipient_id);
CREATE INDEX idx_notifications_unread ON public.notifications(recipient_id, is_read) WHERE is_read = FALSE;

-- =============================================
-- MÓDULO 12: SUPER ADMIN (SaaS Management)
-- =============================================

-- TABELA: saas_plans (Planos SaaS)
CREATE TABLE public.saas_plans (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Preços
  monthly_price_brl NUMERIC(10,2) NOT NULL,
  yearly_price_brl NUMERIC(10,2),
  
  -- Limites
  max_staff INTEGER DEFAULT 1,
  max_locations INTEGER DEFAULT 1,
  
  -- Features
  features JSONB DEFAULT '{
    "ONLINE_BOOKING": false,
    "LOYALTY": false,
    "ADVANCED_REPORTS": false,
    "MULTI_SHOP": false,
    "WEBSITE_PREMIUM": false,
    "COMMISSIONS": false,
    "BLIND_CASH_CLOSURE": false
  }'::jsonb,
  
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

-- TABELA: saas_invoices (Faturas SaaS)
CREATE TABLE public.saas_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  -- Período
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Valores
  amount NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED')),
  
  -- Pagamento
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  payment_reference TEXT,
  
  -- Vencimento
  due_date DATE NOT NULL
);

CREATE INDEX idx_saas_invoices_tenant ON public.saas_invoices(tenant_id);
CREATE INDEX idx_saas_invoices_status ON public.saas_invoices(status);
CREATE INDEX idx_saas_invoices_due ON public.saas_invoices(due_date);

-- TABELA: support_tickets (Tickets de Suporte)
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  
  priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'WAITING_RESPONSE', 'RESOLVED', 'CLOSED')),
  
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT
);

CREATE INDEX idx_support_tickets_tenant ON public.support_tickets(tenant_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);

-- TABELA: support_messages (Mensagens de Suporte)
CREATE TABLE public.support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  
  sender_type TEXT NOT NULL CHECK (sender_type IN ('TENANT', 'SUPPORT')),
  sender_id UUID NOT NULL,
  
  message TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}'
);

CREATE INDEX idx_support_messages_ticket ON public.support_messages(ticket_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS) - MULTI-TENANT
-- =============================================

-- Habilita RLS em todas as tabelas
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- FUNÇÃO HELPER: get_user_tenant_id
-- Retorna o tenant_id do usuário atual
-- =============================================
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =============================================
-- FUNÇÃO HELPER: is_tenant_owner
-- Verifica se o usuário é dono do tenant
-- =============================================
CREATE OR REPLACE FUNCTION public.is_tenant_owner(tenant_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenants 
    WHERE id = tenant_uuid AND owner_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =============================================
-- POLÍTICAS RLS: tenants
-- =============================================
CREATE POLICY "Users can view their tenant"
  ON public.tenants FOR SELECT
  USING (
    owner_id = auth.uid() OR
    id IN (SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Owners can update their tenant"
  ON public.tenants FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Anyone can create tenant"
  ON public.tenants FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- =============================================
-- POLÍTICAS RLS: profiles
-- =============================================
CREATE POLICY "Users can view profiles of their tenant"
  ON public.profiles FOR SELECT
  USING (tenant_id = public.get_user_tenant_id() OR user_id = auth.uid());

CREATE POLICY "Owners can manage profiles"
  ON public.profiles FOR ALL
  USING (public.is_tenant_owner(tenant_id));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (user_id = auth.uid());

-- =============================================
-- POLÍTICAS RLS: categories
-- =============================================
CREATE POLICY "Users can view categories"
  ON public.categories FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Owners can manage categories"
  ON public.categories FOR ALL
  USING (public.is_tenant_owner(tenant_id));

-- =============================================
-- POLÍTICAS RLS: services
-- =============================================
CREATE POLICY "Public can view active services by slug"
  ON public.services FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Staff can view all services"
  ON public.services FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Owners can manage services"
  ON public.services FOR ALL
  USING (public.is_tenant_owner(tenant_id));

-- =============================================
-- POLÍTICAS RLS: products
-- =============================================
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Staff can view all products"
  ON public.products FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Owners can manage products"
  ON public.products FOR ALL
  USING (public.is_tenant_owner(tenant_id));

-- =============================================
-- POLÍTICAS RLS: clients
-- =============================================
CREATE POLICY "Staff can view clients"
  ON public.clients FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Staff can manage clients"
  ON public.clients FOR ALL
  USING (tenant_id = public.get_user_tenant_id());

-- =============================================
-- POLÍTICAS RLS: appointments
-- =============================================
CREATE POLICY "Staff can view appointments"
  ON public.appointments FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Staff can manage appointments"
  ON public.appointments FOR ALL
  USING (tenant_id = public.get_user_tenant_id());

-- =============================================
-- POLÍTICAS RLS: sales
-- =============================================
CREATE POLICY "Staff can view sales"
  ON public.sales FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Staff can create sales"
  ON public.sales FOR INSERT
  WITH CHECK (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Owners can manage sales"
  ON public.sales FOR ALL
  USING (public.is_tenant_owner(tenant_id));

-- =============================================
-- POLÍTICAS RLS: sale_items
-- =============================================
CREATE POLICY "Users can view sale_items via sale"
  ON public.sale_items FOR SELECT
  USING (
    sale_id IN (
      SELECT id FROM public.sales WHERE tenant_id = public.get_user_tenant_id()
    )
  );

CREATE POLICY "Users can insert sale_items"
  ON public.sale_items FOR INSERT
  WITH CHECK (
    sale_id IN (
      SELECT id FROM public.sales WHERE tenant_id = public.get_user_tenant_id()
    )
  );

-- =============================================
-- POLÍTICAS RLS: cash_closures
-- =============================================
CREATE POLICY "Staff can view cash closures"
  ON public.cash_closures FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Owners can manage cash closures"
  ON public.cash_closures FOR ALL
  USING (public.is_tenant_owner(tenant_id));

-- =============================================
-- POLÍTICAS RLS: expenses
-- =============================================
CREATE POLICY "Owners can view expenses"
  ON public.expenses FOR SELECT
  USING (public.is_tenant_owner(tenant_id));

CREATE POLICY "Owners can manage expenses"
  ON public.expenses FOR ALL
  USING (public.is_tenant_owner(tenant_id));

-- =============================================
-- POLÍTICAS RLS: commissions
-- =============================================
CREATE POLICY "Staff can view own commissions"
  ON public.commissions FOR SELECT
  USING (
    staff_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_tenant_owner(tenant_id)
  );

CREATE POLICY "Owners can manage commissions"
  ON public.commissions FOR ALL
  USING (public.is_tenant_owner(tenant_id));

-- =============================================
-- POLÍTICAS RLS: website_config
-- =============================================
CREATE POLICY "Public can view website config"
  ON public.website_config FOR SELECT
  USING (TRUE);

CREATE POLICY "Owners can manage website config"
  ON public.website_config FOR ALL
  USING (public.is_tenant_owner(tenant_id));

-- =============================================
-- POLÍTICAS RLS: website_reviews
-- =============================================
CREATE POLICY "Public can view published reviews"
  ON public.website_reviews FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Staff can view all reviews"
  ON public.website_reviews FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Owners can manage reviews"
  ON public.website_reviews FOR ALL
  USING (public.is_tenant_owner(tenant_id));

-- =============================================
-- POLÍTICAS RLS: loyalty_config
-- =============================================
CREATE POLICY "Staff can view loyalty config"
  ON public.loyalty_config FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Owners can manage loyalty config"
  ON public.loyalty_config FOR ALL
  USING (public.is_tenant_owner(tenant_id));

-- =============================================
-- POLÍTICAS RLS: loyalty_transactions
-- =============================================
CREATE POLICY "Staff can view loyalty transactions"
  ON public.loyalty_transactions FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Staff can create loyalty transactions"
  ON public.loyalty_transactions FOR INSERT
  WITH CHECK (tenant_id = public.get_user_tenant_id());

-- =============================================
-- POLÍTICAS RLS: loyalty_rewards
-- =============================================
CREATE POLICY "Staff can view loyalty rewards"
  ON public.loyalty_rewards FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Owners can manage loyalty rewards"
  ON public.loyalty_rewards FOR ALL
  USING (public.is_tenant_owner(tenant_id));

-- =============================================
-- POLÍTICAS RLS: referral_config
-- =============================================
CREATE POLICY "Staff can view referral config"
  ON public.referral_config FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Owners can manage referral config"
  ON public.referral_config FOR ALL
  USING (public.is_tenant_owner(tenant_id));

-- =============================================
-- POLÍTICAS RLS: referral_links
-- =============================================
CREATE POLICY "Staff can view referral links"
  ON public.referral_links FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Staff can create referral links"
  ON public.referral_links FOR INSERT
  WITH CHECK (tenant_id = public.get_user_tenant_id());

-- =============================================
-- POLÍTICAS RLS: referral_conversions
-- =============================================
CREATE POLICY "Staff can view referral conversions"
  ON public.referral_conversions FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

-- =============================================
-- POLÍTICAS RLS: tips
-- =============================================
CREATE POLICY "Staff can view tips"
  ON public.tips FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Staff can create tips"
  ON public.tips FOR INSERT
  WITH CHECK (tenant_id = public.get_user_tenant_id());

-- =============================================
-- POLÍTICAS RLS: notifications
-- =============================================
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (
    recipient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR recipient_id IN (SELECT id FROM public.clients WHERE tenant_id = public.get_user_tenant_id())
  );

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (
    recipient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- =============================================
-- POLÍTICAS RLS: saas_invoices
-- =============================================
CREATE POLICY "Owners can view invoices"
  ON public.saas_invoices FOR SELECT
  USING (public.is_tenant_owner(tenant_id));

-- =============================================
-- POLÍTICAS RLS: support_tickets
-- =============================================
CREATE POLICY "Owners can view support tickets"
  ON public.support_tickets FOR SELECT
  USING (public.is_tenant_owner(tenant_id));

CREATE POLICY "Owners can create support tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (public.is_tenant_owner(tenant_id));

CREATE POLICY "Owners can update support tickets"
  ON public.support_tickets FOR UPDATE
  USING (public.is_tenant_owner(tenant_id));

-- =============================================
-- POLÍTICAS RLS: support_messages
-- =============================================
CREATE POLICY "Users can view messages of their tickets"
  ON public.support_messages FOR SELECT
  USING (
    ticket_id IN (
      SELECT id FROM public.support_tickets WHERE public.is_tenant_owner(tenant_id)
    )
  );

CREATE POLICY "Users can create messages"
  ON public.support_messages FOR INSERT
  WITH CHECK (
    ticket_id IN (
      SELECT id FROM public.support_tickets WHERE public.is_tenant_owner(tenant_id)
    )
  );

-- =============================================
-- TRIGGERS: updated_at automático
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplica trigger em todas as tabelas com updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.website_config FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- DADOS INICIAIS: Planos SaaS
-- =============================================
INSERT INTO public.saas_plans (id, name, description, monthly_price_brl, yearly_price_brl, max_staff, max_locations, features, sort_order) VALUES
('FREE', 'Gratuito', 'Para começar', 0, 0, 1, 1, '{"ONLINE_BOOKING": false, "LOYALTY": false, "ADVANCED_REPORTS": false, "MULTI_SHOP": false, "WEBSITE_PREMIUM": false, "COMMISSIONS": false, "BLIND_CASH_CLOSURE": false}', 1),
('SOLO', 'Solo', 'Para profissionais autônomos', 49, 490, 1, 1, '{"ONLINE_BOOKING": false, "LOYALTY": false, "ADVANCED_REPORTS": false, "MULTI_SHOP": false, "WEBSITE_PREMIUM": false, "COMMISSIONS": false, "BLIND_CASH_CLOSURE": false}', 2),
('SOLO_PRO', 'Solo Pro', 'Solo com agendamento online', 59, 590, 1, 1, '{"ONLINE_BOOKING": true, "LOYALTY": false, "ADVANCED_REPORTS": false, "MULTI_SHOP": false, "WEBSITE_PREMIUM": false, "COMMISSIONS": false, "BLIND_CASH_CLOSURE": false}', 3),
('EQUIPE', 'Equipe', 'Para pequenas equipes', 79, 790, 3, 1, '{"ONLINE_BOOKING": true, "LOYALTY": true, "ADVANCED_REPORTS": true, "MULTI_SHOP": false, "WEBSITE_PREMIUM": false, "COMMISSIONS": true, "BLIND_CASH_CLOSURE": true}', 4),
('STUDIO', 'Studio', 'Para barbearias em crescimento', 119, 1190, 6, 2, '{"ONLINE_BOOKING": true, "LOYALTY": true, "ADVANCED_REPORTS": true, "MULTI_SHOP": true, "WEBSITE_PREMIUM": true, "COMMISSIONS": true, "BLIND_CASH_CLOSURE": true}', 5),
('ENTERPRISE', 'Enterprise', 'Para redes e franquias', 899, 8990, 999, 999, '{"ONLINE_BOOKING": true, "LOYALTY": true, "ADVANCED_REPORTS": true, "MULTI_SHOP": true, "WEBSITE_PREMIUM": true, "COMMISSIONS": true, "BLIND_CASH_CLOSURE": true}', 6);

-- =============================================
-- FIM DO SCHEMA COMPLETO
-- =============================================
