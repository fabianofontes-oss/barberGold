-- ============================================
-- DADOS DE TESTE PARA O SISTEMA FUNCIONAR
-- Execute este SQL no Supabase Dashboard
-- ============================================

-- Obter IDs necessários
DO $$
DECLARE
    v_store_id UUID;
    v_tenant_id UUID;
BEGIN
    -- Pegar a primeira store existente
    SELECT id INTO v_store_id FROM stores LIMIT 1;
    
    -- Se não houver store, criar um erro
    IF v_store_id IS NULL THEN
        RAISE EXCEPTION 'Nenhuma store encontrada. Faça login no sistema primeiro.';
    END IF;
    
    -- Pegar o tenant_id da primeira categoria existente ou usar o store_id
    SELECT tenant_id INTO v_tenant_id FROM categories LIMIT 1;
    IF v_tenant_id IS NULL THEN
        v_tenant_id := v_store_id; -- Usar store_id como tenant_id se não houver
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
        INSERT INTO products (id, tenant_id, name, price, cost_price, stock, category, is_active) VALUES
        (gen_random_uuid(), v_tenant_id, 'Pomada Matte', 45.00, 20.00, 10, 'POMADA', true),
        (gen_random_uuid(), v_tenant_id, 'Gel Cola', 35.00, 15.00, 15, 'GEL', true),
        (gen_random_uuid(), v_tenant_id, 'Shampoo Barba', 28.00, 12.00, 20, 'SHAMPOO', true),
        (gen_random_uuid(), v_tenant_id, 'Óleo para Barba', 55.00, 25.00, 8, 'ÓLEO', true),
        (gen_random_uuid(), v_tenant_id, 'Cera Modeladora', 40.00, 18.00, 12, 'CERA', true),
        (gen_random_uuid(), v_tenant_id, 'Pós-Barba', 32.00, 14.00, 18, 'CUIDADOS', true)
        ON CONFLICT DO NOTHING;
    END IF;

    -- Inserir Categorias (apenas SERVICE e PRODUCT)
    INSERT INTO categories (id, tenant_id, name, type, color, icon) VALUES
    (gen_random_uuid(), v_tenant_id, 'Cortes', 'SERVICE', '#3B82F6', 'scissors'),
    (gen_random_uuid(), v_tenant_id, 'Barba', 'SERVICE', '#10B981', 'razor'),
    (gen_random_uuid(), v_tenant_id, 'Combos', 'SERVICE', '#F59E0B', 'package'),
    (gen_random_uuid(), v_tenant_id, 'Produtos de Cabelo', 'PRODUCT', '#8B5CF6', 'bottle'),
    (gen_random_uuid(), v_tenant_id, 'Produtos de Barba', 'PRODUCT', '#EF4444', 'droplet')
    ON CONFLICT DO NOTHING;

    -- Inserir Plano de Comissão Padrão
    INSERT INTO commission_plans (id, tenant_id, name, description, service_rate, product_rate, is_default) VALUES
    (gen_random_uuid(), v_tenant_id, 'Plano Padrão', 'Comissão padrão para barbeiros', 50.00, 20.00, true),
    (gen_random_uuid(), v_tenant_id, 'Plano Premium', 'Para barbeiros experientes', 60.00, 25.00, false),
    (gen_random_uuid(), v_tenant_id, 'Plano Junior', 'Para barbeiros iniciantes', 40.00, 15.00, false)
    ON CONFLICT DO NOTHING;

    -- Inserir Fornecedores
    INSERT INTO suppliers (id, tenant_id, name, contact_name, email, phone, address) VALUES
    (gen_random_uuid(), v_tenant_id, 'Distribuidora Barber Pro', 'João Silva', 'contato@barberpro.com', '(11) 98765-4321', 'Rua dos Barbeiros, 123'),
    (gen_random_uuid(), v_tenant_id, 'Fornecedor Nacional', 'Maria Santos', 'vendas@nacional.com', '(11) 91234-5678', 'Av. Comercial, 456'),
    (gen_random_uuid(), v_tenant_id, 'Produtos Premium', 'Carlos Oliveira', 'premium@produtos.com', '(11) 99876-5432', 'Rua Premium, 789')
    ON CONFLICT DO NOTHING;

END $$;

-- Mensagem de confirmação
SELECT 'Dados de teste inseridos com sucesso!' as mensagem;
