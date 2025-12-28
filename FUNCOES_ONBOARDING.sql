-- =====================================================
-- FUNÇÕES PARA ONBOARDING SELETIVO
-- O barbeiro escolhe quais serviços quer oferecer
-- =====================================================

-- Função para copiar categoria selecionada do template para a loja
CREATE OR REPLACE FUNCTION copy_category_to_store(
    p_store_id UUID,
    p_template_category_id UUID
) RETURNS UUID AS $$
DECLARE
    v_new_category_id UUID;
BEGIN
    INSERT INTO service_categories (
        store_id,
        template_id,
        name,
        description,
        display_order,
        icon,
        color,
        is_active
    )
    SELECT 
        p_store_id,
        id,
        name,
        description,
        display_order,
        icon,
        color,
        true
    FROM service_categories_template
    WHERE id = p_template_category_id
    RETURNING id INTO v_new_category_id;
    
    RETURN v_new_category_id;
END;
$$ LANGUAGE plpgsql;

-- Função para copiar serviços selecionados do template para a loja
CREATE OR REPLACE FUNCTION copy_selected_services_to_store(
    p_store_id UUID,
    p_template_service_ids UUID[]
) RETURNS TABLE (
    template_id UUID,
    new_service_id UUID,
    service_name TEXT
) AS $$
DECLARE
    v_service_mapping RECORD;
    v_new_service_id UUID;
    v_category_mapping JSONB DEFAULT '{}'::jsonb;
BEGIN
    -- Primeiro, criar as categorias necessárias (se ainda não existirem)
    FOR v_service_mapping IN 
        SELECT DISTINCT st.category_id as template_category_id
        FROM services_template st
        WHERE st.id = ANY(p_template_service_ids)
    LOOP
        -- Verificar se a categoria já foi copiada
        SELECT id INTO v_new_service_id
        FROM service_categories
        WHERE store_id = p_store_id 
        AND template_id = v_service_mapping.template_category_id;
        
        -- Se não existe, criar
        IF v_new_service_id IS NULL THEN
            v_new_service_id := copy_category_to_store(p_store_id, v_service_mapping.template_category_id);
        END IF;
        
        -- Guardar mapeamento categoria_template -> categoria_loja
        v_category_mapping := v_category_mapping || 
            jsonb_build_object(v_service_mapping.template_category_id::text, v_new_service_id);
    END LOOP;
    
    -- Agora copiar os serviços selecionados
    FOR v_service_mapping IN 
        SELECT 
            st.id as template_id,
            st.category_id,
            st.name,
            st.description,
            st.duration_minutes,
            st.price,
            st.is_combo,
            st.image_url
        FROM services_template st
        WHERE st.id = ANY(p_template_service_ids)
    LOOP
        INSERT INTO services (
            store_id,
            category_id,
            template_id,
            name,
            description,
            duration_minutes,
            price,
            is_combo,
            is_active,
            allow_online_booking,
            image_url
        ) VALUES (
            p_store_id,
            (v_category_mapping->>(v_service_mapping.category_id::text))::UUID,
            v_service_mapping.template_id,
            v_service_mapping.name,
            v_service_mapping.description,
            v_service_mapping.duration_minutes,
            v_service_mapping.price,
            v_service_mapping.is_combo,
            true, -- ativo por padrão
            true, -- permitir agendamento online por padrão
            v_service_mapping.image_url
        )
        RETURNING id INTO v_new_service_id;
        
        -- Retornar mapeamento para uso posterior (bundles)
        RETURN QUERY SELECT 
            v_service_mapping.template_id,
            v_new_service_id,
            v_service_mapping.name;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Função para copiar bundle items dos combos selecionados
CREATE OR REPLACE FUNCTION copy_bundle_items_to_store(
    p_store_id UUID,
    p_service_mappings JSONB -- {"template_id": "new_service_id"}
) RETURNS INTEGER AS $$
DECLARE
    v_bundle_count INTEGER := 0;
    v_combo_mapping RECORD;
    v_item_mapping RECORD;
BEGIN
    -- Para cada combo que foi copiado
    FOR v_combo_mapping IN 
        SELECT 
            key::UUID as template_combo_id,
            value::text::UUID as new_combo_id
        FROM jsonb_each_text(p_service_mappings)
        WHERE key::UUID IN (
            SELECT id FROM services_template WHERE is_combo = true
        )
    LOOP
        -- Copiar os itens do bundle
        FOR v_item_mapping IN
            SELECT 
                bit.included_service_id,
                bit.quantity,
                bit.discount_percentage
            FROM bundle_items_template bit
            WHERE bit.combo_service_id = v_combo_mapping.template_combo_id
        LOOP
            -- Verificar se o serviço incluído também foi copiado
            IF p_service_mappings ? v_item_mapping.included_service_id::text THEN
                INSERT INTO bundle_items (
                    combo_service_id,
                    included_service_id,
                    quantity,
                    discount_percentage
                ) VALUES (
                    v_combo_mapping.new_combo_id,
                    (p_service_mappings->>v_item_mapping.included_service_id::text)::UUID,
                    v_item_mapping.quantity,
                    v_item_mapping.discount_percentage
                );
                v_bundle_count := v_bundle_count + 1;
            END IF;
        END LOOP;
    END LOOP;
    
    RETURN v_bundle_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÃO PRINCIPAL DE ONBOARDING
