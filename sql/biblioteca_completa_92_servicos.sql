-- =============================================
-- 📚 BIBLIOTECA COMPLETA - 92 SERVIÇOS
-- LIMPAR e RECRIAR tudo do zero
-- =============================================

-- 1. LIMPAR dados antigos
DELETE FROM service_templates;

-- 2. INSERIR TODOS OS 92 SERVIÇOS

-- 🧔 BARBEARIA (42 serviços)

-- CABELO MASCULINO (6)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Cabelo Masculino', 'Corte Masculino', 'Corte clássico masculino', 40.00, 30, '✂️'),
('Cabelo Masculino', 'Corte Social', 'Corte social profissional', 50.00, 40, '💼'),
('Cabelo Masculino', 'Degradê', 'Degradê baixo/médio/alto', 45.00, 40, '💈'),
('Cabelo Masculino', 'Corte Infantil', 'Para crianças até 12 anos', 30.00, 25, '👶'),
('Cabelo Masculino', 'Corte Navalhado', 'Acabamento com navalha', 55.00, 45, '🪒'),
('Cabelo Masculino', 'Corte Afro', 'Especializado cabelo afro', 60.00, 50, '🌀');

-- BARBA & BIGODE (5)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Barba', 'Barba Simples', 'Aparar e alinhar', 25.00, 15, '✂️'),
('Barba', 'Barba Completa', 'Barba com acabamento', 35.00, 30, '🧔'),
('Barba', 'Barba Navalhada', 'Com navalha quente', 40.00, 30, '🪒'),
('Barba', 'Aparar Bigode', 'Apenas bigode', 15.00, 10, '✂️'),
('Barba', 'Design de Barba', 'Modelagem personalizada', 45.00, 35, '🎨');

-- ACABAMENTO PREMIUM (7) - NARIZ, ORELHA, SOBRANCELHA
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Acabamento', 'Sobrancelha Masculina', 'Design de sobrancelha', 15.00, 10, '👁️'),
('Acabamento', 'Nariz', 'Depilação nasal', 10.00, 5, '👃'),
('Acabamento', 'Orelha', 'Depilação auricular', 10.00, 5, '👂'),
('Acabamento', 'Acabamento Completo', 'Nariz + Orelha + Sobrancelha', 25.00, 15, '✨'),
('Acabamento', 'Risco', 'Risco no cabelo/barba', 15.00, 10, '⚡'),
('Acabamento', 'Desenho no Cabelo', 'Desenhos artísticos', 25.00, 20, '🎨'),
('Acabamento', 'Depilação de Costas', 'Depilação masculina', 40.00, 30, '💪');

-- QUÍMICAS MASCULINAS (7)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Química Masculina', 'Luzes/Mechas', 'Mechas masculinas', 150.00, 90, '✨'),
('Química Masculina', 'Platinado', 'Descoloração completa', 200.00, 120, '⚪'),
('Química Masculina', 'Progressiva Masculina', 'Alisamento', 180.00, 120, '💫'),
('Química Masculina', 'Tintura', 'Coloração total', 60.00, 45, '🎨'),
('Química Masculina', 'Reflexo', 'Tonalizante', 80.00, 60, '🌈'),
('Química Masculina', 'Tintura de Barba', 'Coloração da barba', 40.00, 30, '🖌️'),
('Química Masculina', 'Descoloração de Barba', 'Clareamento', 50.00, 40, '⚪');

-- TRATAMENTOS SPA (8)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Tratamentos', 'Hidratação de Barba', 'Tratamento para barba', 35.00, 25, '💧'),
('Tratamentos', 'Massagem Relaxante', 'Massagem no couro cabeludo', 40.00, 30, '💆'),
('Tratamentos', 'Limpeza de Pele', 'Limpeza facial profunda', 80.00, 60, '🧼'),
('Tratamentos', 'Toalha Quente', 'Relaxamento com toalha', 20.00, 15, '🔥'),
('Tratamentos', 'Esfoliação Facial', 'Esfoliação masculina', 50.00, 30, '✨'),
('Tratamentos', 'Máscara Facial', 'Máscara hidratante', 45.00, 25, '😌'),
('Tratamentos', 'Barboterapia', 'Tratamento anti-queda', 100.00, 60, '💉'),
('Tratamentos', 'Cauterização', 'Cauterização capilar', 120.00, 75, '🔬');

