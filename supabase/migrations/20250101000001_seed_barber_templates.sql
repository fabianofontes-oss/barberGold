-- =====================================================
-- SEED: BARBEARIA - ESSENCIAL + COMPLETO
-- =====================================================

-- CATEGORIAS BARBEARIA
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

-- SERVIÇOS ESSENCIAIS - CABELO MASCULINO (package_level 1)
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino' AND business_type='barber'), 'service', 'Corte Masculino', 30, 4000, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino' AND business_type='barber'), 'service', 'Corte Social', 40, 5000, 1, false, 2),
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino' AND business_type='barber'), 'service', 'Degradê', 40, 4500, 1, true, 3),
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino' AND business_type='barber'), 'service', 'Corte Infantil', 25, 3000, 1, false, 4)
ON CONFLICT (category_id, name) DO NOTHING;

-- SERVIÇOS ESSENCIAIS - BARBA & BIGODE (package_level 1)
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Barba & Bigode' AND business_type='barber'), 'service', 'Barba Simples', 15, 2500, 1, false, 1),
((SELECT id FROM service_categories_template WHERE name='Barba & Bigode' AND business_type='barber'), 'service', 'Barba Completa', 30, 3500, 1, true, 2),
((SELECT id FROM service_categories_template WHERE name='Barba & Bigode' AND business_type='barber'), 'service', 'Barba Navalhada', 30, 4000, 1, true, 3),
((SELECT id FROM service_categories_template WHERE name='Barba & Bigode' AND business_type='barber'), 'service', 'Aparar Bigode', 10, 1500, 1, false, 4)
ON CONFLICT (category_id, name) DO NOTHING;

-- SERVIÇOS ESSENCIAIS - TRATAMENTOS (package_level 1)
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Tratamentos' AND business_type='barber'), 'service', 'Hidratação de Barba', 20, 3000, 1, false, 1),
((SELECT id FROM service_categories_template WHERE name='Tratamentos' AND business_type='barber'), 'service', 'Massagem Relaxante', 20, 3000, 1, false, 2)
ON CONFLICT (category_id, name) DO NOTHING;

-- COMBOS ESSENCIAIS (package_level 1)
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Combos' AND business_type='barber'), 'combo', 'Corte + Barba', 60, 6000, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Combos' AND business_type='barber'), 'combo', 'Pacote VIP', 90, 12000, 1, true, 2)
ON CONFLICT (category_id, name) DO NOTHING;

-- BUNDLE ITEMS - Corte + Barba
INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity) 
SELECT 
  (SELECT id FROM services_template WHERE name='Corte + Barba' AND type='combo' AND category_id IN (SELECT id FROM service_categories_template WHERE business_type='barber')),
  (SELECT id FROM services_template WHERE name='Corte Masculino' AND type='service' AND category_id IN (SELECT id FROM service_categories_template WHERE business_type='barber')),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM bundle_items_template 
  WHERE combo_service_id = (SELECT id FROM services_template WHERE name='Corte + Barba' AND type='combo')
  AND item_service_id = (SELECT id FROM services_template WHERE name='Corte Masculino' AND type='service')
);

INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity) 
SELECT 
  (SELECT id FROM services_template WHERE name='Corte + Barba' AND type='combo' AND category_id IN (SELECT id FROM service_categories_template WHERE business_type='barber')),
  (SELECT id FROM services_template WHERE name='Barba Completa' AND type='service' AND category_id IN (SELECT id FROM service_categories_template WHERE business_type='barber')),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM bundle_items_template 
  WHERE combo_service_id = (SELECT id FROM services_template WHERE name='Corte + Barba' AND type='combo')
  AND item_service_id = (SELECT id FROM services_template WHERE name='Barba Completa' AND type='service')
);

-- BUNDLE ITEMS - Pacote VIP
INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity) 
SELECT 
  (SELECT id FROM services_template WHERE name='Pacote VIP' AND type='combo' AND category_id IN (SELECT id FROM service_categories_template WHERE business_type='barber')),
  (SELECT id FROM services_template WHERE name='Corte Masculino' AND type='service' AND category_id IN (SELECT id FROM service_categories_template WHERE business_type='barber')),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM bundle_items_template 
  WHERE combo_service_id = (SELECT id FROM services_template WHERE name='Pacote VIP' AND type='combo')
  AND item_service_id = (SELECT id FROM services_template WHERE name='Corte Masculino' AND type='service')
);

INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity) 
SELECT 
  (SELECT id FROM services_template WHERE name='Pacote VIP' AND type='combo'),
  (SELECT id FROM services_template WHERE name='Barba Completa' AND type='service'),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM bundle_items_template 
  WHERE combo_service_id = (SELECT id FROM services_template WHERE name='Pacote VIP' AND type='combo')
  AND item_service_id = (SELECT id FROM services_template WHERE name='Barba Completa' AND type='service')
);

INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity) 
SELECT 
  (SELECT id FROM services_template WHERE name='Pacote VIP' AND type='combo'),
  (SELECT id FROM services_template WHERE name='Hidratação de Barba' AND type='service'),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM bundle_items_template 
  WHERE combo_service_id = (SELECT id FROM services_template WHERE name='Pacote VIP' AND type='combo')
  AND item_service_id = (SELECT id FROM services_template WHERE name='Hidratação de Barba' AND type='service')
);

INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity) 
SELECT 
  (SELECT id FROM services_template WHERE name='Pacote VIP' AND type='combo'),
  (SELECT id FROM services_template WHERE name='Massagem Relaxante' AND type='service'),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM bundle_items_template 
  WHERE combo_service_id = (SELECT id FROM services_template WHERE name='Pacote VIP' AND type='combo')
  AND item_service_id = (SELECT id FROM services_template WHERE name='Massagem Relaxante' AND type='service')
);

-- =====================================================
-- BARBEARIA - COMPLETO (package_level 2)
-- =====================================================

-- ACABAMENTO PREMIUM (ADD-ONS)
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
