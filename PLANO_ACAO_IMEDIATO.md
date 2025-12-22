# ⚡ PLANO DE AÇÃO IMEDIATO - BARBER.GOLD

**Data:** 22 de Dezembro de 2025  
**Objetivo:** Transformar o MVP demo em MVP produção  
**Prazo:** 5 semanas (200h)  

---

## 🎯 SPRINT 1: FUNDAÇÃO (Semana 1)

### DIA 1: Setup Supabase (4h)

#### Manhã (2h)
```bash
# 1. Criar projeto no Supabase
# - Acessar: https://supabase.com/dashboard
# - Clicar em "New Project"
# - Nome: barberflow-prod
# - Região: South America (São Paulo)
# - Database Password: [GERAR SENHA FORTE]
# - Aguardar ~2min (criação do banco)

# 2. Copiar credenciais
# - Project URL: https://xxxxx.supabase.co
# - anon/public key: eyJhbGci...
# - Salvar em local seguro (1Password, Bitwarden, etc)
```

#### Tarde (2h)
```bash
# 3. Executar Schema SQL
# - Supabase Dashboard > SQL Editor
# - Abrir arquivo: supabase/schema-complete.sql
# - Copiar todo o conteúdo
# - Colar no editor
# - Clicar em "Run"
# - Verificar: "Success. No rows returned"

# 4. Verificar tabelas criadas
# - Ir em: Database > Tables
# - Deve ter 8 tabelas:
#   ✓ tenants
#   ✓ profiles
#   ✓ clients
#   ✓ services
#   ✓ products
#   ✓ appointments
#   ✓ sales
#   ✓ sale_items

# 5. Executar seed (dados de teste)
# - SQL Editor > New Query
# - Abrir: supabase/seed/p0_pilot_seed.sql
# - Executar
```

### DIA 2: Configurar Ambiente (4h)

#### Manhã (2h)
```bash
# 1. Criar .env.local
cd D:\projetos\PediuFood\barberGold

# Criar arquivo .env.local com:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_APP_MODE=pilot
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 2. Testar conexão
npm run dev

# Abrir navegador: http://localhost:3000
# Abrir DevTools (F12) > Console
# Não deve ter erros de "env vars inválidas"
```

#### Tarde (2h)
```bash
# 3. Criar usuário de teste
# Supabase Dashboard > Authentication > Users
# Clicar em "Add user" > "Create new user"
# Email: teste@barberflow.com
# Password: Teste@123
# Auto Confirm User: ✓ (marcar)
# Clicar em "Create user"
# Copiar User ID (UUID)

# 4. Associar usuário ao tenant
# SQL Editor > New Query
INSERT INTO public.tenants (id, name, slug, owner_id, plan_id, status)
VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  'Barbearia Teste',
  'barbearia-teste',
  '[COLAR USER ID AQUI]',
  'FREE',
  'TRIAL'
);

INSERT INTO public.profiles (tenant_id, user_id, name, email, role)
VALUES (
  'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  '[COLAR USER ID AQUI]',
  'Usuário Teste',
  'teste@barberflow.com',
  'OWNER'
);

# Executar
```

### DIA 3: Autenticação Real (8h)

#### Manhã (4h)
```typescript
// 1. Atualizar src/modules/auth/Login.tsx

// ANTES (linha 19):
const success = login(email, password);

// DEPOIS:
import { signInWithPasswordAction } from './actions';

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
```

#### Tarde (4h)
```typescript
// 2. Criar callback route
// Criar arquivo: src/app/auth/callback/route.ts

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

// 3. Atualizar Supabase Auth URLs
// Supabase Dashboard > Authentication > URL Configuration
// Site URL: http://localhost:3000
// Redirect URLs:
//   - http://localhost:3000/auth/callback
//   - http://localhost:3000/**
```

### DIA 4: Testar Auth (4h)

```bash
# 1. Rodar projeto
npm run dev

# 2. Acessar http://localhost:3000/login

# 3. Fazer login com:
# Email: teste@barberflow.com
# Password: Teste@123

# 4. Verificar:
# ✓ Redireciona para /app/dashboard
# ✓ Sidebar mostra nome do usuário
# ✓ Console sem erros
# ✓ Botão "Sair" funciona

# 5. Testar logout:
# - Clicar em "Sair"
# - Deve redirecionar para /
# - Tentar acessar /app/dashboard
# - Deve redirecionar para /login
```

### DIA 5: Conectar Módulo Clients (8h)

