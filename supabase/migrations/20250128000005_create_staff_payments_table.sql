-- =====================================================
-- TABELA DE PAGAMENTOS DE STAFF
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_staff_payments_store ON staff_payments(store_id);
CREATE INDEX IF NOT EXISTS idx_staff_payments_staff ON staff_payments(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_payments_date ON staff_payments(payment_date);

-- RLS
ALTER TABLE staff_payments ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários veem pagamentos da sua loja
CREATE POLICY "Users can view staff payments from their store"
  ON staff_payments FOR SELECT
  USING (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

-- Policy: Apenas owners podem criar pagamentos
CREATE POLICY "Owners can create staff payments"
  ON staff_payments FOR INSERT
  WITH CHECK (store_id IN (
    SELECT store_id FROM profiles
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

-- Policy: Apenas owners podem atualizar/deletar pagamentos
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
