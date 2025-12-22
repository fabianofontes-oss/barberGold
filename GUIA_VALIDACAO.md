# 🧪 GUIA DE VALIDAÇÃO - DIA 5

**Objetivo:** Testar tudo end-to-end antes do deploy

---

## 📋 PRÉ-REQUISITOS

### 1. Criar Projeto no Supabase

1. Acessar https://supabase.com
2. Clicar em "New Project"
3. Nome: `barberflow-mvp`
4. Database Password: (escolher senha forte)
5. Region: South America (sao-paulo)
6. Aguardar ~2 minutos (criação do projeto)

---

### 2. Executar Schema SQL

**Arquivo:** `supabase/schema.sql`

**Passos:**
1. No Supabase Dashboard, ir em "SQL Editor"
2. Clicar em "New query"
3. Copiar TODO conteúdo de `supabase/schema.sql`
4. Colar no editor
5. Clicar em "Run" (▶️)
6. Aguardar conclusão (~30 segundos)

**Resultado Esperado:**
```
Success. No rows returned
```

**Tabelas Criadas:**
- ✅ `tenants` - Multi-tenant
- ✅ `profiles` - Usuários
- ✅ `clients` - Clientes
- ✅ `services` - Serviços
- ✅ `products` - Produtos
- ✅ `appointments` - Agendamentos
- ✅ `sales` - Vendas
- ✅ `sale_items` - Itens da venda

---

### 3. Configurar .env.local

**Arquivo:** `.env.local` (criar na raiz do projeto)

```env
# Supabase Config
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key-aqui

# Site Config (opcional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Onde encontrar as chaves:**
1. Supabase Dashboard > Settings > API
2. Copiar "Project URL" → `NEXT_PUBLIC_SUPABASE_URL`
3. Copiar "anon public" → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 4. Criar Tenant e Usuário de Teste

**No SQL Editor, executar:**

```sql
-- 1. Criar tenant
INSERT INTO public.tenants (id, name, slug, plan)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Barbearia Teste',
  'teste',
  'SOLO_PRO'
);

-- 2. Criar usuário no Auth
-- (via Supabase Dashboard > Authentication > Users)
-- Email: teste@barberflow.com
-- Password: senha123

