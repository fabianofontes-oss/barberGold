-- 🎯 KIT DADOS INICIAIS - SEM SERVIÇOS
-- Apenas funcionários, clientes e produtos
-- Os SERVIÇOS você escolhe na BIBLIOTECA (/app/catalog/library)
-- Execute no Supabase SQL Editor

-- ========================================
-- 1️⃣ FUNCIONÁRIOS (3)
-- ========================================
INSERT INTO staff (tenant_id, name, role, email, commission_model, service_commission_rate, product_commission_rate, is_active, phone) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pedro Santos', 'PROFESSIONAL', 'pedro@barbergold.com', 'PERCENTAGE', 50.00, 30.00, true, '(11) 98765-4321'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Carlos Oliveira', 'PROFESSIONAL', 'carlos@barbergold.com', 'PERCENTAGE', 45.00, 25.00, true, '(11) 98765-4322'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Maria Recepcionista', 'RECEPTIONIST', 'maria@barbergold.com', 'PERCENTAGE', 0.00, 10.00, true, '(11) 98765-4323')
ON CONFLICT (tenant_id, email) DO NOTHING;

-- ========================================
-- 2️⃣ PRODUTOS (6)
-- ========================================
INSERT INTO products (tenant_id, name, description, cost_price, sale_price, stock_quantity, is_active) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pomada Modeladora', 'Fixação forte', 22.00, 45.00, 50, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Óleo para Barba', 'Hidratação profunda', 18.00, 35.00, 30, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Shampoo para Barba', 'Limpeza especializada', 15.00, 30.00, 40, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Cera Modeladora', 'Fixação média', 19.00, 38.00, 25, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Gel Fixador', 'Fixação extra forte', 12.00, 28.00, 35, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Loção Pós-Barba', 'Hidratante e calmante', 20.00, 40.00, 20, true)
ON CONFLICT (tenant_id, name) DO NOTHING;

-- ========================================
-- 3️⃣ CLIENTES (5)
-- ========================================
INSERT INTO clients (tenant_id, name, phone, email, birth_date, visits_count, total_spent, loyalty_points) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Rafael Costa', '(11) 98765-4321', 'rafael@gmail.com', '1990-05-15', 12, 540.00, 54),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Lucas Mendes', '(11) 91234-5678', 'lucas@gmail.com', '1985-08-22', 8, 360.00, 36),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Matheus Lima', '(11) 95555-5555', 'matheus@gmail.com', '1992-11-10', 15, 675.00, 67),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Gabriel Souza', '(11) 94444-4444', 'gabriel@gmail.com', '1988-03-30', 5, 225.00, 22),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Fernando Alves', '(11) 93333-3333', 'fernando@gmail.com', '1993-07-18', 10, 480.00, 48)
ON CONFLICT (tenant_id, phone) DO NOTHING;

-- ========================================
-- RESUMO:
-- ========================================
-- ✅ 3 Funcionários
-- ✅ 6 Produtos
-- ✅ 5 Clientes
-- ⚠️ 0 Serviços (escolha na BIBLIOTECA)
-- 
-- Total: 14 registros
-- 
-- PRÓXIMO PASSO:
-- Vá em /app/catalog/library e MARQUE os serviços que você quer!
