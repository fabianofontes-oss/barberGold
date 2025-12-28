-- =====================================================
-- KIT PREGUIÇOSO - COMPLETO (ESTRUTURA + SEEDS)
-- Sistema de onboarding com catálogos prontos
-- =====================================================

-- =====================================================
-- PARTE 1: ESTRUTURA DE TABELAS
-- =====================================================

-- TEMPLATES GLOBAIS (seed único, shared)
CREATE TABLE IF NOT EXISTS service_categories_template (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_type TEXT NOT NULL CHECK (business_type IN ('barber', 'salon', 'unisex')),
  name TEXT NOT NULL,
  icon TEXT,
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
  is_popular BOOLEAN DEFAULT false,
  package_level INT DEFAULT 1 CHECK (package_level IN (1, 2, 3)),
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
  template_id UUID REFERENCES service_categories_template(id),
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
  template_id UUID REFERENCES services_template(id),
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
  name TEXT NOT NULL,
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
  CONSTRAINT unique_bundle_item_store UNIQUE (combo_service_id, item_service_id)
);

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_services_store ON services(store_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_services_popular ON services(is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS idx_bundle_combo ON bundle_items(combo_service_id);
CREATE INDEX IF NOT EXISTS idx_services_template_category ON services_template(category_id);
CREATE INDEX IF NOT EXISTS idx_services_template_package ON services_template(package_level);
CREATE INDEX IF NOT EXISTS idx_service_categories_template_business ON service_categories_template(business_type);

-- =====================================================
-- PARTE 2: SEEDS - BARBEARIA
-- =====================================================

INSERT INTO service_categories_template (business_type, name, icon, sort_order) VALUES
('barber', 'Cabelo Masculino', '✂️', 1),
('barber', 'Barba & Bigode', '🧔', 2),
('barber', 'Acabamento', '✨', 3),
('barber', 'Tratamentos', '💆‍♂️', 4),
('barber', 'Combos', '🔥', 5),
('barber', 'Químicas Masculinas', '🧪', 6),
('barber', 'Estética Facial', '🌟', 7),
('barber', 'Acabamento Premium', '💎', 8)
ON CONFLICT (business_type, name) DO NOTHING;

-- SERVIÇOS ESSENCIAIS - CABELO MASCULINO
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino' AND business_type='barber'), 'service', 'Corte Masculino', 30, 4000, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino' AND business_type='barber'), 'service', 'Corte Social', 40, 5000, 1, false, 2),
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino' AND business_type='barber'), 'service', 'Degradê', 40, 4500, 1, true, 3),
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino' AND business_type='barber'), 'service', 'Corte Infantil', 25, 3000, 1, false, 4)
ON CONFLICT (category_id, name) DO NOTHING;

-- SERVIÇOS ESSENCIAIS - BARBA & BIGODE
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Barba & Bigode' AND business_type='barber'), 'service', 'Barba Simples', 15, 2500, 1, false, 1),
((SELECT id FROM service_categories_template WHERE name='Barba & Bigode' AND business_type='barber'), 'service', 'Barba Completa', 30, 3500, 1, true, 2),
((SELECT id FROM service_categories_template WHERE name='Barba & Bigode' AND business_type='barber'), 'service', 'Barba Navalhada', 30, 4000, 1, true, 3),
((SELECT id FROM service_categories_template WHERE name='Barba & Bigode' AND business_type='barber'), 'service', 'Aparar Bigode', 10, 1500, 1, false, 4)
ON CONFLICT (category_id, name) DO NOTHING;

-- SERVIÇOS ESSENCIAIS - TRATAMENTOS
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Tratamentos' AND business_type='barber'), 'service', 'Hidratação de Barba', 20, 3000, 1, false, 1),
((SELECT id FROM service_categories_template WHERE name='Tratamentos' AND business_type='barber'), 'service', 'Massagem Relaxante', 20, 3000, 1, false, 2)
ON CONFLICT (category_id, name) DO NOTHING;

