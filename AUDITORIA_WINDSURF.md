# 🔍 AUDITORIA TÉCNICA - BARBERGOLD

**Data:** 22 de Dezembro de 2025  
**Auditor:** Windsurf AI (Senior Software Architect)  
**Escopo:** Análise completa de infraestrutura, arquitetura e qualidade de código

---

## 1. 🏗️ INFRAESTRUTURA E CONFIGURAÇÃO

### 1.1 📁 Arquitetura de Pastas

#### ✅ Estrutura Principal
```
barberGold/
├── src/
│   ├── app/              # Next.js 16 App Router
│   ├── modules/          # ✅ Módulos (19)
│   ├── components/       # Componentes compartilhados
│   ├── lib/              # Utilitários e clientes (Supabase, etc)
│   ├── hooks/            # Custom hooks globais
│   ├── repositories/     # Camada de dados (2 domínios: referrals, tenantPlan)
│   ├── domain/           # Lógica de domínio
│   ├── context/          # React Context providers
│   ├── providers/        # Providers gerais
│   ├── utils/            # Funções utilitárias
│   ├── types.ts          # Tipos globais
│   └── constants.ts      # Constantes do sistema
├── public/               # Assets estáticos
├── supabase/             # Migrations e configurações do Supabase
├── docs/                 # Documentação
└── design-reference/     # Referências de design
```

#### ✅ Módulos Implementados (`src/modules`)
1. `agenda/` - Agendamentos
2. `auth/` - Autenticação
3. `barber-club/` - Programa de fidelidade
4. `catalog/` - Catálogo de serviços
5. `clients/` - Gestão de clientes
6. `dashboard/` - Dashboard principal
7. `dynamic-pricing/` - Precificação dinâmica
8. `finance/` - Financeiro
9. `growth/` - Crescimento
10. `office-v2/` - Escritório v2
11. `online-booking/` - Reservas online
12. `pdv/` - Ponto de venda
13. `plan/` - Planos
14. `referrals/` - Indicações
15. `settings/` - Configurações
16. `smart-pricing/` - Precificação inteligente
17. `super-admin/` - Super admin
18. `tips/` - Gorjetas
19. `website/` - Website público

**Status:** ⚠️ Estrutura modular presente; padrão de módulos não está consistente (detalhes na Seção 2)

#### ⚠️ Arquivos de Backup/Temporários
- **Nenhum arquivo .old ou .bak encontrado** ✅
- Arquivos Python na raiz (`add_slug_logic.py`, `add_table.py`, `fix_landing_links.py`) - Scripts de migração/utilitários
- Arquivos de relatório grandes: `eslint-report.json` (1.1MB), `eslint-report2.json` (994KB), `tsconfig.tsbuildinfo` (1.4MB)
- `.gitignore` já ignora `*.tsbuildinfo`, mas o arquivo `tsconfig.tsbuildinfo` está presente na raiz (garantir que não esteja versionado)

**Recomendação:** ⚠️ Mover scripts Python para `scripts/` e ignorar reports gerados (ex.: `eslint-report*.json`) no `.gitignore`

---

### 1.2 📦 Package.json & Dependências

#### ✅ Versões Principais
```json
{
  "next": "16.0.10",           // ✅ Next.js 16 (mais recente)
  "react": "19.2.1",           // ✅ React 19 (mais recente)
  "react-dom": "19.2.1",       // ✅ React DOM 19
  "typescript": "^5"           // ✅ TypeScript 5
}
```

#### ✅ Dependências Core
- **Supabase:** `@supabase/supabase-js@2.87.3` + `@supabase/ssr@0.8.0` ✅
- **Forms:** `react-hook-form@7.68.0` + `@hookform/resolvers@5.2.2` ✅
- **Validação:** `zod@4.2.1` ✅
- **Pagamentos:** `stripe@20.1.0` ✅
- **UI/Icons:** `lucide-react@0.561.0` ✅
- **Charts:** `recharts@3.6.0` ✅
- **Datas:** `date-fns@4.1.0` ✅

#### ✅ DevDependencies
- **TailwindCSS:** `tailwindcss@4` + `@tailwindcss/postcss@4` ✅ (Versão mais recente)
- **ESLint:** `eslint@9` + `eslint-config-next@16.0.10` ✅
- **React Compiler:** `babel-plugin-react-compiler@1.0.0` ✅ (Experimental)

#### ✅ Scripts Disponíveis
```json
{
  "dev": "next dev",      // ✅
  "build": "next build",  // ✅
  "start": "next start",  // ✅
  "lint": "eslint"        // ✅
}
```

**Status:** ✅ Todas as dependências estão atualizadas e compatíveis. Sem conflitos detectados.

**Observação:** ⚠️ Falta script de `test` - considerar adicionar Jest/Vitest para testes unitários

---

### 1.3 ⚙️ Configurações Críticas

#### ✅ tsconfig.json
```json
{
  "compilerOptions": {
    "strict": true,                    // ✅ CRÍTICO: Modo strict ativado
    "target": "ES2017",                // ✅
    "module": "esnext",                // ✅
    "moduleResolution": "bundler",     // ✅ Next.js 16 compatible
    "jsx": "react-jsx",                // ✅ React 19 JSX transform
    "paths": {
      "@/*": ["./src/*"]               // ✅ Path alias configurado
    },
    "skipLibCheck": true,              // ✅
    "noEmit": true,                    // ✅
    "incremental": true                // ✅ Build incremental
  }
}
```

