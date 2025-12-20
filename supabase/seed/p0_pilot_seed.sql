-- =============================================
-- SEED P0: Criar Tenant + Profile para Piloto
-- =============================================
-- 
-- INSTRUÇÕES:
-- 1. Primeiro, crie um usuário no Supabase Auth (Dashboard → Authentication → Users)
-- 2. Copie o UUID do usuário criado
-- 3. Substitua os placeholders abaixo
-- 4. Execute este script no SQL Editor do Supabase
--
-- PLACEHOLDERS:
--   <UUID_DO_AUTH_USER>  → UUID do usuário criado no Auth
--   <NOME_DA_BARBEARIA>  → Nome da barbearia (ex: "Barbearia Premium")
--   <SEU_NOME>           → Nome do dono (ex: "João Silva")
--   <SEU_EMAIL>          → Email do dono (mesmo usado no Auth)
--   <SEU_TELEFONE>       → Telefone (ex: "5511999999999")
--
-- =============================================

-- Variáveis (substitua antes de executar)
DO $$
DECLARE
  v_user_id UUID := '<UUID_DO_AUTH_USER>';
  v_tenant_id UUID := gen_random_uuid();
  v_profile_id UUID := gen_random_uuid();
  v_shop_name TEXT := '<NOME_DA_BARBEARIA>';
  v_owner_name TEXT := '<SEU_NOME>';
  v_owner_email TEXT := '<SEU_EMAIL>';
  v_owner_phone TEXT := '<SEU_TELEFONE>';
BEGIN

  -- 1. Criar Tenant (Barbearia)
  INSERT INTO public.tenants (
    id,
    owner_id,
    name,
    slug,
    plan_id,
    status,
    created_at
  ) VALUES (
    v_tenant_id,
    v_user_id,
    v_shop_name,
    LOWER(REPLACE(v_shop_name, ' ', '-')),
    'SOLO',  -- Plano inicial
    'TRIAL', -- Status trial
    NOW()
  );

  -- 2. Criar Profile (vínculo usuário-tenant)
  INSERT INTO public.profiles (
    id,
    user_id,
    tenant_id,
    role,
    name,
    email,
    phone,
    is_active,
    created_at
  ) VALUES (
    v_profile_id,
    v_user_id,
    v_tenant_id,
    'OWNER',
    v_owner_name,
    v_owner_email,
    v_owner_phone,
    TRUE,
    NOW()
  );

  -- 3. Criar configuração inicial do website (opcional)
  INSERT INTO public.website_config (
    id,
    tenant_id,
    business_name,
    tagline,
    primary_color,
    is_published,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_tenant_id,
    v_shop_name,
    'Sua barbearia de confiança',
    '#F59E0B', -- Amber 500
    FALSE,
    NOW(),
    NOW()
  );

  -- 4. Criar configuração de fidelidade (opcional)
  INSERT INTO public.loyalty_config (
    id,
    tenant_id,
    is_enabled,
    points_per_currency,
    currency_per_point,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    v_tenant_id,
    TRUE,
    1,    -- 1 ponto por R$1
    0.10, -- R$0.10 por ponto
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Seed concluído com sucesso!';
  RAISE NOTICE 'Tenant ID: %', v_tenant_id;
  RAISE NOTICE 'Profile ID: %', v_profile_id;

END $$;

-- =============================================
-- VERIFICAÇÃO (execute após o seed)
-- =============================================
-- SELECT * FROM public.tenants;
-- SELECT * FROM public.profiles;
-- SELECT * FROM public.website_config;
-- SELECT * FROM public.loyalty_config;
