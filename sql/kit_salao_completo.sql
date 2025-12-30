-- 💅 KIT SALÃO DE BELEZA COMPLETO
-- Sistema de gestão para salões femininos
-- Execute no Supabase SQL Editor
-- Substitua 'TENANT_ID' por: bf683fdc-8caa-4e60-afda-e2bf7f32a29a

-- ========================================
-- 1️⃣ FUNCIONÁRIOS (4)
-- ========================================
INSERT INTO staff (tenant_id, name, role, email, commission_model, service_commission_rate, product_commission_rate, is_active, phone) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Ana Cabeleireira', 'PROFESSIONAL', 'ana@salaogold.com', 'PERCENTAGE', 50.00, 30.00, true, '(11) 97777-1111'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Carla Manicure', 'PROFESSIONAL', 'carla@salaogold.com', 'PERCENTAGE', 45.00, 25.00, true, '(11) 97777-2222'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Juliana Depiladora', 'PROFESSIONAL', 'juliana@salaogold.com', 'PERCENTAGE', 40.00, 20.00, true, '(11) 97777-3333'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Fernanda Recepcionista', 'RECEPTIONIST', 'fernanda@salaogold.com', 'PERCENTAGE', 0.00, 10.00, true, '(11) 97777-4444');

-- ========================================
-- 2️⃣ SERVIÇOS (50 SERVIÇOS)
-- ========================================

-- CABELO FEMININO (5)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Feminino', 60.00, 45, true, 'Corte feminino com acabamento'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Infantil Feminino', 45.00, 35, true, 'Corte para meninas'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Franja', 30.00, 20, true, 'Corte de franja'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Repicado', 70.00, 50, true, 'Corte repicado'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Longo', 80.00, 60, true, 'Corte em cabelo longo');

-- ESCOVA (4)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Escova Simples', 50.00, 40, true, 'Escova básica'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Escova Modelada', 65.00, 50, true, 'Escova com modelagem'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Chapinha', 55.00, 45, true, 'Alisamento com chapinha'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Babyliss', 60.00, 50, true, 'Cachos com babyliss');

-- UNHAS (6)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Manicure', 35.00, 40, true, 'Manicure tradicional'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pedicure', 40.00, 50, true, 'Pedicure completo'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Manicure + Pedicure', 65.00, 90, true, 'Combo mãos e pés'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Unhas em Gel', 100.00, 90, true, 'Aplicação de gel'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Alongamento de Unhas', 120.00, 120, true, 'Alongamento completo'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Unhas Decoradas', 60.00, 60, true, 'Nail art');

-- DEPILAÇÃO (9)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Sobrancelha', 25.00, 15, true, 'Design de sobrancelha'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Buço', 20.00, 10, true, 'Depilação de buço'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Axila', 25.00, 15, true, 'Depilação axilar'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Perna Completa', 60.00, 45, true, 'Depilação perna inteira'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Meia Perna', 40.00, 30, true, 'Até o joelho'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Virilha', 35.00, 25, true, 'Depilação íntima'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Virilha Completa', 50.00, 35, true, 'Íntima completa'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Braços', 30.00, 20, true, 'Depilação dos braços'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corpo Completo', 150.00, 120, true, 'Depilação corporal completa');

-- QUÍMICAS (8)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Hidratação', 70.00, 50, true, 'Hidratação profunda'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Progressiva', 280.00, 180, true, 'Alisamento progressivo'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Coloração', 180.00, 120, true, 'Coloração completa'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Luzes', 200.00, 150, true, 'Mechas/Luzes'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Ombré Hair', 280.00, 180, true, 'Técnica ombré'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Balayage', 320.00, 200, true, 'Técnica balayage'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Mechas', 200.00, 150, true, 'Mechas tradicionais'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Reflexo', 100.00, 60, true, 'Tonalizante');

-- PENTEADOS (6)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Penteado Simples', 80.00, 60, true, 'Penteado básico'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Penteado de Festa', 120.00, 90, true, 'Para eventos'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Penteado de Noiva', 250.00, 150, true, 'Noiva completo'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Trança', 60.00, 45, true, 'Tranças variadas'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Coque', 70.00, 50, true, 'Coque elegante'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Semi-Preso', 65.00, 45, true, 'Meio preso');