**Status:** ✅ Configuração perfeita. Strict mode ativo garante type-safety máxima.

---

#### ⚠️ next.config.ts
```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,  // ✅ React Compiler ativado (experimental)
};
```

**Problemas Identificados:**
- ❌ **Falta configuração de `images.domains`** - Necessário para imagens do Supabase Storage
- ❌ **Falta `images.remotePatterns`** - Padrão recomendado para Next.js 16
- ⚠️ **Sem configuração de `typescript.ignoreBuildErrors`** - Bom! Não está ignorando erros
- ⚠️ **Sem configuração de `eslint.ignoreDuringBuilds`** - Bom! Não está ignorando lints

**Recomendações CRÍTICAS:**
```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Adicionar se usar Stripe webhooks:
  async headers() {
    return [
      {
        source: '/api/webhooks/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};
```

---

#### ✅ TailwindCSS (via globals.css)
```css
@import "tailwindcss";  // ✅ TailwindCSS v4 syntax

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

**Status:** ✅ TailwindCSS v4 configurado corretamente via CSS (novo padrão)

**Observação:** ⚠️ Não há `tailwind.config.ts` - TailwindCSS v4 usa configuração inline no CSS. Isso é **correto** para a v4.

**Content Coverage:** ✅ O `@import "tailwindcss"` automaticamente cobre todos os arquivos em `src/` (comportamento padrão do TailwindCSS v4)

---

#### ⚠️ ESLint Config
```javascript
{
  rules: {
    "@typescript-eslint/no-explicit-any": "off",  // ❌ PERIGOSO
    "@next/next/no-img-element": "off",           // ⚠️ Usar <Image>
    "react-hooks/set-state-in-effect": "off",     // ⚠️
    "react-hooks/static-components": "off",       // ⚠️
    "react-hooks/purity": "off",                  // ⚠️
  }
}
```

**Problemas:**
- ❌ **`no-explicit-any: off`** - Permite uso de `any`, quebrando type-safety
- ⚠️ **`no-img-element: off`** - Permite `<img>` ao invés de `<Image>` otimizado
- ⚠️ **React Hooks rules desativadas** - Pode causar bugs sutis

**Recomendação:** Reativar essas regras gradualmente e corrigir os problemas

---

### 1.4 🔐 Variáveis de Ambiente

#### ❌ CRÍTICO: Falta `.env.example`
**Não existe arquivo `.env.example` no projeto!**

#### ⚠️ Variáveis em `.env.local` (apenas nomes):
```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_MODE  # demo | pilot | prod
```

#### ❌ Variáveis FALTANDO (baseado no uso de Stripe e sistema multi-tenant):
```bash
# Supabase (Server-side)
SUPABASE_SERVICE_ROLE_KEY=  # ⚠️ Opcional (necessária para webhooks/operações admin)

# Stripe
STRIPE_SECRET_KEY=           # ❌ FALTA (necessária se Stripe estiver habilitado)
STRIPE_WEBHOOK_SECRET=       # ❌ FALTA (necessária para validar webhooks)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # ⚠️ Recomendada (necessária se usar Stripe.js no client)

# App
NEXT_PUBLIC_SITE_URL=        # ❌ FALTA - Usada em auth callback e redirects do Stripe
```

**Recomendação URGENTE:** Criar `.env.example` completo com todas as variáveis necessárias (sem valores reais)

---

## 📊 RESUMO EXECUTIVO - INFRAESTRUTURA

### ✅ Pontos Fortes
1. **Estrutura modular presente** - 19 módulos em `src/modules` (padrão Vertical Slice precisa padronização)
2. **Stack Moderna** - Next.js 16, React 19, TypeScript 5
3. **Dependências Atualizadas** - Sem conflitos ou versões desatualizadas
4. **TypeScript Strict Mode** - Type-safety máxima
5. **TailwindCSS v4** - Configuração moderna e correta
6. **Sem Arquivos de Backup** - Projeto limpo

### ❌ Problemas Críticos
1. **Falta `.env.example`** - Dificulta onboarding de novos devs
2. **Falta configuração de imagens no Next.js** - Imagens do Supabase não funcionarão
3. **Variáveis Stripe ausentes** - Sistema de pagamento incompleto
4. **ESLint com regras perigosas desativadas** - `any` permitido

### ⚠️ Melhorias Recomendadas
1. Mover scripts Python para `scripts/`
2. Ajustar `.gitignore` para ignorar reports gerados (ex.: `eslint-report*.json`)
3. Criar script de testes (`npm test`)
4. Reativar regras do ESLint gradualmente
5. Adicionar configuração de headers para webhooks no `next.config.ts`

### 🎯 Prioridade de Ação
1. **URGENTE:** Criar `.env.example` com todas as variáveis
2. **URGENTE:** Configurar `images.remotePatterns` no `next.config.ts`
3. **ALTA:** Adicionar variáveis Stripe ao ambiente
4. **MÉDIA:** Organizar scripts e reports
5. **BAIXA:** Reativar regras ESLint

---

**Próxima Fase:** Auditoria de Módulos e Arquitetura Vertical Slices

---

## 2. 🗄️ Backend e Dados

### 2.1 📊 Banco de Dados (Schema SQL)

#### ✅ Estrutura de Tenants (Multi-tenancy)
**Tabela `tenants`:** ✅ **EXISTE e está PERFEITA**

```sql
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan_id TEXT DEFAULT 'FREE',
  status TEXT DEFAULT 'TRIAL',
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  settings JSONB,
  ...
);
```

**Status:** ✅ Tabela `tenants` é a **base do SaaS multi-tenant**
- ✅ Vinculada ao `auth.users` via `owner_id`
- ✅ Possui `slug` único para URLs públicas
- ✅ Controle de plano (`plan_id`) e status (`TRIAL`, `ACTIVE`, `SUSPENDED`, etc.)
- ✅ Trial de 14 dias configurado por padrão

**Tabela `profiles`:** ✅ **Vinculada ao tenant**
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'STAFF',
  ...
  UNIQUE(tenant_id, user_id)
);
```