-- COMBOS ESSENCIAIS
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Combos' AND business_type='barber'), 'combo', 'Corte + Barba', 60, 6000, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Combos' AND business_type='barber'), 'combo', 'Pacote VIP', 90, 12000, 1, true, 2)
ON CONFLICT (category_id, name) DO NOTHING;

-- BUNDLE ITEMS - Corte + Barba
DO $$
DECLARE
  combo_id UUID;
  corte_id UUID;
  barba_id UUID;
BEGIN
  SELECT id INTO combo_id FROM services_template WHERE name='Corte + Barba' AND type='combo' LIMIT 1;
  SELECT id INTO corte_id FROM services_template WHERE name='Corte Masculino' AND type='service' LIMIT 1;
  SELECT id INTO barba_id FROM services_template WHERE name='Barba Completa' AND type='service' LIMIT 1;
  
  IF combo_id IS NOT NULL AND corte_id IS NOT NULL THEN
    INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity)
    VALUES (combo_id, corte_id, 1)
    ON CONFLICT (combo_service_id, item_service_id) DO NOTHING;
  END IF;
  
  IF combo_id IS NOT NULL AND barba_id IS NOT NULL THEN
    INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity)
    VALUES (combo_id, barba_id, 1)
    ON CONFLICT (combo_service_id, item_service_id) DO NOTHING;
  END IF;
END $$;

-- BUNDLE ITEMS - Pacote VIP
DO $$
DECLARE
  vip_id UUID;
  corte_id UUID;
  barba_id UUID;
  hidrat_id UUID;
  massag_id UUID;
BEGIN
  SELECT id INTO vip_id FROM services_template WHERE name='Pacote VIP' AND type='combo' LIMIT 1;
  SELECT id INTO corte_id FROM services_template WHERE name='Corte Masculino' AND type='service' LIMIT 1;
  SELECT id INTO barba_id FROM services_template WHERE name='Barba Completa' AND type='service' LIMIT 1;
  SELECT id INTO hidrat_id FROM services_template WHERE name='Hidratação de Barba' AND type='service' LIMIT 1;
  SELECT id INTO massag_id FROM services_template WHERE name='Massagem Relaxante' AND type='service' LIMIT 1;
  
  IF vip_id IS NOT NULL AND corte_id IS NOT NULL THEN
    INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity)
    VALUES (vip_id, corte_id, 1)
    ON CONFLICT (combo_service_id, item_service_id) DO NOTHING;
  END IF;
  
  IF vip_id IS NOT NULL AND barba_id IS NOT NULL THEN
    INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity)
    VALUES (vip_id, barba_id, 1)
    ON CONFLICT (combo_service_id, item_service_id) DO NOTHING;
  END IF;
  
  IF vip_id IS NOT NULL AND hidrat_id IS NOT NULL THEN
    INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity)
    VALUES (vip_id, hidrat_id, 1)
    ON CONFLICT (combo_service_id, item_service_id) DO NOTHING;
  END IF;
  
  IF vip_id IS NOT NULL AND massag_id IS NOT NULL THEN
    INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity)
    VALUES (vip_id, massag_id, 1)
    ON CONFLICT (combo_service_id, item_service_id) DO NOTHING;
  END IF;
END $$;

-- BARBEARIA COMPLETO - ACABAMENTO PREMIUM
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Acabamento Premium' AND business_type='barber'), 'addon', 'Sobrancelha Masculina', 10, 1000, 2, 1),
((SELECT id FROM service_categories_template WHERE name='Acabamento Premium' AND business_type='barber'), 'addon', 'Nariz', 5, 800, 2, 2),
((SELECT id FROM service_categories_template WHERE name='Acabamento Premium' AND business_type='barber'), 'addon', 'Orelha', 5, 800, 2, 3),
((SELECT id FROM service_categories_template WHERE name='Acabamento Premium' AND business_type='barber'), 'addon', 'Acabamento Completo', 15, 2000, 2, 4),
((SELECT id FROM service_categories_template WHERE name='Acabamento Premium' AND business_type='barber'), 'addon', 'Risco', 5, 1000, 2, 5),
((SELECT id FROM service_categories_template WHERE name='Acabamento Premium' AND business_type='barber'), 'addon', 'Desenho no Cabelo', 15, 2000, 2, 6)
ON CONFLICT (category_id, name) DO NOTHING;

