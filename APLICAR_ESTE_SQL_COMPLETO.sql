-- =====================================================
-- SQL COMPLETO PARA CRIAR TODAS AS TABELAS FALTANTES
-- EXECUTAR ESTE ARQUIVO INTEIRO NO SUPABASE SQL EDITOR
-- =====================================================

-- TABELA DE DESPESAS
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

-- TABELA DE FECHAMENTOS DE CAIXA
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

-- FIM DO SQL
-- Se executou sem erros, as tabelas foram criadas com sucesso!
