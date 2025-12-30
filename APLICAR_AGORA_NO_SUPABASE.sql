-- =====================================================
-- BARBERGOLD - SQL CORRIGIDO PARA SEU SCHEMA REAL
-- Data: 2025-01-28
-- =====================================================
-- INSTRUÇÕES:
-- 1. Abra o Supabase Dashboard do seu projeto
-- 2. Vá em SQL Editor > New Query
-- 3. Cole TODO este arquivo e execute
-- =====================================================

-- =====================================================
-- PARTE 1: CRIAR VIEW DE COMPATIBILIDADE
-- Resolve incompatibilidade entre código (stores) e banco (tenants)
-- =====================================================

-- Criar VIEW 'stores' apontando para 'tenants'
-- Isso faz o código que usa .from('stores') funcionar sem erro
CREATE OR REPLACE VIEW stores AS
SELECT
  id,
  name,
  slug,
  owner_id,
  plan_id,
  status,
  settings,
  created_at,
  updated_at
FROM tenants;

COMMENT ON VIEW stores IS 'VIEW de compatibilidade: código usa stores mas banco tem tenants';

-- =====================================================
-- PARTE 2: ATUALIZAR TABELA PROFILES
-- Adicionar coluna store_id se não existir (aponta para tenant_id)
-- =====================================================

-- Verificar se profiles já tem store_id, se não tiver, adicionar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'store_id'
  ) THEN
    -- Se não existir, criar como alias para tenant_id
    ALTER TABLE profiles ADD COLUMN store_id UUID;

    -- Copiar dados de tenant_id para store_id
    UPDATE profiles SET store_id = tenant_id WHERE tenant_id IS NOT NULL;

    -- Criar constraint para manter sincronizado
    ALTER TABLE profiles ADD CONSTRAINT fk_profiles_store
      FOREIGN KEY (store_id) REFERENCES tenants(id) ON DELETE CASCADE;

    -- Criar trigger para manter sincronizado
    CREATE OR REPLACE FUNCTION sync_store_tenant_id()
    RETURNS TRIGGER AS $trigger$
    BEGIN
      IF NEW.tenant_id IS NOT NULL THEN
        NEW.store_id := NEW.tenant_id;
      END IF;
      IF NEW.store_id IS NOT NULL THEN
        NEW.tenant_id := NEW.store_id;
      END IF;
      RETURN NEW;
    END;
    $trigger$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS sync_store_tenant_trigger ON profiles;
    CREATE TRIGGER sync_store_tenant_trigger
      BEFORE INSERT OR UPDATE ON profiles
      FOR EACH ROW EXECUTE FUNCTION sync_store_tenant_id();
  END IF;
END $$;

-- =====================================================
-- PARTE 3: CRIAR TABELA STAFF_PAYMENTS (ÚNICA FALTANTE)
-- =====================================================

