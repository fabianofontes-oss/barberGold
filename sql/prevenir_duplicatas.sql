-- =============================================
-- 🔒 PREVENIR DUPLICATAS + LIMPAR EXISTENTES
-- =============================================

-- 1️⃣ LIMPAR DUPLICATAS ATUAIS
DELETE FROM clients
WHERE id NOT IN (
    SELECT MIN(id)
    FROM clients
    WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a'
    GROUP BY name, phone, tenant_id
);

DELETE FROM staff
WHERE id NOT IN (
    SELECT MIN(id)
    FROM staff
    WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a'
    GROUP BY email, tenant_id
);

DELETE FROM products
WHERE id NOT IN (
    SELECT MIN(id)
    FROM products
    WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a'
    GROUP BY name, tenant_id
);

-- 2️⃣ ADICIONAR CONSTRAINTS PARA PREVENIR DUPLICATAS FUTURAS

-- Clientes: não pode ter mesmo nome+phone no mesmo tenant
ALTER TABLE clients 
DROP CONSTRAINT IF EXISTS unique_client_per_tenant;

ALTER TABLE clients
ADD CONSTRAINT unique_client_per_tenant 
UNIQUE (tenant_id, phone);

-- Funcionários: não pode ter mesmo email no mesmo tenant
ALTER TABLE staff
DROP CONSTRAINT IF EXISTS unique_staff_email_per_tenant;

ALTER TABLE staff
ADD CONSTRAINT unique_staff_email_per_tenant 
UNIQUE (tenant_id, email);

-- Produtos: não pode ter mesmo nome no mesmo tenant
ALTER TABLE products
DROP CONSTRAINT IF EXISTS unique_product_per_tenant;

ALTER TABLE products
ADD CONSTRAINT unique_product_per_tenant 
UNIQUE (tenant_id, name);

-- =============================================
-- ✅ PRONTO! Agora o banco VAI BLOQUEAR duplicatas!
-- =============================================