-- QUÍMICAS MASCULINAS
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Químicas Masculinas' AND business_type='barber'), 'service', 'Luzes/Mechas', 90, 15000, 2, 1),
((SELECT id FROM service_categories_template WHERE name='Químicas Masculinas' AND business_type='barber'), 'service', 'Platinado', 120, 20000, 2, 2),
((SELECT id FROM service_categories_template WHERE name='Químicas Masculinas' AND business_type='barber'), 'service', 'Progressiva Masculina', 120, 18000, 2, 3),
((SELECT id FROM service_categories_template WHERE name='Químicas Masculinas' AND business_type='barber'), 'service', 'Tintura', 45, 6000, 2, 4),
((SELECT id FROM service_categories_template WHERE name='Químicas Masculinas' AND business_type='barber'), 'service', 'Reflexo', 60, 8000, 2, 5),
((SELECT id FROM service_categories_template WHERE name='Químicas Masculinas' AND business_type='barber'), 'service', 'Tintura de Barba', 30, 4000, 2, 6)
ON CONFLICT (category_id, name) DO NOTHING;

-- ESTÉTICA FACIAL
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Estética Facial' AND business_type='barber'), 'service', 'Limpeza de Pele', 60, 8000, 2, 1),
((SELECT id FROM service_categories_template WHERE name='Estética Facial' AND business_type='barber'), 'service', 'Design de Barba Premium', 40, 5000, 2, 2),
((SELECT id FROM service_categories_template WHERE name='Estética Facial' AND business_type='barber'), 'service', 'Pigmentação Capilar', 60, 10000, 2, 3),
((SELECT id FROM service_categories_template WHERE name='Estética Facial' AND business_type='barber'), 'service', 'Pigmentação de Barba', 45, 8000, 2, 4)
ON CONFLICT (category_id, name) DO NOTHING;

-- =====================================================
-- PARTE 3: SEEDS - SALÃO
-- =====================================================

INSERT INTO service_categories_template (business_type, name, icon, sort_order) VALUES
('salon', 'Cabelo Feminino', '💇‍♀️', 1),
('salon', 'Escova', '🌬️', 2),
('salon', 'Unhas', '💅', 3),
('salon', 'Depilação', '✨', 4),
('salon', 'Químicas', '🧪', 5),
('salon', 'Combos', '🔥', 6),
('salon', 'Penteados', '👰', 7),
('salon', 'Tratamentos Capilares', '💆‍♀️', 8),
('salon', 'Unhas Artísticas', '🎨', 9),
('salon', 'Estética Facial', '🌟', 10),
('salon', 'Massagens', '💆', 11),
('salon', 'Depilação Avançada', '💎', 12)
ON CONFLICT (business_type, name) DO NOTHING;

-- CABELO FEMININO
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Cabelo Feminino' AND business_type='salon'), 'service', 'Corte Feminino', 40, 5000, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Cabelo Feminino' AND business_type='salon'), 'service', 'Corte Infantil Feminino', 35, 4000, 1, false, 2),
((SELECT id FROM service_categories_template WHERE name='Cabelo Feminino' AND business_type='salon'), 'service', 'Franja', 15, 2500, 1, false, 3)
ON CONFLICT (category_id, name) DO NOTHING;

-- ESCOVA
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Escova' AND business_type='salon'), 'service', 'Escova Simples', 30, 4000, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Escova' AND business_type='salon'), 'service', 'Escova Modelada', 40, 5000, 1, false, 2)
ON CONFLICT (category_id, name) DO NOTHING;

