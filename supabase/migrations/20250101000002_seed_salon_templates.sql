-- =====================================================
-- SEED: SALÃO - ESSENCIAL + COMPLETO
-- =====================================================

-- CATEGORIAS SALÃO
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

-- SERVIÇOS ESSENCIAIS - CABELO FEMININO (package_level 1)
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Cabelo Feminino' AND business_type='salon'), 'service', 'Corte Feminino', 40, 5000, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Cabelo Feminino' AND business_type='salon'), 'service', 'Corte Infantil Feminino', 35, 4000, 1, false, 2),
((SELECT id FROM service_categories_template WHERE name='Cabelo Feminino' AND business_type='salon'), 'service', 'Franja', 15, 2500, 1, false, 3)
ON CONFLICT (category_id, name) DO NOTHING;

-- SERVIÇOS ESSENCIAIS - ESCOVA (package_level 1)
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Escova' AND business_type='salon'), 'service', 'Escova Simples', 30, 4000, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Escova' AND business_type='salon'), 'service', 'Escova Modelada', 40, 5000, 1, false, 2)
ON CONFLICT (category_id, name) DO NOTHING;

-- SERVIÇOS ESSENCIAIS - UNHAS (package_level 1)
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Unhas' AND business_type='salon'), 'service', 'Manicure', 30, 2500, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Unhas' AND business_type='salon'), 'service', 'Pedicure', 40, 3000, 1, true, 2),
((SELECT id FROM service_categories_template WHERE name='Unhas' AND business_type='salon'), 'service', 'Manicure + Pedicure', 70, 5000, 1, true, 3)
ON CONFLICT (category_id, name) DO NOTHING;

-- SERVIÇOS ESSENCIAIS - DEPILAÇÃO (package_level 1)
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Depilação' AND business_type='salon'), 'service', 'Sobrancelha', 15, 2000, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Depilação' AND business_type='salon'), 'service', 'Buço', 10, 1500, 1, false, 2)
ON CONFLICT (category_id, name) DO NOTHING;

-- SERVIÇOS ESSENCIAIS - QUÍMICAS (package_level 1)
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Químicas' AND business_type='salon'), 'service', 'Hidratação', 45, 6000, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Químicas' AND business_type='salon'), 'service', 'Progressiva', 180, 25000, 1, true, 2)
ON CONFLICT (category_id, name) DO NOTHING;

-- COMBOS ESSENCIAIS (package_level 1)
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, is_popular, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Combos' AND business_type='salon'), 'combo', 'Corte + Escova', 60, 8000, 1, true, 1),
((SELECT id FROM service_categories_template WHERE name='Combos' AND business_type='salon'), 'combo', 'Corte + Hidratação', 80, 10000, 1, false, 2)
ON CONFLICT (category_id, name) DO NOTHING;

-- BUNDLE ITEMS - Corte + Escova
INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity) 
SELECT 
  (SELECT id FROM services_template WHERE name='Corte + Escova' AND type='combo' AND category_id IN (SELECT id FROM service_categories_template WHERE business_type='salon')),
  (SELECT id FROM services_template WHERE name='Corte Feminino' AND type='service' AND category_id IN (SELECT id FROM service_categories_template WHERE business_type='salon')),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM bundle_items_template 
  WHERE combo_service_id = (SELECT id FROM services_template WHERE name='Corte + Escova' AND type='combo')
  AND item_service_id = (SELECT id FROM services_template WHERE name='Corte Feminino' AND type='service')
);

INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity) 
SELECT 
  (SELECT id FROM services_template WHERE name='Corte + Escova' AND type='combo'),
  (SELECT id FROM services_template WHERE name='Escova Simples' AND type='service'),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM bundle_items_template 
  WHERE combo_service_id = (SELECT id FROM services_template WHERE name='Corte + Escova' AND type='combo')
  AND item_service_id = (SELECT id FROM services_template WHERE name='Escova Simples' AND type='service')
);

-- BUNDLE ITEMS - Corte + Hidratação
INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity) 
SELECT 
  (SELECT id FROM services_template WHERE name='Corte + Hidratação' AND type='combo'),
  (SELECT id FROM services_template WHERE name='Corte Feminino' AND type='service'),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM bundle_items_template 
  WHERE combo_service_id = (SELECT id FROM services_template WHERE name='Corte + Hidratação' AND type='combo')
  AND item_service_id = (SELECT id FROM services_template WHERE name='Corte Feminino' AND type='service')
);

INSERT INTO bundle_items_template (combo_service_id, item_service_id, quantity) 
SELECT 
  (SELECT id FROM services_template WHERE name='Corte + Hidratação' AND type='combo'),
  (SELECT id FROM services_template WHERE name='Hidratação' AND type='service'),
  1
WHERE NOT EXISTS (
  SELECT 1 FROM bundle_items_template 
  WHERE combo_service_id = (SELECT id FROM services_template WHERE name='Corte + Hidratação' AND type='combo')
  AND item_service_id = (SELECT id FROM services_template WHERE name='Hidratação' AND type='service')
);

-- =====================================================
-- SALÃO - COMPLETO (package_level 2)
-- =====================================================

