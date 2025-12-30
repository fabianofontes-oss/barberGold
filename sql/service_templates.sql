-- =============================================
-- 📚 BIBLIOTECA COMPLETA DE SERVIÇOS
-- 92+ Templates para Barbearia + Salão
-- =============================================

-- Criar tabela se não existir
CREATE TABLE IF NOT EXISTS service_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  suggested_price DECIMAL(10,2) DEFAULT 0,
  suggested_duration INTEGER DEFAULT 30,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_service_template UNIQUE (category, name)
);

-- Habilitar RLS
ALTER TABLE service_templates ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem LER os templates
CREATE POLICY "Public read access" ON service_templates
  FOR SELECT USING (true);

-- =============================================
-- 🧔 BARBEARIA MASCULINA (42 SERVIÇOS)
-- =============================================

-- CABELO MASCULINO (6)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Cabelo Masculino', 'Corte Masculino', 'Corte clássico masculino', 40.00, 30, '✂️'),
('Cabelo Masculino', 'Corte Social', 'Corte social profissional', 50.00, 40, '💼'),
('Cabelo Masculino', 'Degradê', 'Degradê baixo/médio/alto', 45.00, 40, '💈'),
('Cabelo Masculino', 'Corte Infantil', 'Para crianças até 12 anos', 30.00, 25, '👶'),
('Cabelo Masculino', 'Corte Navalhado', 'Acabamento com navalha', 55.00, 45, '🪒'),
('Cabelo Masculino', 'Corte Afro', 'Especializado cabelo afro', 60.00, 50, '🌀')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- BARBA & BIGODE (5)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Barba', 'Barba Simples', 'Aparar e alinhar', 25.00, 15, '✂️'),
('Barba', 'Barba Completa', 'Barba com acabamento', 35.00, 30, '🧔'),
('Barba', 'Barba Navalhada', 'Com navalha quente', 40.00, 30, '🪒'),
('Barba', 'Aparar Bigode', 'Apenas bigode', 15.00, 10, '✂️'),
('Barba', 'Design de Barba', 'Modelagem personalizada', 45.00, 35, '🎨')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- ACABAMENTO PREMIUM (7)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Acabamento', 'Sobrancelha Masculina', 'Design de sobrancelha', 15.00, 10, '👁️'),
('Acabamento', 'Nariz', 'Depilação nasal', 10.00, 5, '👃'),
('Acabamento', 'Orelha', 'Depilação auricular', 10.00, 5, '👂'),
('Acabamento', 'Acabamento Completo', 'Nariz + Orelha + Sobrancelha', 25.00, 15, '✨'),
('Acabamento', 'Risco', 'Risco no cabelo/barba', 15.00, 10, '⚡'),
('Acabamento', 'Desenho no Cabelo', 'Desenhos artísticos', 25.00, 20, '🎨'),
('Acabamento', 'Depilação de Costas', 'Depilação masculina', 40.00, 30, '💪')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- QUÍMICAS MASCULINAS (7)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Química Masculina', 'Luzes/Mechas', 'Mechas masculinas', 150.00, 90, '✨'),
('Química Masculina', 'Platinado', 'Descoloração completa', 200.00, 120, '⚪'),
('Química Masculina', 'Progressiva Masculina', 'Alisamento', 180.00, 120, '💫'),
('Química Masculina', 'Tintura', 'Coloração total', 60.00, 45, '🎨'),
('Química Masculina', 'Reflexo', 'Tonalizante', 80.00, 60, '🌈'),
('Química Masculina', 'Tintura de Barba', 'Coloração da barba', 40.00, 30, '🖌️'),
('Química Masculina', 'Descoloração de Barba', 'Clareamento', 50.00, 40, '⚪')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- TRATAMENTOS SPA (8)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Tratamentos', 'Hidratação de Barba', 'Tratamento para barba', 35.00, 25, '💧'),
('Tratamentos', 'Massagem Relaxante', 'Massagem no couro cabeludo', 40.00, 30, '💆'),
('Tratamentos', 'Limpeza de Pele', 'Limpeza facial profunda', 80.00, 60, '🧼'),
('Tratamentos', 'Toalha Quente', 'Relaxamento com toalha', 20.00, 15, '🔥'),
('Tratamentos', 'Esfoliação Facial', 'Esfoliação masculina', 50.00, 30, '✨'),
('Tratamentos', 'Máscara Facial', 'Máscara hidratante', 45.00, 25, '😌'),
('Tratamentos', 'Barboterapia', 'Tratamento anti-queda', 100.00, 60, '💉'),
('Tratamentos', 'Cauterização', 'Cauterização capilar', 120.00, 75, '🔬')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- ESTÉTICA FACIAL MASCULINA (5)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Estética Masculina', 'Design de Barba Premium', 'Design profissional', 60.00, 40, '💎'),
('Estética Masculina', 'Pigmentação Capilar', 'Micropigmentação', 120.00, 70, '🖊️'),
('Estética Masculina', 'Pigmentação de Barba', 'Micropigmentação barba', 90.00, 50, '🎨'),
('Estética Masculina', 'Depilação de Peito', 'Depilação peitoral', 35.00, 25, '💪'),
('Estética Masculina', 'Depilação de Ombros', 'Depilação ombros', 30.00, 20, '💪')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- COMBOS MASCULINOS (4)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Combos', 'Corte + Barba', 'Combo econômico', 65.00, 60, '🔥'),
('Combos', 'Pacote VIP', 'Corte + Barba + Hidratação + Massagem', 130.00, 95, '👑'),
('Combos', 'Pacote Premium', 'Serviço completo com toal ha quente', 160.00, 120, '💎'),
('Combos', 'Pacote Noivo', 'Preparação casamento', 200.00, 150, '🤵')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- =============================================
-- 💅 SALÃO DE BELEZA FEMININO (50 SERVIÇOS)
-- =============================================

