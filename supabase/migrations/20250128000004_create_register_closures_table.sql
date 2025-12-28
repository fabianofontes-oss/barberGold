-- =====================================================
-- TABELA DE FECHAMENTOS DE CAIXA
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_register_closures_store ON register_closures(store_id);
CREATE INDEX IF NOT EXISTS idx_register_closures_staff ON register_closures(staff_id);
CREATE INDEX IF NOT EXISTS idx_register_closures_date ON register_closures(closed_at);

-- RLS
ALTER TABLE register_closures ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários veem fechamentos da sua loja
CREATE POLICY "Users can view register closures from their store"
  ON register_closures FOR SELECT
  USING (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

-- Policy: Staff pode criar fechamentos
CREATE POLICY "Staff can create register closures"
  ON register_closures FOR INSERT
  WITH CHECK (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

-- Policy: Apenas owners podem atualizar/deletar fechamentos
CREATE POLICY "Owners can manage register closures"
  ON register_closures FOR UPDATE
  USING (store_id IN (
    SELECT store_id FROM profiles 
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

COMMENT ON TABLE register_closures IS 'Fechamentos de caixa diários';
