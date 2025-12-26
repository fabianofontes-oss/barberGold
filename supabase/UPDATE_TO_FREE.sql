-- ===============================================================
-- BARBERGOLD - ATUALIZAR SISTEMA PARA 100% GRATUITO
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- ===============================================================

-- PASSO 1: Atualizar todos tenants existentes para FREE e ACTIVE
UPDATE public.tenants 
SET 
    plan_id = 'FREE',
    status = 'ACTIVE'
WHERE plan_id IS NULL OR plan_id != 'FREE';

-- PASSO 2: Alterar defaults da tabela tenants para sempre criar como FREE
ALTER TABLE public.tenants 
ALTER COLUMN plan_id SET DEFAULT 'FREE';

ALTER TABLE public.tenants
ALTER COLUMN status SET DEFAULT 'ACTIVE';

-- PASSO 3: Verificar resultado (deve mostrar todos como FREE e ACTIVE)
SELECT 
    name,
    slug,
    plan_id,
    status,
    created_at
FROM public.tenants
ORDER BY created_at DESC;

-- ===============================================================
-- PRONTO! Todos os tenants agora estão em FREE com acesso total
-- ===============================================================
