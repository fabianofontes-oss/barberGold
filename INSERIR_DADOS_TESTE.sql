-- ============================================
-- DADOS DE TESTE PARA O SISTEMA FUNCIONAR
-- Execute este SQL no Supabase Dashboard
-- ============================================

-- Obter IDs necessários
DO $$
DECLARE
    v_store_id UUID;
BEGIN
    -- Pegar a primeira store existente
    SELECT id INTO v_store_id FROM stores LIMIT 1;
    
    -- Se não houver store, criar um erro
    IF v_store_id IS NULL THEN
        RAISE EXCEPTION 'Nenhuma store encontrada. Faça login no sistema primeiro para criar uma store.';
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

    -- Inserir Clientes de teste
    INSERT INTO clients (id, store_id, name, phone, email) VALUES
    (gen_random_uuid(), v_store_id, 'João Silva', '(11) 98765-4321', 'joao@email.com'),
    (gen_random_uuid(), v_store_id, 'Maria Santos', '(11) 91234-5678', 'maria@email.com'),
    (gen_random_uuid(), v_store_id, 'Pedro Oliveira', '(11) 99876-5432', 'pedro@email.com')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Dados de teste inseridos com sucesso para store: %', v_store_id;

END $$;

-- Mensagem de confirmação
SELECT 'Dados de teste inseridos com sucesso!' as mensagem;
