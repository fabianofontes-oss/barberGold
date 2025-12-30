-- 🎯 KIT PREGUIÇOSO COMPLETO - BASEADO NO ONBOARDING ORIGINAL
-- Execute este SQL no Supabase SQL Editor
-- Substitui 'TENANT_ID' pelo seu ID real: bf683fdc-8caa-4e60-afda-e2bf7f32a29a

-- 1️⃣ FUNCIONÁRIOS
INSERT INTO staff (tenant_id, name, role, email, commission_model, service_commission_rate, product_commission_rate, is_active, phone) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pedro Santos', 'PROFESSIONAL', 'pedro@barbergold.com', 'PERCENTAGE', 50.00, 30.00, true, '(11) 98765-4321'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Carlos Oliveira', 'PROFESSIONAL', 'carlos@barbergold.com', 'PERCENTAGE', 40.00, 20.00, true, '(11) 98765-4322'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Maria Recepcionista', 'RECEPTIONIST', 'maria@barbergold.com', 'PERCENTAGE', 0.00, 0.00, true, '(11) 98765-4323');

-- 2️⃣ SERVIÇOS ESSENCIAIS - CABELO MASCULINO
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Masculino', 40.00, 30, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Social', 50.00, 40, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Degradê', 45.00, 40, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Infantil', 30.00, 25, true);

-- 3️⃣ SERVIÇOS ESSENCIAIS - BARBA & BIGODE
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Barba Simples', 25.00, 15, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Barba Completa', 35.00, 30, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Barba Navalhada', 40.00, 30, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Aparar Bigode', 15.00, 10, true);

-- 4️⃣ TRATAMENTOS
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Hidratação de Barba', 30.00, 20, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Massagem Relaxante', 30.00, 20, true);

-- 5️⃣ COMBOS
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte + Barba', 60.00, 60, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pacote VIP', 120.00, 90, true);

-- 6️⃣ ACABAMENTO PREMIUM (Nariz, Orelha, Sobrancelha)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Sobrancelha Masculina', 10.00, 10, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Nariz', 8.00, 5, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Orelha', 8.00, 5, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Acabamento Completo', 20.00, 15, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Risco', 10.00, 5, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Desenho no Cabelo', 20.00, 15, true);

-- 7️⃣ QUÍMICAS MASCULINAS
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Luzes/Mechas', 150.00, 90, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Platinado', 200.00, 120, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Progressiva Masculina', 180.00, 120, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Tintura', 60.00, 45, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Reflexo', 80.00, 60, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Tintura de Barba', 40.00, 30, true);

-- 8️⃣ ESTÉTICA FACIAL
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Limpeza de Pele', 80.00, 60, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Design de Barba Premium', 50.00, 40, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pigmentação Capilar', 100.00, 60, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pigmentação de Barba', 80.00, 45, true);

-- 9️⃣ PRODUTOS
INSERT INTO products (tenant_id, name, description, cost_price, sale_price, stock_quantity, is_active) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pomada Modeladora', 'Fixação forte', 22.00, 45.00, 50, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Óleo para Barba', 'Hidratação profunda', 18.00, 35.00, 30, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Shampoo Anti-Caspa', 'Limpeza profunda', 12.00, 28.00, 40, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Cera Modeladora', 'Fixação média', 19.00, 38.00, 25, true);

-- 🔟 CLIENTES
INSERT INTO clients (tenant_id, name, phone, email, birth_date, visits_count, total_spent, loyalty_points) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Rafael Costa', '(11) 98765-4321', 'rafael@gmail.com', '1990-05-15', 12, 540.00, 54),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Lucas Mendes', '(11) 91234-5678', 'lucas@gmail.com', '1985-08-22', 8, 360.00, 36),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Matheus Lima', '(11) 95555-5555', 'matheus@gmail.com', '1992-11-10', 15, 675.00, 67),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Gabriel Souza', '(11) 94444-4444', 'gabriel@gmail.com', '1988-03-30', 5, 225.00, 22),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Fernando Alves', '(11) 93333-3333', 'fernando@gmail.com', '1993-07-18', 10, 480.00, 48);