-- UNHAS
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Unhas' AND business_type='salon'), 'service', 'Manicure', 30, 2500, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Unhas' AND business_type='salon'), 'service', 'Pedicure', 40, 3000, 1, true, 2),
((SELECT id FROM service_categories_template WHERE name='Unhas' AND business_type='salon'), 'service', 'Manicure + Pedicure', 70, 5000, 1, true, 3)
ON CONFLICT (category_id, name) DO NOTHING;

-- DEPILAÇÃO
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Depilação' AND business_type='salon'), 'service', 'Sobrancelha', 15, 2000, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Depilação' AND business_type='salon'), 'service', 'Buço', 10, 1500, 1, false, 2)
ON CONFLICT (category_id, name) DO NOTHING;

-- QUÍMICAS
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Químicas' AND business_type='salon'), 'service', 'Hidratação', 45, 6000, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Químicas' AND business_type='salon'), 'service', 'Progressiva', 180, 25000, 1, true, 2),
((SELECT id FROM service_categories_template WHERE name='Químicas' AND business_type='salon'), 'service', 'Coloração', 90, 15000, 2, false, 3),
((SELECT id FROM service_categories_template WHERE name='Químicas' AND business_type='salon'), 'service', 'Luzes', 120, 18000, 2, false, 4),
((SELECT id FROM service_categories_template WHERE name='Químicas' AND business_type='salon'), 'service', 'Mechas', 120, 18000, 2, false, 5),
((SELECT id FROM service_categories_template WHERE name='Químicas' AND business_type='salon'), 'service', 'Ombré Hair', 150, 25000, 2, false, 6),
((SELECT id FROM service_categories_template WHERE name='Químicas' AND business_type='salon'), 'service', 'Balayage', 150, 28000, 2, false, 7)
ON CONFLICT (category_id, name) DO NOTHING;

-- COMBOS SALÃO
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Combos' AND business_type='salon'), 'combo', 'Corte + Escova', 60, 8000, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Combos' AND business_type='salon'), 'combo', 'Corte + Hidratação', 80, 10000, 1, false, 2)
ON CONFLICT (category_id, name) DO NOTHING;

-- SALÃO COMPLETO - DEPILAÇÃO AVANÇADA
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Depilação Avançada' AND business_type='salon'), 'service', 'Axila', 15, 2000, 2, false, 1),
((SELECT id FROM service_categories_template WHERE name='Depilação Avançada' AND business_type='salon'), 'service', 'Perna Completa', 40, 5000, 2, false, 2),
((SELECT id FROM service_categories_template WHERE name='Depilação Avançada' AND business_type='salon'), 'service', 'Meia Perna', 25, 3500, 2, false, 3),
((SELECT id FROM service_categories_template WHERE name='Depilação Avançada' AND business_type='salon'), 'service', 'Virilha', 20, 3000, 2, false, 4),
((SELECT id FROM service_categories_template WHERE name='Depilação Avançada' AND business_type='salon'), 'service', 'Corpo Completo', 90, 12000, 2, false, 5)
ON CONFLICT (category_id, name) DO NOTHING;

-- PENTEADOS
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Penteados' AND business_type='salon'), 'service', 'Penteado Simples', 60, 8000, 2, false, 1),
((SELECT id FROM service_categories_template WHERE name='Penteados' AND business_type='salon'), 'service', 'Penteado de Festa', 90, 12000, 2, false, 2),
((SELECT id FROM service_categories_template WHERE name='Penteados' AND business_type='salon'), 'service', 'Penteado de Noiva', 120, 20000, 2, true, 3),
((SELECT id FROM service_categories_template WHERE name='Penteados' AND business_type='salon'), 'service', 'Trança', 40, 5000, 2, false, 4),
((SELECT id FROM service_categories_template WHERE name='Penteados' AND business_type='salon'), 'service', 'Coque', 45, 6000, 2, false, 5)
ON CONFLICT (category_id, name) DO NOTHING;

