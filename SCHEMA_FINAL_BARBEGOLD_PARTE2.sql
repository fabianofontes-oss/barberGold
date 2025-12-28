-- =============================================
-- BARBEGOLD - SCHEMA PARTE 2
-- Continuação do SCHEMA_FINAL_BARBEGOLD.sql
-- =============================================

-- TABELA: appointments (Agendamentos)
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    
    -- Horário
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    end_at TIMESTAMPTZ, -- Será calculado via trigger ou aplicação
    
    -- Status e Valores
    status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    discount DECIMAL(10,2) DEFAULT 0 CHECK (discount >= 0),
    
    -- Observações
    notes TEXT,
    cancel_reason TEXT,
    
    -- Compatibilidade
    store_id UUID GENERATED ALWAYS AS (tenant_id) STORED
);

-- TABELA: sales (Vendas)
CREATE TABLE public.sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    
    -- Valores
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    discount DECIMAL(10,2) DEFAULT 0 CHECK (discount >= 0),
    tip_amount DECIMAL(10,2) DEFAULT 0 CHECK (tip_amount >= 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    
    -- Pagamento
    payment_method TEXT DEFAULT 'CASH' CHECK (payment_method IN ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'VOUCHER', 'MIXED')),
    payment_status TEXT DEFAULT 'PAID' CHECK (payment_status IN ('PENDING', 'PAID', 'PARTIALLY_PAID', 'REFUNDED', 'CANCELLED')),
    
    -- Observações
    notes TEXT,
    
    -- Compatibilidade
    store_id UUID GENERATED ALWAYS AS (tenant_id) STORED
);

-- TABELA: sale_items (Itens da Venda)
CREATE TABLE public.sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
    
    -- Tipo de Item
    item_type TEXT NOT NULL CHECK (item_type IN ('SERVICE', 'PRODUCT')),
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    
    -- Quantidade e Valores
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    discount DECIMAL(10,2) DEFAULT 0 CHECK (discount >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    
    -- Comissão
    staff_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    commission_rate DECIMAL(5,2) DEFAULT 0 CHECK (commission_rate >= 0 AND commission_rate <= 100),
    commission_amount DECIMAL(10,2), -- Será calculado via trigger ou aplicação
    
    CONSTRAINT check_item_reference CHECK (
        (item_type = 'SERVICE' AND service_id IS NOT NULL AND product_id IS NULL) OR
        (item_type = 'PRODUCT' AND product_id IS NOT NULL AND service_id IS NULL)
    )
);

-- TABELA: staff_services (Relacionamento Staff-Serviços)
CREATE TABLE public.staff_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    
    -- Configurações específicas do profissional para o serviço
    custom_price DECIMAL(10,2),
    custom_duration INTEGER,
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(staff_id, service_id)
);

-- TABELA: expenses (Despesas)
CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Informações da Despesa
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    date DATE NOT NULL,
    
    -- Pagamento
    payment_method TEXT DEFAULT 'CASH' CHECK (payment_method IN ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'BANK_TRANSFER', 'CHECK')),
    paid BOOLEAN DEFAULT false,
    due_date DATE,
    
    -- Fornecedor
    supplier_id UUID, -- FK adicionada depois de criar suppliers
    invoice_number TEXT,
    
    -- Anexos
    attachments JSONB DEFAULT '[]'::jsonb,
    
    -- Recorrência
    is_recurring BOOLEAN DEFAULT false,
    recurrence_type TEXT CHECK (recurrence_type IN ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', NULL)),
    
    -- Compatibilidade
    store_id UUID GENERATED ALWAYS AS (tenant_id) STORED
);

-- TABELA: register_closures (Fechamentos de Caixa)
CREATE TABLE public.register_closures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Período
    opened_at TIMESTAMPTZ NOT NULL,
    closed_at TIMESTAMPTZ,
    
    -- Valores de Abertura
    opening_balance DECIMAL(10,2) DEFAULT 0,
    
    -- Valores de Fechamento
    closing_balance DECIMAL(10,2),
    cash_sales DECIMAL(10,2) DEFAULT 0,
    card_sales DECIMAL(10,2) DEFAULT 0,
    pix_sales DECIMAL(10,2) DEFAULT 0,
    other_sales DECIMAL(10,2) DEFAULT 0,
    
    -- Movimentações
    cash_withdrawals DECIMAL(10,2) DEFAULT 0,
    cash_deposits DECIMAL(10,2) DEFAULT 0,
    
    -- Diferença
    expected_balance DECIMAL(10,2), -- Será calculado via trigger ou aplicação
    difference DECIMAL(10,2), -- Será calculado via trigger ou aplicação
    
    -- Status
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'RECONCILED')),
    notes TEXT,
    
    -- Compatibilidade
    store_id UUID GENERATED ALWAYS AS (tenant_id) STORED
);