-- ESTÉTICA FACIAL MASCULINA (5)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Estética Masculina', 'Design de Barba Premium', 'Design profissional', 60.00, 40, '💎'),
('Estética Masculina', 'Pigmentação Capilar', 'Micropigmentação', 120.00, 70, '🖊️'),
('Estética Masculina', 'Pigmentação de Barba', 'Micropigmentação barba', 90.00, 50, '🎨'),
('Estética Masculina', 'Depilação de Peito', 'Depilação peitoral', 35.00, 25, '💪'),
('Estética Masculina', 'Depilação de Ombros', 'Depilação ombros', 30.00, 20, '💪');

-- COMBOS MASCULINOS (4)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Combos', 'Corte + Barba', 'Combo econômico', 65.00, 60, '🔥'),
('Combos', 'Pacote VIP', 'Corte + Barba + Hidratação + Massagem', 130.00, 95, '👑'),
('Combos', 'Pacote Premium', 'Serviço completo com toalha quente', 160.00, 120, '💎'),
('Combos', 'Pacote Noivo', 'Preparação casamento', 200.00, 150, '🤵');

-- 💅 SALÃO (50 serviços)

-- CABELO FEMININO (5)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Cabelo Feminino', 'Corte Feminino', 'Corte com acabamento', 60.00, 45, '✂️'),
('Cabelo Feminino', 'Corte Infantil Feminino', 'Para meninas', 45.00, 35, '👧'),
('Cabelo Feminino', 'Franja', 'Corte de franja', 30.00, 20, '✂️'),
('Cabelo Feminino', 'Repicado', 'Corte repicado', 70.00, 50, '✨'),
('Cabelo Feminino', 'Corte Longo', 'Corte cabelo longo', 80.00, 60, '💇');

-- ESCOVA (4)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Escova', 'Escova Simples', 'Escova básica', 50.00, 40, '🌬️'),
('Escova', 'Escova Modelada', 'Escova com modelagem', 65.00, 50, '💫'),
('Escova', 'Chapinha', 'Alisamento com chapinha', 55.00, 45, '🔥'),
('Escova', 'Babyliss', 'Cachos com babyliss', 60.00, 50, '🌀');

-- UNHAS (6)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Unhas', 'Manicure', 'Manicure tradicional', 35.00, 40, '💅'),
('Unhas', 'Pedicure', 'Pedicure completo', 40.00, 50, '🦶'),
('Unhas', 'Manicure + Pedicure', 'Combo mãos e pés', 65.00, 90, '💖'),
('Unhas', 'Unhas em Gel', 'Aplicação de gel', 100.00, 90, '✨'),
('Unhas', 'Alongamento de Unhas', 'Alongamento completo', 120.00, 120, '💎'),
('Unhas', 'Unhas Decoradas', 'Nail art', 60.00, 60, '🎨');

-- DEPILAÇÃO (9)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Depilação', 'Sobrancelha', 'Design de sobrancelha', 25.00, 15, '👁️'),
('Depilação', 'Buço', 'Depilação de buço', 20.00, 10, '😊'),
('Depilação', 'Axila', 'Depilação axilar', 25.00, 15, '🙋'),
('Depilação', 'Perna Completa', 'Depilação perna inteira', 60.00, 45, '🦵'),
('Depilação', 'Meia Perna', 'Até o joelho', 40.00, 30, '🦵'),
('Depilação', 'Virilha', 'Depilação íntima', 35.00, 25, '💃'),
('Depilação', 'Virilha Completa', 'Íntima completa', 50.00, 35, '💃'),
('Depilação', 'Braços', 'Depilação dos braços', 30.00, 20, '💪'),
('Depilação', 'Corpo Completo', 'Depilação corporal', 150.00, 120, '✨');