**Status:** ✅ Cada usuário (`profiles`) está **obrigatoriamente vinculado a um tenant**

---

#### ✅ Row Level Security (RLS)

**RLS Ativado:** ✅ **No `schema.sql` (versão reduzida) RLS está habilitado em 9/9 tabelas. No schema completo (`schema-complete.sql`/`migration-reset.sql`), RLS está habilitado em 25/26 tabelas (todas exceto `saas_plans`, tabela global)**

```sql
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
-- ... (25 tabelas com RLS no schema completo; `saas_plans` é global e não tem RLS nos scripts)
```

**Funções Helper para RLS:** ✅ **Implementadas corretamente**
```sql
-- Retorna o tenant_id do usuário logado
CREATE FUNCTION public.get_user_tenant_id() RETURNS UUID AS $$
  SELECT tenant_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Verifica se o usuário é dono do tenant
CREATE FUNCTION public.is_tenant_owner(tenant_uuid UUID) RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenants 
    WHERE id = tenant_uuid AND owner_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

**Políticas RLS:** ✅ **Isolamento perfeito entre tenants**

Exemplos de políticas implementadas:
```sql
-- Clientes: apenas staff do mesmo tenant pode ver
CREATE POLICY "Staff can view clients"
  ON public.clients FOR SELECT
  USING (tenant_id = public.get_user_tenant_id());

-- Vendas: apenas staff do mesmo tenant pode criar
CREATE POLICY "Staff can create sales"
  ON public.sales FOR INSERT
  WITH CHECK (tenant_id = public.get_user_tenant_id());

-- Despesas: apenas owners podem ver
CREATE POLICY "Owners can view expenses"
  ON public.expenses FOR SELECT
  USING (public.is_tenant_owner(tenant_id));
