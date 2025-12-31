-- =============================================
-- 🔒 OPÇÃO 2: Telefone único GLOBALMENTE
-- (Nenhum cliente em NENHUM tenant pode ter telefone duplicado)
-- =============================================

DO $$ 
BEGIN
    -- Remover constraint se existir
    ALTER TABLE clients DROP CONSTRAINT IF EXISTS unique_client_per_tenant;
    ALTER TABLE clients DROP CONSTRAINT IF EXISTS unique_client_phone_global;
    
    -- Adicionar constraint: telefone único GLOBALMENTE
    ALTER TABLE clients
    ADD CONSTRAINT unique_client_phone_global 
    UNIQUE (phone);
END $$;

-- =============================================
-- RESULTADO: Telefone único em TODO o sistema
-- Mesmo em tenants diferentes, não pode repetir telefone
-- =============================================
