# 🏆 BARBERFLOW - DOCUMENTAÇÃO COMPLETA DO SISTEMA

> **"Se o mundo acabar hoje, este documento tem TUDO para reconstruir o projeto do zero."**

**Data:** 20/12/2024  
**Versão:** 0.1.0 (MVP)  
**Repositório:** `monetizandooo-braga/barberGold`  
**Produção:** https://barber-gold-alpha.vercel.app

---

## 📋 ÍNDICE MASTER

1. [O QUE É O SISTEMA](#1-o-que-é-o-sistema)
2. [STACK TECNOLÓGICA](#2-stack-tecnológica)
3. [ARQUITETURA](#3-arquitetura)
4. [ESTRUTURA DE PASTAS](#4-estrutura-de-pastas)
5. [BANCO DE DADOS](#5-banco-de-dados)
6. [MÓDULOS DO SISTEMA](#6-módulos-do-sistema)
7. [REGRAS DE NEGÓCIO](#7-regras-de-negócio)
8. [TIPOS E CONTRATOS](#8-tipos-e-contratos)
9. [ESTADO ATUAL (O QUE FUNCIONA)](#9-estado-atual-o-que-funciona)
10. [O QUE FALTA PARA MVP](#10-o-que-falta-para-mvp)
11. [PROBLEMAS CRÍTICOS](#11-problemas-críticos)
12. [MELHORIAS NECESSÁRIAS](#12-melhorias-necessárias)
13. [PADRÕES DE CÓDIGO](#13-padrões-de-código)
14. [COMO RODAR O PROJETO](#14-como-rodar-o-projeto)
15. [ROADMAP DE IMPLEMENTAÇÃO](#15-roadmap-de-implementação)
16. [CHECKLIST DE LANÇAMENTO](#16-checklist-de-lançamento)

---

## 1. O QUE É O SISTEMA

### 1.1 Visão Geral
**BarberFlow** é um **SaaS Multi-tenant** de gestão completa para barbearias. O sistema é projetado para:

- **Donos de barbearias** gerenciarem sua operação completa
- **Barbeiros** acompanharem agenda, comissões e metas
- **Clientes** agendarem online e acumularem fidelidade

### 1.2 Modelo de Negócio
```
PLANOS DISPONÍVEIS:
┌─────────────┬──────────┬──────────────────────────────────────┐
│ Plano       │ Preço/mês│ Recursos                             │
├─────────────┼──────────┼──────────────────────────────────────┤
│ FREE        │ R$ 0     │ 1 profissional, recursos básicos     │
│ SOLO        │ R$ 49    │ 1 profissional, agenda online        │
│ SOLO_PRO    │ R$ 79    │ 1 profissional, relatórios avançados │
│ EQUIPE      │ R$ 149   │ Até 3 profissionais                  │
│ STUDIO      │ R$ 249   │ Até 6 profissionais, multi-loja      │
│ ENTERPRISE  │ R$ 499   │ Ilimitado, white-label               │
└─────────────┴──────────┴──────────────────────────────────────┘
```

### 1.3 Público-Alvo
- **Primário:** Donos de barbearias (1-10 cadeiras)
- **Secundário:** Barbeiros autônomos (1 pessoa)
- **Terciário:** Redes de barbearias (múltiplas lojas)

### 1.4 Diferenciais
1. **Fila Inteligente** - Distribui walk-ins automaticamente
2. **Clube de Assinatura** - Clientes pagam mensalidade por cortes
3. **Precificação Dinâmica** - Preços variam por demanda
4. **Comissões Flexíveis** - 3 modelos de compensação
5. **Mobile-First** - UI otimizada para uso em pé

---

## 2. STACK TECNOLÓGICA

### 2.1 Frontend
| Tecnologia | Versão | Função |
|------------|--------|--------|
| **Next.js** | 16.0.10 | Framework React (App Router) |
| **React** | 19.2.1 | Biblioteca UI |
| **TypeScript** | 5.x | Tipagem estática |
| **TailwindCSS** | 4.x | Estilização utility-first |
| **Lucide React** | 0.561.0 | Biblioteca de ícones |
| **Recharts** | 3.6.0 | Gráficos e dashboards |
| **date-fns** | 4.1.0 | Manipulação de datas |
| **React Hook Form** | 7.68.0 | Gerenciamento de formulários |
| **Zod** | 4.2.1 | Validação de schemas |

### 2.2 Backend
| Tecnologia | Versão | Função |
|------------|--------|--------|
| **Supabase** | - | Auth, Database, Storage, Realtime |
| **@supabase/ssr** | 0.8.0 | SSR para Next.js |
| **@supabase/supabase-js** | 2.87.3 | Cliente JavaScript |

### 2.3 Infraestrutura
| Serviço | Função |
|---------|--------|
| **Vercel** | Hosting, Deploy, Edge Functions |
| **GitHub** | Repositório, CI/CD |
| **Supabase** | Banco de dados PostgreSQL |

### 2.4 Tema Visual
```
PREMIUM GOLD THEME:
- Background: zinc-950 (#09090b)
- Cards: zinc-900 (#18181b)
- Borders: zinc-800 (#27272a)
- Primary: amber-500 (#f59e0b)
- Text: white/zinc-400
```

---

## 3. ARQUITETURA

### 3.1 Arquitetura Atual (Problemática)
```
┌─────────────────────────────────────────────────────────────────┐
│                         NEXT.JS APP                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────────────────────────────────────────────┐     │
│   │               page.tsx (ÚNICA PÁGINA)                 │     │
│   │        Controla 28 views por ESTADO (não rotas)       │     │
│   └──────────────────────────────────────────────────────┘     │
│                            │                                    │
│                            ▼                                    │
│   ┌──────────────────────────────────────────────────────┐     │
│   │            BarberContext.tsx (677 linhas)             │     │
│   │                   MONOLÍTICO                          │     │
│   │   - 30+ estados diferentes                            │     │
│   │   - 50+ actions                                       │     │
│   │   - Auth + Vendas + Clientes + Finance... TUDO JUNTO  │     │
│   └──────────────────────────────────────────────────────┘     │
│                            │                                    │
│                            ▼                                    │
│   ┌──────────────────────────────────────────────────────┐     │
│   │                   localStorage                        │     │
│   │            'barberflow_data' (sem versão)             │     │
│   └──────────────────────────────────────────────────────┘     │
│                                                                 │
│   ═══════════════════════════════════════════════════════════  │
│                    SUPABASE (NÃO CONECTADO)                    │
│   ═══════════════════════════════════════════════════════════  │
│                                                                 │
│   - lib/supabase/client.ts ✓ Configurado                       │
│   - lib/supabase/server.ts ✓ Configurado                       │
│   - Schema SQL ✓ Definido (NÃO EXECUTADO)                      │
│   - RLS Policies ✓ Definidas (NÃO EXECUTADAS)                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Arquitetura Desejada (Vertical Slices)
```
┌─────────────────────────────────────────────────────────────────┐
│                         NEXT.JS APP ROUTER                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   /app/                                                         │
│   ├── (auth)/login/page.tsx          → Autenticação             │
│   ├── (app)/dashboard/page.tsx       → Dashboard                │
│   ├── (app)/agenda/page.tsx          → Agendamentos             │
│   ├── (app)/pdv/page.tsx             → Ponto de Venda           │
│   ├── (app)/clientes/page.tsx        → CRM                      │
│   └── ...                                                       │
│                                                                 │
│   /src/modules/[modulo]/                                        │
│   ├── types.ts        → Schemas Zod + tipos                     │
│   ├── repository.ts   → Chamadas ao Supabase                    │
│   ├── actions.ts      → Server Actions                          │
│   ├── hooks/          → Custom hooks (client-side)              │
│   └── components/     → UI do módulo                            │
│                                                                 │
│   ═══════════════════════════════════════════════════════════  │
│                         SUPABASE                                │
│   ═══════════════════════════════════════════════════════════  │
│                                                                 │
│   PostgreSQL + RLS + Auth + Storage + Realtime                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Fluxo de Dados

**ATUAL (Problemático):**
```
UI → Context (677 linhas) → localStorage
```

**DESEJADO:**
```
UI → Hook/Server Action → Repository → Supabase → RLS → Dados
```

### 3.4 Modos de Operação
O sistema suporta 3 modos configurados via `NEXT_PUBLIC_APP_MODE`:

| Modo | Uso | Backend |
|------|-----|---------|
| `demo` | Demonstração | localStorage |
| `pilot` | Testes com dados reais | Supabase |
| `prod` | Produção | Supabase |

---

## 4. ESTRUTURA DE PASTAS

```
barberApp-temp/
│
├── 📁 src/
│   │
│   ├── 📁 app/                          # Next.js App Router
│   │   ├── layout.tsx                   # Layout raiz (Providers)
│   │   ├── page.tsx                     # Página única (router por estado)
│   │   └── error.tsx                    # Error boundary
│   │
│   ├── 📁 components/                   # Componentes globais
│   │   ├── Layout.tsx                   # Wrapper com Sidebar
│   │   ├── Sidebar.tsx                  # Menu lateral (315 linhas)
│   │   ├── SubscriptionGuard.tsx        # Guard de features por plano
│   │   ├── shared/
│   │   │   └── ImageUpload.tsx
│   │   └── widgets/
│   │       └── DailyGoalWidget.tsx
│   │
│   ├── 📁 context/                      # Estado global
│   │   ├── BarberContext.tsx            # Context MONOLÍTICO (677 linhas) ⚠️
│   │   ├── SaasV2Context.tsx            # Context SaaS V2
│   │   ├── ReferralContext.tsx          # Context de referrals
│   │   └── slices/                      # Tentativa de modularização
│   │       ├── tenantPlanSlice.ts
│   │       └── referralSlice.ts
│   │
│   ├── 📁 hooks/                        # Hooks globais
│   │   ├── useCurrentReferralPartner.ts
│   │   ├── useDashboardStats.ts
│   │   └── useFeatureGate.ts
│   │
│   ├── 📁 lib/                          # Configurações
│   │   ├── supabase/
│   │   │   ├── client.ts                # Cliente browser
│   │   │   ├── server.ts                # Cliente server
│   │   │   ├── middleware.ts            # Auth middleware
│   │   │   └── index.ts
│   │   ├── env.ts                       # Validação de env vars
│   │   └── database.types.ts            # Tipos gerados do Supabase
│   │
│   ├── 📁 modules/                      # 19 MÓDULOS DE DOMÍNIO
│   │   │
│   │   ├── 📁 agenda/                   # Calendário e agendamentos
│   │   │   ├── Agenda.tsx               # (814 linhas) ⚠️
│   │   │   └── components/
│   │   │       └── QueuePanel.tsx       # Fila de espera
│   │   │
│   │   ├── 📁 auth/                     # Autenticação
│   │   │   └── Login.tsx
│   │   │
│   │   ├── 📁 barber-club/              # ✅ MÓDULO BEM ESTRUTURADO
│   │   │   ├── types.ts                 # Schemas Zod
│   │   │   ├── repository.ts            # Data layer
│   │   │   ├── actions.ts               # Business logic
│   │   │   ├── hooks/
│   │   │   │   └── useBarberClub.ts
│   │   │   └── components/
│   │   │       ├── ClubDashboard.tsx
│   │   │       ├── PlanEditor.tsx
│   │   │       └── ...
│   │   │
│   │   ├── 📁 catalog/                  # Serviços e produtos
│   │   │   ├── Catalog.tsx
│   │   │   └── components/
│   │   │
│   │   ├── 📁 clients/                  # CRM
│   │   │   ├── Clients.tsx
│   │   │   └── MyReferralsPanel.tsx
│   │   │
│   │   ├── 📁 dashboard/                # Dashboard principal
│   │   │   ├── Dashboard.tsx
│   │   │   └── PlanSummaryCard.tsx
│   │   │
│   │   ├── 📁 dynamic-pricing/          # ✅ MÓDULO BEM ESTRUTURADO
│   │   │   ├── types.ts
│   │   │   ├── repository.ts
│   │   │   ├── engine.ts                # Motor de precificação
│   │   │   ├── hooks/
│   │   │   └── components/
│   │   │
│   │   ├── 📁 finance/                  # Gestão financeira
│   │   │   ├── Finance.tsx              # (955 linhas) ⚠️
│   │   │   └── components/
│   │   │       ├── ExpenseQuickAdd.tsx
│   │   │       └── RegisterClosureModal.tsx
│   │   │
│   │   ├── 📁 growth/                   # Marketing e growth
│   │   │   ├── GrowthCommand.tsx
│   │   │   └── ReferralManager.tsx
│   │   │
│   │   ├── 📁 office-v2/                # Super Admin V2
│   │   │   ├── SuperOfficeV2.tsx
│   │   │   ├── PlansV2.tsx
│   │   │   ├── TenantDetailsV2.tsx
│   │   │   └── TenantsListV2.tsx
│   │   │
│   │   ├── 📁 online-booking/           # Agendamento público
│   │   │   └── OnlineBookingWizard.tsx
│   │   │
│   │   ├── 📁 pdv/                      # Ponto de Venda
│   │   │   └── PointOfSale.tsx          # (796 linhas) ⚠️
│   │   │
│   │   ├── 📁 plan/                     # Meu plano
│   │   │   └── MyPlan.tsx
│   │   │
│   │   ├── 📁 referrals/                # Sistema de indicações
│   │   │   └── ReferralDashboard.tsx
│   │   │
│   │   ├── 📁 settings/                 # Configurações
│   │   │   ├── Settings.tsx             # (1118 linhas) ⚠️ MAIOR ARQUIVO
│   │   │   ├── PlanOverview.tsx
│   │   │   ├── ReferralSettingsPanel.tsx
│   │   │   ├── WebsiteBuilder.tsx
│   │   │   ├── components/
│   │   │   │   └── PlanComparisonTable.tsx
│   │   │   └── modals/
│   │   │       ├── CommissionPlanModal.tsx
│   │   │       ├── InventoryModal.tsx
│   │   │       ├── OwnerReferralModal.tsx
│   │   │       ├── ProductModal.tsx
│   │   │       ├── ServiceModal.tsx
│   │   │       └── StaffModal.tsx
│   │   │
│   │   ├── 📁 smart-pricing/            # Precificação inteligente
│   │   │   └── SmartPricing.tsx
│   │   │
│   │   ├── 📁 super-admin/              # Painel Admin SaaS
│   │   │   ├── SuperAdminDashboard.tsx
│   │   │   ├── SuperAdminPlans.tsx
│   │   │   ├── SuperAdminPartners.tsx
│   │   │   ├── SuperAdminSystem.tsx
│   │   │   ├── SuperAdminSupport.tsx
│   │   │   ├── SuperAdminBilling.tsx
│   │   │   ├── SuperAdminSettings.tsx
│   │   │   ├── SuperAdminMarketing.tsx
│   │   │   ├── SuperAdminMarketplace.tsx
│   │   │   └── SuperAdminLandingEditor.tsx
│   │   │
│   │   ├── 📁 tips/                     # Gorjetas e avaliações
│   │   │   └── TipsReviewWizard.tsx
│   │   │
│   │   └── 📁 website/                  # Site público
│   │       ├── SaasLandingPage.tsx      # Landing page SaaS
│   │       ├── Website.tsx              # Site da barbearia
│   │       └── WebsiteBuilder.tsx
│   │
│   ├── 📁 providers/                    # Providers React
│   │   └── AppProviders.tsx
│   │
│   ├── 📁 repositories/                 # Repositories (pouco usado)
│   │
│   ├── 📁 utils/                        # Utilitários
│   │
│   ├── constants.ts                     # Dados mock (413 linhas)
│   └── types.ts                         # Tipos globais (567 linhas)
│
├── 📁 supabase/                         # Banco de dados
│   ├── schema.sql                       # Schema básico
│   ├── schema-complete.sql              # Schema completo (1318 linhas)
│   ├── migration-reset.sql              # Reset de migrations
│   └── seed/                            # Dados de seed
│
├── middleware.ts                        # Middleware Next.js
├── package.json                         # Dependências
├── tsconfig.json                        # Config TypeScript
├── .env.example                         # Variáveis de ambiente
│
└── 📁 docs/                             # Documentação
    ├── AI_CONTEXT.md                    # Contexto para IAs
    ├── AUDIT_REPORT.md                  # Relatório de auditoria
    ├── BLUEPRINT.md                     # Regras de negócio
    └── SISTEMA_COMPLETO.md              # ESTE ARQUIVO
```

---

## 5. BANCO DE DADOS

### 5.1 Schema Completo
**Arquivo:** `supabase/schema-complete.sql` (1318 linhas)

**STATUS:** ⚠️ **NÃO EXECUTADO NO SUPABASE**

### 5.2 Tabelas Principais

```sql
-- MÓDULO CORE
tenants              -- Barbearias/Lojas (raiz multi-tenant)
profiles             -- Staff/Funcionários (ligado a auth.users)

-- MÓDULO CATÁLOGO
categories           -- Categorias de serviços/produtos
services             -- Serviços oferecidos
products             -- Produtos à venda

-- MÓDULO CRM
clients              -- Clientes da barbearia

-- MÓDULO AGENDAMENTO
appointments         -- Agendamentos

-- MÓDULO PDV
sales                -- Vendas
sale_items           -- Itens da venda

-- MÓDULO FINANCEIRO
cash_closures        -- Fechamento de caixa
expenses             -- Despesas
staff_payouts        -- Pagamentos a funcionários
```

### 5.3 Relacionamentos
```
tenants (1) ──────── (N) profiles
tenants (1) ──────── (N) clients
tenants (1) ──────── (N) services
tenants (1) ──────── (N) products
tenants (1) ──────── (N) appointments
tenants (1) ──────── (N) sales
tenants (1) ──────── (N) expenses

clients (1) ──────── (N) appointments
profiles (1) ─────── (N) appointments
services (1) ─────── (N) appointments

sales (1) ─────────── (N) sale_items
```

### 5.4 RLS (Row Level Security)
Todas as tabelas têm RLS habilitado:

```sql
-- Exemplo de política RLS
CREATE POLICY "Tenant isolation" ON services
  FOR ALL USING (tenant_id = auth.jwt() ->> 'tenant_id');
```

### 5.5 Campos Importantes

**Tenant (Barbearia):**
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
slug TEXT UNIQUE NOT NULL
owner_id UUID REFERENCES auth.users
plan_id TEXT DEFAULT 'FREE'
status TEXT DEFAULT 'TRIAL'
settings JSONB  -- Configurações flexíveis
```

**Profile (Staff):**
```sql
id UUID PRIMARY KEY
tenant_id UUID REFERENCES tenants
user_id UUID REFERENCES auth.users
name TEXT NOT NULL
role TEXT  -- OWNER, ADMIN, BARBER, ASSISTANT, STAFF
commission_model TEXT  -- PERCENTAGE, FIXED, TIERED
commission_rate NUMERIC(5,2)
work_schedule JSONB  -- Horários por dia
```

**Client:**
```sql
id UUID PRIMARY KEY
tenant_id UUID REFERENCES tenants
name TEXT NOT NULL
phone TEXT NOT NULL
total_spent NUMERIC(10,2)
loyalty_points INTEGER
preferred_staff_id UUID
```

**Appointment:**
```sql
id UUID PRIMARY KEY
tenant_id UUID REFERENCES tenants
client_id UUID REFERENCES clients
staff_id UUID REFERENCES profiles
service_id UUID REFERENCES services
scheduled_at TIMESTAMPTZ
status TEXT  -- SCHEDULED, IN_PROGRESS, COMPLETED, etc.
```

**Sale:**
```sql
id UUID PRIMARY KEY
tenant_id UUID REFERENCES tenants
client_id UUID REFERENCES clients
staff_id UUID REFERENCES profiles
total NUMERIC(10,2)
payment_method TEXT
```

---

## 6. MÓDULOS DO SISTEMA

### 6.1 Dashboard
**Arquivo:** `modules/dashboard/Dashboard.tsx`

**Funcionalidades:**
- Resumo diário de faturamento
- Meta do dia vs realizado
- Próximos agendamentos
- Clientes aguardando
- Estatísticas rápidas

### 6.2 Agenda
**Arquivo:** `modules/agenda/Agenda.tsx` (814 linhas)

**Funcionalidades:**
- Calendário mensal/semanal/diário
- Agendamentos por barbeiro
- Fila de espera (walk-ins)
- Bloqueio de horários
- Recorrência de agendamentos

**Componentes:**
- `QueuePanel.tsx` - Gerencia fila de espera com algoritmo inteligente

### 6.3 PDV (Ponto de Venda)
**Arquivo:** `modules/pdv/PointOfSale.tsx` (796 linhas)

**Funcionalidades:**
- Carrinho de compras
- Seleção de cliente (obrigatória)
- Serviços e produtos
- Múltiplas formas de pagamento
- Descontos automáticos (aniversário, win-back)
- Gorjetas

### 6.4 Clientes (CRM)
**Arquivo:** `modules/clients/Clients.tsx`

**Funcionalidades:**
- Cadastro completo
- Histórico de visitas
- Pontos de fidelidade
- Tags e notas
- Preferências
- Dependentes (família)
- Sistema de indicações

### 6.5 Financeiro
**Arquivo:** `modules/finance/Finance.tsx` (955 linhas)

**Funcionalidades:**
- Dashboard financeiro
- Despesas (fixas e variáveis)
- Comissões por barbeiro
- Pagamentos (payouts)
- Fechamento de caixa (cego)
- Relatórios

### 6.6 Catálogo
**Arquivo:** `modules/catalog/Catalog.tsx`

**Funcionalidades:**
- Gestão de serviços
- Gestão de produtos
- Categorias
- Estoque
- Preços e custos

### 6.7 Configurações
**Arquivo:** `modules/settings/Settings.tsx` (1118 linhas - MAIOR ARQUIVO)

**Funcionalidades:**
- Perfil da loja
- Gestão da equipe
- Planos de comissão
- Horários de funcionamento
- Configurações do sistema
- Website builder
- Integrações

### 6.8 Barber Club (Assinaturas)
**Arquivos:** `modules/barber-club/` ✅ MÓDULO BEM ESTRUTURADO

**Funcionalidades:**
- Planos de assinatura
- Créditos mensais
- Descontos em produtos
- Dashboard de assinantes
- Gestão de planos

### 6.9 Smart/Dynamic Pricing
**Arquivos:** `modules/dynamic-pricing/` ✅ MÓDULO BEM ESTRUTURADO

**Funcionalidades:**
- Preços por demanda
- Horários de pico
- Multiplicadores
- Engine de precificação

### 6.10 Online Booking
**Arquivo:** `modules/online-booking/OnlineBookingWizard.tsx`

**Funcionalidades:**
- Wizard de agendamento
- Seleção de serviço
- Seleção de profissional
- Seleção de horário
- Confirmação

### 6.11 Super Admin
**Arquivos:** `modules/super-admin/`

**Funcionalidades:**
- Dashboard SaaS
- Gestão de tenants
- Planos e preços
- Parceiros/afiliados
- Suporte
- Faturamento
- Marketing
- Marketplace
- Configurações globais

### 6.12 Website Builder
**Arquivos:** `modules/website/`

**Funcionalidades:**
- Site público da barbearia
- Landing page SaaS
- Editor visual
- Temas customizáveis

---

## 7. REGRAS DE NEGÓCIO

### 7.1 Sistema de Fila Inteligente
**Local:** `modules/agenda/components/QueuePanel.tsx`

```typescript
type QueueDistributionRule = 'FAIRNESS' | 'SPEED' | 'MANUAL';

// FAIRNESS: Prioriza barbeiro que atendeu MENOS hoje (equilibra comissões)
// SPEED: Prioriza quem desocupa PRIMEIRO (minimiza espera)
// MANUAL: Recepcionista escolhe
```

**Cálculo de tempo de espera:**
```
Tempo = (Restante do corte atual) + (Soma dos cortes na fila do barbeiro)
```

### 7.2 Cálculo de Comissões
**Local:** `modules/finance/Finance.tsx`

**Modelos de Compensação:**
```typescript
enum CompensationModel {
  PERCENTAGE,    // Split (ex: 50/50)
  CHAIR_RENTAL,  // Aluguel fixo da cadeira
  OWNER          // 100% para o dono
}
```

**Regra de Desconto:**
```typescript
type DiscountAllocation = 'SHARED' | 'SHOP_ABSORBS';

// SHARED: Desconto divide entre barbeiro e loja
// SHOP_ABSORBS: Loja absorve todo o desconto
```

### 7.3 Fidelidade e Gamificação
**Local:** `modules/clients/Clients.tsx`

```
1 visita = 1 selo
10 selos = Recompensa (corte grátis)

Tiers: BRONZE → SILVER → GOLD → PLATINUM → DIAMOND
```

**Fidelidade ao profissional:**
```
Se cliente cortar X vezes seguidas com mesmo barbeiro → LOYAL
Se cortar com outro → Quebra sequência
```

### 7.4 Descontos Automáticos (PDV)
**Local:** `modules/pdv/PointOfSale.tsx`

```typescript
// Ao selecionar cliente:
1. Verifica aniversário (mês/dia = hoje?)
2. Verifica win-back (última visita > X dias?)
3. Aplica desconto automaticamente
```

### 7.5 Fechamento de Caixa (Cego)
**Local:** `modules/finance/components/RegisterClosureModal.tsx`

```
1. Barbeiro informa valor ANTES de ver esperado
2. Sistema calcula diferença (sobra/quebra)
3. Registra para auditoria
```

### 7.6 Smart Breaks
**Local:** `modules/settings/modals/StaffModal.tsx`

```typescript
smartBreak: {
  enabled: boolean;
  clientsPerCycle: number;  // A cada X clientes
  durationMinutes: number;  // Pausa de Y minutos
}
```

### 7.7 Agendamento Online
**Local:** `modules/online-booking/OnlineBookingWizard.tsx`

**Fluxo:**
```
1. Seleciona serviço
2. Seleciona profissional (ou "qualquer um")
3. Seleciona data
4. Seleciona horário disponível
5. Confirma dados
6. Agendamento criado
```

**Cálculo de slots disponíveis:**
```typescript
function getAvailableSlots(date, staffId, duration) {
  // Pega workSchedule do staff
  // Remove appointments existentes
  // Remove breaks (almoço, etc)
  // Retorna slots livres
}
```

---

## 8. TIPOS E CONTRATOS

### 8.1 Arquivo Principal
**Arquivo:** `src/types.ts` (567 linhas)

### 8.2 Enums Importantes

```typescript
enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CHECKED_IN = 'CHECKED_IN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  BLOCKED = 'BLOCKED',
  NO_SHOW_PENDING = 'NO_SHOW_PENDING',
  NO_SHOW = 'NO_SHOW'
}

enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  GOOGLE_PAY = 'GOOGLE_PAY',
  APPLE_PAY = 'APPLE_PAY',
  MERCADO_PAGO = 'MERCADO_PAGO',
  // ...
}

enum CompensationModel {
  PERCENTAGE = 'PERCENTAGE',
  CHAIR_RENTAL = 'CHAIR_RENTAL',
  OWNER = 'OWNER'
}
```

### 8.3 Interfaces Principais

```typescript
interface StaffMember {
  id: string;
  name: string;
  role: 'OWNER' | 'ADMIN' | 'BARBER' | 'ASSISTANT' | 'STAFF' | 'SUPER_ADMIN';
  email?: string;
  commissionModel: CompensationModel;
  serviceCommissionRate: number;
  productCommissionRate: number;
  workSchedule: DaySchedule[];
  smartBreak?: { enabled: boolean; clientsPerCycle: number; durationMinutes: number };
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  totalSpent: number;
  loyaltyPoints?: number;
  lastVisit?: Date;
  preferredStaffId?: string;
  tags?: ClientTag[];
}

interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  staffId: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  price: number;
  status: AppointmentStatus;
}

interface Sale {
  id: string;
  clientId: string | null;
  staffId: string;
  items: CartItem[];
  total: number;
  date: Date;
  method: PaymentMethod;
  tip?: number;
}

interface Tenant {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  planId: SaasPlanId;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'CANCELLED';
}
```

### 8.4 ViewState (28 views)
```typescript
type ViewState = 
  | 'DASHBOARD' | 'AGENDA' | 'PDV' | 'CLIENTS' | 'FINANCE' 
  | 'CATALOG' | 'SETTINGS' | 'MY_PLAN' | 'GROWTH' 
  | 'SMART_PRICING' | 'BARBER_CLUB' | 'REFERRALS' 
  | 'WEBSITE_EDITOR' | 'SUPER_ADMIN_DASHBOARD' 
  | 'SUPER_ADMIN_TENANTS' | 'SUPER_ADMIN_PLANS' 
  | 'SUPER_ADMIN_PARTNERS' | 'SUPER_ADMIN_SYSTEM' 
  | 'SUPER_ADMIN_SUPPORT' | 'SUPER_ADMIN_BILLING' 
  | 'SUPER_ADMIN_SETTINGS' | 'SUPER_ADMIN_MARKETING' 
  | 'SUPER_ADMIN_MARKETPLACE' | 'SUPER_ADMIN_CMS' 
  | 'SAAS_LANDING' | 'AUTH' | 'ONLINE_BOOKING' 
  | 'TIPS_REVIEW' | 'PUBLIC_WEBSITE' | 'SUPER_OFFICE_V2';
```

---

## 9. ESTADO ATUAL (O QUE FUNCIONA)

### 9.1 ✅ Completo e Funcional

| Item | Status | Observação |
|------|--------|------------|
| UI completa | ✅ | 19 módulos com interface |
| Tipos TypeScript | ✅ | 567 linhas bem definidas |
| Dados mock para demo | ✅ | Funciona 100% em localStorage |
| Deploy na Vercel | ✅ | https://barber-gold-alpha.vercel.app |
| Repositório GitHub | ✅ | Versionado e organizado |
| Schema SQL | ✅ | 1318 linhas com RLS |
| Supabase Client | ✅ | Configurado e pronto |
| Mobile-First UI | ✅ | Responsivo e bonito |

### 9.2 ⚠️ Parcialmente Funcional

| Item | Status | Problema |
|------|--------|----------|
| Autenticação | ⚠️ | Fake (email/password hardcoded) |
| Multi-tenancy | ⚠️ | Não filtra por tenant_id |
| Módulos novos | ⚠️ | barber-club e dynamic-pricing bem estruturados, resto não |

### 9.3 ❌ Não Funcional

| Item | Status | Motivo |
|------|--------|--------|
| Conexão com Supabase | ❌ | Schema não executado |
| Persistência real | ❌ | Tudo em localStorage |
| RLS funcionando | ❌ | Políticas não aplicadas |
| Rotas reais | ❌ | Navegação por estado |

---

## 10. O QUE FALTA PARA MVP

### 10.1 Crítico (Bloqueante)

```
[ ] 1. Executar schema SQL no Supabase
[ ] 2. Configurar variáveis de ambiente na Vercel
[ ] 3. Implementar Supabase Auth (substituir login fake)
[ ] 4. Conectar módulo Clients ao Supabase (piloto)
[ ] 5. Conectar módulo Appointments ao Supabase
[ ] 6. Conectar módulo Sales ao Supabase
```

### 10.2 Importante (Lançamento)

```
[ ] 7. Criar rotas reais com App Router
[ ] 8. Quebrar BarberContext em módulos menores
[ ] 9. Remover dados mock de produção
[ ] 10. Implementar Error Boundaries
[ ] 11. Configurar monitoramento (Sentry)
```

### 10.3 Desejável (Pós-lançamento)

```
[ ] 12. Testes automatizados
[ ] 13. PWA e modo offline
[ ] 14. Notificações push
[ ] 15. Integração WhatsApp
[ ] 16. Relatórios avançados
```

---

## 11. PROBLEMAS CRÍTICOS

### 11.1 🔴 Segurança

**1. Autenticação Fake**
```typescript
// src/context/BarberContext.tsx:371-384
const login = (email: string, pass: string) => {
   const user = staff.find(s => s.email === email && s.password === pass);
   // Senhas visíveis no código fonte!
```
**Solução:** Usar Supabase Auth

**2. Senhas Hardcoded**
```typescript
// src/constants.ts (removidas, mas login ainda verifica)
{ email: 'admin@barberflow.com', password: 'admin' }
```
**Solução:** Remover completamente após auth real

**3. Sem Multi-Tenancy Real**
- Nenhuma query filtra por `tenant_id`
- Todos os tenants veriam mesmos dados
**Solução:** Aplicar RLS + filtros em todas as queries

### 11.2 🟡 Arquitetura

**1. Context Monolítico (677 linhas)**
- 30+ estados diferentes
- 50+ actions
- Re-renders massivos
**Solução:** Quebrar em contextos por domínio

**2. Arquivos Gigantes**
| Arquivo | Linhas |
|---------|--------|
| Settings.tsx | 1118 |
| Finance.tsx | 955 |
| Agenda.tsx | 814 |
| PointOfSale.tsx | 796 |

**Solução:** Extrair componentes e hooks

**3. Navegação por Estado (não rotas)**
```typescript
const [currentView, setView] = useState<ViewState>('SAAS_LANDING');
// 28 views controladas por estado!
```
**Impacto:** Sem deep-linking, botão voltar não funciona, SEO zero
**Solução:** Migrar para App Router com rotas reais

### 11.3 🟠 Qualidade

**1. 103 usos de `any`**
- Type safety comprometida
**Solução:** Tipar corretamente

**2. Zero testes**
- Nenhum arquivo `*.test.*`
**Solução:** Criar suíte de testes

**3. ESLint permissivo**
```javascript
"@typescript-eslint/no-explicit-any": "off"
```
**Solução:** Ativar como warning

---

## 12. MELHORIAS NECESSÁRIAS

### 12.1 Curto Prazo (1-2 semanas)

| Prioridade | Tarefa | Esforço |
|------------|--------|---------|
| P0 | Executar SQL no Supabase | 1h |
| P0 | Configurar env na Vercel | 30min |
| P0 | Implementar Supabase Auth | 3 dias |
| P1 | Criar rotas reais | 3-4 dias |
| P1 | Quebrar BarberContext | 3 dias |

### 12.2 Médio Prazo (3-4 semanas)

| Prioridade | Tarefa | Esforço |
|------------|--------|---------|
| P1 | Conectar todos módulos ao Supabase | 2 semanas |
| P2 | Refatorar Settings.tsx | 3 dias |
| P2 | Refatorar Finance.tsx | 3 dias |
| P2 | Eliminar `any` | 1 semana |

### 12.3 Longo Prazo (1-2 meses)

| Prioridade | Tarefa | Esforço |
|------------|--------|---------|
| P2 | Testes unitários (60% coverage) | 2 semanas |
| P2 | E2E com Playwright | 1 semana |
| P3 | CI/CD com GitHub Actions | 2 dias |
| P3 | PWA e offline | 1 semana |

---

## 13. PADRÕES DE CÓDIGO

### 13.1 Estrutura de Módulo (Golden Path)

```
src/modules/[nome-do-modulo]/
├── types.ts          # Schemas Zod + tipos derivados
├── repository.ts     # Apenas chamadas ao Supabase
├── actions.ts        # Server Actions com validação
├── hooks/
│   └── use[NomeDoModulo].ts
├── components/
│   ├── [NomeDoModulo]Page.tsx
│   └── [NomeDoModulo]Form.tsx
└── index.ts          # Barrel export
```

### 13.2 Exemplo: types.ts

```typescript
import { z } from 'zod';

export const ClientSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  name: z.string().min(2, 'Nome obrigatório'),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/),
  email: z.string().email().optional(),
});

export type Client = z.infer<typeof ClientSchema>;
```

### 13.3 Exemplo: repository.ts

```typescript
import { createClient } from '@/lib/supabase/server';
import type { Client } from './types';

export async function listClients(tenantId: string): Promise<Client[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('tenant_id', tenantId)  // SEMPRE filtrar por tenant
    .order('name');
  
  if (error) throw error;
  return data ?? [];
}
```

### 13.4 Exemplo: actions.ts

```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { ClientSchema } from './types';
import * as repo from './repository';

export async function addClientAction(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const validated = ClientSchema.omit({ id: true }).parse(raw);
  
  await repo.createClient(validated);
  revalidatePath('/clientes');
}
```

### 13.5 Convenções

- **Commit:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- **Arquivos:** PascalCase para componentes, camelCase para funções
- **Tipagem:** Nunca usar `any`, criar interfaces específicas
- **Imports:** Absolutos com `@/` prefix
- **Idioma:** Código em inglês, UI em português

---

## 14. COMO RODAR O PROJETO

### 14.1 Pré-requisitos

```bash
Node.js 18+
npm ou pnpm
Conta no Supabase
Conta na Vercel (opcional)
```

### 14.2 Setup Local

```bash
# 1. Clonar repositório
git clone https://github.com/monetizandooo-braga/barberGold.git
cd barberGold

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais Supabase

# 4. Rodar em desenvolvimento
npm run dev

# 5. Acessar
http://localhost:3000
```

### 14.3 Variáveis de Ambiente

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_APP_MODE=demo  # demo | pilot | prod
```

### 14.4 Setup Supabase

```bash
# 1. Criar projeto no Supabase Dashboard

# 2. Ir em SQL Editor

# 3. Executar supabase/schema-complete.sql

# 4. Verificar tabelas criadas

# 5. Copiar URL e ANON_KEY para .env.local
```

### 14.5 Deploy Vercel

```bash
# 1. Conectar repo ao Vercel

# 2. Configurar Environment Variables:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - NEXT_PUBLIC_APP_MODE=prod

# 3. Deploy automático a cada push
```

---

## 15. ROADMAP DE IMPLEMENTAÇÃO

### FASE 1: Fundação (1-2 semanas)
```
[x] Migração Vite → Next.js
[x] UI completa
[x] Schema SQL definido
[ ] Executar SQL no Supabase
[ ] Configurar env na Vercel
[ ] Supabase Auth
[ ] Rotas reais (App Router)
```

### FASE 2: Core Business (2-3 semanas)
```
[ ] Conectar Clients ao Supabase
[ ] Conectar Appointments ao Supabase
[ ] Conectar Sales ao Supabase
[ ] Conectar Services/Products ao Supabase
[ ] Remover dados mock
```

### FASE 3: Refinamento (2-3 semanas)
```
[ ] Quebrar BarberContext
[ ] Refatorar arquivos grandes
[ ] Eliminar `any`
[ ] Testes básicos
[ ] Error Boundaries
```

### FASE 4: Features Avançadas (4+ semanas)
```
[ ] Agendamento Online público
[ ] Notificações (email/push)
[ ] Integração WhatsApp
[ ] Relatórios avançados
[ ] PWA e modo offline
```

---

## 16. CHECKLIST DE LANÇAMENTO

### Segurança
- [ ] Supabase Auth implementado
- [ ] Senhas hardcoded removidas
- [ ] RLS habilitado em todas tabelas
- [ ] Variáveis de ambiente na Vercel
- [ ] HTTPS forçado
- [ ] Chaves de API não expostas

### Dados
- [ ] Schema SQL executado
- [ ] Migrations versionadas
- [ ] Backup automático
- [ ] Dados mock removidos

### Qualidade
- [ ] Zero erros TypeScript (`tsc --noEmit`)
- [ ] ESLint passando
- [ ] Build sem erros (`npm run build`)
- [ ] Testes passando

### Performance
- [ ] Bundle size < 500KB
- [ ] Lighthouse > 80
- [ ] Imagens otimizadas

### Monitoramento
- [ ] Sentry configurado
- [ ] Analytics ativo
- [ ] Uptime monitoring

### Documentação
- [ ] README atualizado
- [ ] Variáveis documentadas
- [ ] Fluxos críticos documentados

---

## 📎 ARQUIVOS ESSENCIAIS PARA BACKUP

Se precisar salvar o mínimo para reconstruir:

```
ESSENCIAIS:
├── src/types.ts                    # Todos os tipos
├── src/context/BarberContext.tsx   # Toda a lógica atual
├── supabase/schema-complete.sql    # Banco completo
├── package.json                    # Dependências
├── .env.example                    # Variáveis necessárias
└── SISTEMA_COMPLETO.md             # Este documento

DOCUMENTAÇÃO:
├── AI_CONTEXT.md
├── BLUEPRINT.md
└── AUDIT_REPORT.md

MÓDULOS BEM ESTRUTURADOS (referência):
├── src/modules/barber-club/
└── src/modules/dynamic-pricing/
```

---

## 🎯 RESUMO EXECUTIVO

**O QUE O SISTEMA É:**
- SaaS multi-tenant para barbearias
- UI completa e bonita (mobile-first)
- 19 módulos funcionais em modo demo
- Regras de negócio bem definidas

**O QUE O SISTEMA TEM:**
- Frontend: Next.js 16 + React 19 + TypeScript + TailwindCSS
- Backend: Supabase (configurado, não conectado)
- Deploy: Vercel (funcionando)

**O QUE FALTA PARA MVP:**
1. Executar SQL no Supabase
2. Implementar autenticação real
3. Conectar módulos ao banco
4. Criar rotas reais

**NOTA GERAL: 4.9/10**
- UI/UX: ⭐⭐⭐⭐⭐
- Arquitetura: ⭐⭐
- Segurança: ⭐⭐
- Pronto para produção: ❌

**ESTIMATIVA PARA MVP:** 3-4 semanas de trabalho focado

---

*Documento gerado em 20/12/2024 para garantir a continuidade do projeto BarberFlow.*