CREATE TABLE IF NOT EXISTS staff_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('SALARY', 'COMMISSION', 'BONUS', 'OTHER')),
  payment_method TEXT CHECK (payment_method IN ('CASH', 'TRANSFER', 'PIX', 'CHECK', 'OTHER')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_staff_payments_store ON staff_payments(store_id);
CREATE INDEX IF NOT EXISTS idx_staff_payments_staff ON staff_payments(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_payments_date ON staff_payments(payment_date);

-- RLS
ALTER TABLE staff_payments ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view staff payments from their store" ON staff_payments;
CREATE POLICY "Users can view staff payments from their store"
  ON staff_payments FOR SELECT
  USING (store_id IN (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Owners can create staff payments" ON staff_payments;
CREATE POLICY "Owners can create staff payments"
  ON staff_payments FOR INSERT
  WITH CHECK (store_id IN (
    SELECT tenant_id FROM profiles
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

DROP POLICY IF EXISTS "Owners can manage staff payments" ON staff_payments;
CREATE POLICY "Owners can manage staff payments"
  ON staff_payments FOR UPDATE
  USING (store_id IN (
    SELECT tenant_id FROM profiles
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

DROP POLICY IF EXISTS "Owners can delete staff payments" ON staff_payments;
CREATE POLICY "Owners can delete staff payments"
  ON staff_payments FOR DELETE
  USING (store_id IN (
    SELECT tenant_id FROM profiles
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

COMMENT ON TABLE staff_payments IS 'Pagamentos realizados para membros da equipe';

-- =====================================================
-- PARTE 4: ATUALIZAR POLICIES DAS TABELAS EXISTENTES
-- Para funcionar com store_id (via profiles.store_id)
-- =====================================================

-- Appointments
DROP POLICY IF EXISTS "Users can view appointments from their store" ON appointments;
CREATE POLICY "Users can view appointments from their store"
  ON appointments FOR SELECT
  USING (store_id IN (SELECT COALESCE(store_id, tenant_id) FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can manage appointments" ON appointments;
CREATE POLICY "Staff can manage appointments"
  ON appointments FOR ALL
  USING (store_id IN (SELECT COALESCE(store_id, tenant_id) FROM profiles WHERE user_id = auth.uid()));

-- Sales
DROP POLICY IF EXISTS "Users can view sales from their store" ON sales;
CREATE POLICY "Users can view sales from their store"
  ON sales FOR SELECT
  USING (store_id IN (SELECT COALESCE(store_id, tenant_id) FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can manage sales" ON sales;
CREATE POLICY "Staff can manage sales"
  ON sales FOR ALL
  USING (store_id IN (SELECT COALESCE(store_id, tenant_id) FROM profiles WHERE user_id = auth.uid()));

-- Sale Items
DROP POLICY IF EXISTS "Users can view sale items from their store" ON sale_items;
CREATE POLICY "Users can view sale items from their store"
  ON sale_items FOR SELECT
  USING (sale_id IN (
    SELECT id FROM sales
    WHERE store_id IN (SELECT COALESCE(store_id, tenant_id) FROM profiles WHERE user_id = auth.uid())
  ));

DROP POLICY IF EXISTS "Staff can manage sale items" ON sale_items;
CREATE POLICY "Staff can manage sale items"
  ON sale_items FOR ALL
  USING (sale_id IN (
    SELECT id FROM sales
    WHERE store_id IN (SELECT COALESCE(store_id, tenant_id) FROM profiles WHERE user_id = auth.uid())
  ));

-- Expenses
DROP POLICY IF EXISTS "Users can view expenses from their store" ON expenses;
CREATE POLICY "Users can view expenses from their store"
  ON expenses FOR SELECT
  USING (store_id IN (SELECT COALESCE(store_id, tenant_id) FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Owners can manage expenses" ON expenses;
CREATE POLICY "Owners can manage expenses"
  ON expenses FOR ALL
  USING (store_id IN (
    SELECT COALESCE(store_id, tenant_id) FROM profiles
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

-- Register Closures
DROP POLICY IF EXISTS "Users can view register closures from their store" ON register_closures;
CREATE POLICY "Users can view register closures from their store"
  ON register_closures FOR SELECT
  USING (store_id IN (SELECT COALESCE(store_id, tenant_id) FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can create register closures" ON register_closures;
CREATE POLICY "Staff can create register closures"
  ON register_closures FOR INSERT
  WITH CHECK (store_id IN (SELECT COALESCE(store_id, tenant_id) FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Owners can manage register closures" ON register_closures;
CREATE POLICY "Owners can manage register closures"
  ON register_closures FOR UPDATE
  USING (store_id IN (
    SELECT COALESCE(store_id, tenant_id) FROM profiles
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

-- =====================================================
-- PARTE 5: ATUALIZAR TRIGGER DE SIGNUP
-- =====================================================

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
    v_full_name := coalesce(new.raw_user_meta_data->>'full_name', 'Nova Barbearia');
    v_slug      := coalesce(new.raw_user_meta_data->>'slug', 'shop-' || floor(random() * 1000000)::text);
    v_plan      := coalesce(new.raw_user_meta_data->>'plan', 'FREE');

    RAISE NOTICE 'Iniciando criação de tenant para usuário: %, com slug: %', new.id, v_slug;

    -- Criar tenant
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
        'ACTIVE',
        jsonb_build_object(
            'setup_completed', false,
            'onboarding_completed', false
        )
    )
    RETURNING id INTO new_tenant_id;

    -- Criar profile com tenant_id E store_id
    INSERT INTO public.profiles (
        tenant_id,
        store_id,
        user_id,
        role,
        name,
        email,
        is_active
    ) VALUES (
        new_tenant_id,
        new_tenant_id,  -- store_id = tenant_id
        new.id,
        'OWNER',
        v_full_name,
        new.email,
        TRUE
    );

    -- Criar registro na tabela staff
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'staff') THEN
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
            new_tenant_id,  -- store_id = tenant_id
            new.id,
            v_full_name,
            'OWNER',
            new.email,
            'OWNER',
            100.00,
            100.00
        );
    END IF;

    RAISE NOTICE '✅ Tenant criado com sucesso: %', new_tenant_id;

    RETURN new;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Erro ao configurar barbearia: %', SQLERRM;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS 'Trigger automático que cria tenant, profile e staff ao fazer signup';

-- =====================================================
-- FIM - TUDO PRONTO!
-- =====================================================
-- ✅ VIEW stores criada (compatibilidade com código)
-- ✅ profiles.store_id adicionado e sincronizado
-- ✅ staff_payments criado
-- ✅ Policies atualizadas para funcionar com store_id
-- ✅ Trigger de SignUp corrigido
--
-- Seu código agora vai funcionar perfeitamente!
-- =====================================================
