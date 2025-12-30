-- 🧔 KIT BARBEARIA COMPLETO
-- Sistema de gestão para barbearias masculinas
-- Execute no Supabase SQL Editor
-- Substitua 'TENANT_ID' por: bf683fdc-8caa-4e60-afda-e2bf7f32a29a

-- ========================================
-- 1️⃣ FUNCIONÁRIOS (3)
-- ========================================
INSERT INTO staff (tenant_id, name, role, email, commission_model, service_commission_rate, product_commission_rate, is_active, phone) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pedro Santos', 'PROFESSIONAL', 'pedro@barbergold.com', 'PERCENTAGE', 50.00, 30.00, true, '(11) 98765-4321'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Carlos Barbeiro', 'PROFESSIONAL', 'carlos@barbergold.com', 'PERCENTAGE', 45.00, 25.00, true, '(11) 98765-4322'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'João Recepcionista', 'RECEPTIONIST', 'joao@barbergold.com', 'PERCENTAGE', 0.00, 10.00, true, '(11) 98765-4323');

-- ========================================
-- 2️⃣ SERVIÇOS (42 SERVIÇOS)
-- ========================================

-- CABELO MASCULINO (6)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Masculino', 40.00, 30, true, 'Corte clássico masculino'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Social', 50.00, 40, true, 'Corte social profissional'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Degradê', 45.00, 40, true, 'Degradê baixo/médio/alto'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Infantil', 30.00, 25, true, 'Corte para crianças até 12 anos'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Navalhado', 55.00, 45, true, 'Acabamento com navalha'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Afro', 60.00, 50, true, 'Especializado em cabelo afro');

-- BARBA & BIGODE (5)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Barba Simples', 25.00, 15, true, 'Aparar e alinhar'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Barba Completa', 35.00, 30, true, 'Barba completa com acabamento'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Barba Navalhada', 40.00, 30, true, 'Acabamento com navalha quente'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Aparar Bigode', 15.00, 10, true, 'Apenas bigode'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Design de Barba', 45.00, 35, true, 'Modelagem e design personalizado');

-- ACABAMENTO PREMIUM (7) - Nariz, Orelha, Sobrancelha
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Sobrancelha Masculina', 15.00, 10, true, 'Design de sobrancelha'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Nariz', 10.00, 5, true, 'Depilação nasal'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Orelha', 10.00, 5, true, 'Depilação auricular'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Acabamento Completo', 25.00, 15, true, 'Nariz + Orelha + Sobrancelha'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Risco', 15.00, 10, true, 'Risco no cabelo ou barba'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Desenho no Cabelo', 25.00, 20, true, 'Desenhos artísticos'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Depilação de Costas', 40.00, 30, true, 'Depilação masculina costas');

-- QUÍMICAS MASCULINAS (7)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Luzes/Mechas', 150.00, 90, true, 'Mechas masculinas'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Platinado', 200.00, 120, true, 'Descoloração completa'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Progressiva Masculina', 180.00, 120, true, 'Alisamento masculino'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Tintura', 60.00, 45, true, 'Coloração total'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Reflexo', 80.00, 60, true, 'Tonalizante'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Tintura de Barba', 40.00, 30, true, 'Coloração da barba'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Descoloração de Barba', 50.00, 40, true, 'Clareamento da barba');

-- TRATAMENTOS & SPA (8)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Hidratação de Barba', 35.00, 25, true, 'Tratamento para barba'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Massagem Relaxante', 40.00, 30, true, 'Massagem no couro cabeludo'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Limpeza de Pele', 80.00, 60, true, 'Limpeza facial profunda'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Toalha Quente', 20.00, 15, true, 'Relaxamento com toalha quente'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Esfoliação Facial', 50.00, 30, true, 'Esfoliação masculina'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Máscara Facial', 45.00, 25, true, 'Máscara hidratante facial'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Barboterapia', 100.00, 60, true, 'Tratamento capilar anti-queda'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Cauterização', 120.00, 75, true, 'Cauterização capilar');

-- ESTÉTICA FACIAL (5)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Design de Barba Premium', 60.00, 40, true, 'Design e modelagem profissional'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pigmentação Capilar', 120.00, 70, true, 'Micropigmentação capilar'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pigmentação de Barba', 90.00, 50, true, 'Micropigmentação de barba'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Depilação de Peito', 35.00, 25, true, 'Depilação peitoral'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Depilação de Ombros', 30.00, 20, true, 'Depilação dos ombros');

-- COMBOS & PACOTES (4)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte + Barba', 65.00, 60, true, 'Combo econômico'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pacote VIP', 130.00, 95, true, 'Corte + Barba + Hidratação + Massagem'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pacote Premium', 160.00, 120, true, 'Serviço completo com toalha quente'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pacote Noivo', 200.00, 150, true, 'Preparação completa para casamento');

-- ========================================
-- 3️⃣ PRODUTOS (8)
-- ========================================
INSERT INTO products (tenant_id, name, description, cost_price, sale_price, stock_quantity, is_active) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pomada Modeladora', 'Fixação forte', 22.00, 45.00, 50, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Óleo para Barba', 'Hidratação profunda', 18.00, 35.00, 30, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Shampoo para Barba', 'Limpeza especializada', 15.00, 30.00, 40, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Cera Modeladora', 'Fixação média', 19.00, 38.00, 25, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Gel Fixador', 'Fixação extra forte', 12.00, 28.00, 35, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Loção Pós-Barba', 'Hidratante e calmante', 20.00, 40.00, 20, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Balm para Barba', 'Nutrição e brilho', 25.00, 50.00, 15, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Spray Finalizador', 'Fixação e brilho', 18.00, 35.00, 30, true);

-- ========================================
-- 4️⃣ CLIENTES (5)
-- ========================================
INSERT INTO clients (tenant_id, name, phone, email, birth_date, visits_count, total_spent, loyalty_points) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Rafael Costa', '(11) 98765-4321', 'rafael@gmail.com', '1990-05-15', 12, 540.00, 54),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Lucas Mendes', '(11) 91234-5678', 'lucas@gmail.com', '1985-08-22', 8, 360.00, 36),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Matheus Lima', '(11) 95555-5555', 'matheus@gmail.com', '1992-11-10', 15, 675.00, 67),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Gabriel Souza', '(11) 94444-4444', 'gabriel@gmail.com', '1988-03-30', 5, 225.00, 22),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Fernando Alves', '(11) 93333-3333', 'fernando@gmail.com', '1993-07-18', 10, 480.00, 48);

-- ========================================
-- RESUMO DO KIT BARBEARIA:
-- ========================================
-- ✅ 3 Funcionários
-- ✅ 42 Serviços (Completo)
-- ✅ 8 Produtos
-- ✅ 5 Clientes
-- Total: 58 registros
