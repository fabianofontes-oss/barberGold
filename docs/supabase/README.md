# Supabase Setup - BarberFlow

Guia para configurar o banco de dados Supabase para o BarberFlow.

---

## Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Projeto criado (ou criar um novo)
3. Acesso ao **SQL Editor** do dashboard

---

## 1. Executar o Schema

### Passos:

1. Acesse o **Supabase Dashboard** → Seu Projeto
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New Query**
4. Abra o arquivo `supabase/schema-complete.sql` do repositório
5. **Copie todo o conteúdo** e cole no SQL Editor
6. Clique em **Run** (ou Ctrl+Enter)

### Verificação:

Após executar, vá em **Table Editor** e confirme que as tabelas foram criadas:
- `tenants`
- `profiles`
- `clients`
- `appointments`
- `sales`
- `saas_plans` (deve ter 6 registros: FREE, SOLO, SOLO_PRO, EQUIPE, STUDIO, ENTERPRISE)

---

## 2. Criar Usuário Auth (Email/Senha)

### Via Dashboard:

1. Vá em **Authentication** → **Users**
2. Clique em **Add User** → **Create New User**
3. Preencha:
   - **Email:** seu-email@exemplo.com
   - **Password:** (mínimo 6 caracteres)
   - ✅ **Auto Confirm User** (marcar para pular verificação de email)
4. Clique em **Create User**
5. **COPIE O UUID** do usuário criado (coluna `id`)

### Via SQL (alternativa):

```sql
-- Não recomendado para produção, use apenas para testes
-- O Auth do Supabase gerencia usuários automaticamente
```

---

## 3. Seedar Tenant + Profile

Após criar o usuário Auth, você precisa criar o Tenant (barbearia) e o Profile (vínculo usuário-tenant).

### Passos:

1. Abra o arquivo `supabase/seed/p0_pilot_seed.sql`
2. **Substitua os placeholders**:
   - `<UUID_DO_AUTH_USER>` → UUID copiado no passo anterior
   - `<NOME_DA_BARBEARIA>` → Nome da sua barbearia
   - `<SEU_NOME>` → Seu nome
   - `<SEU_EMAIL>` → Seu email
3. Execute no SQL Editor

---

## 4. Obter Credenciais para .env

1. Vá em **Project Settings** → **API**
2. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Exemplo de .env.local:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_MODE=pilot
```

---

## Troubleshooting

### Erro "permission denied for table"
- Verifique se o RLS está habilitado e as policies foram criadas
- Execute novamente o schema completo

### Erro "duplicate key value"
- O schema já foi executado antes
- Use `supabase/migration-reset.sql` para limpar e re-executar

### Usuário não consegue ver dados
- Verifique se existe um registro em `profiles` vinculando o `user_id` ao `tenant_id`
- O RLS usa `get_user_tenant_id()` que depende dessa tabela

---

## Próximos Passos

Após configurar:

1. Inicie o app: `npm run dev`
2. Acesse `/login`
3. Faça login com o usuário criado
4. Se não houver profile, você será redirecionado para `/app/setup`

---

*Última atualização: Dezembro 2024*
