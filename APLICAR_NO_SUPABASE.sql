-- =====================================================
-- BARBERGOLD - APLICAR NO SUPABASE SQL EDITOR
-- Data: 2025-01-28
-- =====================================================
-- INSTRUÇÕES:
-- 1. Abra o Supabase Dashboard do seu projeto
-- 2. Vá em SQL Editor
-- 3. Cole TODO este arquivo e execute
-- 4. Verifique se não há erros no log
-- =====================================================

-- =====================================================
-- MIGRATION 1: APPOINTMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_store ON appointments(store_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_staff ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view appointments from their store"
  ON appointments FOR SELECT
  USING (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Staff can manage appointments"
  ON appointments FOR ALL
  USING (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

COMMENT ON TABLE appointments IS 'Agendamentos de serviços';

-- =====================================================
-- MIGRATION 2: SALES E SALE_ITEMS
-- =====================================================

CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL,
  tip DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'OTHER')),
  payment_status TEXT NOT NULL DEFAULT 'PAID' CHECK (payment_status IN ('PAID', 'PENDING', 'CANCELLED', 'REFUNDED')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  item_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('SERVICE', 'PRODUCT')),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_store ON sales(store_id);
CREATE INDEX IF NOT EXISTS idx_sales_client ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_staff ON sales(staff_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sales from their store"
  ON sales FOR SELECT
  USING (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Staff can manage sales"
  ON sales FOR ALL
  USING (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view sale items from their store"
  ON sale_items FOR SELECT
  USING (sale_id IN (SELECT id FROM sales WHERE store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Staff can manage sale items"
  ON sale_items FOR ALL
  USING (sale_id IN (SELECT id FROM sales WHERE store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid())));

COMMENT ON TABLE sales IS 'Vendas realizadas no PDV';
COMMENT ON TABLE sale_items IS 'Itens de cada venda';

-- =====================================================
-- MIGRATION 3: EXPENSES
-- =====================================================

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  payment_method TEXT CHECK (payment_method IN ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'TRANSFER', 'OTHER')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_store ON expenses(store_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_supplier ON expenses(supplier_id);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view expenses from their store"
  ON expenses FOR SELECT
  USING (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Owners can manage expenses"
  ON expenses FOR ALL
  USING (store_id IN (
    SELECT store_id FROM profiles
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

COMMENT ON TABLE expenses IS 'Despesas e custos do estabelecimento';

-- =====================================================
-- MIGRATION 4: REGISTER_CLOSURES
-- =====================================================

CREATE TABLE IF NOT EXISTS register_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  opened_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ NOT NULL,
  opening_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  closing_balance DECIMAL(10,2) NOT NULL,
  total_sales DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_cash DECIMAL(10,2) DEFAULT 0,
  total_card DECIMAL(10,2) DEFAULT 0,
  total_pix DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_register_closures_store ON register_closures(store_id);
CREATE INDEX IF NOT EXISTS idx_register_closures_staff ON register_closures(staff_id);
CREATE INDEX IF NOT EXISTS idx_register_closures_date ON register_closures(closed_at);

ALTER TABLE register_closures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view register closures from their store"
  ON register_closures FOR SELECT
  USING (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Staff can create register closures"
  ON register_closures FOR INSERT
  WITH CHECK (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Owners can manage register closures"
  ON register_closures FOR UPDATE
  USING (store_id IN (
    SELECT store_id FROM profiles
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

COMMENT ON TABLE register_closures IS 'Fechamentos de caixa diários';

-- =====================================================
-- MIGRATION 5: STAFF_PAYMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS staff_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
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

CREATE INDEX IF NOT EXISTS idx_staff_payments_store ON staff_payments(store_id);
CREATE INDEX IF NOT EXISTS idx_staff_payments_staff ON staff_payments(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_payments_date ON staff_payments(payment_date);

ALTER TABLE staff_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view staff payments from their store"
  ON staff_payments FOR SELECT
  USING (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Owners can create staff payments"
  ON staff_payments FOR INSERT
  WITH CHECK (store_id IN (
    SELECT store_id FROM profiles
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

CREATE POLICY "Owners can manage staff payments"
  ON staff_payments FOR UPDATE
  USING (store_id IN (
    SELECT store_id FROM profiles
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

CREATE POLICY "Owners can delete staff payments"
  ON staff_payments FOR DELETE
  USING (store_id IN (
    SELECT store_id FROM profiles
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

COMMENT ON TABLE staff_payments IS 'Pagamentos realizados para membros da equipe';

-- =====================================================
-- MIGRATION 6: TRIGGER DE SIGNUP (CORRIGIDO)
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_store_id uuid;
    v_full_name text;
    v_slug text;
    v_plan text;
BEGIN
    v_full_name := coalesce(new.raw_user_meta_data->>'full_name', 'Nova Barbearia');
    v_slug      := coalesce(new.raw_user_meta_data->>'slug', 'shop-' || floor(random() * 1000000)::text);
    v_plan      := coalesce(new.raw_user_meta_data->>'plan', 'FREE');

    RAISE NOTICE 'Iniciando criação de store para usuário: %, com slug: %', new.id, v_slug;

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
    RAISE EXCEPTION 'Erro ao configurar barbearia: %', SQLERRM;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS 'Trigger automático que cria store e staff/profile ao fazer signup';

-- =====================================================
-- FIM DAS MIGRATIONS
-- =====================================================
-- ✅ Se você chegou até aqui sem erros, todas as tabelas foram criadas!
-- ✅ Agora você pode testar o fluxo de cadastro e persistência de dados
-- =====================================================
