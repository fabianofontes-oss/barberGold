-- =============================================
-- FIX: TRIGGER HANDLE_NEW_USER COM SHOP_NAME E SLUG
-- Execute no Supabase Dashboard > SQL Editor
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_tenant_id uuid;
    v_full_name text;
    v_shop_name text;
    v_slug text;
    v_plan text;
BEGIN
    -- Extrair dados do metadata enviado pelo frontend
    v_full_name := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
    v_shop_name := coalesce(new.raw_user_meta_data->>'shop_name', v_full_name || ' Barbearia');
    v_slug      := coalesce(new.raw_user_meta_data->>'slug', 'loja-' || substr(md5(random()::text), 1, 6));
    v_plan      := coalesce(new.raw_user_meta_data->>'plan', 'FREE');

    -- Garantir que slug seja unico (adicionar sufixo se necessario)
    WHILE EXISTS (SELECT 1 FROM public.tenants WHERE slug = v_slug) LOOP
        v_slug := v_slug || '-' || substr(md5(random()::text), 1, 3);
    END LOOP;

    -- Criar Tenant (Barbearia)
    INSERT INTO public.tenants (
        name,
        slug,
        owner_id,
        plan_id,
        status,
        email,
        trial_ends_at
    ) VALUES (
        v_shop_name,
        v_slug,
        new.id,
        v_plan,
        'TRIAL',
        new.email,
        NOW() + INTERVAL '14 days'
    )
    RETURNING id INTO new_tenant_id;

    -- Criar Profile do Owner
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

    RAISE LOG 'Tenant criado com sucesso: % (slug: %) para usuario %', v_shop_name, v_slug, new.email;

    RETURN new;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Erro ao criar tenant para %: %', new.email, SQLERRM;
    RETURN new;
END;
$$;

-- Recriar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verificar
SELECT 'Trigger atualizado com sucesso!' as status;