-- TABELA: commission_plans (Planos de Comissão)
CREATE TABLE public.commission_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Informações do Plano
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    
    -- Configurações de Comissão
    service_commission_type TEXT DEFAULT 'PERCENTAGE' CHECK (service_commission_type IN ('PERCENTAGE', 'FIXED')),
    service_commission_value DECIMAL(10,2) DEFAULT 50 CHECK (service_commission_value >= 0),
    
    product_commission_type TEXT DEFAULT 'PERCENTAGE' CHECK (product_commission_type IN ('PERCENTAGE', 'FIXED')),
    product_commission_value DECIMAL(10,2) DEFAULT 30 CHECK (product_commission_value >= 0),
    
    -- Regras Especiais
    rules JSONB DEFAULT '{}'::jsonb
);

-- TABELA: categories (Categorias Genéricas)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Informações da Categoria
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('EXPENSE', 'PRODUCT', 'SERVICE', 'GENERAL')),
    description TEXT,
    color TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    
    -- Hierarquia
    parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0
);

-- TABELA: suppliers (Fornecedores)
CREATE TABLE public.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    
    -- Informações do Fornecedor
    name TEXT NOT NULL,
    cnpj TEXT,
    contact_name TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    
    -- Endereço
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    
    -- Configurações
    is_active BOOLEAN DEFAULT true,
    payment_terms TEXT,
    notes TEXT
);

-- Adicionar FK de supplier_id em expenses agora que suppliers existe
ALTER TABLE public.expenses 
    ADD CONSTRAINT fk_expense_supplier 
    FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE SET NULL;

-- TABELA: inventory (Inventário)
CREATE TABLE public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    
    -- Item de Inventário
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT,
    barcode TEXT,
    
    -- Quantidades
    quantity DECIMAL(10,2) DEFAULT 0,
    min_quantity DECIMAL(10,2) DEFAULT 0,
    max_quantity DECIMAL(10,2),
    unit_of_measure TEXT DEFAULT 'UN',
    
    -- Custos
    unit_cost DECIMAL(10,2) DEFAULT 0,
    last_purchase_price DECIMAL(10,2),
    average_cost DECIMAL(10,2),
    
    -- Fornecedor Principal
    primary_supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    
    -- Configurações
    is_active BOOLEAN DEFAULT true,
    track_stock BOOLEAN DEFAULT true,
    location TEXT
);

-- TABELA: supply_transactions (Transações de Estoque)
CREATE TABLE public.supply_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    inventory_id UUID NOT NULL REFERENCES public.inventory(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    
    -- Tipo de Transação
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('PURCHASE', 'SALE', 'ADJUSTMENT', 'RETURN', 'TRANSFER', 'LOSS')),
    
    -- Quantidades
    quantity DECIMAL(10,2) NOT NULL,
    previous_quantity DECIMAL(10,2),
    new_quantity DECIMAL(10,2),
    
    -- Valores
    unit_price DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    
    -- Referências
    reference_type TEXT CHECK (reference_type IN ('SALE', 'PURCHASE_ORDER', 'ADJUSTMENT', 'MANUAL', NULL)),
    reference_id UUID,
    
    -- Observações
    notes TEXT,
    performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- =============================================
-- TABELAS DE TEMPLATES (Onboarding)
-- =============================================

-- TABELA: service_categories_template
CREATE TABLE public.service_categories_template (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    icon TEXT,
    color TEXT
);

