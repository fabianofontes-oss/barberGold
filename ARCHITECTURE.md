# Arquitetura BarberFlow SaaS

## Stack Tecnológica
- **Frontend:** Next.js 14+ (App Router), React 19, TailwindCSS 4
- **Backend:** Supabase (Auth, Database, RLS)
- **Validação:** Zod + React Hook Form
- **Estado:** Server State (preferencial), Context API (fallback)

---

## Padrão Arquitetural: Vertical Slices

Cada domínio/módulo reside em `src/modules/{nome-do-modulo}/` com esta estrutura:

```
src/modules/{modulo}/
├── types.ts          # Schemas Zod + Types do Banco + Types de UI
├── repository.ts     # Data Layer (Supabase queries) - SEMPRE filtra por tenant_id
├── actions.ts        # Server Actions (Next.js) - Validação Zod + chamadas ao repository
├── hooks/            # Custom hooks para consumir Server Actions (useQuery/useState)
├── components/       # Componentes visuais exclusivos deste módulo
└── index.ts          # Barrel export
```

### Exemplo: Módulo Agenda (referência)
- `src/modules/agenda/repository.ts` - Queries filtradas por `tenant_id`
- `src/modules/agenda/actions.ts` - `getAgendaBootstrapAction`, `createAppointmentAction`, etc
- `src/modules/agenda/hooks/useAgenda.ts` - Hook que chama actions e gerencia estado local
- `src/modules/agenda/Agenda.tsx` - Componente principal que usa `useAgenda()`

---

## Fluxo de Dados (Data Flow)

```
UI Component
    ↓ (chama)
Custom Hook (useClients, useAgenda)
    ↓ (chama)
Server Action (createClientAction)
    ↓ (valida com Zod)
Repository (createClientsRepository)
    ↓ (query Supabase)
Banco de Dados (PostgreSQL + RLS)
```

**Regras:**
1. **UI nunca acessa Supabase diretamente** (sempre via Server Actions)
2. **Server Actions sempre validam input** (Zod schemas)
3. **Repository sempre filtra por `tenant_id`** (multi-tenancy)
4. **RLS no banco garante segurança** (última camada de defesa)

---

## Multi-Tenancy & Segurança

### Obtenção do Tenant ID
```typescript
import { getAuthContext } from '@/lib/auth/getTenantId';

const auth = await getAuthContext();
// auth.tenantId, auth.profileId, auth.role, auth.displayName
```

### Exemplo de Repository (SEMPRE filtrar por tenant_id)
```typescript
export function createClientsRepository(supabase: AppSupabaseClient) {
  return {
    async listClients({ tenantId }: { tenantId: string }) {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('tenant_id', tenantId)  // ← OBRIGATÓRIO
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  };
}
```

### RLS (Row Level Security)
Todas as tabelas têm políticas RLS no banco:
```sql
CREATE POLICY "Staff can view clients"
  ON public.clients FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());
```

**Função helper:**
```sql
CREATE FUNCTION public.get_user_tenant_id() RETURNS UUID AS $$
  SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

---

## Modos de Operação

Configurado via `NEXT_PUBLIC_APP_MODE` em `.env.local`:

### `demo` (desenvolvimento/showcase)
- Usa mocks de `src/constants.ts`
- Dados em `localStorage` via `BarberContext`
- Não requer Supabase configurado
- Login fake habilitado

### `pilot` (teste com dados reais)
- Usa Supabase para módulos migrados (Agenda, Clients, Services, Staff)
- Fallback para localStorage em módulos não migrados
- Requer Supabase configurado

### `prod` (produção)
- 100% Supabase
- Zero mocks/localStorage
- RLS obrigatório em todas as queries

**Helper:**
```typescript
import { getAppMode, shouldUseSupabase } from '@/lib/env';