-- CABELO FEMININO (5)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Cabelo Feminino', 'Corte Feminino', 'Corte com acabamento', 60.00, 45, '✂️'),
('Cabelo Feminino', 'Corte Infantil Feminino', 'Para meninas', 45.00, 35, '👧'),
('Cabelo Feminino', 'Franja', 'Corte de franja', 30.00, 20, '✂️'),
('Cabelo Feminino', 'Repicado', 'Corte repicado', 70.00, 50, '✨'),
('Cabelo Feminino', 'Corte Longo', 'Corte cabelo longo', 80.00, 60, '💇')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- ESCOVA (4)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Escova', 'Escova Simples', 'Escova básica', 50.00, 40, '🌬️'),
('Escova', 'Escova Modelada', 'Escova com modelagem', 65.00, 50, '💫'),
('Escova', 'Chapinha', 'Alisamento com chapinha', 55.00, 45, '🔥'),
('Escova', 'Babyliss', 'Cachos com babyliss', 60.00, 50, '🌀')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- UNHAS (6)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Unhas', 'Manicure', 'Manicure tradicional', 35.00, 40, '💅'),
('Unhas', 'Pedicure', 'Pedicure completo', 40.00, 50, '🦶'),
('Unhas', 'Manicure + Pedicure', 'Combo mãos e pés', 65.00, 90, '💖'),
('Unhas', 'Unhas em Gel', 'Aplicação de gel', 100.00, 90, '✨'),
('Unhas', 'Alongamento de Unhas', 'Alongamento completo', 120.00, 120, '💎'),
('Unhas', 'Unhas Decoradas', 'Nail art', 60.00, 60, '🎨')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

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
('Depilação', 'Corpo Completo', 'Depilação corporal', 150.00, 120, '✨')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- QUÍMICAS FEMININAS (8)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Química Feminina', 'Hidratação', 'Hidratação profunda', 70.00, 50, '💧'),
('Química Feminina', 'Progressiva', 'Alisamento progressivo', 280.00, 180, '💫'),
('Química Feminina', 'Coloração', 'Coloração completa', 180.00, 120, '🎨'),
('Química Feminina', 'Luzes', 'Mechas/Luzes', 200.00, 150, '✨'),
('Química Feminina', 'Ombré Hair', 'Técnica ombré', 280.00, 180, '🌈'),
('Química Feminina', 'Balayage', 'Técnica balayage', 320.00, 200, '🎨'),
('Química Feminina', 'Mechas', 'Mechas tradicionais', 200.00, 150, '✨'),
('Química Feminina', 'Reflexo', 'Tonalizante', 100.00, 60, '🌈')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- PENTEADOS (6)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Penteados', 'Penteado Simples', 'Penteado básico', 80.00, 60, '💐'),
('Penteados', 'Penteado de Festa', 'Para eventos', 120.00, 90, '🎉'),
('Penteados', 'Penteado de Noiva', 'Noiva completo', 250.00, 150, '👰'),
('Penteados', 'Trança', 'Tranças variadas', 60.00, 45, '🌸'),
('Penteados', 'Coque', 'Coque elegante', 70.00, 50, '💐'),
('Penteados', 'Semi-Preso', 'Meio preso', 65.00, 45, '🌺')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- TRATAMENTOS CAPILARES (6)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Tratamentos Capilares', 'Cauterização', 'Cauterização profunda', 130.00, 90, '🔬'),
('Tratamentos Capilares', 'Botox Capilar', 'Botox para fios', 160.00, 100, '💉'),
('Tratamentos Capilares', 'Reconstrução', 'Reconstrução capilar', 110.00, 80, '🔧'),
('Tratamentos Capilares', 'Cronograma Capilar', 'Tratamento completo', 90.00, 70, '📅'),
('Tratamentos Capilares', 'Selagem', 'Selagem térmica', 140.00, 95, '🔐'),
('Tratamentos Capilares', 'Queratina', 'Reposição queratina', 180.00, 120, '💎')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- ESTÉTICA FACIAL (6)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Estética Facial', 'Limpeza de Pele', 'Limpeza facial', 120.00, 75, '🧼'),
('Estética Facial', 'Limpeza Profunda', 'Limpeza completa', 170.00, 100, '✨'),
('Estética Facial', 'Design de Sobrancelha', 'Design profissional', 35.00, 25, '👁️'),
('Estética Facial', 'Henna de Sobrancelha', 'Henna sobrancelha', 40.00, 30, '🎨'),
('Estética Facial', 'Aplicação de Cílios', 'Extensão de cílios', 100.00, 70, '👁️'),
('Estética Facial', 'Maquiagem', 'Make profissional', 80.00, 60, '💄')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- MASSAGENS (3)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Massagens', 'Massagem Relaxante', 'Massagem corporal', 100.00, 60, '💆'),
('Massagens', 'Massagem Modeladora', 'Modeladora', 120.00, 70, '💪'),
('Massagens', 'Drenagem Linfática', 'Drenagem corporal', 140.00, 80, '💧')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- COMBOS FEMININOS (4)
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
('Combos Femininos', 'Corte + Escova', 'Combo cabelo', 100.00, 80, '🔥'),
('Combos Femininos', 'Corte + Hidratação', 'Corte com tratamento', 120.00, 90, '💧'),
('Combos Femininos', 'Pacote Noiva', 'Completo casamento', 450.00, 240, '👰'),
('Combos Femininos', 'Day Spa', 'Dia de beleza', 350.00, 180, '✨')
ON CONFLICT (category, name) DO UPDATE SET
  description = EXCLUDED.description,
  price = EXCLUDED.suggested_price,
  duration_minutes = EXCLUDED.suggested_duration,
  icon = EXCLUDED.icon;

-- =============================================
-- RESUMO:
-- =============================================
-- ✅ 42 Serviços Barbearia
-- ✅ 50 Serviços Salão
-- ✅ Total: 92 Templates
-- 
-- PRÓXIMO PASSO:
-- Vá em /app/catalog/library e MARQUE os serviços!