```

**Status:** ✅ **RLS implementado de forma consistente para dados de tenant**
- ✅ Tabelas com `tenant_id` protegidas por políticas
- ✅ Políticas garantem isolamento total entre tenants
- ✅ Funções helper facilitam manutenção
- ✅ Diferentes níveis de acesso (OWNER, STAFF, PUBLIC)

---

#### ✅ Triggers e Automações

**Trigger `updated_at`:** ✅ **Implementado**
```sql
CREATE FUNCTION public.handle_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicado em 8 tabelas principais
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tenants ...
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles ...
```

**Status:** ✅ Trigger de `updated_at` funciona automaticamente

**❌ FALTA: Trigger para criar tenant automaticamente no signup**

Atualmente **NÃO EXISTE** trigger que:
1. Cria automaticamente um `tenant` quando um usuário se cadastra
2. Cria automaticamente um `profile` vinculado ao tenant

**Observação:** ⚠️ Existe `supabase/seed/p0_pilot_seed.sql` para criação manual de tenant+profile (fluxo assistido para P0)

**Recomendação CRÍTICA:** Criar trigger ou implementar lógica no Server Action de signup:
```sql
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar tenant para o novo usuário
  INSERT INTO public.tenants (owner_id, name, slug, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Minha Barbearia'),
    'tenant-' || substr(NEW.id::text, 1, 8),
    'TRIAL'
  );
  
  -- Criar profile como OWNER
  INSERT INTO public.profiles (tenant_id, user_id, name, email, role)
  VALUES (
    (SELECT id FROM public.tenants WHERE owner_id = NEW.id LIMIT 1),
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Owner'),
    NEW.email,
    'OWNER'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### 2.2 🏗️ Lógica de Negócio (Modules)

#### ⚠️ Estrutura Repository/Actions NÃO está sendo seguida consistentemente

**Análise dos 19 módulos:**

**Módulos COM estrutura correta (2/19):** ⚠️
- ✅ `barber-club/` - Possui `types.ts`, `repository.ts`, `actions.ts`
- ✅ `dynamic-pricing/` - Possui `types.ts`, `repository.ts`, hooks

**Módulos SEM estrutura Vertical Slice (17/19):** ❌
- ❌ `agenda/` - Apenas `Agenda.tsx` (43KB) com lógica misturada
- ❌ `clients/` - Apenas `Clients.tsx` (31KB) com lógica misturada
- ❌ `catalog/` - Apenas `Catalog.tsx` (43KB) com lógica misturada
- ❌ `auth/` - Possui `actions.ts` mas sem `repository.ts` (usa Supabase direto)
- ❌ `dashboard/`, `finance/`, `settings/`, etc. - Apenas componentes

**Problema Identificado:** ❌ **Lógica de negócio está DENTRO dos componentes React**

Exemplo de código problemático em `@d:\projetos\Antigravity\barbergold\barberGold\src\modules\clients\Clients.tsx`:
- 31KB de código com lógica de negócio/estado no client (principalmente via `BarberContext`)
- Sem separação de camadas (Repository/Actions)
- Dificulta testes e manutenção

**Recomendação URGENTE:** Refatorar módulos principais seguindo o padrão:
```
src/modules/{modulo}/
  ├── types.ts          # Tipos Zod + Types do Banco
  ├── repository.ts     # Queries Supabase (Data Layer)
  ├── actions.ts        # Server Actions + Validação Zod
  ├── hooks/            # Custom hooks (useClients, etc.)
  └── components/       # Componentes visuais
```

---

#### ❌ Server Actions: Validação Zod AUSENTE

**Análise dos Server Actions existentes:**

`@d:\projetos\Antigravity\barbergold\barberGold\src\modules\auth\actions.ts`:
```typescript
export async function signInWithPasswordAction(
  email: string,
  password: string
): Promise<AuthActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  // ...
}
```

**Problema:** ❌ **Sem validação Zod** dos parâmetros `email` e `password`

`@d:\projetos\Antigravity\barbergold\barberGold\src\modules\barber-club\actions.ts`:
```typescript
export async function createPlanFromSuggestion(
  tenantId: string,
  suggestion: PlanSuggestion,
  overrides?: Partial<MembershipPlan>
): Promise<MembershipPlan> {
  // Sem validação Zod
  const plan: MembershipPlan = {
    id: uuid(),
    tenantId,
    // ...
  };
  await repo.upsertPlan(plan);
}
```

**Problema:** ❌ **Sem validação Zod** - aceita qualquer dado sem validar

**Exemplo de como DEVERIA ser:**
```typescript
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export async function signInWithPasswordAction(
  email: string,
  password: string
): Promise<AuthActionResult> {
  // Validação Zod
  const result = signInSchema.safeParse({ email, password });
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors[0].message,
    };
  }
  
  const supabase = await createClient();
  // ...
}
```

**Status:** ❌ **NENHUM Server Action possui validação Zod**

---

#### ⚠️ Uso de `tenant_id` em Queries

**Repositórios Supabase (2 encontrados):**

**❌ Inconsistência crítica (Schema vs Código):**
- `src/repositories/referrals/supabase.ts` referencia tabelas `referral_partners`, `referral_sales`, `tenant_referral_config` (não aparecem em `supabase/schema.sql`, `schema-complete.sql` ou `migration-reset.sql`)
- `src/repositories/tenantPlan/supabase.ts` referencia tabelas `tenants_registry` e `app_session` (não aparecem no schema SQL)

`@d:\projetos\Antigravity\barbergold\barberGold\src\repositories\referrals\supabase.ts`:
```typescript
async listPartners({ tenantId }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(TABLE_PARTNERS)
    .select('*')
    .eq('tenant_id', tenantId);  // ✅ Filtra por tenant_id
  // ...
}
```

**Status:** ✅ Repositórios existentes **filtram corretamente por `tenant_id`**

**Problema:** ⚠️ **Maioria dos módulos NÃO usa repositories**
- Lógica está nos componentes React
- Queries Supabase diretas sem garantia de filtro por tenant
- Alto risco de vazamento de dados entre tenants

**Módulos usando localStorage (Demo Mode):**

`@d:\projetos\Antigravity\barbergold\barberGold\src\modules\barber-club\repository.ts`:
```typescript
export async function listPlans(tenantId: string): Promise<MembershipPlan[]> {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(planKey(tenantId));  // ✅ Usa tenantId na key
  // ...
}
```

**Status:** ✅ Repositories em modo demo **isolam dados por `tenantId`**

---

### 2.3 🔌 Integrações (Lib)

#### ⚠️ Stripe: Configuração Incompleta

`@d:\projetos\Antigravity\barbergold\barberGold\src\lib\stripe\index.ts`:
```typescript
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? 'sk_test_mock_key',  // ⚠️ Fallback perigoso
  {
    apiVersion: '2025-12-15.clover',
    appInfo: {
      name: 'BarberFlow SaaS',
      version: '0.1.0',
    },
  }
);

export const getStripeSession = async (priceId: string, tenantId: string, userId: string) => {
  const session = await stripe.checkout.sessions.create({
    // ...
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    metadata: {
      tenantId,  // ✅ Inclui tenantId nos metadados
      userId,
    },
  });
  return session;
};
```

**Problemas Identificados:**
- ⚠️ **Fallback `'sk_test_mock_key'`** - Perigoso em produção
- ⚠️ **`process.env.NEXT_PUBLIC_SITE_URL`** - Variável não definida no `.env.local`
- ✅ **Webhook existe** em `src/app/api/webhooks/stripe/route.ts` e **valida assinatura** via `stripe.webhooks.constructEvent`
- ❌ **Webhook atualiza colunas que não existem no schema SQL atual**: `subscription_status`, `stripe_subscription_id`, `stripe_customer_id`
- ⚠️ **Supabase Admin no webhook usa fallbacks perigosos** (`https://example.supabase.co`, `service_role_key_mock`)

**Recomendações:**
1. Remover fallback mock - falhar se `STRIPE_SECRET_KEY` não existir
2. Adicionar `NEXT_PUBLIC_SITE_URL` ao `.env.example`
3. Remover fallbacks do webhook e falhar se `SUPABASE_SERVICE_ROLE_KEY`/`STRIPE_WEBHOOK_SECRET` não existirem
4. Alinhar webhook com o schema: criar colunas necessárias em `tenants` OU atualizar campos já existentes (ex.: `status`)

---

#### ✅ Supabase Client: Configuração CORRETA

**Server Client** `@d:\projetos\Antigravity\barbergold\barberGold\src\lib\supabase\server.ts`:
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) { /* ... */ },
      },
    }
  );
}
```

**Status:** ✅ **Server Client configurado CORRETAMENTE**
- ✅ Usa `@supabase/ssr` (recomendado para Next.js 15+)
- ✅ Gerencia cookies adequadamente
- ✅ Async/await com `cookies()` do Next.js 15

**Browser Client** `@d:\projetos\Antigravity\barbergold\barberGold\src\lib\supabase\client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
```

**Status:** ✅ **Browser Client configurado CORRETAMENTE**
- ✅ Usa `createBrowserClient` (correto para client-side)
- ✅ Simples e direto

---

## 📊 RESUMO EXECUTIVO - BACKEND E DADOS

### ✅ Pontos Fortes
1. **Schema SQL bem estruturado** - 26 tabelas no schema completo (`schema-complete.sql`/`migration-reset.sql`) + versão reduzida `schema.sql` (9 tabelas)
2. **Multi-tenancy Perfeito** - Tabela `tenants` como base do SaaS
3. **RLS Implementado (tenant-scoped)** - 25 tabelas com RLS no schema completo (todas exceto `saas_plans`, global)
4. **Funções Helper RLS** - `get_user_tenant_id()` e `is_tenant_owner()` facilitam manutenção
5. **Supabase Clients Corretos** - Server e Browser clients configurados perfeitamente
6. **Isolamento de Dados** - Políticas RLS garantem segurança total

### ❌ Problemas Críticos
1. **Falta Trigger de Auto-criação de Tenant** - Usuário não vira tenant automaticamente
2. **Arquitetura Vertical Slice NÃO seguida** - Apenas 2 de 19 módulos seguem o padrão
3. **Lógica no Frontend** - Componentes de 30-40KB com queries diretas
4. **Zero Validação Zod** - Server Actions aceitam dados sem validar
5. **Stripe ⚠️** - Webhook existe, mas está inconsistente com o schema e usa fallbacks perigosos
6. **Schema vs Código ❌** - Repositórios Supabase referenciam tabelas que não existem nos SQLs versionados
7. **Variáveis de Ambiente Faltando** - `NEXT_PUBLIC_SITE_URL`, `STRIPE_SECRET_KEY`

### ⚠️ Riscos de Segurança
1. **Alto Risco:** Lógica no frontend pode bypassar RLS se mal implementada
2. **Médio Risco:** Sem validação Zod, dados inválidos podem corromper o banco
3. **Médio Risco:** Webhook Stripe existe, mas pode falhar em atualizar assinatura por inconsistência com o schema e fallbacks perigosos

### 🎯 Prioridade de Ação
1. **URGENTE:** Criar trigger de auto-criação de tenant no signup
2. **URGENTE:** Adicionar validação Zod em TODOS os Server Actions
3. **ALTA:** Refatorar módulos principais (clients, agenda, catalog) para Vertical Slices
4. **ALTA:** Corrigir webhook do Stripe (remover fallbacks + alinhar com schema)
5. **ALTA:** Alinhar schema SQL com `src/repositories/*/supabase.ts` (criar/renomear tabelas e políticas)
6. **MÉDIA:** Criar repositories para módulos que usam queries diretas
7. **BAIXA:** Documentar padrão de arquitetura para novos módulos

---

**Próxima Fase:** Auditoria de Frontend e Componentes

---

## 3. 🎨 Frontend e UX

### 3.1 🧭 App Router (Navegação)

#### ✅ Páginas encontradas (`page.tsx`)

- **`/`** → `src/app/page.tsx`
- **`/login`** → `src/app/login/page.tsx`
- **`/register`** → `src/app/register/page.tsx`
- **`/forgot-password`** → `src/app/forgot-password/page.tsx`
- **`/book`** → `src/app/book/page.tsx`
- **`/app/dashboard`** → `src/app/app/dashboard/page.tsx`
- **`/app/agenda`** → `src/app/app/agenda/page.tsx`
- **`/app/clients`** → `src/app/app/clients/page.tsx`
- **`/app/finance`** → `src/app/app/finance/page.tsx`
- **`/app/pdv`** → `src/app/app/pdv/page.tsx`
- **`/app/plan`** → `src/app/app/plan/page.tsx`
- **`/app/referrals`** → `src/app/app/referrals/page.tsx`
- **`/app/settings`** → `src/app/app/settings/page.tsx`
- **`/app/setup`** → `src/app/app/setup/page.tsx`

**Status:** ✅ Estrutura de rotas está organizada e as páginas do App Router são “wrappers” finos (renderizam módulos)

---

#### ⚠️ Rotas de Auth (`src/app/(auth)`)

- `src/app/(auth)` **não existe**.
- As rotas de auth estão em primeiro nível:
  - `/login`
  - `/register`
  - `/forgot-password`

**Status:** ⚠️ Funciona, mas não segue o checklist pedido (route group `(auth)`)

---

#### ✅ Proteção de rotas do dashboard (`/app/*`)

Proteção está implementada via **Middleware** (`middleware.ts` na raiz), usando `src/lib/supabase/middleware.ts`:

- ✅ Se acessar `/app/*` sem sessão → redireciona para `/login`
- ✅ Se acessar `/` com sessão → redireciona para `/app/dashboard`
- ✅ Se acessar `/login` ou `/register` com sessão → redireciona para `/app/dashboard`

**Status:** ✅ Rotas do dashboard estão protegidas por sessão

---

#### ⚠️ Proteção por profile (`/app/setup`) pode não estar aplicada

- Existe `src/components/AuthGuard.tsx` (server component) com `requireProfile`.
- Existe `src/app/app/(protected)/layout.tsx` que usa `AuthGuard(requireProfile=true)`.
- Porém, as páginas reais estão em `src/app/app/*` (fora do grupo `(protected)`), então essa checagem pode estar **inativa** hoje.

**Impacto:** ⚠️ Usuário com sessão mas sem `profile` pode entrar no app sem passar por `/app/setup`

---

#### ❌ Rotas/links inconsistentes (“fantasmas”)

- ❌ **`/auth/callback`** é referenciada em login/registro/recuperação de senha, mas não existe rota correspondente em `src/app/auth/callback`
- ❌ Links para **`/terms`** e **`/privacy`** existem no formulário de registro, mas não há páginas correspondentes
- ❌ Fluxo de reset de senha usa `next=/app/settings/password`, mas não existe rota `/app/settings/password` (apenas `/app/settings`)
- ⚠️ Rota **`/book`** existe, mas não foi encontrado link interno apontando para ela; no `Website.tsx` o agendamento chama `setView('ONLINE_BOOKING')`
- ⚠️ Não existe `src/app/app/page.tsx` (acessar `/app` pode resultar em 404)

---

### 3.2 🧩 Componentes e UI (`src/components`)

#### ✅ Uso de `use client`

**Server Component:**
- ✅ `src/components/AuthGuard.tsx` (ideal para redirects e checagens server-side)

**Client Components:**
- ✅ `src/components/Layout.tsx`
- ✅ `src/components/Sidebar.tsx`
- ✅ `src/components/SubscriptionGuard.tsx`
- ✅ `src/components/SignOutButton.tsx`
- ✅ `src/components/shared/ImageUpload.tsx`
- ✅ `src/components/widgets/DailyGoalWidget.tsx`

**Status:** ✅ `use client` está aplicado em componentes que realmente precisam de estado/interação

---

#### ⚠️ `use client` em wrappers de rota

As páginas em `src/app/app/*/page.tsx` estão como `use client`, mas apenas renderizam um componente do módulo (sem hooks/estado).

**Status:** ⚠️ Pode estar aumentando bundle e reduzindo ganho de Server Components sem necessidade

---

#### ✅ Componentes gigantes (+500 linhas)

- Em `src/components`, **nenhum** arquivo ultrapassa 500 linhas ✅
- Maior componente: `src/components/Sidebar.tsx` (~315 linhas) ✅

**Observação (fora de `src/components`):** ⚠️ há componentes grandes em `src/modules` (ex.: `src/modules/website/Website.tsx` ~538 linhas)

---

#### ⚠️ Reuso/duplicação de UI (Buttons/Inputs)

- Não existe um diretório `src/components/ui` com `Button`/`Input` reutilizáveis.
- `login`, `register` e `forgot-password` repetem markup/classes de inputs e botões.

**Status:** ⚠️ Alto potencial de duplicação e inconsistência visual

---

### 3.3 🧠 UX e Fluxos

#### ❌ Loading States e Error Boundaries

- Nenhum `loading.tsx` encontrado em `src/app` ❌
- Nenhum `error.tsx` encontrado em `src/app` ❌

**Impacto:** ❌ Experiência pode degradar em lentidão/erros (sem skeletons e sem boundaries de erro por rota)

---

#### ⚠️ Registro e redirecionamento pós-sucesso

- `src/app/register/page.tsx` redireciona para `/app/dashboard` após `signUp`.
- Se confirmação de e-mail estiver habilitada no Supabase, pode não haver sessão imediatamente → middleware pode mandar o usuário de volta ao login.

**Status:** ⚠️ Funciona em modo “auto-login”, mas pode quebrar em ambientes com confirmação obrigatória

---

#### ✅ Login

- `src/app/login/page.tsx` faz `signInWithPassword` e redireciona para `/app/dashboard`.
- Middleware também evita usuário logado acessar `/login` e `/register`.

**Status:** ✅ Fluxo de login está coerente

---

#### ❌ Links placeholders (`href="#"`)

- ❌ `src/modules/website/SaasLandingPage.tsx` (footer): Termos de Uso / Privacidade / Contato
- ❌ `src/modules/website/Website.tsx` (footer): ícone de email

**Status:** ❌ Placeholders em produção podem gerar fricção e prejudicar credibilidade

---

**Próxima Fase:** Auditoria de Segurança e Performance

---

## 4. 🔐 Segurança e Performance

### 4.1 🚨 Segurança (Crítico)

#### 🚨 Secrets Hardcoded

**Varredura por padrões de chaves:**

- ⚠️ Encontrado `sk_live_***` (placeholder mascarado) em `src/context/BarberContext.tsx` (`stripeKey` em `INITIAL_GLOBAL_SETTINGS`)
- ⚠️ Encontrado fallback `sk_test_mock_key` em `src/lib/stripe/index.ts` (fallback perigoso caso `STRIPE_SECRET_KEY` não exista)
- ⚠️ Encontrado fallback `service_role_key_mock` em `src/app/api/webhooks/stripe/route.ts` (webhook cria Supabase Admin com chave mock se env não existir)
- ✅ Não encontrado `pk_live`/`pk_test` no código
- ✅ Não encontrados tokens JWT aparentes (`eyJ...`) hardcoded

**Status:** ⚠️ Não há evidência de chave real exposta, mas existem **placeholders/fallbacks perigosos** e um campo `stripeKey` em estado client-side (mesmo que em modo demo)

**Recomendações:**
1. ❌ Remover fallbacks (`sk_test_mock_key`, `service_role_key_mock`) e falhar rápido se env obrigatórias estiverem ausentes
2. ⚠️ Evitar qualquer cenário onde `Stripe Secret Key` seja armazenada/gerida no client (mesmo em “Super Admin”)

---

#### ✅ SQL Injection

- ✅ Não foi encontrado uso de SQL “raw” em template strings (ex.: `` `SELECT ...` ``) no código TS/TSX
- ✅ Não foram encontradas libs/padrões típicos de query raw (`$queryRaw`, `knex.raw`, `pg.query`, `sequelize.query`)
- ✅ As consultas (quando existem) seguem o padrão do Supabase query builder

**Status:** ✅ Baixo risco de SQL Injection no código atual

---

#### ✅ Tenant Isolation (Multi-tenant)

- ✅ No banco (ver Seção 2), o isolamento é garantido por RLS e helpers (`get_user_tenant_id`, `is_tenant_owner`)
- ✅ No app, o client Supabase padrão usa `anon key` + sessão (cookies) → respeita RLS
- ⚠️ Ponto de atenção: uso de `SUPABASE_SERVICE_ROLE_KEY` em `src/app/api/webhooks/stripe/route.ts` **bypassa RLS** (correto para admin) — porém o fallback para chave mock é arriscado
- ⚠️ Em modo demo/localStorage, não existe garantia real de isolamento entre tenants (ex.: `src/context/BarberContext.tsx` usa `localStorage` com chave única `barberflow_data`)

**Status:** ✅ Em `pilot/prod` (Supabase+RLS), é **muito improvável** um usuário acessar dados de outro tenant; ⚠️ em modo demo não há isolamento forte

---

### 4.2 ⚡ Performance

#### ⚠️ Imagens

- ⚠️ `next/image` é usado em `/login` e `/register` com imagens externas (Unsplash)
- ❌ `next.config.ts` não possui configuração de `images.domains`/`remotePatterns` → risco de erro em runtime/dev e falta de otimização
- ⚠️ Foram encontradas **27 ocorrências de `<img>` em 17 arquivos** no `src/` (ex.: `src/modules/website/Website.tsx`, `src/components/Layout.tsx`, `src/components/Sidebar.tsx`, `src/components/shared/ImageUpload.tsx`)

**Status:** ⚠️ Uso de imagens está funcional, mas sem padronização e com perdas de otimização/CLS em páginas públicas

**Recomendações:**
1. ✅ Configurar `images.remotePatterns` (ex.: `images.unsplash.com`) no `next.config.ts`
2. ⚠️ Migrar imagens de marketing/landing para `next/image` quando possível
3. ⚠️ Para imagens de usuário (logo/upload), avaliar `next/image` com `unoptimized`/loader ou manter `<img>` com cuidado (tamanho/placeholder)

---

#### ✅ Console Logs

- ✅ `console.log(...)`: **1 ocorrência** em `src/context/BarberContext.tsx`

**Status:** ✅ Baixo ruído de logs em produção (pelo menos via `console.log`)

---

#### ⚠️ Bundle (imports pesados)

- ⚠️ `recharts` é importado em 3 módulos client-side (`Dashboard`, `SuperAdminDashboard`, `SuperAdminSystem`) e pode pesar no bundle inicial (principalmente no dashboard)
- ⚠️ `src/components/Sidebar.tsx` importa muitos ícones do `lucide-react` (bundle do “shell” do app)
- ✅ `stripe` (lib pesada) está restrita ao server (`src/app/api/webhooks/stripe/route.ts`) e não aparece importada no client

**Recomendações:**
1. ⚠️ Considerar `dynamic(() => import(...), { ssr: false })` para gráficos (`recharts`) e/ou carregar sob demanda
2. ⚠️ Avaliar split do Sidebar/menus por contexto (ex.: owner vs staff vs super admin) para reduzir bundle inicial

---

**Próxima Fase:** Auditoria Final (Parte 5/5)

---

## 5. 🧹 Qualidade e Veredito Final

### 5.1 🧼 Higiene de Código

#### ✅ TODOs e FIXMEs

- ✅ Nenhum `TODO`/`FIXME` encontrado via varredura na pasta `src/`

**Status:** ✅ Higiene de pendências em comentários está OK

---

#### ⚠️ Código morto / importações não utilizadas

Executando `npm run lint`:

- ✅ 0 errors
- ⚠️ 128 warnings

Principais sinais de “código morto”/desalinhamento:

- ⚠️ Muitos `no-unused-vars` (imports/variáveis não usados), ex.:
  - `src/modules/pdv/PointOfSale.tsx` (`Star` não usado)
  - `src/modules/referrals/ReferralDashboard.tsx` (vários ícones e `ownerLink` não usados)
  - `src/modules/office-v2/TenantsListV2.tsx` (`currentPlan` não usado)
  - `src/modules/settings/components/PlanComparisonTable.tsx` (`Minus`, `catIdx` não usados)
- ⚠️ `react-hooks/exhaustive-deps` (deps faltando em `useEffect`) em vários modais/telas
- ⚠️ `jsx-a11y/alt-text` (img sem `alt`) em:
  - `src/modules/pdv/PointOfSale.tsx`
  - `src/modules/tips/TipsReviewWizard.tsx`

Itens possivelmente “não integrados” hoje (sinal de acoplamento/arquitetura em transição):

- ⚠️ `src/app/app/(protected)/layout.tsx` (o route group `(protected)` existe, mas as páginas estão em `src/app/app/*` — a checagem pode não estar ativa)
- ⚠️ `src/lib/stripe/index.ts` exporta `getStripeSession`, mas não foi encontrado uso no projeto

**Status:** ⚠️ Há oportunidades claras de limpeza e redução de ruído no código

---

#### ❌ TypeScript e tipagem (`any`)

Varredura de tipagem no `src/`:

- ❌ Alto uso de `any` (103 ocorrências em 27 arquivos)
- Concentração notável em:
  - `src/context/BarberContext.tsx` (muitas ocorrências; núcleo de estado/ações)
  - `src/context/SaasV2Context.tsx`
  - `src/modules/finance/Finance.tsx`
  - `src/repositories/*/supabase.ts` (mapeamento de linhas do banco como `any`)
- Impacto:
  - ❌ Refactors arriscados
  - ❌ Aumenta chance de bug em tempo de execução
  - ❌ Dificulta evolução do modelo multi-tenant com segurança

**Status:** ❌ Precisa reduzir `any` antes de evolução/escala do produto

---

## ✅ CONCLUSÃO E PLANO DE AÇÃO

### Veredito

**[CORRIGIR ANTES]**

Motivos objetivos (bloqueadores para lançamento em produção):

1. ❌ **Fluxo de autenticação incompleto**: `/auth/callback` é referenciado e não existe; reset de senha aponta para rota inexistente; `requireProfile` pode não estar aplicado em `/app/*`
2. ❌ **Inconsistência Schema vs Código**: repositórios e webhook Stripe referenciam tabelas/colunas não presentes nos SQLs versionados
3. 🚨 **Risco operacional de secrets/fallbacks**: fallbacks (`sk_test_mock_key`, `service_role_key_mock`) e chave Stripe em estado client-side (mesmo em demo)

---

### P1 (FAZER HOJE) — 3 tarefas prioritárias

1. **P1 - Fechar Auth/Onboarding End-to-End**
   - Criar rota `/auth/callback` no App Router
   - Garantir proteção por perfil/tenant (`AuthGuard` realmente aplicado em `/app/*`)
   - Definir fluxo único pós-signup (principalmente se houver confirmação de e-mail)

2. **P1 - Alinhar Banco (SQL) com o Código**
   - Resolver “Schema vs Código” (tabelas/colunas faltantes)
   - Ajustar webhook Stripe para escrever em colunas existentes (ou criar migração)
   - Definir fonte única de verdade para schema (migrations)

3. **P1 - Remover riscos de secrets e endurecer env**
   - Remover fallbacks de chaves (Stripe/Supabase service role)
   - Falhar rápido em rotas server se env estiver faltando
   - Garantir que `Stripe Secret Key` nunca exista no client (nem via “Super Admin UI”)

---

### P2 (PRÓXIMAS)

1. **Reduzir `any` e aumentar tipagem** (começando por `BarberContext` e repos Supabase)
2. **Corrigir warnings do ESLint** (unused vars, deps de hooks, `alt` em imagens)
3. **Otimizar performance de imagens e bundle** (remotePatterns, `next/image`, lazy/dynamic charts)

---

**Status Final da Auditoria:** ✅ Partes 1–5 concluídas e consolidadas neste relatório
