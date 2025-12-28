-- =====================================================
-- KIT PREGUIÇOSO - TEMPLATES DE SERVIÇOS
-- Sistema de onboarding com catálogos prontos
-- =====================================================

-- TEMPLATES GLOBAIS (seed único, shared)
CREATE TABLE IF NOT EXISTS service_categories_template (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_type TEXT NOT NULL CHECK (business_type IN ('barber', 'salon', 'unisex')),
  name TEXT NOT NULL,
  icon TEXT, -- emoji ou nome do ícone
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_category_per_business UNIQUE (business_type, name)
);

CREATE TABLE IF NOT EXISTS services_template (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES service_categories_template(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('service', 'addon', 'combo')),
  name TEXT NOT NULL,
  duration_min INT NOT NULL CHECK (duration_min >= 5 AND duration_min <= 300 AND duration_min % 5 = 0),
  price_cents INT NOT NULL,
  price_from BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_popular BOOLEAN DEFAULT false, -- destaque no app
  package_level INT DEFAULT 1 CHECK (package_level IN (1, 2, 3)), -- 1=essencial, 2=completo, 3=premium
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_service_per_category UNIQUE (category_id, name)
);

CREATE TABLE IF NOT EXISTS bundle_items_template (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  combo_service_id UUID REFERENCES services_template(id) ON DELETE CASCADE,
  item_service_id UUID REFERENCES services_template(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  CONSTRAINT unique_bundle_item UNIQUE (combo_service_id, item_service_id)
);

-- DADOS DA LOJA (cópia após onboarding)
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  template_id UUID REFERENCES service_categories_template(id), -- rastreabilidade
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_category_per_store UNIQUE (store_id, name)
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category_id UUID REFERENCES service_categories(id) ON DELETE CASCADE,
  template_id UUID REFERENCES services_template(id), -- rastreabilidade
  type TEXT NOT NULL CHECK (type IN ('service', 'addon', 'combo')),
  name TEXT NOT NULL,
  duration INT NOT NULL CHECK (duration >= 5 AND duration <= 300),
  price DECIMAL(10,2) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_service_per_store_category UNIQUE (store_id, category_id, name)
);

CREATE TABLE IF NOT EXISTS service_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- ex: "Curto", "Médio", "Longo"
  duration_min INT NOT NULL CHECK (duration_min >= 5 AND duration_min <= 300 AND duration_min % 5 = 0),
  price_cents INT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  CONSTRAINT unique_variant_per_service UNIQUE (service_id, name)
);

CREATE TABLE IF NOT EXISTS bundle_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  combo_service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  item_service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  CONSTRAINT unique_bundle_item_tenant UNIQUE (combo_service_id, item_service_id)
);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_services_store ON services(store_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_services_popular ON services(is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS idx_bundle_combo ON bundle_items(combo_service_id);
CREATE INDEX IF NOT EXISTS idx_services_template_category ON services_template(category_id);
CREATE INDEX IF NOT EXISTS idx_services_template_package ON services_template(package_level);
CREATE INDEX IF NOT EXISTS idx_service_categories_template_business ON service_categories_template(business_type);

-- COMENTÁRIOS
COMMENT ON TABLE service_categories_template IS 'Templates globais de categorias de serviços para onboarding rápido';
COMMENT ON TABLE services_template IS 'Templates globais de serviços pré-configurados';
COMMENT ON TABLE bundle_items_template IS 'Itens que compõem combos nos templates';
COMMENT ON COLUMN services_template.package_level IS '1=essencial (básico), 2=completo (avançado), 3=premium (futuro)';
COMMENT ON COLUMN services_template.is_popular IS 'Serviço popular para destacar no app do cliente';
