-- =============================================
-- 🧹 LIMPAR DUPLICADOS
-- Remove clientes, funcionários e produtos duplicados
-- =============================================

-- Seu tenant_id
-- Substitua se necessário: bf683fdc-8caa-4e60-afda-e2bf7f32a29a

-- 1️⃣ LIMPAR CLIENTES DUPLICADOS
-- Mantém apenas o primeiro registro de cada cliente (por nome)
DELETE FROM clients
WHERE id NOT IN (
    SELECT MIN(id)
    FROM clients
    WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a'
    GROUP BY name, tenant_id
);

-- 2️⃣ LIMPAR FUNCIONÁRIOS DUPLICADOS
-- Mantém apenas o primeiro registro de cada funcionário (por email)
DELETE FROM staff
WHERE id NOT IN (
    SELECT MIN(id)
    FROM staff
    WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a'
    GROUP BY email, tenant_id
);

-- 3️⃣ LIMPAR PRODUTOS DUPLICADOS
-- Mantém apenas o primeiro registro de cada produto (por nome)
DELETE FROM products
WHERE id NOT IN (
    SELECT MIN(id)
    FROM products
    WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a'
    GROUP BY name, tenant_id
);

-- =============================================
-- VERIFICAR RESULTADO:
-- =============================================
-- SELECT COUNT(*) as total_clientes FROM clients WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a';
-- SELECT COUNT(*) as total_funcionarios FROM staff WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a';
-- SELECT COUNT(*) as total_produtos FROM products WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a';
