-- ===============================================================
-- BARBERGOLD - SQL PARA CORRIGIR CADASTRO
-- COPIE E COLE ESTE ARQUIVO INTEIRO NO SUPABASE SQL EDITOR
-- ===============================================================

-- PASSO 1: Criar a função que processa novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_tenant_id uuid;
    v_full_name text;
    v_slug text;
    v_plan text;
BEGIN
    -- Extrai dados do cadastro
    v_full_name := coalesce(new.raw_user_meta_data->>'full_name', 'Novo Barbeiro');
    v_slug      := coalesce(new.raw_user_meta_data->>'slug', 'shop-' || floor(random() * 1000000)::text);
    v_plan      := coalesce(new.raw_user_meta_data->>'plan', 'FREE');

    -- Log para debug (aparece nos logs do Supabase)
    RAISE NOTICE 'Criando tenant para usuário: %, slug: %', new.id, v_slug;

    -- PASSO 1: Criar Tenant (Barbearia)
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
        jsonb_build_object('setup_completed', false)
    )
    RETURNING id INTO new_tenant_id;

    -- PASSO 2: Criar Profile (Usuário)
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
    -- Em caso de erro, cancela o cadastro e mostra a mensagem
    RAISE EXCEPTION 'Erro ao configurar barbearia: %', SQLERRM;
END;
$$;

-- PASSO 2: Remover trigger antigo (se existir)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- PASSO 3: Criar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===============================================================
-- PRONTO! Agora teste o cadastro em barber.gold/register
-- ===============================================================