-- TABELA: services_template  
CREATE TABLE public.services_template (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.service_categories_template(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 30,
    price DECIMAL(10,2) NOT NULL,
    is_combo BOOLEAN DEFAULT false,
    package_level INTEGER DEFAULT 1,
    image_url TEXT
);

-- TABELA: bundle_items_template
CREATE TABLE public.bundle_items_template (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    combo_service_id UUID REFERENCES public.services_template(id) ON DELETE CASCADE,
    included_service_id UUID REFERENCES public.services_template(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    discount_percentage DECIMAL(5,2) DEFAULT 0
);

-- =============================================
-- TRIGGERS PARA CAMPOS CALCULADOS
-- =============================================

-- Trigger para calcular end_at em appointments
CREATE OR REPLACE FUNCTION calculate_appointment_end_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.end_at := NEW.scheduled_at + (NEW.duration_minutes || ' minutes')::INTERVAL;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_appointment_end_at
    BEFORE INSERT OR UPDATE OF scheduled_at, duration_minutes ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION calculate_appointment_end_at();

-- Trigger para calcular commission_amount em sale_items
CREATE OR REPLACE FUNCTION calculate_commission_amount()
RETURNS TRIGGER AS $$
BEGIN
    NEW.commission_amount := NEW.total_price * NEW.commission_rate / 100;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_commission_amount
    BEFORE INSERT OR UPDATE OF total_price, commission_rate ON public.sale_items
    FOR EACH ROW EXECUTE FUNCTION calculate_commission_amount();

-- Trigger para calcular expected_balance e difference em register_closures
CREATE OR REPLACE FUNCTION calculate_register_balance()
RETURNS TRIGGER AS $$
BEGIN
    NEW.expected_balance := NEW.opening_balance + NEW.cash_sales + NEW.cash_deposits - NEW.cash_withdrawals;
    IF NEW.closing_balance IS NOT NULL THEN
        NEW.difference := NEW.closing_balance - NEW.expected_balance;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_register_balance
    BEFORE INSERT OR UPDATE ON public.register_closures
    FOR EACH ROW EXECUTE FUNCTION calculate_register_balance();

-- =============================================
-- ÍNDICES
-- =============================================

-- Índices para tenants
CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_owner ON public.tenants(owner_id);
CREATE INDEX idx_tenants_stripe_customer ON public.tenants(stripe_customer_id);
CREATE INDEX idx_tenants_status ON public.tenants(status);

-- Índices para profiles
CREATE INDEX idx_profiles_tenant ON public.profiles(tenant_id);
CREATE INDEX idx_profiles_user ON public.profiles(user_id);
CREATE INDEX idx_profiles_active ON public.profiles(tenant_id, is_active);

-- Índices para clients
CREATE INDEX idx_clients_tenant ON public.clients(tenant_id);
CREATE INDEX idx_clients_phone ON public.clients(tenant_id, phone);
CREATE INDEX idx_clients_name_search ON public.clients USING gin(name gin_trgm_ops);

-- Índices para services
CREATE INDEX idx_services_tenant ON public.services(tenant_id);
CREATE INDEX idx_services_category ON public.services(category_id);
CREATE INDEX idx_services_active ON public.services(tenant_id, is_active);

-- Índices para appointments
CREATE INDEX idx_appointments_tenant ON public.appointments(tenant_id);
CREATE INDEX idx_appointments_date ON public.appointments(tenant_id, scheduled_at);
CREATE INDEX idx_appointments_client ON public.appointments(client_id);
CREATE INDEX idx_appointments_staff ON public.appointments(staff_id);
CREATE INDEX idx_appointments_status ON public.appointments(tenant_id, status);

-- Índices para sales
CREATE INDEX idx_sales_tenant ON public.sales(tenant_id);
CREATE INDEX idx_sales_date ON public.sales(tenant_id, created_at);
CREATE INDEX idx_sales_client ON public.sales(client_id);
CREATE INDEX idx_sales_staff ON public.sales(staff_id);

-- Índices para expenses
CREATE INDEX idx_expenses_tenant ON public.expenses(tenant_id);
CREATE INDEX idx_expenses_date ON public.expenses(tenant_id, date);
CREATE INDEX idx_expenses_category ON public.expenses(tenant_id, category);

-- Índices para register_closures
CREATE INDEX idx_closures_tenant ON public.register_closures(tenant_id);
CREATE INDEX idx_closures_date ON public.register_closures(tenant_id, opened_at);
CREATE INDEX idx_closures_status ON public.register_closures(tenant_id, status);

-- Índices para inventory
CREATE INDEX idx_inventory_tenant ON public.inventory(tenant_id);
CREATE INDEX idx_inventory_product ON public.inventory(product_id);
CREATE INDEX idx_inventory_sku ON public.inventory(tenant_id, sku);

-- =============================================
-- TRIGGERS para updated_at
-- =============================================

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at BEFORE UPDATE ON public.sales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_register_closures_updated_at BEFORE UPDATE ON public.register_closures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commission_plans_updated_at BEFORE UPDATE ON public.commission_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.register_closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_transactions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS RLS
-- =============================================

-- TENANTS: Usuários podem ver/editar apenas suas lojas
CREATE POLICY "Users can view their tenants" ON public.tenants
    FOR SELECT USING (owner_id = auth.uid() OR id = get_user_tenant_id());

CREATE POLICY "Owners can update their tenants" ON public.tenants
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can insert tenants" ON public.tenants
    FOR INSERT WITH CHECK (owner_id = auth.uid());

-- PROFILES: Usuários veem apenas perfis do mesmo tenant
CREATE POLICY "Users can view profiles in their tenant" ON public.profiles
    FOR SELECT USING (tenant_id = get_user_tenant_id() OR user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage profiles in their tenant" ON public.profiles
    FOR ALL USING (
        tenant_id = get_user_tenant_id() AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid()
            AND tenant_id = get_user_tenant_id()
            AND role IN ('OWNER', 'ADMIN', 'MANAGER')
        )
    );

-- CLIENTS: Acesso por tenant
CREATE POLICY "View clients in tenant" ON public.clients
    FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Manage clients in tenant" ON public.clients
    FOR ALL USING (tenant_id = get_user_tenant_id());

-- SERVICES: Acesso por tenant
CREATE POLICY "View services in tenant" ON public.services
    FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Manage services in tenant" ON public.services
    FOR ALL USING (tenant_id = get_user_tenant_id());

-- APPOINTMENTS: Acesso por tenant
CREATE POLICY "View appointments in tenant" ON public.appointments
    FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Manage appointments in tenant" ON public.appointments
    FOR ALL USING (tenant_id = get_user_tenant_id());

-- SALES: Acesso por tenant
CREATE POLICY "View sales in tenant" ON public.sales
    FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Manage sales in tenant" ON public.sales
    FOR ALL USING (tenant_id = get_user_tenant_id());

-- SALE_ITEMS: Acesso através da venda
CREATE POLICY "View sale items" ON public.sale_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sales
            WHERE sales.id = sale_items.sale_id
            AND sales.tenant_id = get_user_tenant_id()
        )
    );

