-- =====================================================
-- TABELA DE VENDAS
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

-- Tabela de itens da venda (relacionamento)
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_sales_store ON sales(store_id);
CREATE INDEX IF NOT EXISTS idx_sales_client ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_staff ON sales(staff_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);

-- RLS
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Policies para sales
CREATE POLICY "Users can view sales from their store"
  ON sales FOR SELECT
  USING (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Staff can manage sales"
  ON sales FOR ALL
  USING (store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid()));

-- Policies para sale_items
CREATE POLICY "Users can view sale items from their store"
  ON sale_items FOR SELECT
  USING (sale_id IN (SELECT id FROM sales WHERE store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Staff can manage sale items"
  ON sale_items FOR ALL
  USING (sale_id IN (SELECT id FROM sales WHERE store_id IN (SELECT store_id FROM profiles WHERE user_id = auth.uid())));

COMMENT ON TABLE sales IS 'Vendas realizadas no PDV';
COMMENT ON TABLE sale_items IS 'Itens de cada venda';
