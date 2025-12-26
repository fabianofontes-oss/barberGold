# 🔧 CORREÇÃO DO ERRO DE CADASTRO

**Erro:** "Database error saving new user"

---

## 🐛 CAUSA RAIZ

O trigger `handle_new_user()` no Supabase está falhando ao criar automaticamente o tenant e profile após o signup.

**Possíveis causas:**
1. ❌ Trigger não está instalado no Supabase
2. ❌ Tabelas `tenants` ou `profiles` não existem
3. ❌ RLS (Row Level Security) bloqueando a inserção
4. ❌ Slug duplicado ou constraint violada
5. ❌ Permissões insuficientes

---

## ✅ SOLUÇÃO 1: VERIFICAR E INSTALAR TRIGGER

### **Passo 1: Acessar Supabase SQL Editor**

1. Acesse: https://supabase.com/dashboard/project/yitrspfqpakpygfytduz
2. Vá em: **SQL Editor**

### **Passo 2: Executar SQL do Trigger**

Copie e execute o SQL abaixo:

```sql
-- ===============================================================
-- BARBERGOLD - TRIGGER DE AUTOMAÇÃO DE NOVO USUÁRIO
-- ===============================================================

-- 1. Cria ou atualiza a função
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_tenant_id uuid;
    v_full_name text;
    v_slug text;
    v_plan text;
BEGIN
    -- Extrai metadados do signup
    v_full_name := coalesce(new.raw_user_meta_data->>'full_name', 'Novo Barbeiro');
    v_slug      := coalesce(new.raw_user_meta_data->>'slug', 'shop-' || floor(random() * 1000000)::text);
    v_plan      := coalesce(new.raw_user_meta_data->>'plan', 'FREE');

    -- Log
    RAISE NOTICE 'Criando tenant para usuário: %, slug: %', new.id, v_slug;

    -- Criar Tenant
    INSERT INTO public.tenants (
        name,
        slug,
        owner_id,
        plan_id,
        status,
        settings
    ) VALUES (
        v_full_name,
        v_slug,
        new.id,
        upper(v_plan),
        'TRIAL',
        jsonb_build_object('setup_completed', false)
    )
    RETURNING id INTO new_tenant_id;

    -- Criar Profile
    INSERT INTO public.profiles (
        tenant_id,
        user_id,
        role,
        name,
        email,
        is_active
    ) VALUES (
        new_tenant_id,
        new.id,
        'OWNER',
        v_full_name,
        new.email,
        TRUE
    );

    RETURN new;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Erro ao configurar barbearia: %', SQLERRM;
END;
$$;

-- 2. Criar Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### **Passo 3: Verificar se Funcionou**

Execute para verificar:

```sql
-- Verificar se o trigger existe
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Verificar se a função existe
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
```

---

## ✅ SOLUÇÃO 2: REMOVER TRIGGER E USAR FLUXO MANUAL

Se o trigger continuar falhando, podemos usar o fluxo manual via `/app/setup`.

### **Modificar Register para Não Depender do Trigger**

O cadastro já redireciona para `/app/setup`, onde o usuário cria o tenant manualmente.

**Fluxo:**
1. Usuário preenche cadastro
2. Supabase cria apenas o `auth.user`
3. Redireciona para `/app/setup`
4. Usuário preenche dados da barbearia
5. Server Action `createTenantAndProfile()` cria tenant e profile

**Vantagem:** Mais controle e menos dependência de triggers.

---

## ✅ SOLUÇÃO 3: DESABILITAR CONFIRMAÇÃO DE EMAIL

Se o problema for confirmação de email:

### **Supabase Dashboard:**

1. Acesse: **Authentication → Email Templates**
2. Vá em: **Settings → Email Auth**
3. Desabilite: **"Enable email confirmations"**

Isso permite que o usuário faça login imediatamente após o cadastro.

---

## 🧪 TESTAR CADASTRO

### **Teste 1: Cadastro Normal**

1. Acesse: `https://barber.gold/register`
2. Preencha:
   - Nome: Teste
   - Email: teste@teste.com
   - Senha: 123456
3. Clique: "Criar Conta"
4. **Esperado:** Redireciona para `/app/setup` ou `/app/dashboard`

### **Teste 2: Verificar Logs do Supabase**

1. Acesse: **Logs → Postgres Logs**
2. Procure por: `"Criando tenant para usuário"`
3. Se aparecer erro, copie a mensagem

### **Teste 3: Verificar Dados Criados**

```sql
-- Ver usuários criados
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Ver tenants criados
SELECT * FROM public.tenants ORDER BY created_at DESC LIMIT 5;

-- Ver profiles criados
SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 5;
```

---

## 🔍 DEBUG: IDENTIFICAR ERRO ESPECÍFICO

### **Ver Logs do Trigger:**

```sql
-- Habilitar logs detalhados
SET client_min_messages TO NOTICE;

-- Tentar inserir usuário manualmente (teste)
-- Isso vai mostrar o erro exato do trigger
```

### **Erros Comuns:**

| Erro | Causa | Solução |
|------|-------|---------|
| `relation "tenants" does not exist` | Tabela não existe | Executar migration completa |
| `duplicate key value violates unique constraint` | Slug duplicado | Gerar slug único |
| `permission denied for table tenants` | RLS bloqueando | Ajustar políticas RLS |
| `function handle_new_user() does not exist` | Trigger não instalado | Executar SQL do trigger |

---

## 🚀 RECOMENDAÇÃO

**Use SOLUÇÃO 2 (Fluxo Manual)** porque:
- ✅ Mais confiável
- ✅ Melhor UX (usuário preenche dados da barbearia)
- ✅ Menos dependência de triggers
- ✅ Mais fácil de debugar

**Desabilite o trigger** e deixe o fluxo natural:
```
/register → /app/setup → /app/dashboard
```

---

## 📋 CHECKLIST

- [ ] Verificar se trigger está instalado
- [ ] Verificar se tabelas existem
- [ ] Verificar logs do Supabase
- [ ] Testar cadastro novamente
- [ ] Se falhar, usar fluxo manual (SOLUÇÃO 2)
- [ ] Desabilitar confirmação de email (opcional)

---

**Próximo passo:** Verificar Supabase e aplicar uma das soluções acima.
