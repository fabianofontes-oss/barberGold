-- =====================================================
-- KIT PREGUIÇOSO - POPULAR TEMPLATES
-- Execute APÓS criar as tabelas do schema
-- =====================================================

-- LIMPAR DADOS ANTERIORES (OPCIONAL)
TRUNCATE service_categories_template, services_template, bundle_items_template CASCADE;

-- =====================================================
-- CATEGORIAS DE SERVIÇOS - BARBEARIA
-- =====================================================
INSERT INTO service_categories_template (name, description, display_order, icon, color) VALUES
('Cabelo Masculino', 'Cortes e estilos masculinos', 1, '✂️', '#2563eb'),
('Barba & Bigode', 'Cuidados com barba e bigode', 2, '🧔', '#dc2626'),
('Acabamento', 'Acabamento e detalhes', 3, '✨', '#f59e0b'),
('Tratamentos', 'Tratamentos capilares e faciais', 4, '💆‍♂️', '#10b981'),
('Combos', 'Pacotes e promoções', 5, '🔥', '#ef4444'),
('Químicas Masculinas', 'Processos químicos', 6, '🧪', '#8b5cf6'),
('Estética Facial', 'Cuidados faciais', 7, '🌟', '#ec4899'),
('Acabamento Premium', 'Serviços exclusivos', 8, '💎', '#6366f1')
ON CONFLICT DO NOTHING;

-- =====================================================
-- SERVIÇOS - CABELO MASCULINO
-- =====================================================
INSERT INTO services_template (
    category_id, 
    name, 
    description,
    duration_minutes, 
    price, 
    package_level, 
    is_combo,
    image_url
) VALUES
-- Cabelo Masculino
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino'), 
    'Corte Masculino', 
    'Corte tradicional com acabamento',
    30, 40.00, 1, false, null),
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino'), 
    'Corte Social', 
    'Corte clássico executivo',
    40, 50.00, 1, false, null),
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino'), 
    'Degradê', 
    'Corte degradê moderno',
    40, 45.00, 1, false, null),
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino'), 
    'Corte Infantil', 
    'Corte especial para crianças',
    25, 30.00, 1, false, null),
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino'), 
    'Corte Mid Fade', 
    'Degradê médio estilizado',
    45, 55.00, 2, false, null),
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino'), 
    'Corte Low Fade', 
    'Degradê baixo sutil',
    45, 55.00, 2, false, null),
((SELECT id FROM service_categories_template WHERE name='Cabelo Masculino'), 
    'Corte High Fade', 
    'Degradê alto marcante',
    45, 55.00, 2, false, null),

-- Barba & Bigode
((SELECT id FROM service_categories_template WHERE name='Barba & Bigode'), 
    'Barba Simples', 
    'Aparar e alinhar barba',
    15, 25.00, 1, false, null),
((SELECT id FROM service_categories_template WHERE name='Barba & Bigode'), 
    'Barba Completa', 
    'Barba com toalha quente e produtos',
    30, 35.00, 1, false, null),
((SELECT id FROM service_categories_template WHERE name='Barba & Bigode'), 
    'Barba Navalhada', 
    'Barba tradicional com navalha',
    30, 40.00, 1, false, null),
((SELECT id FROM service_categories_template WHERE name='Barba & Bigode'), 
    'Aparar Bigode', 
    'Aparar e modelar bigode',
    10, 15.00, 1, false, null),
((SELECT id FROM service_categories_template WHERE name='Barba & Bigode'), 
    'Design de Barba', 
    'Desenho personalizado na barba',
    40, 50.00, 2, false, null),
((SELECT id FROM service_categories_template WHERE name='Barba & Bigode'), 
    'Barba Terapêutica', 
    'Barba com óleos essenciais',
    45, 60.00, 2, false, null),

-- Acabamento
((SELECT id FROM service_categories_template WHERE name='Acabamento'), 
    'Pezinho', 
    'Acabamento do pé do cabelo',
    10, 15.00, 1, false, null),
((SELECT id FROM service_categories_template WHERE name='Acabamento'), 
    'Sobrancelha', 
    'Alinhamento de sobrancelha',
    10, 15.00, 1, false, null),
((SELECT id FROM service_categories_template WHERE name='Acabamento'), 
    'Risquinho', 
    'Desenho artístico no cabelo',
    15, 20.00, 1, false, null),