-- TRATAMENTOS CAPILARES (6)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Cauterização', 130.00, 90, true, 'Cauterização profunda'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Botox Capilar', 160.00, 100, true, 'Botox para fios'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Reconstrução', 110.00, 80, true, 'Reconstrução capilar'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Cronograma Capilar', 90.00, 70, true, 'Tratamento completo'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Selagem', 140.00, 95, true, 'Selagem térmica'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Queratina', 180.00, 120, true, 'Reposição de queratina');

-- ESTÉTICA FACIAL (6)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Limpeza de Pele', 120.00, 75, true, 'Limpeza facial'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Limpeza de Pele Profunda', 170.00, 100, true, 'Limpeza completa'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Design de Sobrancelha', 35.00, 25, true, 'Design profissional'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Henna de Sobrancelha', 40.00, 30, true, 'Henna para sobrancelha'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Aplicação de Cílios', 100.00, 70, true, 'Extensão de cílios'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Maquiagem', 80.00, 60, true, 'Maquiagem profissional');

-- MASSAGENS (3)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Massagem Relaxante', 100.00, 60, true, 'Massagem corporal'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Massagem Modeladora', 120.00, 70, true, 'Modeladora'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Drenagem Linfática', 140.00, 80, true, 'Drenagem corporal');

-- COMBOS (4)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte + Escova', 100.00, 80, true, 'Combo cabelo'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte + Hidratação', 120.00, 90, true, 'Corte com tratamento'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pacote Noiva', 450.00, 240, true, 'Completo para casamento'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Day Spa', 350.00, 180, true, 'Dia de beleza completo');

-- ========================================
-- 3️⃣ PRODUTOS (10)
-- ========================================
INSERT INTO products (tenant_id, name, description, cost_price, sale_price, stock_quantity, is_active) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Shampoo Hidratante', 'Hidratação profunda', 18.00, 45.00, 40, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Condicionador', 'Nutrição e brilho', 16.00, 40.00, 40, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Máscara Capilar', 'Tratamento intensivo', 25.00, 55.00, 25, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Óleo Finalizador', 'Brilho e nutrição', 22.00, 50.00, 30, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Spray Térmico', 'Proteção térmica', 20.00, 45.00, 35, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Esmalte Tradicional', 'Várias cores', 5.00, 15.00, 100, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Base Fortalecedora', 'Para unhas', 8.00, 20.00, 50, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Kit Manicure', 'Kit completo', 35.00, 80.00, 15, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Creme para Mãos', 'Hidratação intensa', 12.00, 30.00, 40, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Sérum Capilar', 'Reparação', 30.00, 70.00, 20, true);

-- ========================================
-- 4️⃣ CLIENTES (6)
-- ========================================
INSERT INTO clients (tenant_id, name, phone, email, birth_date, visits_count, total_spent, loyalty_points) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Mariana Silva', '(11) 98888-1111', 'mariana@gmail.com', '1992-03-10', 20, 1200.00, 120),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Juliana Santos', '(11) 98888-2222', 'juliana@gmail.com', '1988-07-25', 15, 900.00, 90),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Camila Costa', '(11) 98888-3333', 'camila@gmail.com', '1995-11-18', 25, 1500.00, 150),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Ana Paula Lima', '(11) 98888-4444', 'anapaula@gmail.com', '1990-05-30', 10, 600.00, 60),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Beatriz Oliveira', '(11) 98888-5555', 'beatriz@gmail.com', '1993-09-12', 18, 1080.00, 108),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Larissa Mendes', '(11) 98888-6666', 'larissa@gmail.com', '1991-12-05', 12, 720.00, 72);

-- ========================================
-- RESUMO DO KIT SALÃO:
-- ========================================
-- ✅ 4 Funcionários
-- ✅ 50 Serviços (Completo)
-- ✅ 10 Produtos
-- ✅ 6 Clientes
-- Total: 70 registros