-- 3. Associar user ao tenant
-- Substituir USER_ID pelo ID do usuário criado
INSERT INTO public.profiles (id, tenant_id, email, name, role)
VALUES (
  'USER_ID_AQUI', -- ID do usuário do passo 2
  '00000000-0000-0000-0000-000000000001',
  'teste@barberflow.com',
  'Admin Teste',
  'OWNER'
);
```

---

## 🧪 TESTES FUNCIONAIS

### Teste 1: Auth ✅

**Objetivo:** Verificar autenticação

**Passos:**
1. Rodar projeto: `npm run dev`
2. Acessar: http://localhost:3000/app/dashboard
3. **Deve redirecionar** para `/login` (proteção funcionando!)
4. Fazer login:
   - Email: `teste@barberflow.com`
   - Password: `senha123`
5. **Deve redirecionar** para `/app/dashboard` (auth OK!)

**Resultado Esperado:**
- ✅ Redirect para /login se não autenticado
- ✅ Login funciona
- ✅ Redirect para /dashboard após login
- ✅ Sidebar mostra nome do usuário

**Se falhar:**
- Verificar se `.env.local` está correto
- Verificar se usuário foi criado no Auth
- Verificar console do navegador (F12)

---

### Teste 2: Clients (CRUD Completo) ✅

**Objetivo:** Testar módulo de Clients

#### 2.1 Criar Cliente

**Passos:**
1. Navegar para `/app/clients`
2. Clicar em "Add Client"
3. Preencher:
   - Nome: `João Silva`
   - Telefone: `11999999999`
   - Email: `joao@teste.com`
4. Clicar em "Save Client"

**Resultado Esperado:**
- ✅ Cliente aparece na lista
- ✅ Sem erro no console
- ✅ Cliente salvo no Supabase

**Verificar no Supabase:**
```sql
SELECT * FROM public.clients;
-- Deve aparecer João Silva
```

---

#### 2.2 Listar Clientes

**Passos:**
1. Refresh da página (`F5`)
2. Verificar lista

**Resultado Esperado:**
- ✅ João Silva aparece
- ✅ Dados corretos (nome, telefone)
- ✅ Loading state funciona

---

#### 2.3 Editar Cliente (Notes)

**Passos:**
1. Clicar no card do "João Silva"
2. Ir na tab "Notes"
3. Escrever: `Cliente preferencial`
4. Clicar em "Save Notes"

**Resultado Esperado:**
- ✅ Notes salvas
- ✅ Sem erro no console
- ✅ Modal fecha

**Verificar no Supabase:**
```sql
SELECT name, notes FROM public.clients WHERE name = 'João Silva';
-- notes deve ser 'Cliente preferencial'
```

---

#### 2.4 Buscar Cliente

**Passos:**
1. Na página `/app/clients`
2. Digitar "João" no campo de busca
3. Verificar filtro

**Resultado Esperado:**
- ✅ Apenas "João Silva" aparece
- ✅ Busca é instantânea (client-side)

---

### Teste 3: RLS (Row Level Security) 🔒

**Objetivo:** Verificar isolamento entre tenants

**Passos:**

1. Criar segundo tenant:
```sql
INSERT INTO public.tenants (id, name, slug, plan)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Outra Barbearia',
  'outra',
  'SOLO_BASIC'
);
```

2. Criar cliente para outro tenant:
```sql
INSERT INTO public.clients (tenant_id, name, phone)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'Cliente Outro Tenant',
  '11888888888'
);
```

3. Fazer login como usuário do tenant 1
4. Ir em `/app/clients`

**Resultado Esperado:**
- ✅ NÃO vê "Cliente Outro Tenant"
- ✅ Vê apenas "João Silva" (seu tenant)
- ✅ RLS está funcionando! 🎉

**Se vir clientes de outros tenants:**
- ❌ RLS NÃO está configurado
- Executar policies do `schema.sql`

---

### Teste 4: Appointments (Opcional) ⏸️

**Pré-requisito:** Criar serviço primeiro

```sql
INSERT INTO public.services (tenant_id, name, price, duration_minutes)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Corte Simples',
  50.00,
  30
);
```

**Passos:**
1. Ir em `/app/agenda`
2. Criar appointment (se UI estiver conectada)

**Resultado Esperado:**
- ✅ Appointment criado
- ✅ Aparece no calendário

---

### Teste 5: Sales (Opcional) ⏸️

**Passos:**
1. Ir em `/app/pdv`
2. Processar venda (se UI estiver conectada)

**Resultado Esperado:**
- ✅ Venda processada
- ✅ Commission snapshot salva
- ✅ Client loyalty atualizado

---

## 🐛 TROUBLESHOOTING

### Erro: "Invalid login credentials"

**Causa:** Email/senha incorretos

**Solução:**
1. Verificar no Supabase > Authentication > Users
2. Se não existe, criar usuário
3. Tentar novamente

---

### Erro: "Failed to fetch"

**Causa:** `.env.local` incorreto ou Supabase offline

**Solução:**
1. Verificar `NEXT_PUBLIC_SUPABASE_URL`
2. Verificar `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Testar URL no navegador (deve abrir dashboard do Supabase)

---

### Erro: "No rows returned"

**Causa:** RLS bloqueando query (usuário sem tenant)

**Solução:**
1. Verificar se `profiles` tem entrada para o usuário
2. Verificar se `tenant_id` está correto
3. Executar:
```sql
SELECT * FROM public.profiles WHERE id = 'SEU_USER_ID';
```

---

### Clientes não aparecem

**Causa:** RLS não configurado OU tenant_id errado

**Solução:**
1. Verificar se RLS está habilitado:
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true;
```
2. Se não aparecer `clients`, executar:
```sql
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
```
3. Criar policy:
```sql
CREATE POLICY "Users can only see their tenant's clients"
ON public.clients FOR SELECT
USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));
```

---

## ✅ CHECKLIST FINAL

### Auth
- [ ] Redirect para /login funciona
- [ ] Login funciona
- [ ] Redirect para /dashboard após login
- [ ] Logout funciona
- [ ] Sidebar mostra usuário

### Clients
- [ ] Criar cliente funciona
- [ ] Listar clientes funciona
- [ ] Editar notes funciona
- [ ] Buscar cliente funciona
- [ ] Empty state aparece (sem clientes)
- [ ] Loading state aparece

### RLS
- [ ] NÃO vê clientes de outros tenants
- [ ] Vê apenas clientes do seu tenant

### Performance
- [ ] Carregamento rápido (<1s)
- [ ] Sem erros no console
- [ ] Build passa (`npm run build`)

---

## 🎯 CRITÉRIOS DE SUCESSO

**MVP está pronto para deploy se:**

✅ Todos os testes de Auth passam  
✅ Todos os testes de Clients passam  
✅ RLS está funcionando  
✅ Sem erros no console  
✅ Build passa  

**Se tudo OK:** 🚀 **PRONTO PARA DEPLOY!**

**Próximo passo:** `GUIA_DEPLOY.md`