#### Manhã (4h)
```typescript
// 1. Atualizar src/modules/clients/Clients.tsx

// ANTES (usa BarberContext):
const { clients, addClient, updateClient } = useBarber();

// DEPOIS (usa Server Actions):
import { listClientsAction, addClientAction, updateClientAction } from './actions';
import { useEffect, useState } from 'react';

const [clients, setClients] = useState<Client[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadClients();
}, []);

async function loadClients() {
  setLoading(true);
  const result = await listClientsAction();
  if (result.success) {
    setClients(result.data || []);
  }
  setLoading(false);
}

async function handleAddClient(data: CreateClientInput) {
  const result = await addClientAction(data);
  if (result.success) {
    await loadClients(); // Recarrega lista
  }
  return result;
}
```

#### Tarde (4h)
```bash
# 2. Testar CRUD completo

# Criar cliente:
# - Nome: João Silva
# - Telefone: (11) 98765-4321
# - Email: joao@email.com
# - Salvar

# Verificar no Supabase:
# - Database > Table Editor > clients
# - Deve aparecer o cliente criado
# - tenant_id deve estar preenchido

# Editar cliente:
# - Adicionar nota: "Cliente VIP"
# - Salvar
# - Verificar atualização no banco

# Buscar cliente:
# - Digitar "João" no campo de busca
# - Deve filtrar e mostrar o cliente

# Refresh da página (F5):
# - Cliente deve continuar aparecendo
# - Dados devem persistir
```

---

## 🎯 SPRINT 2: CORE BUSINESS (Semana 2)

### DIA 1-2: Appointments (16h)

```typescript
// 1. Criar src/modules/appointments/actions.ts

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/auth/getCurrentProfile';
import * as repo from './repository';
import { CreateAppointmentInput, UpdateAppointmentInput } from './types';

export async function listAppointmentsAction(filters = {}) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return { success: false, error: 'Não autenticado' };
    }

    const supabase = await createClient();
    const result = await repo.listAppointments(supabase, filters);

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createAppointmentAction(input: CreateAppointmentInput) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return { success: false, error: 'Não autenticado' };
    }

    const supabase = await createClient();
    const appointment = await repo.createAppointment(supabase, input);

    revalidatePath('/app/agenda');
    return { success: true, data: appointment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ... outras actions
```

```typescript
// 2. Atualizar src/modules/agenda/Agenda.tsx

// Substituir useBarber por Server Actions
import { listAppointmentsAction, createAppointmentAction } from '@/modules/appointments/actions';
```

### DIA 3-4: Sales (16h)

```typescript
// 1. Criar src/modules/sales/actions.ts
// (Similar ao appointments)

// 2. Atualizar src/modules/pdv/PointOfSale.tsx
// Conectar ao Supabase
```

### DIA 5: Testes e Bugs (8h)

```bash
# Fluxo completo:
1. Criar cliente
2. Agendar serviço
3. Fazer check-in
4. Finalizar atendimento
5. Registrar venda no PDV
6. Verificar comissão calculada
7. Verificar histórico do cliente

# Verificar no Supabase:
- clients ✓
- appointments ✓
- sales ✓
- sale_items ✓
```

---

## 🎯 SPRINT 3: CATÁLOGO (Semana 3)

### DIA 1-2: Services e Products (16h)

```typescript
// 1. Criar src/modules/services/repository.ts
// 2. Criar src/modules/services/actions.ts
// 3. Criar src/modules/products/repository.ts
// 4. Criar src/modules/products/actions.ts
// 5. Atualizar src/modules/catalog/Catalog.tsx
```

### DIA 3-4: Staff (16h)

```typescript
// 1. Criar src/modules/staff/repository.ts
// 2. Criar src/modules/staff/actions.ts
// 3. Atualizar src/modules/settings/Settings.tsx
```

### DIA 5: Multi-tenancy (8h)

```bash
# Testar isolamento de dados:

# 1. Criar segundo tenant
INSERT INTO tenants (id, name, slug, owner_id)
VALUES (
  'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
  'Barbearia 2',
  'barbearia-2',
  '[OUTRO USER ID]'
);

# 2. Criar cliente para tenant 2
INSERT INTO clients (tenant_id, name, phone)
VALUES (
  'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
  'Cliente Tenant 2',
  '(11) 99999-9999'
);

# 3. Login como tenant 1
# 4. Ir em /app/clients
# 5. NÃO deve ver cliente do tenant 2
# 6. Verificar RLS funcionando
```

---

## 🎯 SPRINT 4: FINANCE (Semana 4)

### DIA 1-2: Comissões (16h)

```typescript
// 1. Criar src/modules/commissions/repository.ts
// 2. Criar src/modules/commissions/actions.ts
// 3. Atualizar src/modules/finance/Finance.tsx
// 4. Testar cálculos de comissão
```

