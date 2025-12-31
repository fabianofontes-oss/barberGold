-- =============================================
-- 🔒 PREVENIR DUPLICATAS COMPLETO
-- Telefone, CPF e CNPJ únicos por tenant
-- =============================================

DO $$ 
BEGIN
    -- TELEFONE: Único por tenant
    ALTER TABLE clients DROP CONSTRAINT IF EXISTS unique_client_phone;
    ALTER TABLE clients
    ADD CONSTRAINT unique_client_phone 
    UNIQUE (tenant_id, phone);
    
    -- CPF: Único por tenant (se a coluna existir)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'cpf'
    ) THEN
        ALTER TABLE clients DROP CONSTRAINT IF EXISTS unique_client_cpf;
        ALTER TABLE clients
        ADD CONSTRAINT unique_client_cpf 
        UNIQUE (tenant_id, cpf);
    END IF;
    
    -- CNPJ: Único por tenant (se a coluna existir)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'cnpj'
    ) THEN
        ALTER TABLE clients DROP CONSTRAINT IF EXISTS unique_client_cnpj;
        ALTER TABLE clients
        ADD CONSTRAINT unique_client_cnpj 
        UNIQUE (tenant_id, cnpj);
    END IF;
    
    -- EMAIL: Único por tenant (bônus)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'email'
    ) THEN
        ALTER TABLE clients DROP CONSTRAINT IF EXISTS unique_client_email;
        ALTER TABLE clients
        ADD CONSTRAINT unique_client_email 
        UNIQUE (tenant_id, email);
    END IF;
    
    RAISE NOTICE 'Constraints de unicidade aplicadas com sucesso!';
END $$;

-- =============================================
-- ✅ RESULTADO:
-- - Telefone único por tenant
-- - CPF único por tenant (se coluna existir)
-- - CNPJ único por tenant (se coluna existir)
-- - Email único por tenant (bônus)
-- =============================================

-- VERIFICAR constraints criadas:
-- SELECT conname, contype FROM pg_constraint WHERE conrelid = 'clients'::regclass;
