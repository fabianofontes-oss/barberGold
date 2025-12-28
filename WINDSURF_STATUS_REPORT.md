# WINDSURF STATUS REPORT - BarberGold
**Data:** 28 de Dezembro de 2024  
**Versão:** 0.1.0  
**Status:** Em Desenvolvimento Ativo

---

## 1) IDENTIDADE DO PROJETO

### O que o sistema faz
BarberGold é um sistema SaaS multi-tenant completo para gestão de barbearias e salões de beleza. O sistema oferece agendamento online, controle de caixa (PDV), gestão de clientes com CRM, controle de estoque e inventário, gestão de equipe com comissões, relatórios financeiros, programa de indicações (referral), e um website/landing page personalizável para cada estabelecimento. O sistema suporta múltiplos planos (FREE, SOLO, EQUIPE, STUDIO, ENTERPRISE) com diferentes níveis de funcionalidades.

### Usuários e Áreas
- **SUPER_ADMIN**: Administração global da plataforma SaaS
- **OWNER**: Dono da barbearia (acesso total ao tenant)
- **ADMIN**: Administrador do estabelecimento
- **BARBER/STAFF**: Barbeiros e funcionários (acesso limitado)
- **ASSISTANT**: Assistentes (acesso ainda mais limitado)
- **CLIENTE**: Usuários finais que fazem agendamentos online

### Principais Rotas/Páginas
- `/` - Landing page pública
- `/login` - Autenticação
- `/register` - Cadastro de novos estabelecimentos
- `/app/dashboard` - Dashboard principal
- `/app/agenda` - Agenda e agendamentos
- `/app/pdv` - Ponto de Venda (caixa)
- `/app/clients` - Gestão de clientes (CRM)
- `/app/catalog` - Serviços, produtos e estoque
- `/app/finance` - Financeiro e relatórios
- `/app/settings` - Configurações (equipe, comissões, pagamentos)
- `/app/referrals` - Programa de indicações
- `/app/website` - Editor de website personalizado
- `/app/super-admin` - Painel administrativo global
- `/book` - Agendamento online público

---

## 2) STACK E EXECUÇÃO

### Framework e Linguagem
- **Framework:** Next.js 16.0.10 (App Router com Turbopack)
- **Linguagem:** TypeScript 5.x
- **Runtime:** Node.js (React 19.2.1)

### Bibliotecas Principais
- **UI:** Lucide React (ícones), TailwindCSS 4.x, Recharts (gráficos)
- **Forms:** React Hook Form + Zod (validação)
- **Backend/DB:** Supabase (@supabase/supabase-js 2.87.3, @supabase/ssr 0.8.0)
- **Auth:** Supabase Auth
- **Pagamentos:** Stripe 20.1.0
- **Utilidades:** date-fns 4.1.0, qrcode.react 4.2.0
- **i18n:** next-intl 4.6.1

### Como Rodar Local
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Copiar .env.local.example para .env.local e preencher:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - STRIPE_SECRET_KEY (opcional)

# Rodar em desenvolvimento
npm run dev
# Acessa em http://localhost:3000
```

### Como Buildar e Testar
```bash
# Lint (verificar código)
npm run lint

# Build de produção
npm run build

# Rodar build de produção
npm run start

