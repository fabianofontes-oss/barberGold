# ⚡ SETUP RÁPIDO - TRANSFORME EM PRODUÇÃO HOJE!

**Tempo estimado:** 3-4 horas  
**Data:** 22/12/2025  

---

## 🎯 BOA NOTÍCIA: 70% JÁ ESTÁ PRONTO!

Você **NÃO precisa** criar arquivos do zero. O sistema já tem:
- ✅ Supabase clients configurados
- ✅ Server Actions implementadas (315 linhas só em clients!)
- ✅ Repositories com CRUD completo
- ✅ Tipos TypeScript
- ✅ Schema SQL completo

**O que falta:** Configurar ambiente + Conectar UI

---

## PASSO 1: Criar Projeto no Supabase (10min)

```bash
1. Acesse: https://supabase.com/dashboard
2. Clique em "New Project"
3. Nome: barberflow-dev
4. Região: South America (São Paulo)
5. Database Password: [GERAR SENHA FORTE - SALVAR!]
6. Aguarde ~2min
```

**Copie as credenciais:**
- Project URL: `https://xxxxx.supabase.co`
- anon/public key: `eyJhbGci...`

---

## PASSO 2: Configurar Variáveis de Ambiente (2min)

Crie arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_APP_MODE=pilot
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:** Use suas credenciais do Supabase!

---

## PASSO 3: Executar Schema SQL (15min)

```bash
1. Supabase Dashboard > SQL Editor
2. Abrir arquivo: supabase/schema-complete.sql
3. Copiar TODO o conteúdo
4. Colar no editor
5. Clicar em "Run"
6. Verificar mensagem: "Success. No rows returned"
```

**Verificar tabelas criadas:**
- Database > Tables
- Deve ter: tenants, profiles, clients, services, products, appointments, sales, sale_items

---

## PASSO 4: Criar Usuário de Teste (10min)

### A) Criar usuário no Auth

```bash
Supabase Dashboard > Authentication > Users
Clicar em "Add user" > "Create new user"

Email: teste@barberflow.com
Password: Teste@123456
✓ Auto Confirm User (marcar)

Clicar "Create user"
Copiar User ID (UUID)
```

### B) Criar tenant e profile (SQL)

```sql
-- SQL Editor > New Query

-- 1. Criar tenant
INSERT INTO public.tenants (id, name, slug, owner_id, plan_id, status)
VALUES (
  gen_random_uuid(),
  'Barbearia Teste',
  'barbearia-teste',
  '[COLAR USER ID AQUI]',
  'FREE',
  'TRIAL'
)
RETURNING id;

-- Copiar o ID retornado!

-- 2. Criar profile
INSERT INTO public.profiles (tenant_id, user_id, name, email, role)
VALUES (
  '[COLAR TENANT ID AQUI]',
  '[COLAR USER ID AQUI]',
  'Usuário Teste',
  'teste@barberflow.com',
  'OWNER'
);

-- Executar
```

---

## PASSO 5: Testar Conexão (5min)

```bash
# Reiniciar servidor
npm run dev

# Abrir navegador
http://localhost:3000

# Abrir DevTools (F12) > Console
# NÃO deve ter erro de "env vars inválidas"
```

---

## PASSO 6: Conectar UI de Clientes (1h)

### A) Modificar página de clientes

Arquivo: `src/modules/clients/Clients.tsx`

**Substituir importação do Context por Server Actions:**

```typescript
// ❌ ANTES (Context antigo)
import { useBarber } from '@/context/BarberContext';
const { clients, addClient, updateClient } = useBarber();

// ✅ DEPOIS (Server Actions)
import { 
  listClientsAction, 
  createClientAction, 
  updateClientAction, 
  deleteClientAction 
} from './actions';
import { useState, useEffect } from 'react';

// Estado local
const [clients, setClients] = useState<Client[]>([]);
const [loading, setLoading] = useState(true);

// Carregar clientes
useEffect(() => {
  loadClients();
}, []);

async function loadClients() {
  setLoading(true);
  const result = await listClientsAction();
  if (result.success) {
    setClients(result.data.data);
  }
  setLoading(false);
}
```

### B) Modificar funções de CRUD

```typescript
// Criar cliente
async function handleCreateClient(data: CreateClientInput) {
  const result = await createClientAction(data);
  if (result.success) {
    await loadClients(); // Recarrega lista
    // TODO: Mostrar toast de sucesso
  } else {
    // TODO: Mostrar toast de erro
    console.error(result.error);
  }
}

// Atualizar cliente
async function handleUpdateClient(id: string, data: UpdateClientInput) {
  const result = await updateClientAction(id, data);
  if (result.success) {
    await loadClients();
  } else {
    console.error(result.error);
  }
}

// Deletar cliente
async function handleDeleteClient(id: string) {
  if (!confirm('Tem certeza que deseja excluir?')) return;
  
  const result = await deleteClientAction(id);
  if (result.success) {
    await loadClients();
  } else {
    console.error(result.error);
  }
}
```

### C) Adicionar 'use client' no topo do arquivo

```typescript
'use client';

import { useState, useEffect } from 'react';
import { listClientsAction, ... } from './actions';
// ... resto do código
```

---

## PASSO 7: Testar CRUD Completo (30min)

### A) Criar cliente

```bash
1. Ir em /app/clients
2. Clicar "Novo Cliente"
3. Preencher:
   - Nome: João Silva
   - Telefone: (11) 98765-4321
   - Email: joao@email.com
4. Salvar
5. Cliente deve aparecer na lista
```

