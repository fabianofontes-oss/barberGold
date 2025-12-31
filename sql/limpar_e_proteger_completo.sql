-- =============================================
-- 🧹 PASSO 1: LIMPAR DUPLICATAS
-- =============================================

-- Ver quantas duplicatas existem
SELECT phone, COUNT(*) as total
FROM clients
WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a'
GROUP BY phone
HAVING COUNT(*) > 1
ORDER BY total DESC;

-- Deletar duplicatas (mantém a primeira)
DELETE FROM clients
WHERE id NOT IN (
    SELECT MIN(id)
    FROM clients
    WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a'
    GROUP BY phone, tenant_id
);

-- =============================================
-- 🔒 PASSO 2: ADICIONAR CONSTRAINTS
-- =============================================

DO $$ 
BEGIN
    -- TELEFONE: Único por tenant
    ALTER TABLE clients DROP CONSTRAINT IF EXISTS unique_client_phone;
    ALTER TABLE clients
    ADD CONSTRAINT unique_client_phone 
    UNIQUE (tenant_id, phone);
    
    -- CPF: Único por tenant (se existir)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'cpf'
    ) THEN
        ALTER TABLE clients DROP CONSTRAINT IF EXISTS unique_client_cpf;
        ALTER TABLE clients
        ADD CONSTRAINT unique_client_cpf 
        UNIQUE (tenant_id, cpf);
    END IF;
    
    -- CNPJ: Único por tenant (se existir)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'cnpj'
    ) THEN
        ALTER TABLE clients DROP CONSTRAINT IF EXISTS unique_client_cnpj;
        ALTER TABLE clients
        ADD CONSTRAINT unique_client_cnpj 
        UNIQUE (tenant_id, cnpj);
    END IF;
    
    -- EMAIL: Único por tenant
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'email'
    ) THEN
        ALTER TABLE clients DROP CONSTRAINT IF EXISTS unique_client_email;
        ALTER TABLE clients
        ADD CONSTRAINT unique_client_email 
        UNIQUE (tenant_id, email);
    END IF;
    
    RAISE NOTICE 'Constraints aplicadas com sucesso!';
END $$;

-- =============================================
-- ✅ VERIFICAR RESULTADO:
-- =============================================
SELECT 
    'Total clientes' as info,
    COUNT(*) as total
FROM clients
WHERE tenant_id = 'bf683fdc-8caa-4e60-afda-e2bf7f32a29a';
