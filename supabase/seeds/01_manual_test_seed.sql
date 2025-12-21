-- ==========================================
-- SEED DE TESTE MANUAL - BARBERFLOW
-- Versão: 1.0
-- ==========================================

DO $$
DECLARE
    -- VAI SER SUBSTITUÍDO PELO WINDSURF
    v_user_id UUID := 'COLE_SEU_UUID_AQUI'; 
    
    v_tenant_id UUID;
    v_profile_id UUID;
    v_staff_joao UUID;
    v_service_corte UUID;
    v_service_barba UUID;
    v_client_carlos UUID;
BEGIN
    -- 1. Criar o Tenant (A Barbearia)
    INSERT INTO public.tenants (name, slug, owner_id, plan_id, status)
    VALUES ('Barbearia Demo', 'barbearia-demo', v_user_id, 'EQUIPE', 'ACTIVE')
    RETURNING id INTO v_tenant_id;

    -- 2. Criar o Perfil do Dono
    INSERT INTO public.profiles (tenant_id, user_id, name, email, role, bio)
    VALUES (v_tenant_id, v_user_id, 'Dono Admin', 'admin@demo.com', 'OWNER', 'Gerente Geral')
    RETURNING id INTO v_profile_id;

    -- 3. Criar um Funcionário Extra
    INSERT INTO public.profiles (tenant_id, user_id, name, email, role, bio, commission_rate)
    VALUES (v_tenant_id, uuid_generate_v4(), 'João Barbeiro', 'joao@demo.com', 'BARBER', 'Especialista em degradê', 40.0)
    RETURNING id INTO v_staff_joao;

    -- 4. Criar Serviços
    INSERT INTO public.services (tenant_id, name, price, duration_minutes, is_active)
    VALUES (v_tenant_id, 'Corte Degrade', 50.00, 45, true)
    RETURNING id INTO v_service_corte;

    INSERT INTO public.services (tenant_id, name, price, duration_minutes, is_active)
    VALUES (v_tenant_id, 'Barba Terapia', 40.00, 30, true)
    RETURNING id INTO v_service_barba;

    -- 5. Criar Clientes
    INSERT INTO public.clients (tenant_id, name, phone, email)
    VALUES (v_tenant_id, 'Carlos Cliente', '11999999999', 'carlos@cliente.com')
    RETURNING id INTO v_client_carlos;

    -- 6. Criar Agendamentos
    -- Hoje às 10:00 (Confirmado)
    INSERT INTO public.appointments (
        tenant_id, client_id, staff_id, service_id, 
        scheduled_at, duration_minutes, price, status
    )
    VALUES (
        v_tenant_id, v_client_carlos, v_profile_id, v_service_corte,
        NOW()::date + TIME '10:00:00', 45, 50.00, 'CONFIRMED'
    );

    -- Amanhã às 15:00 (Agendado)
    INSERT INTO public.appointments (
        tenant_id, client_id, staff_id, service_id, 
        scheduled_at, duration_minutes, price, status
    )
    VALUES (
        v_tenant_id, v_client_carlos, v_staff_joao, v_service_barba,
        (NOW() + INTERVAL '1 day')::date + TIME '15:00:00', 30, 40.00, 'SCHEDULED'
    );

    RAISE NOTICE 'SEED EXECUTADO COM SUCESSO! Tenant ID: %', v_tenant_id;
END $$;
