-- =====================================================
-- SEED INICIAL DE SERVIÇOS (para todas as lojas existentes)
-- Popula serviços básicos para lojas que já existem
-- =====================================================

-- Inserir serviços básicos para cada loja existente
DO $$
DECLARE
  store_record RECORD;
  cat_cabelo_id UUID;
  cat_barba_id UUID;
BEGIN
  -- Para cada loja existente
  FOR store_record IN SELECT id FROM stores LOOP
    
    -- Criar categorias básicas
    INSERT INTO service_categories (store_id, name, icon, sort_order, is_active)
    VALUES (store_record.id, 'Cabelo', '✂️', 1, true)
    ON CONFLICT (store_id, name) DO NOTHING
    RETURNING id INTO cat_cabelo_id;
    
    IF cat_cabelo_id IS NULL THEN
      SELECT id INTO cat_cabelo_id FROM service_categories 
      WHERE store_id = store_record.id AND name = 'Cabelo' LIMIT 1;
    END IF;
    
    INSERT INTO service_categories (store_id, name, icon, sort_order, is_active)
    VALUES (store_record.id, 'Barba', '🧔', 2, true)
    ON CONFLICT (store_id, name) DO NOTHING
    RETURNING id INTO cat_barba_id;
    
    IF cat_barba_id IS NULL THEN
      SELECT id INTO cat_barba_id FROM service_categories 
      WHERE store_id = store_record.id AND name = 'Barba' LIMIT 1;
    END IF;
    
    -- Inserir serviços básicos
    IF cat_cabelo_id IS NOT NULL THEN
      INSERT INTO services (store_id, category_id, type, name, duration, price, is_active, is_popular, sort_order)
      VALUES 
        (store_record.id, cat_cabelo_id, 'service', 'Corte Masculino', 30, 40.00, true, true, 1),
        (store_record.id, cat_cabelo_id, 'service', 'Corte Social', 40, 50.00, true, false, 2),
        (store_record.id, cat_cabelo_id, 'service', 'Degradê', 40, 45.00, true, true, 3)
      ON CONFLICT (store_id, category_id, name) DO NOTHING;
    END IF;
    
    IF cat_barba_id IS NOT NULL THEN
      INSERT INTO services (store_id, category_id, type, name, duration, price, is_active, is_popular, sort_order)
      VALUES 
        (store_record.id, cat_barba_id, 'service', 'Barba Simples', 15, 25.00, true, false, 1),
        (store_record.id, cat_barba_id, 'service', 'Barba Completa', 30, 35.00, true, true, 2)
      ON CONFLICT (store_id, category_id, name) DO NOTHING;
    END IF;
    
  END LOOP;
END $$;
