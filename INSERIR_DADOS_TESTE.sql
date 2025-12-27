-- ============================================
-- DADOS DE TESTE PARA O SISTEMA FUNCIONAR
-- Execute este SQL no Supabase Dashboard
-- ============================================

-- Obter o store_id da barbearia existente
DO $$
DECLARE
    v_store_id UUID;
BEGIN
    -- Pegar a primeira store existente
    SELECT id INTO v_store_id FROM stores LIMIT 1;
    
    -- Se não houver store, criar um erro
    IF v_store_id IS NULL THEN
        RAISE EXCEPTION 'Nenhuma store encontrada. Crie uma store primeiro.';
    END IF;

    -- Inserir Serviços
    INSERT INTO services (id, store_id, name, price, duration_minutes, category, is_active) VALUES
    (gen_random_uuid(), v_store_id, 'Corte de Cabelo', 35.00, 30, 'CORTE', true),
    (gen_random_uuid(), v_store_id, 'Barba', 25.00, 20, 'BARBA', true),
    (gen_random_uuid(), v_store_id, 'Corte + Barba', 50.00, 45, 'COMBO', true),
    (gen_random_uuid(), v_store_id, 'Nevou', 45.00, 40, 'CORTE', true),
    (gen_random_uuid(), v_store_id, 'Pigmentação', 60.00, 60, 'TRATAMENTO', true),
    (gen_random_uuid(), v_store_id, 'Platinado', 120.00, 90, 'COLORAÇÃO', true),
    (gen_random_uuid(), v_store_id, 'Sobrancelha', 15.00, 15, 'OUTROS', true),
    (gen_random_uuid(), v_store_id, 'Relaxamento', 80.00, 60, 'TRATAMENTO', true)
    ON CONFLICT DO NOTHING;

    -- Inserir Produtos (caso tenha tabela products)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        INSERT INTO products (id, store_id, name, price, cost_price, stock, category, is_active) VALUES
        (gen_random_uuid(), v_store_id, 'Pomada Matte', 45.00, 20.00, 10, 'POMADA', true),
        (gen_random_uuid(), v_store_id, 'Gel Cola', 35.00, 15.00, 15, 'GEL', true),
        (gen_random_uuid(), v_store_id, 'Shampoo Barba', 28.00, 12.00, 20, 'SHAMPOO', true),
        (gen_random_uuid(), v_store_id, 'Óleo para Barba', 55.00, 25.00, 8, 'ÓLEO', true),
        (gen_random_uuid(), v_store_id, 'Cera Modeladora', 40.00, 18.00, 12, 'CERA', true),
        (gen_random_uuid(), v_store_id, 'Pós-Barba', 32.00, 14.00, 18, 'CUIDADOS', true)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Inserir Categorias
    INSERT INTO categories (id, store_id, name, type, color, icon) VALUES
    (gen_random_uuid(), v_store_id, 'Cortes', 'SERVICE', '#3B82F6', 'scissors'),
    (gen_random_uuid(), v_store_id, 'Barba', 'SERVICE', '#10B981', 'razor'),
    (gen_random_uuid(), v_store_id, 'Combos', 'SERVICE', '#F59E0B', 'package'),
    (gen_random_uuid(), v_store_id, 'Produtos de Cabelo', 'PRODUCT', '#8B5CF6', 'bottle'),
    (gen_random_uuid(), v_store_id, 'Produtos de Barba', 'PRODUCT', '#EF4444', 'droplet'),
    (gen_random_uuid(), v_store_id, 'Despesas Fixas', 'EXPENSE', '#6B7280', 'home'),
    (gen_random_uuid(), v_store_id, 'Despesas Variáveis', 'EXPENSE', '#F97316', 'trending-up')
    ON CONFLICT DO NOTHING;

    -- Inserir Plano de Comissão Padrão
    INSERT INTO commission_plans (id, store_id, name, description, service_rate, product_rate, is_default) VALUES
    (gen_random_uuid(), v_store_id, 'Plano Padrão', 'Comissão padrão para barbeiros', 50.00, 20.00, true),
    (gen_random_uuid(), v_store_id, 'Plano Premium', 'Para barbeiros experientes', 60.00, 25.00, false),
    (gen_random_uuid(), v_store_id, 'Plano Junior', 'Para barbeiros iniciantes', 40.00, 15.00, false)
    ON CONFLICT DO NOTHING;

    -- Inserir Fornecedores
    INSERT INTO suppliers (id, store_id, name, contact_name, email, phone, address) VALUES
    (gen_random_uuid(), v_store_id, 'Distribuidora Barber Pro', 'João Silva', 'contato@barberpro.com', '(11) 98765-4321', 'Rua dos Barbeiros, 123'),
    (gen_random_uuid(), v_store_id, 'Fornecedor Nacional', 'Maria Santos', 'vendas@nacional.com', '(11) 91234-5678', 'Av. Comercial, 456'),
    (gen_random_uuid(), v_store_id, 'Produtos Premium', 'Carlos Oliveira', 'premium@produtos.com', '(11) 99876-5432', 'Rua Premium, 789')
    ON CONFLICT DO NOTHING;

END $$;

-- Mensagem de confirmação
SELECT 'Dados de teste inseridos com sucesso!' as mensagem;