CREATE POLICY "Manage sale items" ON public.sale_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.sales
            WHERE sales.id = sale_items.sale_id
            AND sales.tenant_id = get_user_tenant_id()
        )
    );

-- STAFF_SERVICES: Acesso por staff do tenant
CREATE POLICY "View staff services" ON public.staff_services
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = staff_services.staff_id
            AND profiles.tenant_id = get_user_tenant_id()
        )
    );

CREATE POLICY "Manage staff services" ON public.staff_services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = staff_services.staff_id
            AND profiles.tenant_id = get_user_tenant_id()
        )
    );

-- EXPENSES: Acesso por tenant
CREATE POLICY "View expenses in tenant" ON public.expenses
    FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Manage expenses in tenant" ON public.expenses
    FOR ALL USING (tenant_id = get_user_tenant_id());

-- REGISTER_CLOSURES: Acesso por tenant
CREATE POLICY "View closures in tenant" ON public.register_closures
    FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Manage closures in tenant" ON public.register_closures
    FOR ALL USING (tenant_id = get_user_tenant_id());

-- COMMISSION_PLANS: Acesso por tenant
CREATE POLICY "View commission plans in tenant" ON public.commission_plans
    FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Manage commission plans in tenant" ON public.commission_plans
    FOR ALL USING (tenant_id = get_user_tenant_id());

-- CATEGORIES: Acesso por tenant
CREATE POLICY "View categories in tenant" ON public.categories
    FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Manage categories in tenant" ON public.categories
    FOR ALL USING (tenant_id = get_user_tenant_id());

-- SUPPLIERS: Acesso por tenant
CREATE POLICY "View suppliers in tenant" ON public.suppliers
    FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Manage suppliers in tenant" ON public.suppliers
    FOR ALL USING (tenant_id = get_user_tenant_id());

-- INVENTORY: Acesso por tenant
CREATE POLICY "View inventory in tenant" ON public.inventory
    FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Manage inventory in tenant" ON public.inventory
    FOR ALL USING (tenant_id = get_user_tenant_id());

-- SUPPLY_TRANSACTIONS: Acesso por tenant
CREATE POLICY "View supply transactions in tenant" ON public.supply_transactions
    FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Manage supply transactions in tenant" ON public.supply_transactions
    FOR ALL USING (tenant_id = get_user_tenant_id());

-- PRODUCTS: Acesso por tenant
CREATE POLICY "View products in tenant" ON public.products
    FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Manage products in tenant" ON public.products
    FOR ALL USING (tenant_id = get_user_tenant_id());

-- SERVICE_CATEGORIES: Acesso por tenant
CREATE POLICY "View service categories in tenant" ON public.service_categories
    FOR SELECT USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Manage service categories in tenant" ON public.service_categories
    FOR ALL USING (tenant_id = get_user_tenant_id());

-- BUNDLE_ITEMS: Acesso através do serviço combo
CREATE POLICY "View bundle items" ON public.bundle_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.services
            WHERE services.id = bundle_items.combo_service_id
            AND services.tenant_id = get_user_tenant_id()
        )
    );

CREATE POLICY "Manage bundle items" ON public.bundle_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.services
            WHERE services.id = bundle_items.combo_service_id
            AND services.tenant_id = get_user_tenant_id()
        )
    );

-- =============================================
-- FIM DO SCHEMA
-- ============================================