-- TRATAMENTOS CAPILARES
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Tratamentos Capilares' AND business_type='salon'), 'service', 'Cauterização', 90, 12000, 2, false, 1),
((SELECT id FROM service_categories_template WHERE name='Tratamentos Capilares' AND business_type='salon'), 'service', 'Botox Capilar', 90, 15000, 2, true, 2),
((SELECT id FROM service_categories_template WHERE name='Tratamentos Capilares' AND business_type='salon'), 'service', 'Reconstrução', 75, 10000, 2, false, 3),
((SELECT id FROM service_categories_template WHERE name='Tratamentos Capilares' AND business_type='salon'), 'service', 'Cronograma Capilar', 60, 8000, 2, false, 4),
((SELECT id FROM service_categories_template WHERE name='Tratamentos Capilares' AND business_type='salon'), 'service', 'Selagem', 90, 13000, 2, false, 5)
ON CONFLICT (category_id, name) DO NOTHING;

-- UNHAS ARTÍSTICAS
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Unhas Artísticas' AND business_type='salon'), 'service', 'Unhas em Gel', 90, 8000, 2, true, 1),
((SELECT id FROM service_categories_template WHERE name='Unhas Artísticas' AND business_type='salon'), 'service', 'Alongamento de Unhas', 120, 10000, 2, false, 2),
((SELECT id FROM service_categories_template WHERE name='Unhas Artísticas' AND business_type='salon'), 'service', 'Unhas Decoradas', 60, 5000, 2, false, 3),
((SELECT id FROM service_categories_template WHERE name='Unhas Artísticas' AND business_type='salon'), 'service', 'Fibra de Vidro', 90, 9000, 2, false, 4),
((SELECT id FROM service_categories_template WHERE name='Unhas Artísticas' AND business_type='salon'), 'service', 'Manutenção de Gel', 60, 6000, 2, false, 5)
ON CONFLICT (category_id, name) DO NOTHING;

-- ESTÉTICA FACIAL SALÃO
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Estética Facial' AND business_type='salon'), 'service', 'Limpeza de Pele', 60, 10000, 2, true, 1),
((SELECT id FROM service_categories_template WHERE name='Estética Facial' AND business_type='salon'), 'service', 'Limpeza de Pele Profunda', 90, 15000, 2, false, 2),
((SELECT id FROM service_categories_template WHERE name='Estética Facial' AND business_type='salon'), 'service', 'Design de Sobrancelha', 20, 3000, 2, true, 3),
((SELECT id FROM service_categories_template WHERE name='Estética Facial' AND business_type='salon'), 'service', 'Henna de Sobrancelha', 25, 3500, 2, false, 4),
((SELECT id FROM service_categories_template WHERE name='Estética Facial' AND business_type='salon'), 'service', 'Aplicação de Cílios', 60, 8000, 2, false, 5)
ON CONFLICT (category_id, name) DO NOTHING;

-- MASSAGENS
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Massagens' AND business_type='salon'), 'service', 'Massagem Relaxante', 50, 8000, 2, false, 1),
((SELECT id FROM service_categories_template WHERE name='Massagens' AND business_type='salon'), 'service', 'Massagem Modeladora', 60, 10000, 2, false, 2),
((SELECT id FROM service_categories_template WHERE name='Massagens' AND business_type='salon'), 'service', 'Drenagem Linfática', 70, 12000, 2, false, 3)
ON CONFLICT (category_id, name) DO NOTHING;

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_services_store ON services(store_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_services_popular ON services(is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS idx_bundle_combo ON bundle_items(combo_service_id);
CREATE INDEX IF NOT EXISTS idx_services_template_category ON services_template(category_id);
CREATE INDEX IF NOT EXISTS idx_services_template_package ON services_template(package_level);
CREATE INDEX IF NOT EXISTS idx_service_categories_template_business ON service_categories_template(business_type);
