-- 📚 BIBLIOTECA DE SERVIÇOS - Templates Globais

-- Criar tabela de templates (se não existir)
CREATE TABLE IF NOT EXISTS service_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  suggested_price NUMERIC DEFAULT 0,
  suggested_duration INTEGER DEFAULT 30,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Popular com catálogo completo de barbearia
INSERT INTO service_templates (category, name, description, suggested_price, suggested_duration, icon) VALUES
-- CORTES
('Cortes', 'Corte Social', 'Corte social clássico masculino', 40.00, 30, '✂️'),
('Cortes', 'Corte Degradê', 'Degradê baixo/médio/alto', 45.00, 35, '✂️'),
('Cortes', 'Corte Navalhado', 'Acabamento com navalha', 50.00, 40, '🔪'),
('Cortes', 'Corte Infantil', 'Corte para crianças até 12 anos', 30.00, 25, '👶'),
('Cortes', 'Corte + Barba', 'Combo completo', 70.00, 60, '✂️'),
('Cortes', 'Corte Afro', 'Especializado em cabelo afro', 55.00, 45, '✂️'),

-- BARBA
('Barba', 'Barba Completa', 'Aparar, alinhar e finalizar', 35.00, 25, '🧔'),
('Barba', 'Barba Navalhada', 'Acabamento com navalha quente', 45.00, 30, '🔥'),
('Barba', 'Barba Express', 'Alinhamento rápido', 25.00, 15, '⚡'),
('Barba', 'Design de Barba', 'Modelagem e design', 40.00, 25, '✨'),
('Barba', 'Sobrancelha', 'Design de sobrancelha masculina', 20.00, 15, '👁️'),

-- COLORAÇÃO
('Coloração', 'Platinado', 'Descoloração completa', 150.00, 120, '⭐'),
('Coloração', 'Luzes', 'Mechas/Luzes', 120.00, 90, '✨'),
('Coloração', 'Pigmentação Barba', 'Coloração de barba', 80.00, 45, '🎨'),
('Coloração', 'Pigmentação Cabelo', 'Coloração completa', 100.00, 60, '🎨'),
('Coloração', 'Reflexo', 'Reflexo/Tonalizante', 90.00, 50, '💫'),

-- TRATAMENTOS
('Tratamentos', 'Relaxamento', 'Relaxamento capilar', 80.00, 60, '💆'),
('Tratamentos', 'Hidratação', 'Tratamento hidratante', 60.00, 45, '💧'),
('Tratamentos', 'Botox Capilar', 'Tratamento intensivo', 120.00, 90, '💉'),
('Tratamentos', 'Progressiva', 'Escova progressiva', 200.00, 180, '🔥'),
('Tratamentos', 'Reconstrução', 'Reconstrução capilar', 100.00, 75, '🔧'),

-- EXTRAS
('Extras', 'Desenho Artístico', 'Desenhos na nuca/lateral', 40.00, 20, '🎨'),
('Extras', 'Limpeza de Pele', 'Limpeza facial masculina', 70.00, 40, '✨'),
('Extras', 'Massagem Relaxante', 'Massagem no couro cabeludo', 30.00, 20, '💆'),
('Extras', 'Depilação Nariz/Orelha', 'Remoção de pelos internos', 15.00, 10, '👃');

-- Habilitar RLS
ALTER TABLE service_templates ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem LER templates (são globais)
CREATE POLICY "templates_select_public"
ON service_templates FOR SELECT
TO authenticated
USING (true);
