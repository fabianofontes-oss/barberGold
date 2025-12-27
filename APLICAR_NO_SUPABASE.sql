-- ============================================
-- COPIE E COLE ESTE SQL NO SUPABASE DASHBOARD
-- SQL Editor > New Query > Execute
-- ============================================

-- Criar tabelas faltantes para remover mocks

-- Tabela de planos de comissão
CREATE TABLE IF NOT EXISTS commission_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  service_rate DECIMAL(5,2) NOT NULL DEFAULT 50.00,
  product_rate DECIMAL(5,2) NOT NULL DEFAULT 20.00,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('SERVICE', 'PRODUCT', 'EXPENSE')),
  color TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de fornecedores
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de inventário
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  current_stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER,
  unit TEXT DEFAULT 'un',
  cost_price DECIMAL(10,2),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  last_restock_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de transações de fornecimento
CREATE TABLE IF NOT EXISTS supply_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('PURCHASE', 'RETURN', 'ADJUSTMENT')),
  quantity INTEGER NOT NULL,
  unit_cost DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  notes TEXT,
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE commission_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE supply_transactions ENABLE ROW LEVEL SECURITY;

-- Policies para commission_plans
CREATE POLICY "Users can view commission plans from their tenant"
  ON commission_plans FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Owners can manage commission plans"
  ON commission_plans FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM profiles 
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

-- Policies para categories
CREATE POLICY "Users can view categories from their tenant"
  ON categories FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Owners can manage categories"
  ON categories FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM profiles 
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

-- Policies para suppliers
CREATE POLICY "Users can view suppliers from their tenant"
  ON suppliers FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Owners can manage suppliers"
  ON suppliers FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM profiles 
    WHERE user_id = auth.uid() AND role IN ('OWNER', 'ADMIN')
  ));

-- Policies para inventory
CREATE POLICY "Users can view inventory from their tenant"
  ON inventory FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Staff can manage inventory"
  ON inventory FOR ALL
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));

-- Policies para supply_transactions
CREATE POLICY "Users can view supply transactions from their tenant"
  ON supply_transactions FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Staff can create supply transactions"
  ON supply_transactions FOR INSERT
  WITH CHECK (tenant_id IN (SELECT tenant_id FROM profiles WHERE user_id = auth.uid()));

-- Índices para performance
CREATE INDEX idx_commission_plans_tenant ON commission_plans(tenant_id);
CREATE INDEX idx_categories_tenant ON categories(tenant_id);
CREATE INDEX idx_suppliers_tenant ON suppliers(tenant_id);
CREATE INDEX idx_inventory_tenant ON inventory(tenant_id);
CREATE INDEX idx_supply_transactions_tenant ON supply_transactions(tenant_id);
