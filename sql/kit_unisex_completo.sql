-- 🎭 KIT UNISEX/STUDIO COMPLETO
-- Sistema de gestão para estabelecimentos mistos
-- Execute no Supabase SQL Editor
-- Substitua 'TENANT_ID' por: bf683fdc-8caa-4e60-afda-e2bf7f32a29a

-- ========================================
-- 1️⃣ FUNCIONÁRIOS (6)
-- ========================================
INSERT INTO staff (tenant_id, name, role, email, commission_model, service_commission_rate, product_commission_rate, is_active, phone) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pedro Barbeiro', 'PROFESSIONAL', 'pedro@studiogold.com', 'PERCENTAGE', 50.00, 30.00, true, '(11) 96666-1111'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Ana Cabeleireira', 'PROFESSIONAL', 'ana@studiogold.com', 'PERCENTAGE', 50.00, 30.00, true, '(11) 96666-2222'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Carla Manicure', 'PROFESSIONAL', 'carla@studiogold.com', 'PERCENTAGE', 45.00, 25.00, true, '(11) 96666-3333'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Juliana Depiladora', 'PROFESSIONAL', 'juliana@studiogold.com', 'PERCENTAGE', 40.00, 20.00, true, '(11) 96666-4444'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Carlos Estilista', 'PROFESSIONAL', 'carlos@studiogold.com', 'PERCENTAGE', 48.00, 28.00, true, '(11) 96666-5555'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Maria Recepcionista', 'RECEPTIONIST', 'maria@studiogold.com', 'PERCENTAGE', 0.00, 10.00, true, '(11) 96666-6666');

-- ========================================
-- 2️⃣ SERVIÇOS (COMPLETO - MASCULINO + FEMININO)
-- ========================================

-- Este kit combina TODOS os serviços do Kit Barbearia + Kit Salão
-- Para simplicidade, execute os dois kits anteriores juntos
-- ou use este comando para verificar o total:

-- Total esperado: 92 serviços (42 masculinos + 50 femininos)

-- ALTERNATIVAMENTE, se quiser apenas os principais de cada:

-- CABELO UNISEX (8)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
-- Masculino
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Masculino', 40.00, 30, true, 'Corte clássico masculino'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Social', 50.00, 40, true, 'Corte social profissional'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Degradê', 45.00, 40, true, 'Degradê masculino'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Infantil Masculino', 30.00, 25, true, 'Meninos'),
-- Feminino
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Feminino', 60.00, 45, true, 'Corte feminino completo'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte Infantil Feminino', 45.00, 35, true, 'Meninas'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Escova', 50.00, 40, true, 'Escova feminina'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Franja', 30.00, 20, true, 'Corte de franja');

-- BARBA & ESTÉTICA MASCULINA (6)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Barba Completa', 35.00, 30, true, 'Barba com acabamento'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Barba Navalhada', 40.00, 30, true, 'Com navalha quente'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Sobrancelha Masculina', 15.00, 10, true, 'Design masculino'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Nariz + Orelha', 15.00, 10, true, 'Depilação nasal/auricular'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Limpeza de Pele Masculina', 80.00, 60, true, 'Skin care masculino'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Depilação Costas/Peito', 40.00, 30, true, 'Depilação masculina');

-- UNHAS (5)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Manicure', 35.00, 40, true, 'Manicure tradicional'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pedicure', 40.00, 50, true, 'Pedicure completo'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Manicure + Pedicure', 65.00, 90, true, 'Combo completo'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Unhas em Gel', 100.00, 90, true, 'Gel'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Alongamento', 120.00, 120, true, 'Alongamento');

-- DEPILAÇÃO FEMININA (8)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Sobrancelha Feminina', 25.00, 15, true, 'Design feminino'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Buço', 20.00, 10, true, 'Depilação buço'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Axila', 25.00, 15, true, 'Axilas'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Perna Completa', 60.00, 45, true, 'Pernas inteiras'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Meia Perna', 40.00, 30, true, 'Até joelho'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Virilha', 35.00, 25, true, 'Íntima'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Virilha Completa', 50.00, 35, true, 'Íntima completa'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corpo Completo Feminino', 150.00, 120, true, 'Corporal');

-- QUÍMICAS UNISEX (10)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Hidratação', 70.00, 50, true, 'Hidratação capilar'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Progressiva', 280.00, 180, true, 'Alisamento'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Botox Capilar', 160.00, 100, true, 'Botox'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Coloração', 180.00, 120, true, 'Tintura'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Luzes', 200.00, 150, true, 'Mechas/Luzes'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Platinado', 250.00, 150, true, 'Descoloração'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Ombré/Balayage', 300.00, 180, true, 'Técnicas modernas'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Cauterização', 130.00, 90, true, 'Reconstrução'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Reflexo', 100.00, 60, true, 'Tonalizante'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Queratina', 180.00, 120, true, 'Tratamento');

