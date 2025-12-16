# 🤖 AI CONTEXT - BARBERFLOW

> **Este documento contém TODA a informação necessária para uma IA continuar o desenvolvimento deste projeto.**

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Arquitetura](#arquitetura)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Estado Atual](#estado-atual)
6. [Dívidas Técnicas](#dívidas-técnicas)
7. [Banco de Dados](#banco-de-dados)
8. [Regras de Negócio](#regras-de-negócio)
9. [Fluxos Críticos](#fluxos-críticos)
10. [Tipos TypeScript](#tipos-typescript)
11. [Avaliação Crítica](#avaliação-crítica)
12. [Roadmap de Implementação](#roadmap-de-implementação)
13. [Comandos Úteis](#comandos-úteis)

---

## 🎯 VISÃO GERAL

**BarberFlow** é um SaaS Multi-tenant de gestão para barbearias, desenvolvido em Next.js 16 com Supabase como backend.

### Objetivo do Produto
Sistema completo para gestão de barbearias incluindo:
- Agenda e agendamentos
- Ponto de Venda (PDV)
- Gestão de clientes (CRM)
- Controle financeiro e comissões
- Gestão de estoque
- Website público para cada barbearia
- Painel Super Admin para gestão do SaaS

### Público-Alvo
- Donos de barbearias (OWNER)
- Barbeiros/Staff
- Clientes (agendamento online)

### Modelo de Negócio
- SaaS com planos: FREE, SOLO, SOLO_PRO, EQUIPE, STUDIO, ENTERPRISE
- Preços em BRL (Brasil)
- Multi-tenant com isolamento por RLS

---

## 🛠 STACK TECNOLÓGICA

### Frontend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 16.0.10 | Framework React |
| React | 19.2.1 | UI Library |
| TypeScript | 5.x | Tipagem |
| TailwindCSS | 4.x | Estilização |
| Lucide React | 0.561.0 | Ícones |
| Recharts | 3.6.0 | Gráficos |
| date-fns | 4.1.0 | Manipulação de datas |
| react-hook-form | 7.68.0 | Formulários |
| zod | 4.2.1 | Validação |

### Backend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Supabase | - | Auth, Database, Storage |
| @supabase/supabase-js | 2.87.3 | Cliente Supabase |
| @supabase/ssr | 0.8.0 | SSR Support |

### Deploy
| Serviço | Função |
|---------|--------|
| Vercel | Hosting e Deploy |
| GitHub | Repositório |
| Supabase | Backend |

### URLs
- **Produção:** https://barber-gold-alpha.vercel.app
- **Repositório:** https://github.com/monetizandooo-braga/barberGold

---

## 🏗 ARQUITETURA

### Padrão Atual
O projeto usa uma arquitetura **híbrida** com:
- **Client-Side Rendering** (CSR) para toda a aplicação
- **Context API** para estado global
- **localStorage** para persistência local
- **Navegação por estado** (não por URL)

### Padrão Desejado (Vertical Slices)
```
src/modules/{nome-do-modulo}/
├── types.ts        # Tipagem Zod + Types do Banco + Types de UI
├── repository.ts   # Apenas chamadas ao Supabase (Data Layer)
├── actions.ts      # Server Actions (Next.js) com validação Zod
├── hooks/          # Custom hooks para consumir dados
├── components/     # Componentes visuais exclusivos do módulo
└── index.ts        # Barrel export
```

### Fluxo de Dados Atual
```
UI → Context → localStorage
```

### Fluxo de Dados Desejado
```
UI → Hook/Action → Repository → Supabase → RLS → Dados
```

---

## 📁 ESTRUTURA DE PASTAS

```
barberApp-temp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Layout principal
│   │   └── page.tsx            # Página inicial (153 linhas)
│   │
│   ├── components/             # Componentes globais
│   │   ├── Layout.tsx          # Layout wrapper
│   │   ├── Sidebar.tsx         # Menu lateral (315 linhas)
│   │   ├── SubscriptionGuard.tsx # Guard de planos
│   │   ├── shared/
│   │   │   └── ImageUpload.tsx
│   │   └── widgets/
│   │       └── DailyGoalWidget.tsx
│   │
│   ├── context/                # Estado global
│   │   ├── BarberContext.tsx   # Context principal (693 linhas) ⚠️ MONOLÍTICO
│   │   ├── ReferralContext.tsx # Context de referrals
│   │   └── SaasV2Context.tsx   # Context SaaS V2
│   │
│   ├── hooks/                  # Hooks customizados
│   │   ├── useCurrentReferralPartner.ts
│   │   ├── useDashboardStats.ts
│   │   └── useFeatureGate.ts
│   │
│   ├── lib/                    # Configurações
│   │   ├── supabase/
│   │   │   ├── client.ts       # Cliente browser
│   │   │   ├── server.ts       # Cliente server
│   │   │   ├── middleware.ts   # Middleware auth
│   │   │   └── index.ts        # Barrel export
│   │   └── database.types.ts   # Tipos do banco
│   │
│   ├── modules/                # Módulos de domínio (17 módulos)
│   │   ├── agenda/             # Calendário e agendamentos
│   │   │   ├── Agenda.tsx      # (674 linhas)
│   │   │   └── components/
│   │   │       └── QueuePanel.tsx # Fila de espera
│   │   ├── auth/
│   │   │   └── Login.tsx
│   │   ├── catalog/
│   │   │   └── Catalog.tsx     # Serviços e produtos
│   │   ├── clients/
│   │   │   ├── Clients.tsx     # CRM
│   │   │   └── MyReferralsPanel.tsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   └── PlanSummaryCard.tsx
│   │   ├── finance/
│   │   │   ├── Finance.tsx     # (936 linhas) ⚠️ GRANDE
│   │   │   └── components/
│   │   │       ├── ExpenseQuickAdd.tsx
│   │   │       └── RegisterClosureModal.tsx
│   │   ├── growth/
│   │   │   ├── GrowthCommand.tsx
│   │   │   └── ReferralManager.tsx
│   │   ├── office-v2/          # Super Admin V2
│   │   │   ├── SuperOfficeV2.tsx
│   │   │   ├── PlansV2.tsx
│   │   │   ├── TenantDetailsV2.tsx
│   │   │   └── TenantsListV2.tsx
│   │   ├── online-booking/
│   │   │   └── OnlineBookingWizard.tsx
│   │   ├── pdv/
│   │   │   └── PointOfSale.tsx # Ponto de Venda
│   │   ├── plan/
│   │   │   └── MyPlan.tsx
│   │   ├── referrals/
│   │   │   └── ReferralDashboard.tsx
│   │   ├── settings/
│   │   │   ├── Settings.tsx    # (1092 linhas) ⚠️ MUITO GRANDE
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
│   │   ├── smart-pricing/
│   │   ├── super-admin/        # Painel Admin SaaS
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
│   │   ├── tips/
│   │   └── website/
│   │       ├── SaasLandingPage.tsx
│   │       ├── Website.tsx
│   │       └── WebsiteBuilder.tsx
│   │
│   ├── providers/
│   ├── utils/
│   ├── constants.ts            # Dados mock (408 linhas)
│   └── types.ts                # Tipos globais (533 linhas)
│
├── supabase/
│   └── schema.sql              # Schema do banco (353 linhas)
│
├── middleware.ts               # Middleware Next.js
├── package.json
├── tsconfig.json
├── BLUEPRINT.md                # Documentação técnica
└── AI_CONTEXT.md               # Este arquivo
```

---

## 📊 ESTADO ATUAL

### ✅ Concluído
| Item | Status |
|------|--------|
| Migração Vite → Next.js | ✅ |
| UI completa (17 módulos) | ✅ |
| Tipos TypeScript | ✅ |
| Dados mock para demo | ✅ |
| Supabase Client configurado | ✅ |
| Schema SQL criado | ✅ |
| RLS Policies definidas | ✅ |
| Deploy na Vercel | ✅ |
| Repositório GitHub | ✅ |

### ❌ Pendente (CRÍTICO)
| Item | Prioridade |
|------|------------|
| Executar SQL no Supabase | 🔴 URGENTE |
| Autenticação real (Supabase Auth) | 🔴 CRÍTICO |
| Conectar módulos ao Supabase | 🔴 CRÍTICO |
| Variáveis de ambiente na Vercel | 🔴 CRÍTICO |

### ⚠️ Pendente (Importante)
| Item | Prioridade |
|------|------------|
| Quebrar BarberContext em módulos | 🟡 ALTO |
| Implementar rotas reais (App Router) | 🟡 ALTO |
| Validação Zod em formulários | 🟡 ALTO |
| Remover dados mock | 🟡 MÉDIO |

---

## 🔴 DÍVIDAS TÉCNICAS

### 1. Context Monolítico (CRÍTICO)
**Arquivo:** `src/context/BarberContext.tsx` (693 linhas)

**Problema:** Um único Context gerencia TODO o estado:
- 30+ estados diferentes
- 50+ actions
- Autenticação, vendas, clientes, staff, financeiro... TUDO junto

**Impacto:**
- Re-renders desnecessários
- Impossível testar isoladamente
- Manutenção extremamente difícil

**Solução:** Quebrar em contextos menores por domínio.

### 2. Arquivos Gigantes (ALTO)
| Arquivo | Linhas | Problema |
|---------|--------|----------|
| `Settings.tsx` | 1092 | Faz tudo: shop, team, commissions |
| `Finance.tsx` | 936 | Dashboard + Expenses + Payouts |
| `BarberContext.tsx` | 693 | Context monolítico |
| `Agenda.tsx` | 674 | Calendário + Modal + Queue |

**Regra:** Nenhum arquivo deveria ter mais de 300-400 linhas.

### 3. Autenticação Fake (CRÍTICO)
```typescript
// ATUAL - INSEGURO!
const login = (email: string, pass: string) => {
   const user = staff.find(s => s.email === email && s.password === pass);
   // Senhas em texto puro no código!
```

**Solução:** Usar Supabase Auth.

### 4. Navegação por Estado (MÉDIO)
```typescript
// ATUAL
const [currentView, setView] = useState<ViewState>('DASHBOARD');
// 28 views diferentes controladas por estado!
```

**Impacto:**
- Sem deep linking
- Botão voltar não funciona
- Sem SSR/SSG
- SEO inexistente

**Solução:** Migrar para App Router com rotas reais.

### 5. Sem Multi-Tenancy Real (CRÍTICO)
**Problema:** Não há `tenant_id` nas queries, dados são globais no localStorage.

**Solução:** Usar RLS do Supabase (já configurado no schema).

---

## 🗄 BANCO DE DADOS

### Tabelas (9 tabelas)
```sql
tenants        -- Barbearias/Lojas (Multi-tenant root)
profiles       -- Staff/Funcionários
clients        -- Clientes
services       -- Serviços oferecidos
products       -- Produtos à venda
appointments   -- Agendamentos
sales          -- Vendas
sale_items     -- Itens da venda
expenses       -- Despesas
```

### Relacionamentos
```
tenants (1) ──── (N) profiles
tenants (1) ──── (N) clients
tenants (1) ──── (N) services
tenants (1) ──── (N) products
tenants (1) ──── (N) appointments
tenants (1) ──── (N) sales
tenants (1) ──── (N) expenses

clients (1) ──── (N) appointments
profiles (1) ──── (N) appointments
services (1) ──── (N) appointments

sales (1) ──── (N) sale_items
```

### RLS (Row Level Security)
Todas as tabelas têm RLS habilitado para isolamento multi-tenant:
- Cada usuário só vê dados do seu tenant
- Owner pode gerenciar tudo do tenant
- Staff tem acesso limitado

### Schema SQL
**Arquivo:** `supabase/schema.sql` (353 linhas)

**STATUS:** ⚠️ NÃO EXECUTADO NO SUPABASE

---

## 🧠 REGRAS DE NEGÓCIO

### 1. Sistema de Fila Inteligente
**Local:** `modules/agenda/components/QueuePanel.tsx`

Gerencia clientes sem hora marcada (Walk-ins):
- **FAIRNESS:** Prioriza barbeiro que atendeu menos
- **SPEED:** Prioriza quem desocupa primeiro
- **MANUAL:** Recepcionista escolhe

### 2. Cálculo de Comissões
**Local:** `modules/finance/Finance.tsx`

Modelos de compensação:
- **PERCENTAGE:** Split clássico (ex: 50/50)
- **CHAIR_RENTAL:** Barbeiro paga aluguel fixo
- **OWNER:** 100% para o dono

Regra de desconto:
- **SHARED:** Desconto dividido entre casa e barbeiro
- **SHOP_ABSORBS:** Casa absorve todo desconto

### 3. Fidelidade & Gamificação
**Local:** `modules/clients/Clients.tsx`

- 1 visita = 1 selo
- 10 selos = Recompensa
- Ranks: Bronze, Silver, Gold, Diamond

### 4. Controle de Caixa
**Local:** `modules/finance/components/RegisterClosureModal.tsx`

- **Fechamento Cego:** Barbeiro informa valor antes de ver esperado
- **Reconciliação:** Sistema calcula diferença

### 5. Smart Breaks
**Local:** `modules/settings/modals/StaffModal.tsx`

Cada barbeiro define seu ritmo:
- Ex: A cada 3 clientes, 15 min de pausa

### 6. Agendamento Online
**Local:** `modules/online-booking/OnlineBookingWizard.tsx`

Fluxo: Serviço → Profissional → Data/Hora → Confirmação

---

## ⚙️ FLUXOS CRÍTICOS

### Agendamento
```
1. Verifica disponibilidade do Staff no dia (workSchedule)
2. Verifica competência do Staff (allowedServices)
3. Detecta colisão com date-fns/areIntervalsOverlapping
4. Cria appointment com status SCHEDULED
```

### Venda (PDV)
```
1. Seleciona cliente (obrigatório)
2. Adiciona itens ao carrinho (serviços/produtos)
3. Aplica desconto automático (aniversário, win-back)
4. Processa pagamento
5. Atualiza estoque e pontos de fidelidade
6. Registra venda e comissão
```

### Login
```
1. Busca usuário em staff array (MOCK!)
2. Compara senha em texto puro (INSEGURO!)
3. Define currentUser no Context
4. Redireciona baseado em role
```

---

## 📝 TIPOS TYPESCRIPT

### Principais Entidades

```typescript
// Usuário/Staff
interface StaffMember {
  id: string;
  name: string;
  role: 'OWNER' | 'ADMIN' | 'BARBER' | 'ASSISTANT' | 'STAFF' | 'SUPER_ADMIN';
  email?: string;
  commissionModel: CompensationModel;
  serviceCommissionRate: number;
  productCommissionRate: number;
  workSchedule: DaySchedule[];
}

// Cliente
interface Client {
  id: string;
  name: string;
  phone: string;
  totalSpent: number;
  loyaltyPoints?: number;
  lastVisit?: Date;
}

// Agendamento
interface Appointment {
  id: string;
  clientId: string;
  staffId: string;
  serviceId: string;
  date: Date;
  status: AppointmentStatus;
}

// Venda
interface Sale {
  id: string;
  clientId: string | null;
  staffId: string;
  items: CartItem[];
  total: number;
  method: PaymentMethod;
}

// Tenant (Multi-tenant)
interface Tenant {
  id: string;
  name: string;
  ownerName: string;
  planId: SaasPlanId;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'CANCELLED';
}
```

### Enums Importantes

```typescript
enum AppointmentStatus {
  SCHEDULED, COMPLETED, CANCELLED, BLOCKED
}

enum PaymentMethod {
  CASH, CREDIT_CARD, DEBIT_CARD, PIX, ...
}

enum CompensationModel {
  PERCENTAGE, CHAIR_RENTAL, OWNER
}

type SaasPlanId = 'FREE' | 'SOLO' | 'SOLO_PRO' | 'EQUIPE' | 'STUDIO' | 'ENTERPRISE';
```

---

## 🔍 AVALIAÇÃO CRÍTICA

### Pontos Fortes
| Aspecto | Nota | Comentário |
|---------|------|------------|
| UI/UX | ⭐⭐⭐⭐⭐ | Moderna, bonita, mobile-first |
| Tipagem | ⭐⭐⭐⭐ | 533 linhas de tipos bem definidos |
| Funcionalidades | ⭐⭐⭐⭐⭐ | Sistema completo com 17 módulos |
| Regras de Negócio | ⭐⭐⭐⭐ | Bem pensadas para o domínio |

### Pontos Fracos
| Aspecto | Nota | Comentário |
|---------|------|------------|
| Arquitetura | ⭐⭐ | Context monolítico, sem separação |
| Segurança | ⭐ | Autenticação fake, senhas em texto |
| Escalabilidade | ⭐⭐ | localStorage não escala |
| Testabilidade | ⭐ | Impossível testar Context monolítico |
| SEO | ⭐ | Sem SSR, sem rotas reais |

### Nota Final: 6/10
**Justificativa:** UI excelente, regras de negócio sólidas, mas arquitetura precisa de refatoração significativa para produção.

---

## 🗺 ROADMAP DE IMPLEMENTAÇÃO

### FASE 1: Fundação (1-2 semanas)
```
[ ] 1. Executar SQL no Supabase
[ ] 2. Configurar variáveis na Vercel
[ ] 3. Implementar Supabase Auth (login real)
[ ] 4. Criar rotas reais com App Router
[ ] 5. Quebrar BarberContext em módulos menores
```

### FASE 2: Core Business (2-3 semanas)
```
[ ] 6. Conectar módulo Clients ao Supabase
[ ] 7. Conectar módulo Appointments ao Supabase
[ ] 8. Conectar módulo Sales ao Supabase
[ ] 9. Conectar módulo Services/Products ao Supabase
[ ] 10. Remover dados mock
```

### FASE 3: Features Avançadas (3-4 semanas)
```
[ ] 11. Agendamento Online público
[ ] 12. Notificações (email/push)
[ ] 13. Integração WhatsApp
[ ] 14. Relatórios avançados
[ ] 15. PWA e modo offline
```

---

## 💻 COMANDOS ÚTEIS

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Deploy
git add .
git commit -m "feat: descrição"
git push origin main
# Vercel faz deploy automático

# Lint
npm run lint
```

### Variáveis de Ambiente
```env
# .env.local (criar manualmente)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

---

## 📌 NOTAS PARA A IA

### Ao fazer alterações:
1. **Multi-tenant First:** Toda query deve filtrar por `tenant_id`
2. **Tipagem Forte:** Não use `any`, estenda tipos do banco
3. **Segurança:** Use Server Actions para mutações
4. **Mobile First:** UI deve ser perfeita no celular
5. **Idioma:** Documente em Português (Brasil)

### Padrão de Commit:
```
feat: nova funcionalidade
fix: correção de bug
chore: manutenção
docs: documentação
refactor: refatoração
```

### Arquivos Principais para Entender o Sistema:
1. `src/context/BarberContext.tsx` - Estado e lógica principal
2. `src/types.ts` - Todos os tipos
3. `supabase/schema.sql` - Estrutura do banco
4. `src/app/page.tsx` - Entry point e navegação
5. `BLUEPRINT.md` - Regras de negócio detalhadas

---

*Documento gerado em 16/12/2024 para auxiliar IAs no desenvolvimento do BarberFlow.*
