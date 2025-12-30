-- ===============================================================
-- BARBERGOLD - TRIGGER DE AUTOMAÇÃO DE NOVO USUÁRIO (CORRIGIDO)
-- Objetivo: Criar Store e Profile automaticamente após o SignUp
-- Atualização: Usa 'stores' ao invés de 'tenants' (schema atual)
-- ===============================================================

-- 1. Cria ou atualiza a função que processa o novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER -- Roda como 'admin' para ignorar RLS durante a criação
AS $$
DECLARE
    new_store_id uuid;
    v_full_name text;
    v_slug text;
    v_plan text;
BEGIN
    -- Extrai metadados enviados pelo frontend no signUp()
    v_full_name := coalesce(new.raw_user_meta_data->>'full_name', 'Nova Barbearia');
    v_slug      := coalesce(new.raw_user_meta_data->>'slug', 'shop-' || floor(random() * 1000000)::text);
    v_plan      := coalesce(new.raw_user_meta_data->>'plan', 'FREE');

    -- Log de depuração (visível no Supabase Logs)
    RAISE NOTICE 'Iniciando criação de store para usuário: %, com slug: %', new.id, v_slug;

    -- PASSO 1: Criar a Barbearia (Store)
    -- Se o slug já existir, o trigger vai falhar e o cadastro será cancelado (proteção de integridade)
    INSERT INTO public.stores (
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
        'ACTIVE',
        jsonb_build_object(
            'setup_completed', false,
            'onboarding_completed', false
        )
    )
    RETURNING id INTO new_store_id;

    -- PASSO 2: Criar o Perfil do Proprietário na tabela profiles (se existir)
    -- Verifica se a tabela profiles existe
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        INSERT INTO public.profiles (
            store_id,
            user_id,
            role,
            name,
            email,
            is_active
        ) VALUES (
            new_store_id,
            new.id,
            'OWNER',
            v_full_name,
            new.email,
            TRUE
        );
    END IF;

    -- PASSO 3: Criar registro do owner na tabela staff
    INSERT INTO public.staff (
        store_id,
        user_id,
        name,
        role,
        email,
        commission_model,
        service_commission_rate,
        product_commission_rate
    ) VALUES (
        new_store_id,
        new.id,
        v_full_name,
        'OWNER',
        new.email,
        'OWNER',
        100.00,
        100.00
    );

    RAISE NOTICE '✅ Store criado com sucesso: %', new_store_id;

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

COMMENT ON FUNCTION public.handle_new_user IS 'Trigger automático que cria store e staff/profile ao fazer signup';
