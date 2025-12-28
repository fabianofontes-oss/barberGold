-- =====================================================
-- TABELA DE AGENDAMENTOS
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_appointments_store ON appointments(store_id);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_staff ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários veem agendamentos da sua loja
CREATE POLICY "Users can view appointments from their store"
  ON appointments FOR SELECT
  USING (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

-- Policy: Staff pode gerenciar agendamentos
CREATE POLICY "Staff can manage appointments"
  ON appointments FOR ALL
  USING (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

COMMENT ON TABLE appointments IS 'Agendamentos de serviços';