# Não há testes automatizados configurados
```

---

## 3) ARQUITETURA ATUAL (MAPA)

### Estrutura de Pastas (Top-Level)
```
barberGold/
├── src/
│   ├── app/                    # Next.js App Router (rotas)
│   │   ├── app/               # Rotas autenticadas (/app/*)
│   │   ├── api/               # API routes (webhooks)
│   │   ├── login/             # Autenticação
│   │   ├── register/          # Cadastro
│   │   └── book/              # Agendamento público
│   ├── modules/               # Módulos de negócio (27 módulos)
│   ├── components/            # Componentes compartilhados
│   ├── context/               # Context API (estado global)
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Bibliotecas e utilitários
│   ├── domain/                # Lógica de domínio
│   ├── repositories/          # Camada de dados
│   ├── types/                 # Definições TypeScript
│   └── locales/               # Traduções (i18n)
├── supabase/
│   └── migrations/            # Migrações SQL (7 arquivos)
└── public/                    # Assets estáticos
```

### Onde Fica Cada Coisa

**UI (Componentes Visuais):**
- `src/components/` - Componentes compartilhados (Sidebar, ImageUpload, MaskedInput)
- `src/modules/*/components/` - Componentes específicos de cada módulo
- `src/modules/*/modals/` - Modais (StaffModal, ServiceModal, etc.)

**State Management:**
- `src/context/BarberContext.tsx` - Context principal (estado global do app)
- `src/context/SaasV2Context.tsx` - Context SaaS multi-tenant
- `src/context/ReferralContext.tsx` - Context de indicações
- `src/context/slices/` - Slices de estado (referral, tenant plan)

**Services/API Calls:**
- `src/modules/*/actions.ts` - Server Actions (Next.js)
- `src/modules/*/repository.ts` - Camada de dados (Supabase)
- `src/repositories/` - Repositories compartilhados

**Banco/Persistência:**
- `src/lib/supabase/` - Cliente Supabase (client, server, middleware)
- `supabase/migrations/` - Schema do banco de dados
- Tabelas principais: tenants, profiles, staff, services, products, clients, appointments, sales, inventory, commission_plans, categories, suppliers

**Auth:**
- `src/lib/supabase/server.ts` - Autenticação server-side
- `src/lib/auth/getCurrentProfile.ts` - Helper de autenticação
- `src/app/auth/callback/route.ts` - Callback OAuth
- Middleware: `middleware.ts` (proteção de rotas)

### Módulos Existentes (27 módulos)
1. **agenda** - Agenda e agendamentos
2. **appointments** - Gestão de agendamentos
3. **auth** - Autenticação
4. **barber-club** - Clube de benefícios
5. **catalog** - Catálogo (serviços, produtos, estoque)
6. **categories** - Categorias
7. **clients** - CRM de clientes
8. **commission** - Planos de comissão
9. **dashboard** - Dashboard e métricas
10. **dynamic-pricing** - Precificação dinâmica
11. **finance** - Financeiro e relatórios
12. **growth** - Crescimento e marketing
13. **inventory** - Controle de estoque
14. **office-v2** - Escritório virtual
15. **onboarding** - Onboarding de novos usuários
16. **online-booking** - Agendamento online
17. **pdv** - Ponto de Venda (caixa)
18. **plan** - Gestão de planos SaaS
19. **products** - Produtos
20. **referrals** - Programa de indicações
21. **sales** - Vendas
22. **services** - Serviços
23. **settings** - Configurações
24. **smart-pricing** - Precificação inteligente
25. **staff** - Gestão de equipe
26. **super-admin** - Administração global
27. **suppliers** - Fornecedores
28. **tips** - Gorjetas
29. **website** - Editor de website

---

## 4) PERSISTÊNCIA E AUTH (REALIDADE)

### Onde os Dados Estão Sendo Salvos

**✅ PERSISTÊNCIA REAL (Supabase):**
- **Serviços** - Tabela `services` (carregados via `useServices` hook)
- **Produtos** - Tabela `products` (em implementação)
- **Clientes** - Tabela `clients` (em implementação)
- **Categorias** - Tabela `categories` (carregados via `useCategories`)
- **Fornecedores** - Tabela `suppliers` (carregados via `useSuppliers`)
- **Estoque** - Tabela `inventory` (carregado via `useInventory`)
- **Planos de Comissão** - Tabela `commission_plans` (✅ RECÉM-IMPLEMENTADO via server actions)
- **Staff** - Tabela `staff` (✅ RECÉM-IMPLEMENTADO via server actions)
- **Tenants** - Tabela `tenants` (multi-tenancy)
- **Profiles** - Tabela `profiles` (usuários)

**❌ AINDA EM MEMÓRIA (LocalStorage/Mock):**
- **Agendamentos** - Estado local (BarberContext)
- **Vendas/Caixa** - Estado local (BarberContext)
- **Despesas** - Estado local (BarberContext)
- **Pagamentos de Staff** - Estado local (BarberContext)
- **Fechamentos de Caixa** - Estado local (BarberContext)
- **Configurações da Loja** - Estado local (BarberContext)

### Entidades Existentes

**Entidades Principais:**
1. **Tenant** - Estabelecimento (multi-tenant)
2. **Profile** - Usuário do sistema
3. **Staff** - Membros da equipe
4. **Client** - Clientes finais
5. **Service** - Serviços oferecidos
6. **Product** - Produtos vendidos
7. **Appointment** - Agendamentos
8. **Sale** - Vendas realizadas
9. **Inventory** - Itens de estoque
10. **SupplyTransaction** - Transações de estoque
11. **Category** - Categorias (serviços/produtos/fornecedores)
12. **Supplier** - Fornecedores
13. **CommissionPlan** - Planos de comissão
14. **Expense** - Despesas
15. **StaffPayment** - Pagamentos a funcionários
16. **RegisterClosure** - Fechamentos de caixa
17. **ReferralPartner** - Parceiros de indicação
18. **ReferralSale** - Vendas por indicação

### Como o Login Funciona

**✅ AUTENTICAÇÃO REAL (Supabase Auth):**
- **Implementação:** `src/lib/supabase/` (client, server, middleware)
- **Fluxo:**
  1. Login via email/senha em `/login`
  2. Supabase Auth valida credenciais
  3. Session armazenada em cookies (SSR-safe)
  4. Middleware protege rotas `/app/*`
  5. Profile carregado de `profiles` table
  6. Tenant_id usado para multi-tenancy

- **Arquivos principais:**
  - `src/app/login/page.tsx` - UI de login
  - `src/modules/auth/actions.ts` - Server actions de auth
  - `middleware.ts` - Proteção de rotas
  - `src/lib/auth/getCurrentProfile.ts` - Helper de perfil

**Funcionalidades de Auth:**
- ✅ Login com email/senha
- ✅ Cadastro de novos usuários
- ✅ Reset de senha (`/forgot-password`, `/reset-password`)
- ✅ Proteção de rotas via middleware
- ✅ Multi-tenancy (tenant_id em profiles)
- ✅ Roles (OWNER, ADMIN, BARBER, ASSISTANT, SUPER_ADMIN)
- ❌ Login social (Google) - código presente mas não funcional

---

## 5) "NUNCA TERMINA" — DIAGNÓSTICO

### 5 Maiores Motivos Técnicos do Projeto Não Fechar

#### 1. **INCONSISTÊNCIA DE PERSISTÊNCIA (Crítico)**
**Problema:** Metade dos dados persiste no Supabase, metade fica em memória (BarberContext). Ao recarregar a página, dados críticos desaparecem.

**Arquivos Envolvidos:**
- `src/context/BarberContext.tsx` (linhas 236-420, 830-900)
- Funções problemáticas: `addAppointment`, `addSale`, `addExpense`, `addStaffPayment`, `closeRegister`, `updateShopSettings`

**Impacto:**
- Agendamentos criados somem ao recarregar
- Vendas não são persistidas
- Fechamentos de caixa perdidos
- Configurações da loja não salvam
- **Dados críticos de negócio são voláteis**

**Solução Necessária:** Criar server actions para todas essas entidades (similar ao que foi feito para `commission_plans` e `staff`).

---

#### 2. **DUPLICAÇÃO DE LÓGICA E COMPONENTES (Alto)**
**Problema:** Múltiplos módulos fazem a mesma coisa de formas diferentes. Há 3 sistemas de agendamento, 2 sistemas de PDV, componentes duplicados.

**Arquivos Envolvidos:**
- `src/modules/agenda/` vs `src/modules/appointments/` vs `src/modules/online-booking/`
- `src/modules/pdv/` vs `src/modules/sales/`
- `src/modules/smart-pricing/` vs `src/modules/dynamic-pricing/`
- `src/modules/office-v2/` (não usado)

**Impacto:**
- Manutenção duplicada
- Bugs em um lugar, não no outro
- Confusão sobre qual usar
- Código inchado (27 módulos, muitos redundantes)

**Solução Necessária:** Consolidar módulos redundantes, escolher uma implementação canônica para cada funcionalidade.

---

#### 3. **ESTADO GLOBAL MONOLÍTICO (Alto)**
**Problema:** `BarberContext.tsx` tem 1016 linhas, gerencia TODO o estado do app. É um "god object" que viola princípios de separação de responsabilidades.

**Arquivos Envolvidos:**
- `src/context/BarberContext.tsx` (1016 linhas)
- Mistura: UI state, business logic, data fetching, mock data, real data

**Impacto:**
- Difícil de manter e debugar
- Re-renders desnecessários
- Lógica de negócio misturada com estado
- Impossível testar isoladamente
- Performance ruim (todo o app re-renderiza)

**Solução Necessária:** Quebrar em contextos menores, mover lógica para hooks/repositories, usar React Query ou SWR para cache.

---

#### 4. **FALTA DE VALIDAÇÃO E TRATAMENTO DE ERROS (Médio)**
**Problema:** Muitas operações não validam entrada, não tratam erros adequadamente. Uso excessivo de `any` e `as any`.

**Arquivos Envolvidos:**
- `src/context/BarberContext.tsx` - funções usam `any` (linhas 831, 833, 862, etc.)
- `src/modules/*/actions.ts` - tratamento de erro inconsistente
- `src/modules/*/modals/*.tsx` - validação fraca

**Impacto:**
- Erros silenciosos (dados não salvam, usuário não sabe)
- Crashes inesperados
- Dados corrompidos no banco
- Experiência ruim do usuário

**Solução Necessária:** Adicionar Zod schemas, validação consistente, toast notifications, error boundaries.

---

#### 5. **MIGRAÇÕES E SCHEMA DESATUALIZADOS (Médio)**
**Problema:** Schema do banco não reflete o código TypeScript. Campos faltando, tipos incompatíveis, RLS policies incompletas.

**Arquivos Envolvidos:**
- `supabase/migrations/` - 7 arquivos de migração
- `src/types/supabase.ts` - tipos gerados desatualizados
- `src/types.ts` - tipos manuais não sincronizados com DB

**Impacto:**
- Erros em runtime (campos undefined)
- Queries falham silenciosamente
- Segurança comprometida (RLS mal configurado)
- Impossível confiar nos tipos

**Solução Necessária:** Regenerar tipos do Supabase, criar migrações para campos faltantes, revisar RLS policies.

---

## 6) ERROS E QUEBRAS REPRODUZÍVEIS

### Resultado do Lint (npm run lint)
**Status:** ✅ Passou sem erros críticos

**Warnings Encontrados (não bloqueantes):**
- 26 warnings de variáveis não utilizadas (`@typescript-eslint/no-unused-vars`)
- Arquivos principais com warnings:
  - `setup-database.js` (4 warnings)
  - `src/app/login/page.tsx` (5 warnings)
  - `src/app/register/page.tsx` (3 warnings)
  - `src/app/super-admin/page.tsx` (6 warnings)

**Impacto:** Baixo - são apenas imports/variáveis não usadas, não afetam funcionalidade.

---

### Resultado do Build (npm run build)
**Status:** ✅ Build passou com sucesso

**Observações:**
- Compilação TypeScript: ✅ OK
- Geração de páginas estáticas: ✅ 28 rotas geradas
- Warning sobre middleware deprecado (usar "proxy" ao invés de "middleware")
- Build time: ~7.5 segundos

**Rotas Geradas:**
```
✓ / (landing)
✓ /app/dashboard
✓ /app/agenda
✓ /app/pdv
✓ /app/clients
✓ /app/catalog
✓ /app/finance
✓ /app/settings
✓ /app/referrals
✓ /app/website
✓ /app/super-admin
✓ /login
✓ /register
✓ /book
... (28 rotas total)
```

---

### Erros Conhecidos em Runtime

#### 1. **Dados Somem ao Recarregar**
- **Arquivo:** `src/context/BarberContext.tsx`
- **Causa:** Dados em memória não persistidos
- **Reprodução:** Criar agendamento → F5 → agendamento sumiu
- **Status:** ❌ Crítico

#### 2. **Commission Plans Não Salvavam** 
- **Arquivo:** `src/context/BarberContext.tsx` (linhas 833-861)
- **Causa:** Apenas modificava estado local
- **Status:** ✅ RESOLVIDO (server actions implementadas)

#### 3. **Staff Commission Não Salvava**
- **Arquivo:** `src/context/BarberContext.tsx` (linhas 831-882)
- **Causa:** Apenas modificava estado local
- **Status:** ✅ RESOLVIDO (server actions implementadas)

#### 4. **Máscaras de Input Faltando**
- **Arquivos:** Vários formulários
- **Causa:** Inputs sem formatação (telefone, CEP, etc.)
- **Status:** ✅ PARCIALMENTE RESOLVIDO (implementado em Settings e Staff, falta aplicar em outros lugares)

---

## 7) PLANO DE FECHAMENTO (MVP "FECHADO")

### Definition of Done (10 Itens Verificáveis)

1. ✅ **Autenticação funcional** - Login, cadastro e reset de senha funcionando com Supabase
2. ❌ **Agendamentos persistem** - Criar agendamento, recarregar página, agendamento continua lá
3. ❌ **Vendas persistem** - Registrar venda no PDV, recarregar, venda aparece no histórico
4. ❌ **Clientes persistem** - Cadastrar cliente, recarregar, cliente continua no CRM
5. ✅ **Serviços e produtos carregam do banco** - Dados vêm do Supabase, não de mocks
6. ✅ **Comissões de staff salvam** - Configurar comissão, recarregar, valores permanecem
7. ❌ **Fechamento de caixa persiste** - Fechar caixa, recarregar, fechamento registrado
8. ❌ **Configurações da loja salvam** - Alterar nome/endereço, recarregar, mudanças permanecem
9. ✅ **Build passa sem erros** - `npm run build` completa com sucesso
10. ❌ **Multi-tenancy funciona** - Dois estabelecimentos não veem dados um do outro

**Status Atual:** 4/10 itens completos (40%)

---

### Plano em 3 Etapas

#### **ETAPA 1: PERSISTÊNCIA CRÍTICA (1-2 dias)**
**Objetivo:** Fazer dados críticos de negócio persistirem no Supabase

**Tarefas:**
1. Criar server actions para `appointments`:
   - `src/modules/appointments/actions.ts` (createAppointment, updateAppointment, deleteAppointment)
   - Atualizar `BarberContext.tsx` para usar as actions

2. Criar server actions para `sales`:
   - `src/modules/sales/actions.ts` (createSale, updateSale)
   - Persistir vendas do PDV

3. Criar server actions para `clients`:
   - `src/modules/clients/actions.ts` (createClient, updateClient)
   - Migrar CRM para persistência real

4. Criar server actions para `finance`:
   - `src/modules/finance/actions.ts` (createExpense, createStaffPayment, createRegisterClosure)
   - Persistir dados financeiros

5. Criar server actions para `settings`:
   - `src/modules/settings/actions.ts` (updateShopSettings)
   - Salvar configurações da loja

**Entregável:** Todas as operações CRUD principais persistindo no Supabase

---

#### **ETAPA 2: CONSOLIDAÇÃO E LIMPEZA (1 dia)**
**Objetivo:** Remover código duplicado e consolidar módulos

**Tarefas:**
1. Consolidar sistemas de agendamento:
   - Escolher `src/modules/agenda/` como canônico
   - Remover `src/modules/appointments/` e `src/modules/online-booking/` (ou integrar)

2. Consolidar PDV:
   - Manter `src/modules/pdv/`
   - Remover `src/modules/sales/` redundante

3. Remover módulos não usados:
   - `src/modules/office-v2/`
   - `src/modules/dynamic-pricing/` (se não usado)

4. Quebrar `BarberContext.tsx`:
   - Criar hooks específicos: `useAppointments`, `useSales`, `useClients`
   - Mover lógica para repositories
   - Reduzir contexto para apenas estado essencial

5. Aplicar máscaras de input em todos os formulários:
   - Usar `MaskedInput` component em todos os lugares com telefone/CEP/etc.

**Entregável:** Código mais limpo, sem duplicação, mais fácil de manter

---

#### **ETAPA 3: VALIDAÇÃO E POLISH (1 dia)**
**Objetivo:** Garantir qualidade e experiência do usuário

**Tarefas:**
1. Adicionar validação Zod em todos os formulários:
   - Schemas em `src/modules/*/types.ts`
   - Validação client-side e server-side

2. Implementar toast notifications:
   - Feedback visual para todas as operações
   - Erros claros para o usuário

3. Adicionar error boundaries:
   - Capturar erros em runtime
   - Páginas de erro amigáveis

4. Revisar RLS policies:
   - Garantir que multi-tenancy funciona
   - Testar isolamento de dados

5. Documentar comandos e setup:
   - README.md atualizado
   - Guia de desenvolvimento

6. Testes manuais críticos:
   - Fluxo completo: cadastro → agendamento → venda → fechamento
   - Testar em 2 tenants diferentes (isolamento)

**Entregável:** Sistema estável, validado, pronto para uso real

---

## RESUMO EXECUTIVO

**Status Geral:** 🟡 Em Desenvolvimento Ativo (40% completo)

**Pontos Fortes:**
- ✅ Arquitetura moderna (Next.js 16, TypeScript, Supabase)
- ✅ Autenticação real funcionando
- ✅ Multi-tenancy implementado
- ✅ UI completa e responsiva
- ✅ Build passa sem erros

**Pontos Críticos:**
- ❌ Dados críticos ainda em memória (agendamentos, vendas, clientes)
- ❌ Estado global monolítico (BarberContext com 1016 linhas)
- ❌ Código duplicado (27 módulos, muitos redundantes)
- ❌ Validação e tratamento de erros inconsistente

**Tempo Estimado para MVP Fechado:** 3-4 dias de trabalho focado

**Próxima Ação Recomendada:** Começar ETAPA 1 - implementar server actions para appointments, sales e clients.

---

**Gerado por:** Windsurf Agent  
**Última Atualização:** 28/12/2024 01:04 UTC-03:00
