-- =============================================
-- FIX: Recursão Infinita nas Políticas RLS
-- =============================================
-- Problema: get_user_tenant_id() consulta profiles, mas as políticas
-- de profiles chamam get_user_tenant_id(), criando loop infinito
--
-- Solução: Reescrever políticas para evitar recursão
-- =============================================

-- 1. Remover políticas antigas que causam recursão
DROP POLICY IF EXISTS "Users can view profiles of their tenant" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles in their tenant" ON public.profiles;
DROP POLICY IF EXISTS "Owners can manage profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage profiles in their tenant" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- 2. Recriar função get_user_tenant_id com bypass de RLS
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID AS $$
DECLARE
  user_tenant_id UUID;
BEGIN
  -- Bypass RLS usando SECURITY DEFINER
  SELECT tenant_id INTO user_tenant_id
  FROM public.profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  RETURN user_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public;

-- 3. Criar políticas RLS sem recursão
-- Política 1: Usuários podem ver seu próprio profile (sem chamar get_user_tenant_id)
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Política 2: Usuários podem ver profiles do mesmo tenant (via JOIN direto)
CREATE POLICY "Users can view profiles in same tenant" 
  ON public.profiles 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT p.tenant_id 
      FROM public.profiles p 
      WHERE p.user_id = auth.uid()
    )
  );

-- Política 3: Usuários podem atualizar apenas seu próprio profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Política 4: Owners podem gerenciar todos os profiles do tenant
CREATE POLICY "Owners can manage tenant profiles" 
  ON public.profiles 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 
      FROM public.tenants t
      WHERE t.id = profiles.tenant_id 
        AND t.owner_id = auth.uid()
    )
  );

-- Política 5: Permitir INSERT para novos usuários (setup inicial)
CREATE POLICY "Users can create own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- 4. Verificar se RLS está ativo
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- =============================================
-- TESTE: Verificar políticas criadas
-- =============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;