-- ESTÉTICA & SPA (7)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Limpeza de Pele', 120.00, 75, true, 'Facial'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Design de Sobrancelha Premium', 40.00, 30, true, 'Com henna'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Massagem Relaxante', 100.00, 60, true, 'Corporal'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Drenagem Linfática', 140.00, 80, true, 'Drenagem'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Aplicação de Cílios', 100.00, 70, true, 'Extensão'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Maquiagem', 80.00, 60, true, 'Make profissional'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Penteado', 100.00, 75, true, 'Para eventos');

-- COMBOS & PACOTES (6)
INSERT INTO services (tenant_id, name, price, duration_minutes, is_active, description) VALUES
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte + Barba', 65.00, 60, true, 'Masculino combo'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Corte + Escova', 100.00, 80, true, 'Feminino combo'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pacote VIP Masculino', 130.00, 95, true, 'Completo masculino'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pacote VIP Feminino', 200.00, 120, true, 'Completo feminino'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Day Spa', 350.00, 180, true, 'Dia completo'),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pacote Noivos', 550.00, 300, true, 'Casal completo');

-- ========================================
-- 3️⃣ PRODUTOS (12)
-- ========================================
INSERT INTO products (tenant_id, name, description, cost_price, sale_price, stock_quantity, is_active) VALUES
-- Masculinos
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Pomada Modeladora', 'Fixação forte', 22.00, 45.00, 40, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Óleo para Barba', 'Hidratação', 18.00, 35.00, 30, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Gel Fixador', 'Extra forte', 12.00, 28.00, 35, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Loção Pós-Barba', 'Calmante', 20.00, 40.00, 25, true),
-- Femininos
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Shampoo Hidratante', 'Cabelo', 18.00, 45.00, 40, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Condicionador', 'Nutrição', 16.00, 40.00, 40, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Máscara Capilar', 'Tratamento', 25.00, 55.00, 25, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Óleo Finalizador', 'Brilho', 22.00, 50.00, 30, true),
-- Unhas
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Esmalte', 'Várias cores', 5.00, 15.00, 80, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Base Fortalecedora', 'Unhas', 8.00, 20.00, 40, true),
-- Unisex
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Spray Térmico', 'Proteção', 20.00, 45.00, 35, true),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Sérum', 'Reparação', 30.00, 70.00, 20, true);

-- ========================================
-- 4️⃣ CLIENTES (8 - MIX)
-- ========================================
INSERT INTO clients (tenant_id, name, phone, email, birth_date, visits_count, total_spent, loyalty_points) VALUES
-- Masculinos
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Rafael Costa', '(11) 98765-4321', 'rafael@gmail.com', '1990-05-15', 12, 540.00, 54),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Lucas Mendes', '(11) 91234-5678', 'lucas@gmail.com', '1985-08-22', 8, 360.00, 36),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Matheus Lima', '(11) 95555-5555', 'matheus@gmail.com', '1992-11-10', 15, 675.00, 67),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Gabriel Souza', '(11) 94444-4444', 'gabriel@gmail.com', '1988-03-30', 5, 225.00, 22),
-- Femininos
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Mariana Silva', '(11) 98888-1111', 'mariana@gmail.com', '1992-03-10', 18, 1080.00, 108),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Juliana Santos', '(11) 98888-2222', 'juliana@gmail.com', '1988-07-25', 14, 840.00, 84),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Camila Costa', '(11) 98888-3333', 'camila@gmail.com', '1995-11-18', 22, 1320.00, 132),
('bf683fdc-8caa-4e60-afda-e2bf7f32a29a', 'Ana Paula Lima', '(11) 98888-4444', 'anapaula@gmail.com', '1990-05-30', 9, 540.00, 54);

-- ========================================
-- RESUMO DO KIT UNISEX:
-- ========================================
-- ✅ 6 Funcionários
-- ✅ 50 Serviços Principais (Mix masculino/feminino)
-- ✅ 12 Produtos
-- ✅ 8 Clientes
-- Total: 76 registros

-- NOTA: Para catálogo COMPLETO (92 serviços), execute:
-- 1. kit_barbearia_completo.sql (42 serviços masculinos)
-- 2. kit_salao_completo.sql (50 serviços femininos)