((SELECT id FROM service_categories_template WHERE name='Acabamento'), 
    'Glitter', 
    'Aplicação de glitter',
    10, 15.00, 2, false, null),
((SELECT id FROM service_categories_template WHERE name='Acabamento'), 
    'Coloração de Barba', 
    'Tingimento de barba',
    30, 40.00, 2, false, null),

-- Tratamentos
((SELECT id FROM service_categories_template WHERE name='Tratamentos'), 
    'Hidratação Capilar', 
    'Hidratação profunda dos fios',
    20, 30.00, 1, false, null),
((SELECT id FROM service_categories_template WHERE name='Tratamentos'), 
    'Hidratação de Barba', 
    'Tratamento hidratante para barba',
    20, 30.00, 1, false, null),
((SELECT id FROM service_categories_template WHERE name='Tratamentos'), 
    'Massagem Relaxante', 
    'Massagem craniana relaxante',
    20, 30.00, 1, false, null),
((SELECT id FROM service_categories_template WHERE name='Tratamentos'), 
    'Limpeza de Pele', 
    'Limpeza facial profunda',
    45, 70.00, 2, false, null),
((SELECT id FROM service_categories_template WHERE name='Tratamentos'), 
    'Máscara Black', 
    'Máscara removedora de cravos',
    30, 45.00, 2, false, null),
((SELECT id FROM service_categories_template WHERE name='Tratamentos'), 
    'Peeling Facial', 
    'Esfoliação e renovação da pele',
    40, 60.00, 3, false, null),

-- Químicas Masculinas
((SELECT id FROM service_categories_template WHERE name='Químicas Masculinas'), 
    'Relaxamento', 
    'Alisamento capilar masculino',
    60, 80.00, 2, false, null),
((SELECT id FROM service_categories_template WHERE name='Químicas Masculinas'), 
    'Progressiva', 
    'Escova progressiva masculina',
    90, 150.00, 2, false, null),
((SELECT id FROM service_categories_template WHERE name='Químicas Masculinas'), 
    'Selagem', 
    'Selagem capilar',
    60, 100.00, 2, false, null),
((SELECT id FROM service_categories_template WHERE name='Químicas Masculinas'), 
    'Luzes', 
    'Mechas e reflexos',
    120, 200.00, 3, false, null),
((SELECT id FROM service_categories_template WHERE name='Químicas Masculinas'), 
    'Platinado', 
    'Descoloração total',
    150, 250.00, 3, false, null),

-- Estética Facial
((SELECT id FROM service_categories_template WHERE name='Estética Facial'), 
    'Limpeza de Pele Express', 
    'Limpeza facial rápida',
    30, 50.00, 2, false, null),
((SELECT id FROM service_categories_template WHERE name='Estética Facial'), 
    'Limpeza de Pele Completa', 
    'Limpeza profunda com extração',
    60, 90.00, 2, false, null),
((SELECT id FROM service_categories_template WHERE name='Estética Facial'), 
    'Harmonização de Barba', 
    'Alinhamento e design de barba',
    40, 60.00, 3, false, null),

-- Acabamento Premium
((SELECT id FROM service_categories_template WHERE name='Acabamento Premium'), 
    'Dia do Noivo', 
    'Pacote completo para noivos',
    120, 300.00, 3, false, null),
((SELECT id FROM service_categories_template WHERE name='Acabamento Premium'), 
    'Transformação Completa', 
    'Mudança total de visual',
    150, 350.00, 3, false, null),
((SELECT id FROM service_categories_template WHERE name='Acabamento Premium'), 
    'VIP Experience', 
    'Experiência exclusiva personalizada',
    180, 500.00, 3, false, null)
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMBOS / PACOTES
-- =====================================================
INSERT INTO services_template (
    category_id, 
    name, 
    description,
    duration_minutes, 
    price, 
    package_level,
    is_combo,
    image_url
) VALUES
((SELECT id FROM service_categories_template WHERE name='Combos'), 
    'Corte + Barba', 
    'Corte masculino + barba completa',
    60, 60.00, 1, true, null),
((SELECT id FROM service_categories_template WHERE name='Combos'), 
    'Pacote Relax', 
    'Corte + barba + massagem',
    80, 85.00, 1, true, null),
((SELECT id FROM service_categories_template WHERE name='Combos'), 
    'Pacote VIP', 
    'Corte + barba + hidratação + massagem',
    90, 120.00, 2, true, null),
