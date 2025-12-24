-- =============================================
-- DADOS DE TESTE PARA O MVP
-- Execute APÓS criar as tabelas e APÓS fazer login
-- =============================================

-- Inserir loja de teste (substitua o USER_ID pelo seu ID real após login)
INSERT INTO public.stores (id, name, owner_id, plan_id, status) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Barbearia Premium',
  (SELECT id FROM auth.users WHERE email = 'admin@barbergold.com'),
  'SOLO_PRO',
  'ACTIVE'
);

-- Inserir funcionários
INSERT INTO public.staff (store_id, name, role, email, commission_model, service_commission_rate) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'João Silva', 'OWNER', 'joao@barbergold.com', 'OWNER', 100),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Pedro Santos', 'BARBER', 'pedro@barbergold.com', 'PERCENTAGE', 50),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Carlos Oliveira', 'BARBER', 'carlos@barbergold.com', 'PERCENTAGE', 40);

-- Inserir serviços
INSERT INTO public.services (store_id, name, price, duration_minutes, category) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Corte Tradicional', 35.00, 30, 'Corte'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Corte + Barba', 55.00, 45, 'Combo'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Barba Completa', 25.00, 20, 'Barba'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Hidratação Capilar', 40.00, 30, 'Tratamento'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Platinado', 120.00, 90, 'Coloração');

-- Inserir alguns clientes
INSERT INTO public.clients (store_id, name, phone, email) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Rafael Costa', '(11) 98765-4321', 'rafael@gmail.com'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lucas Mendes', '(11) 91234-5678', 'lucas@gmail.com'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Matheus Lima', '(11) 95555-5555', 'matheus@gmail.com'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Gabriel Souza', '(11) 94444-4444', 'gabriel@gmail.com'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Fernando Alves', '(11) 93333-3333', 'fernando@gmail.com');