-- =====================================================
CREATE OR REPLACE FUNCTION onboard_store_with_selected_services(
    p_store_id UUID,
    p_selected_service_ids UUID[]
) RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    services_created INTEGER,
    bundles_created INTEGER
) AS $$
DECLARE
    v_service_mappings JSONB DEFAULT '{}'::jsonb;
    v_service_record RECORD;
    v_services_count INTEGER := 0;
    v_bundles_count INTEGER := 0;
BEGIN
    -- Validar store_id
    IF NOT EXISTS (SELECT 1 FROM tenants WHERE id = p_store_id) THEN
        RETURN QUERY SELECT 
            false,
            'Loja não encontrada',
            0,
            0;
        RETURN;
    END IF;
    
    -- Validar se há serviços selecionados
    IF array_length(p_selected_service_ids, 1) IS NULL THEN
        RETURN QUERY SELECT 
            false,
            'Nenhum serviço selecionado',
            0,
            0;
        RETURN;
    END IF;
    
    -- Copiar serviços selecionados e construir mapeamento
    FOR v_service_record IN 
        SELECT * FROM copy_selected_services_to_store(p_store_id, p_selected_service_ids)
    LOOP
        v_service_mappings := v_service_mappings || 
            jsonb_build_object(v_service_record.template_id::text, v_service_record.new_service_id);
        v_services_count := v_services_count + 1;
    END LOOP;
    
    -- Copiar bundle items se houver combos
    v_bundles_count := copy_bundle_items_to_store(p_store_id, v_service_mappings);
    
    RETURN QUERY SELECT 
        true,
        format('Onboarding concluído: %s serviços e %s bundles criados', v_services_count, v_bundles_count),
        v_services_count,
        v_bundles_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VIEWS AUXILIARES PARA O FRONTEND
-- =====================================================

-- View para mostrar todos os serviços disponíveis no template agrupados por categoria
CREATE OR REPLACE VIEW v_template_services_by_category AS
SELECT 
    c.id as category_id,
    c.name as category_name,
    c.description as category_description,
    c.icon as category_icon,
    c.color as category_color,
    c.display_order as category_order,
    s.id as service_id,
    s.name as service_name,
    s.description as service_description,
    s.duration_minutes,
    s.price,
    s.is_combo,
    s.package_level,
    s.image_url,
    CASE 
        WHEN s.is_combo THEN 
            (SELECT json_agg(json_build_object(
                'service_name', si.name,
                'quantity', bit.quantity
            ))
            FROM bundle_items_template bit
            JOIN services_template si ON si.id = bit.included_service_id
            WHERE bit.combo_service_id = s.id)
        ELSE NULL
    END as bundle_items
FROM service_categories_template c
LEFT JOIN services_template s ON s.category_id = c.id
ORDER BY c.display_order, c.name, s.name;

-- View para mostrar estatísticas do template
CREATE OR REPLACE VIEW v_template_stats AS
SELECT 
    (SELECT COUNT(*) FROM service_categories_template) as total_categories,
    (SELECT COUNT(*) FROM services_template WHERE is_combo = false) as total_services,
    (SELECT COUNT(*) FROM services_template WHERE is_combo = true) as total_combos,
    (SELECT COUNT(*) FROM services_template WHERE package_level = 1) as services_basic,
    (SELECT COUNT(*) FROM services_template WHERE package_level = 2) as services_standard,
    (SELECT COUNT(*) FROM services_template WHERE package_level = 3) as services_premium,
    (SELECT COUNT(DISTINCT combo_service_id) FROM bundle_items_template) as combos_configured;

-- =====================================================
-- EXEMPLO DE USO
-- =====================================================
/*
-- 1. Listar todos os serviços disponíveis para seleção:
SELECT * FROM v_template_services_by_category;

-- 2. Frontend envia array de IDs dos serviços selecionados pelo barbeiro:
SELECT * FROM onboard_store_with_selected_services(
    'uuid-da-loja',
    ARRAY[
        'uuid-servico-1',
        'uuid-servico-2',
        'uuid-servico-3',
        'uuid-combo-1'
    ]::UUID[]
);

-- 3. Verificar serviços criados para a loja:
SELECT s.*, c.name as category_name
FROM services s
JOIN service_categories c ON c.id = s.category_id
WHERE s.store_id = 'uuid-da-loja'
ORDER BY c.display_order, s.name;
*/
