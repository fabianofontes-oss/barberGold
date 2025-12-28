-- =====================================================
-- TABELA DE SERVIÇOS POR STAFF
-- Permite que cada barbeiro configure quais serviços oferece
-- =====================================================

CREATE TABLE IF NOT EXISTS staff_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_staff_service UNIQUE (staff_id, service_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_staff_services_staff ON staff_services(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_services_service ON staff_services(service_id);

-- RLS
ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view staff services from their store"
  ON staff_services FOR SELECT
  USING (
    staff_id IN (
      SELECT id FROM profiles 
      WHERE store_id IN (
        SELECT store_id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Staff can manage their own services"
  ON staff_services FOR ALL
  USING (staff_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

COMMENT ON TABLE staff_services IS 'Serviços que cada barbeiro/staff oferece';
