-- ===============================================================
-- CORRIGIR STATUS - Mudar de TRIAL para ACTIVE
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- ===============================================================

-- Atualizar status de TRIAL para ACTIVE
UPDATE public.tenants 
SET status = 'ACTIVE'
WHERE status = 'TRIAL';

-- Verificar resultado
SELECT 
    name,
    slug,
    plan_id,
    status,
    created_at
FROM public.tenants
ORDER BY created_at DESC;

-- ===============================================================
-- PRONTO! Status atualizado para ACTIVE
-- ===============================================================