### B) Verificar no Supabase

```bash
Supabase > Database > Table Editor > clients
Deve aparecer o cliente criado
tenant_id deve estar preenchido
```

### C) Editar cliente

```bash
1. Clicar no cliente
2. Editar notas: "Cliente VIP"
3. Salvar
4. Verificar mudança
```

### D) Buscar cliente

```bash
1. Digitar "João" no campo de busca
2. Deve filtrar e mostrar apenas esse cliente
```

### E) Refresh da página (F5)

```bash
Cliente deve continuar aparecendo
Dados devem persistir (não é mais localStorage!)
```

---

## PASSO 8: Autenticação Real (1h)

### A) Modificar Login

Arquivo: `src/modules/auth/Login.tsx`

```typescript
'use client';

import { useState } from 'react';
import { signInWithPasswordAction } from './actions';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await signInWithPasswordAction(email, password);
      
      if (!result.success) {
        setError(result.error || 'Erro ao fazer login');
        return;
      }
      
      // Redirecionar para dashboard
      window.location.href = '/app/dashboard';
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* ... resto do form */}
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
```

### B) Criar callback route

Arquivo: `src/app/auth/callback/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/app/dashboard', request.url))
}
```

### C) Configurar Supabase Auth

```bash
Supabase Dashboard > Authentication > URL Configuration

Site URL: http://localhost:3000

Redirect URLs:
- http://localhost:3000/auth/callback
- http://localhost:3000/**
```

### D) Testar login

```bash
1. Ir em /login
2. Email: teste@barberflow.com
3. Password: Teste@123456
4. Clicar "Entrar"
5. Deve redirecionar para /app/dashboard
6. Verificar nome do usuário na Sidebar
```

---

## PASSO 9: Conectar Appointments e Sales (2h)

Seguir mesmo padrão do módulo Clients:
1. Importar Server Actions
2. Usar useState + useEffect
3. Criar funções de CRUD
4. Testar cada operação

**Arquivos a modificar:**
- `src/modules/agenda/Agenda.tsx`
- `src/modules/pdv/PointOfSale.tsx`

---

## PASSO 10: Melhorias de UX (30min)

### A) Adicionar loading states

```typescript
{loading ? (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
  </div>
) : (
  // ... conteúdo
)}
```

### B) Adicionar toasts (opcional)

```bash
npm install sonner

# Em layout.tsx
import { Toaster } from 'sonner'

<body>
  <Toaster position="top-right" />
  {children}
</body>

# Nas páginas
import { toast } from 'sonner'

toast.success('Cliente criado com sucesso!')
toast.error('Erro ao criar cliente')
```

---

## ✅ CHECKLIST FINAL

### Ambiente
- [ ] Projeto criado no Supabase
- [ ] .env.local configurado
- [ ] Schema SQL executado
- [ ] Usuário de teste criado
- [ ] Conexão testada (sem erros no console)

### Funcionalidades
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Clientes: CRUD completo
- [ ] Appointments: CRUD completo
- [ ] Sales: CRUD completo
- [ ] Dados persistem no Supabase
- [ ] Multi-tenancy funcionando (RLS)

### UX
- [ ] Loading states em todas as páginas
- [ ] Error handling consistente
- [ ] Toast notifications
- [ ] Validação de forms

---

## 🎯 PRIORIDADES DE HOJE

### Manhã (4h)
1. ✅ Setup Supabase (30min)
2. ✅ Conectar UI Clientes (1h30)
3. ✅ Autenticação real (1h)
4. ✅ Testar e corrigir bugs (1h)

### Tarde (3h)
5. ✅ Conectar Appointments (1h30)
6. ✅ Conectar Sales (1h)
7. ✅ Melhorias de UX (30min)

---

## 🚨 TROUBLESHOOTING RÁPIDO

### Erro: "Variáveis de ambiente inválidas"
```bash
# Verificar .env.local existe na raiz
# Verificar valores corretos
# Reiniciar servidor: Ctrl+C, npm run dev
```

### Erro: "Failed to fetch"
```bash
# Verificar NEXT_PUBLIC_SUPABASE_URL está correta
# Verificar NEXT_PUBLIC_SUPABASE_ANON_KEY está correta
# Verificar internet
# Verificar projeto Supabase está ativo
```

### Erro: "RLS policy violation"
```bash
# Verificar usuário está autenticado
# Verificar tenant_id está sendo passado
# SQL Editor: SELECT * FROM auth.users();
# Verificar RLS policies no Supabase
```

### Erro de TypeScript
```bash
# Verificar imports corretos
# Verificar tipos estão alinhados
# Usar optional chaining: data?.field
# Adicionar 'use client' se usa hooks
```

---

## 💡 DICAS IMPORTANTES

1. **Sempre use try/catch** em funções assíncronas
2. **Sempre use optional chaining** (data?.field)
3. **Adicione console.logs** para debug
4. **Teste cada feature** antes de passar para a próxima
5. **Commit frequente** (a cada feature funcionando)

---

## 📞 SE PRECISAR DE AJUDA

**Documentação completa:**
- `PLANO_ACAO_IMEDIATO.md` - Guia de 5 sprints
- `AUDITORIA_COMPLETA_DEZ2025.md` - Análise técnica
- `RESUMO_EXECUTIVO_AUDITORIA.md` - Visão geral

**Recursos:**
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- Console do navegador (F12)

---

**🚀 BORA COMEÇAR! Você vai terminar hoje!**

**Próximo passo:** Criar projeto no Supabase (10 minutos)



