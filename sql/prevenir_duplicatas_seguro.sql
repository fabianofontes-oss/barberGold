-- =============================================
-- 🔒 PREVENIR DUPLICATAS - VERSÃO SEGURA
-- =============================================

-- PASSO 1: Adicionar constraints se não existirem
-- (Ignorar se já existir)

-- Clientes: telefone único por tenant
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_client_per_tenant'
    ) THEN
        ALTER TABLE clients
        ADD CONSTRAINT unique_client_per_tenant 
        UNIQUE (tenant_id, phone);
    END IF;
END $$;

-- Funcionários: email único por tenant
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_staff_email_per_tenant'
    ) THEN
        ALTER TABLE staff
        ADD CONSTRAINT unique_staff_email_per_tenant 
        UNIQUE (tenant_id, email);
    END IF;
END $$;

-- Produtos: nome único por tenant
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_product_per_tenant'
    ) THEN
        ALTER TABLE products
        ADD CONSTRAINT unique_product_per_tenant 
        UNIQUE (tenant_id, name);
    END IF;
END $$;

-- =============================================
-- PASSO 2: Limpar duplicatas (APENAS se necessário)
-- Execute os comandos abaixo SOMENTE se houver duplicatas
-- Descomente as linhas que precisar
-- =============================================

-- CLIENTES DUPLICADOS (comentado por segurança)
-- DELETE FROM clients
-- WHERE id NOT IN (
--     SELECT MIN(id)
--     FROM clients
--     WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a'
--     GROUP BY phone, tenant_id
-- );

-- FUNCIONÁRIOS DUPLICADOS (comentado por segurança)
-- DELETE FROM staff
-- WHERE id NOT IN (
--     SELECT MIN(id)
--     FROM staff
--     WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a'
--     GROUP BY email, tenant_id
-- );

-- PRODUTOS DUPLICADOS (comentado por segurança)
-- DELETE FROM products
-- WHERE id NOT IN (
--     SELECT MIN(id)
--     FROM products
--     WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a'
--     GROUP BY name, tenant_id
-- );

-- =============================================
-- ✅ PRONTO! 
-- Constraints adicionadas - duplicatas futuras serão bloqueadas
-- Se precisar limpar duplicatas existentes, descomente o PASSO 2
-- =============================================