if (shouldUseSupabase()) {
  // Usar Supabase
} else {
  // Usar mocks
}
```

---

## Módulos Migrados vs Legados

### ✅ Migrados (Supabase + Vertical Slice)
- **Agenda** - `src/modules/agenda/`
- **Clients** - `src/modules/clients/`
- **Services** - `src/modules/services/`
- **Staff** - `src/modules/staff/`
- **Auth** - `src/modules/auth/`

### ⚠️ Legados (ainda em BarberContext/localStorage)
- **Dashboard** - `src/modules/dashboard/`
- **PDV** - `src/modules/pdv/`
- **Finance** - `src/modules/finance/`
- **Settings** - `src/modules/settings/`
- **Website** - `src/modules/website/`
- **SuperAdmin** - `src/modules/super-admin/`
- **Referrals** - `src/modules/referrals/`

---

## Como Criar um Novo Módulo

### 1. Criar estrutura de pastas
```bash
mkdir -p src/modules/{nome}/hooks
touch src/modules/{nome}/{types,repository,actions,index}.ts
```

### 2. Definir tipos (types.ts)
```typescript
import { z } from 'zod';

export const createItemInputSchema = z.object({
  name: z.string().min(1),
  // ...
});

export type CreateItemInput = z.infer<typeof createItemInputSchema>;
```

### 3. Criar repository (repository.ts)
```typescript
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

type AppSupabaseClient = SupabaseClient<Database>;

export function createItemsRepository(supabase: AppSupabaseClient) {
  return {
    async listItems({ tenantId }: { tenantId: string }) {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('tenant_id', tenantId); // ← SEMPRE filtrar

      if (error) throw error;
      return data;
    },
  };
}
```

### 4. Criar Server Actions (actions.ts)
```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { getAuthContext } from '@/lib/auth/getTenantId';
import { createItemsRepository } from './repository';
import { createItemInputSchema } from './types';

export async function createItemAction(input: unknown) {
  const parsed = createItemInputSchema.parse(input);
  const auth = await getAuthContext();
  const supabase = await createClient();
  const repo = createItemsRepository(supabase);

  const result = await repo.createItem({
    input: {
      tenant_id: auth.tenantId,
      name: parsed.name,
    },
  });

  return result;
}
```

### 5. Criar Hook (hooks/useItems.ts)
```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
import { listItemsAction, createItemAction } from '../actions';

export function useItems() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    setIsLoading(true);
    const data = await listItemsAction({});
    setItems(data);
    setIsLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const addItem = useCallback(async (input) => {
    await createItemAction(input);
    await reload();
  }, [reload]);

  return { items, isLoading, reload, addItem };
}
```

### 6. Usar no componente
```typescript
'use client';

import { useItems } from '@/modules/items';

export function ItemsPage() {
  const { items, addItem } = useItems();

  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  );
}
```

---

## Regras de Ouro

1. **Multi-tenant First:** Toda query filtra por `tenant_id`. Sem exceção.
2. **Tipagem Forte:** Não use `any`. Estenda tipos do `Database['public']...`
3. **Segurança:** Lógica sensível só em Server Actions. Client é apenas UI.
4. **Mobile First:** UI deve funcionar perfeitamente em celular.
5. **Commits Semânticos:** `feat:`, `fix:`, `chore:`, `refactor:`

---

## Troubleshooting

### "Database error querying schema"
- Usuário criado via SQL não funciona no Supabase Auth
- **Solução:** Criar usuário via Dashboard → Authentication → Add User

### "Invalid Server Actions request"
- Proxy do Windsurf causa conflito
- **Solução:** Acessar diretamente `http://localhost:3000` (não usar preview)

### "Relation does not exist"
- Tabela referenciada antes de ser criada no schema
- **Solução:** Verificar ordem de criação no `schema-complete.sql`

---

## Próximos Passos (Roadmap)

### Fase 1: Core Modules (em andamento)
- [x] Agenda
- [x] Clients (repository criado)
- [x] Services (repository criado)
- [x] Staff (repository criado)
- [ ] Dashboard (adaptar para usar dados reais)

### Fase 2: Transações
- [ ] PDV (Sales)
- [ ] Finance (Expenses, Commissions)

### Fase 3: Avançado
- [ ] Settings (Shop Profile, Team)
- [ ] Website Builder
- [ ] Referrals (adaptar schema)

### Fase 4: Super Admin
- [ ] Multi-tenant Dashboard
- [ ] Billing
- [ ] Support

---

**Última atualização:** 21/12/2024  
**Versão:** 0.1.0 (Sprint 0 - P0)