-- QUÍMICAS FEMININAS (8)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Química Feminina', 'Hidratação', 'Hidratação profunda', 70.00, 50, '💧'),
('Química Feminina', 'Progressiva', 'Alisamento progressivo', 280.00, 180, '💫'),
('Química Feminina', 'Coloração', 'Coloração completa', 180.00, 120, '🎨'),
('Química Feminina', 'Luzes', 'Mechas/Luzes', 200.00, 150, '✨'),
('Química Feminina', 'Ombré Hair', 'Técnica ombré', 280.00, 180, '🌈'),
('Química Feminina', 'Balayage', 'Técnica balayage', 320.00, 200, '🎨'),
('Química Feminina', 'Mechas', 'Mechas tradicionais', 200.00, 150, '✨'),
('Química Feminina', 'Reflexo', 'Tonalizante', 100.00, 60, '🌈');

-- PENTEADOS (6)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Penteados', 'Penteado Simples', 'Penteado básico', 80.00, 60, '💐'),
('Penteados', 'Penteado de Festa', 'Para eventos', 120.00, 90, '🎉'),
('Penteados', 'Penteado de Noiva', 'Noiva completo', 250.00, 150, '👰'),
('Penteados', 'Trança', 'Tranças variadas', 60.00, 45, '🌸'),
('Penteados', 'Coque', 'Coque elegante', 70.00, 50, '💐'),
('Penteados', 'Semi-Preso', 'Meio preso', 65.00, 45, '🌺');

-- TRATAMENTOS CAPILARES (6)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Tratamentos Capilares', 'Cauterização', 'Cauterização profunda', 130.00, 90, '🔬'),
('Tratamentos Capilares', 'Botox Capilar', 'Botox para fios', 160.00, 100, '💉'),
('Tratamentos Capilares', 'Reconstrução', 'Reconstrução capilar', 110.00, 80, '🔧'),
('Tratamentos Capilares', 'Cronograma Capilar', 'Tratamento completo', 90.00, 70, '📅'),
('Tratamentos Capilares', 'Selagem', 'Selagem térmica', 140.00, 95, '🔐'),
('Tratamentos Capilares', 'Queratina', 'Reposição queratina', 180.00, 120, '💎');

-- ESTÉTICA FACIAL (6)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Estética Facial', 'Limpeza de Pele', 'Limpeza facial', 120.00, 75, '🧼'),
('Estética Facial', 'Limpeza Profunda', 'Limpeza completa', 170.00, 100, '✨'),
('Estética Facial', 'Design de Sobrancelha', 'Design profissional', 35.00, 25, '👁️'),
('Estética Facial', 'Henna de Sobrancelha', 'Henna sobrancelha', 40.00, 30, '🎨'),
('Estética Facial', 'Aplicação de Cílios', 'Extensão de cílios', 100.00, 70, '👁️'),
('Estética Facial', 'Maquiagem', 'Make profissional', 80.00, 60, '💄');

-- MASSAGENS (3)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Massagens', 'Massagem Relaxante', 'Massagem corporal', 100.00, 60, '💆'),
('Massagens', 'Massagem Modeladora', 'Modeladora', 120.00, 70, '💪'),
('Massagens', 'Drenagem Linfática', 'Drenagem corporal', 140.00, 80, '💧');

-- COMBOS FEMININOS (4)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Combos Femininos', 'Corte + Escova', 'Combo cabelo', 100.00, 80, '🔥'),
('Combos Femininos', 'Corte + Hidratação', 'Corte com tratamento', 120.00, 90, '💧'),
('Combos Femininos', 'Pacote Noiva', 'Completo casamento', 450.00, 240, '👰'),
('Combos Femininos', 'Day Spa', 'Dia de beleza', 350.00, 180, '✨');

-- =============================================
-- RESUMO:
-- =============================================
-- ✅ 42 Serviços Barbearia
-- ✅ 50 Serviços Salão
-- ✅ Total: 92 Templates