-- DEPILAÇÃO AVANÇADA
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Depilação Avançada' AND business_type='salon'), 'service', 'Axila', 15, 2000, 2, 1),
((SELECT id FROM service_categories_template WHERE name='Depilação Avançada' AND business_type='salon'), 'service', 'Perna Completa', 40, 5000, 2, 2),
((SELECT id FROM service_categories_template WHERE name='Depilação Avançada' AND business_type='salon'), 'service', 'Meia Perna', 25, 3500, 2, 3),
((SELECT id FROM service_categories_template WHERE name='Depilação Avançada' AND business_type='salon'), 'service', 'Virilha', 20, 3000, 2, 4),
((SELECT id FROM service_categories_template WHERE name='Depilação Avançada' AND business_type='salon'), 'service', 'Corpo Completo', 90, 12000, 2, 5)
ON CONFLICT (category_id, name) DO NOTHING;

-- QUÍMICAS AVANÇADAS
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Químicas' AND business_type='salon'), 'service', 'Coloração', 90, 15000, 2, 3),
((SELECT id FROM service_categories_template WHERE name='Químicas' AND business_type='salon'), 'service', 'Luzes', 120, 18000, 2, 4),
((SELECT id FROM service_categories_template WHERE name='Químicas' AND business_type='salon'), 'service', 'Mechas', 120, 18000, 2, 5),
((SELECT id FROM service_categories_template WHERE name='Químicas' AND business_type='salon'), 'service', 'Ombré Hair', 150, 25000, 2, 6),
((SELECT id FROM service_categories_template WHERE name='Químicas' AND business_type='salon'), 'service', 'Balayage', 150, 28000, 2, 7)
ON CONFLICT (category_id, name) DO NOTHING;

-- PENTEADOS
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Penteados' AND business_type='salon'), 'service', 'Penteado Simples', 60, 8000, 2, 1),
((SELECT id FROM service_categories_template WHERE name='Penteados' AND business_type='salon'), 'service', 'Penteado de Festa', 90, 12000, 2, 2),
((SELECT id FROM service_categories_template WHERE name='Penteados' AND business_type='salon'), 'service', 'Penteado de Noiva', 120, 20000, 2, 3),
((SELECT id FROM service_categories_template WHERE name='Penteados' AND business_type='salon'), 'service', 'Trança', 40, 5000, 2, 4),
((SELECT id FROM service_categories_template WHERE name='Penteados' AND business_type='salon'), 'service', 'Coque', 45, 6000, 2, 5)
ON CONFLICT (category_id, name) DO NOTHING;

-- TRATAMENTOS CAPILARES
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Tratamentos Capilares' AND business_type='salon'), 'service', 'Cauterização', 90, 12000, 2, 1),
((SELECT id FROM service_categories_template WHERE name='Tratamentos Capilares' AND business_type='salon'), 'service', 'Botox Capilar', 90, 15000, 2, 2),
((SELECT id FROM service_categories_template WHERE name='Tratamentos Capilares' AND business_type='salon'), 'service', 'Reconstrução', 75, 10000, 2, 3),
((SELECT id FROM service_categories_template WHERE name='Tratamentos Capilares' AND business_type='salon'), 'service', 'Cronograma Capilar', 60, 8000, 2, 4),
((SELECT id FROM service_categories_template WHERE name='Tratamentos Capilares' AND business_type='salon'), 'service', 'Selagem', 90, 13000, 2, 5)
ON CONFLICT (category_id, name) DO NOTHING;

-- UNHAS ARTÍSTICAS
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Unhas Artísticas' AND business_type='salon'), 'service', 'Unhas em Gel', 90, 8000, 2, 1),
((SELECT id FROM service_categories_template WHERE name='Unhas Artísticas' AND business_type='salon'), 'service', 'Alongamento de Unhas', 120, 10000, 2, 2),
((SELECT id FROM service_categories_template WHERE name='Unhas Artísticas' AND business_type='salon'), 'service', 'Unhas Decoradas', 60, 5000, 2, 3),
((SELECT id FROM service_categories_template WHERE name='Unhas Artísticas' AND business_type='salon'), 'service', 'Fibra de Vidro', 90, 9000, 2, 4),
((SELECT id FROM service_categories_template WHERE name='Unhas Artísticas' AND business_type='salon'), 'service', 'Manutenção de Gel', 60, 6000, 2, 5)
ON CONFLICT (category_id, name) DO NOTHING;

-- ESTÉTICA FACIAL
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Estética Facial' AND business_type='salon'), 'service', 'Limpeza de Pele', 60, 10000, 2, 1),
((SELECT id FROM service_categories_template WHERE name='Estética Facial' AND business_type='salon'), 'service', 'Limpeza de Pele Profunda', 90, 15000, 2, 2),
((SELECT id FROM service_categories_template WHERE name='Estética Facial' AND business_type='salon'), 'service', 'Design de Sobrancelha', 20, 3000, 2, 3),
((SELECT id FROM service_categories_template WHERE name='Estética Facial' AND business_type='salon'), 'service', 'Henna de Sobrancelha', 25, 3500, 2, 4),
((SELECT id FROM service_categories_template WHERE name='Estética Facial' AND business_type='salon'), 'service', 'Aplicação de Cílios', 60, 8000, 2, 5)
ON CONFLICT (category_id, name) DO NOTHING;

-- MASSAGENS
INSERT INTO services_template (category_id, type, name, duration_min, price_cents, package_level, sort_order) VALUES
((SELECT id FROM service_categories_template WHERE name='Massagens' AND business_type='salon'), 'service', 'Massagem Relaxante', 50, 8000, 2, 1),
((SELECT id FROM service_categories_template WHERE name='Massagens' AND business_type='salon'), 'service', 'Massagem Modeladora', 60, 10000, 2, 2),
((SELECT id FROM service_categories_template WHERE name='Massagens' AND business_type='salon'), 'service', 'Drenagem Linfática', 70, 12000, 2, 3)
ON CONFLICT (category_id, name) DO NOTHING;
