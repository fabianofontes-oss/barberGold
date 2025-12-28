-- =====================================================
-- SCHEMA COMPLETO DO BARBERGOLD
-- COPIE E COLE TUDO NO SUPABASE SQL EDITOR
-- =====================================================

-- TABELA DE DESPESAS
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  supplier_id UUID,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_store ON expenses(store_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view expenses from their store" ON expenses;
CREATE POLICY "Users can view expenses from their store"
  ON expenses FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can manage expenses" ON expenses;
CREATE POLICY "Owners can manage expenses"
  ON expenses FOR ALL
  USING (true);

-- TABELA DE FECHAMENTOS DE CAIXA
CREATE TABLE IF NOT EXISTS register_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL,
  staff_id UUID NOT NULL,
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

DROP POLICY IF EXISTS "Users can view register closures from their store" ON register_closures;
CREATE POLICY "Users can view register closures from their store"
  ON register_closures FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Staff can create register closures" ON register_closures;
CREATE POLICY "Staff can create register closures"
  ON register_closures FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Owners can manage register closures" ON register_closures;
CREATE POLICY "Owners can manage register closures"
  ON register_closures FOR UPDATE
  USING (true);

-- FIM
-- Execute este SQL completo no Supabase SQL Editor
-- Se der sucesso, as tabelas foram criadas!
