-- ===============================================================
-- BARBERGOLD - TRIGGER DE AUTOMAÇÃO DE NOVO USUÁRIO
-- Objetivo: Criar Tenant e Profile automaticamente após o SignUp
-- Local: Supabase Dashboard > SQL Editor
-- ===============================================================

-- 1. Cria ou atualiza a função que processa o novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER -- Roda como 'admin' para ignorar RLS durante a criação
AS $$
DECLARE
    new_tenant_id uuid;
    v_full_name text;
    v_slug text;
    v_plan text;
BEGIN
    -- Extrai metadados enviados pelo frontend no signUp()
    v_full_name := coalesce(new.raw_user_meta_data->>'full_name', 'Novo Barbeiro');
    v_slug      := coalesce(new.raw_user_meta_data->>'slug', 'shop-' || floor(random() * 1000000)::text);
    v_plan      := coalesce(new.raw_user_meta_data->>'plan', 'FREE');

    -- Log de depuração (visível no Supabase Logs)
    RAISE NOTICE 'Iniciando criação de tenant para usuário: %, com slug: %', new.id, v_slug;

    -- PASSO 1: Criar a Barbearia (Tenant)
    -- Se o slug já existir, o trigger vai falhar e o cadastro será cancelado (proteção de integridade)
    INSERT INTO public.tenants (
        name,
        slug,
        owner_id,
        plan_id,
        status,
        settings
    ) VALUES (
        v_full_name,
        v_slug,
        new.id,
        upper(v_plan),
        'TRIAL',
        jsonb_build_object(
            'setup_completed', false,
            'features_enabled', CASE 
                WHEN v_plan IN ('pro', 'empire') THEN '["advanced_reports", "marketing_auto"]'::jsonb 
                ELSE '[]'::jsonb 
            END
        )
    )
    RETURNING id INTO new_tenant_id;

    -- PASSO 2: Criar o Perfil do Proprietário (Owner)
    INSERT INTO public.profiles (
        tenant_id,
        user_id,
        role,
        name,
        email,
        is_active
    ) VALUES (
        new_tenant_id,
        new.id,
        'OWNER',
        v_full_name,
        new.email,
        TRUE
    );

    RETURN new;
EXCEPTION WHEN OTHERS THEN
    -- Em caso de erro (ex: slug duplicado), o Supabase cancela o signUp
    RAISE EXCEPTION 'Erro ao configurar barbearia: %', SQLERRM;
END;
$$;

-- 2. Limpa trigger existente (se houver) e recria
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- DICA: Se você já tem usuários no banco e quer testar, o trigger só rodará nos PRÓXIMOS.
