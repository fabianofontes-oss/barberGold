-- =====================================================
-- BARBERGOLD - SQL APLICADO COM SUCESSO
-- Data: 2025-01-28
-- Status: ✅ EXECUTADO
-- =====================================================

-- Passo 1: Criar VIEW stores
DROP VIEW IF EXISTS stores CASCADE;
CREATE OR REPLACE VIEW stores AS
SELECT id, name, slug, owner_id, plan_id, status, settings, created_at, updated_at
FROM tenants;

-- Passo 2: Criar tabela staff_payments
CREATE TABLE IF NOT EXISTS staff_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_staff_payments_store ON staff_payments(store_id);
CREATE INDEX IF NOT EXISTS idx_staff_payments_staff ON staff_payments(staff_id);

ALTER TABLE staff_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "staff_payments_select" ON staff_payments;
CREATE POLICY "staff_payments_select" ON staff_payments FOR SELECT
  USING (store_id IN (SELECT COALESCE(store_id, tenant_id) FROM profiles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "staff_payments_insert" ON staff_payments;
CREATE POLICY "staff_payments_insert" ON staff_payments FOR INSERT
  WITH CHECK (store_id IN (SELECT COALESCE(store_id, tenant_id) FROM profiles WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')));

DROP POLICY IF EXISTS "staff_payments_update" ON staff_payments;
CREATE POLICY "staff_payments_update" ON staff_payments FOR UPDATE
  USING (store_id IN (SELECT COALESCE(store_id, tenant_id) FROM profiles WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')));

DROP POLICY IF EXISTS "staff_payments_delete" ON staff_payments;
CREATE POLICY "staff_payments_delete" ON staff_payments FOR DELETE
  USING (store_id IN (SELECT COALESCE(store_id, tenant_id) FROM profiles WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')));

-- Passo 3: Atualizar trigger de signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    new_tenant_id uuid;
    v_full_name text;
    v_slug text;
    v_plan text;
BEGIN
    v_full_name := coalesce(new.raw_user_meta_data->>'full_name', 'Nova Barbearia');
    v_slug := coalesce(new.raw_user_meta_data->>'slug', 'shop-' || floor(random() * 1000000)::text);
    v_plan := coalesce(new.raw_user_meta_data->>'plan', 'FREE');

    INSERT INTO public.tenants (name, slug, owner_id, plan_id, status, settings)
    VALUES (v_full_name, v_slug, new.id, upper(v_plan), 'ACTIVE',
            jsonb_build_object('setup_completed', false, 'onboarding_completed', false))
    RETURNING id INTO new_tenant_id;

    INSERT INTO public.profiles (tenant_id, user_id, role, name, email, is_active)
    VALUES (new_tenant_id, new.id, 'OWNER', v_full_name, new.email, TRUE);

    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT '✅ Executado!' as resultado;