### DIA 3-4: Testes de Carga (16h)

```bash
# 1. Criar 100 clientes
# 2. Criar 500 appointments
# 3. Criar 200 sales
# 4. Verificar performance
# 5. Otimizar queries lentas
# 6. Adicionar índices se necessário
```

### DIA 5: Deploy Staging (8h)

```bash
# 1. Criar projeto Supabase produção
# 2. Executar schema
# 3. Configurar env vars na Vercel
# 4. Deploy
# 5. Testes smoke
```

---

## 🎯 SPRINT 5: QUALIDADE (Semana 5)

### DIA 1-2: Refatorações (16h)

```typescript
// 1. Quebrar BarberContext
// - Criar AuthContext
// - Criar ClientsContext
// - Criar AppointmentsContext

// 2. Refatorar Settings.tsx
// - Extrair ShopProfileTab
// - Extrair TeamTab
// - Extrair SettingsTab

// 3. Eliminar any's
// - Criar interfaces específicas
// - Usar unknown quando necessário
```

### DIA 3-4: Monitoring (16h)

```bash
# 1. Configurar Sentry
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs

# 2. Configurar Vercel Analytics
# Vercel Dashboard > Analytics > Enable

# 3. Configurar UptimeRobot
# https://uptimerobot.com
# Adicionar monitor HTTP(s)
# Intervalo: 5 minutos
```

### DIA 5: LAUNCH! 🚀 (8h)

```bash
# 1. Checklist final
✓ Build passa
✓ Testes passam
✓ Auth funciona
✓ CRUD funciona
✓ RLS funciona
✓ Multi-tenancy funciona
✓ Monitoring ativo
✓ Backup configurado

# 2. Deploy produção
vercel --prod

# 3. Smoke tests
# - Criar conta
# - Fazer login
# - Criar cliente
# - Agendar serviço
# - Registrar venda
# - Verificar comissão

# 4. 🎉 LANÇADO!
```

---

## 📋 CHECKLIST DIÁRIO

### Antes de Começar
```
□ Pull do repositório
□ Verificar env vars
□ Rodar npm install (se houver mudanças)
□ Rodar npm run dev
□ Verificar console sem erros
```

### Durante o Desenvolvimento
```
□ Commitar a cada feature completa
□ Testar no navegador
□ Verificar console
□ Verificar dados no Supabase
□ Documentar problemas encontrados
```

### Antes de Terminar o Dia
```
□ Commitar mudanças
□ Push para repositório
□ Atualizar documentação
□ Listar pendências para amanhã
□ Fazer backup local (se necessário)
```

---

## 🚨 TROUBLESHOOTING

### Erro: "Variáveis de ambiente inválidas"
```bash
# Verificar .env.local existe
# Verificar valores corretos
# Reiniciar servidor (Ctrl+C, npm run dev)
```

### Erro: "Failed to fetch"
```bash
# Verificar Supabase URL correta
# Verificar anon key correta
# Verificar internet
# Verificar Supabase não está em manutenção
```

### Erro: "RLS policy violation"
```bash
# Verificar usuário está autenticado
# Verificar tenant_id está sendo passado
# Verificar RLS policies no Supabase
# SQL Editor: SELECT * FROM auth.users();
```

### Erro: "Type 'never'"
```bash
# Usar SupabaseAny no repository
# Fazer cast quando necessário
# Verificar database.types.ts atualizado
```

---

## 📞 RECURSOS

### Documentação
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Suporte
- Discord Supabase: https://discord.supabase.com
- Stack Overflow: [next.js] [supabase]
- GitHub Issues: fabianofontes-oss/barberGold

### Ferramentas
- Supabase Dashboard: https://supabase.com/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub: https://github.com/fabianofontes-oss/barberGold

---

## 🎯 METAS SEMANAIS

### Semana 1
**Meta:** Sistema conectado ao Supabase com auth real  
**Critério:** Login funciona + Clients CRUD completo

### Semana 2
**Meta:** Core business funcionando  
**Critério:** Appointments + Sales persistindo

### Semana 3
**Meta:** Catálogo completo  
**Critério:** Services + Products + Staff no Supabase

### Semana 4
**Meta:** Finance e deploy staging  
**Critério:** Comissões calculando + app no ar

### Semana 5
**Meta:** Produção!  
**Critério:** MVP lançado com monitoring

---

**🚀 Vamos começar!**

**Próximo passo:** Criar projeto no Supabase  
**Tempo estimado:** 2 horas  
**Dificuldade:** Fácil ⭐  


