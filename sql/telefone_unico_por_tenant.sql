-- =============================================
-- 🔒 OPÇÃO 1: Telefone único POR TENANT
-- (Um cliente do Tenant A pode ter mesmo telefone que cliente do Tenant B)
-- =============================================

DO $$ 
BEGIN
    -- Remover constraint se existir
    ALTER TABLE clients DROP CONSTRAINT IF EXISTS unique_client_per_tenant;
    ALTER TABLE clients DROP CONSTRAINT IF EXISTS unique_client_phone_global;
    
    -- Adicionar constraint: telefone único POR tenant
    ALTER TABLE clients
    ADD CONSTRAINT unique_client_per_tenant 
    UNIQUE (tenant_id, phone);
END $$;

-- =============================================
-- RESULTADO: Mesmo telefone NÃO pode existir 2x no mesmo tenant
-- =============================================
