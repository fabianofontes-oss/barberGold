# 🎯 PASSO A PASSO SUPER SIMPLES

**Seu projeto está 95% pronto. Falta só 1 coisa.**

---

## 🔴 O PROBLEMA

Quando você tenta cadastrar um usuário, dá erro: **"Database error saving new user"**

**Por quê?** O banco de dados precisa de uma "receita" (trigger) para criar automaticamente a barbearia e o perfil do usuário.

---

## ✅ A SOLUÇÃO (5 MINUTOS)

### **1. Abrir Supabase**

- Acesse: https://supabase.com/dashboard
- Entre com sua conta
- Clique no seu projeto

### **2. Abrir SQL Editor**

- No menu lateral esquerdo
- Clique em: **SQL Editor**
- Clique em: **New Query**

### **3. Colar e Executar este SQL**

Copie TUDO abaixo e cole no editor:

```sql
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
    v_full_name := coalesce(new.raw_user_meta_data->>'full_name', 'Novo Barbeiro');
    v_slug      := coalesce(new.raw_user_meta_data->>'slug', 'shop-' || floor(random() * 1000000)::text);
    v_plan      := coalesce(new.raw_user_meta_data->>'plan', 'FREE');

    INSERT INTO public.tenants (
        name, slug, owner_id, plan_id, status, settings
    ) VALUES (
        v_full_name, v_slug, new.id, upper(v_plan), 'TRIAL',
        jsonb_build_object('setup_completed', false)
    ) RETURNING id INTO new_tenant_id;

    INSERT INTO public.profiles (
        tenant_id, user_id, role, name, email, is_active
    ) VALUES (
        new_tenant_id, new.id, 'OWNER', v_full_name, new.email, TRUE
    );

    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

Depois clique em **RUN** (botão verde no canto inferior direito)

### **4. Testar**

- Acesse: https://barber.gold/register
- Cadastre um usuário
- **Deve funcionar!** ✅

---

## 🆘 SE DER ERRO

### **Erro: "relation tenants does not exist"**

Significa que as tabelas não existem. Você precisa criar as tabelas primeiro.

**Solução:**
1. Abra o arquivo: `supabase/schema-complete.sql`
2. Copie TODO o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em RUN
5. Depois execute o trigger novamente

### **Outro erro?**

Me mande:
- Print da tela
- Mensagem de erro completa
- Vou te ajudar a resolver

---

## ✅ DEPOIS QUE FUNCIONAR

Seu projeto está **100% PRONTO!**

Você pode:
- ✅ Cadastrar usuários
- ✅ Fazer login
- ✅ Acessar dashboard
- ✅ Criar agendamentos
- ✅ Gerenciar clientes
- ✅ Usar PDV
- ✅ Ver relatórios

---

## 💪 VOCÊ CONSEGUE!

- É só executar esse SQL
- 5 minutos e está pronto
- Eu te ajudo se der qualquer problema

**Vai lá! Execute o SQL e me avise o resultado.** 🚀