((SELECT id FROM service_categories_template WHERE name='Combos'), 
    'Pacote Premium', 
    'Todos os serviços essenciais',
    120, 180.00, 3, true, null),
((SELECT id FROM service_categories_template WHERE name='Combos'), 
    'Pai e Filho', 
    '2 cortes com desconto especial',
    60, 65.00, 2, true, null)
ON CONFLICT DO NOTHING;

-- =====================================================
-- BUNDLE ITEMS - Configurar os combos
-- =====================================================

-- Combo: Corte + Barba
DO $$
DECLARE
  combo_id UUID;
  corte_id UUID;
  barba_id UUID;
BEGIN
  SELECT id INTO combo_id FROM services_template WHERE name='Corte + Barba' AND is_combo=true;
  SELECT id INTO corte_id FROM services_template WHERE name='Corte Masculino' AND is_combo=false;
  SELECT id INTO barba_id FROM services_template WHERE name='Barba Completa' AND is_combo=false;
  
  IF combo_id IS NOT NULL AND corte_id IS NOT NULL THEN
    INSERT INTO bundle_items_template (combo_service_id, included_service_id, quantity)
    VALUES (combo_id, corte_id, 1)
    ON CONFLICT DO NOTHING;
  END IF;
  
  IF combo_id IS NOT NULL AND barba_id IS NOT NULL THEN
    INSERT INTO bundle_items_template (combo_service_id, included_service_id, quantity)
    VALUES (combo_id, barba_id, 1)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Combo: Pacote Relax
DO $$
DECLARE
  combo_id UUID;
  corte_id UUID;
  barba_id UUID;
  massag_id UUID;
BEGIN
  SELECT id INTO combo_id FROM services_template WHERE name='Pacote Relax' AND is_combo=true;
  SELECT id INTO corte_id FROM services_template WHERE name='Corte Masculino';
  SELECT id INTO barba_id FROM services_template WHERE name='Barba Completa';
  SELECT id INTO massag_id FROM services_template WHERE name='Massagem Relaxante';
  
  IF combo_id IS NOT NULL THEN
    INSERT INTO bundle_items_template (combo_service_id, included_service_id, quantity)
    VALUES 
      (combo_id, corte_id, 1),
      (combo_id, barba_id, 1),
      (combo_id, massag_id, 1)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Combo: Pacote VIP
DO $$
DECLARE
  combo_id UUID;
  corte_id UUID;
  barba_id UUID;
  hidrat_id UUID;
  massag_id UUID;
BEGIN
  SELECT id INTO combo_id FROM services_template WHERE name='Pacote VIP' AND is_combo=true;
  SELECT id INTO corte_id FROM services_template WHERE name='Corte Masculino';
  SELECT id INTO barba_id FROM services_template WHERE name='Barba Completa';
  SELECT id INTO hidrat_id FROM services_template WHERE name='Hidratação de Barba';
  SELECT id INTO massag_id FROM services_template WHERE name='Massagem Relaxante';
  
  IF combo_id IS NOT NULL THEN
    INSERT INTO bundle_items_template (combo_service_id, included_service_id, quantity)
    VALUES 
      (combo_id, corte_id, 1),
      (combo_id, barba_id, 1),
      (combo_id, hidrat_id, 1),
      (combo_id, massag_id, 1)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Combo: Pai e Filho
DO $$
DECLARE
  combo_id UUID;
  corte_id UUID;
  infantil_id UUID;
BEGIN
  SELECT id INTO combo_id FROM services_template WHERE name='Pai e Filho' AND is_combo=true;
  SELECT id INTO corte_id FROM services_template WHERE name='Corte Masculino';
  SELECT id INTO infantil_id FROM services_template WHERE name='Corte Infantil';
  
  IF combo_id IS NOT NULL THEN
    INSERT INTO bundle_items_template (combo_service_id, included_service_id, quantity)
    VALUES 
      (combo_id, corte_id, 1),
      (combo_id, infantil_id, 1)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =====================================================
-- ESTATÍSTICAS DO KIT PREGUIÇOSO
-- =====================================================
SELECT 
    'Kit Preguiçoso populado com sucesso!' as mensagem,
    (SELECT COUNT(*) FROM service_categories_template) as total_categorias,
    (SELECT COUNT(*) FROM services_template WHERE is_combo = false) as total_servicos,
    (SELECT COUNT(*) FROM services_template WHERE is_combo = true) as total_combos,
    (SELECT COUNT(*) FROM bundle_items_template) as total_itens_combo;
