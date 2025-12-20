# 🚨 GUIA DE RECUPERAÇÃO RÁPIDA - BARBERFLOW

> **Para colocar no pendrive. Se tudo der errado, siga este guia.**

---

## 📦 O QUE SALVAR NO PENDRIVE

### Opção 1: Clonar do GitHub (Recomendado)
```bash
git clone https://github.com/monetizandooo-braga/barberGold.git
```

### Opção 2: Arquivos Essenciais (Mínimo)
```
📁 pendrive/
├── src/
│   ├── types.ts                 # TODOS os tipos do sistema
│   ├── constants.ts             # Dados mock de referência
│   └── context/
│       └── BarberContext.tsx    # TODA a lógica atual
├── supabase/
│   └── schema-complete.sql      # BANCO COMPLETO
├── package.json                 # Dependências exatas
├── .env.example                 # Variáveis necessárias
├── SISTEMA_COMPLETO.md          # Documentação detalhada
└── PENDRIVE_RECOVERY.md         # Este arquivo
```

---

## 🚀 RECONSTRUIR DO ZERO (15 minutos)

### Passo 1: Setup Node.js
```bash
# Instalar Node.js 18+ de https://nodejs.org
node --version  # Deve ser 18+
```

### Passo 2: Criar Projeto
```bash
# Criar pasta e iniciar projeto
npx create-next-app@latest barberflow --typescript --tailwind --eslint --app --src-dir
cd barberflow
```

### Passo 3: Instalar Dependências
```bash
npm install @supabase/ssr @supabase/supabase-js
npm install date-fns lucide-react recharts
npm install react-hook-form @hookform/resolvers zod
```

### Passo 4: Copiar Arquivos do Pendrive
```bash
# Copiar src/types.ts
# Copiar src/context/BarberContext.tsx
# Copiar supabase/schema-complete.sql
```

### Passo 5: Configurar Supabase
```bash
# 1. Criar conta em https://supabase.com
# 2. Criar novo projeto
# 3. Ir em SQL Editor > Executar schema-complete.sql
# 4. Copiar URL e ANON_KEY de Settings > API

# Criar .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_APP_MODE=demo
```

### Passo 6: Rodar
```bash
npm run dev
# Acessar http://localhost:3000
```

---

## 🗄️ ESQUEMA DO BANCO (Resumido)

```sql
-- TABELAS PRINCIPAIS
tenants          -- Barbearias (multi-tenant)
profiles         -- Funcionários
clients          -- Clientes
services         -- Serviços
products         -- Produtos
appointments     -- Agendamentos
sales            -- Vendas
sale_items       -- Itens vendidos
expenses         -- Despesas
cash_closures    -- Fechamento caixa

-- RELACIONAMENTOS
tenants (1) → (N) profiles, clients, services, products, appointments, sales
clients (1) → (N) appointments
profiles (1) → (N) appointments
sales (1) → (N) sale_items
```

---

## 🧠 CÉREBRO DO SISTEMA

### Arquivo Principal
`src/context/BarberContext.tsx` (677 linhas)

### Estados Críticos
```typescript
isAuthenticated: boolean       // Login
currentUser: StaffMember       // Usuário logado
currentView: ViewState         // Tela atual (28 views)
appointments: Appointment[]    // Agendamentos
clients: Client[]              // Clientes
products: Product[]            // Produtos
services: Service[]            // Serviços
sales: Sale[]                  // Vendas
staff: StaffMember[]           // Equipe
expenses: Expense[]            // Despesas
shopSettings: ShopSettings     // Configurações
```

### Actions Críticas
```typescript
login(email, pass)             // Autenticação
processSale(items, client...)  // Finalizar venda
addAppointment(appt)           // Criar agendamento
addClient(client)              // Cadastrar cliente
updateAppointmentStatus(id, s) // Atualizar status
addExpense(expense)            // Registrar despesa
```

---

## 📊 TIPOS ESSENCIAIS

```typescript
// Roles
type Role = 'OWNER' | 'ADMIN' | 'BARBER' | 'ASSISTANT' | 'STAFF' | 'SUPER_ADMIN';

// Status de agendamento
enum AppointmentStatus {
  SCHEDULED, CHECKED_IN, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW
}

// Pagamentos
enum PaymentMethod {
  CASH, CREDIT_CARD, DEBIT_CARD, PIX, GOOGLE_PAY, APPLE_PAY
}

// Comissões
enum CompensationModel {
  PERCENTAGE,    // Split (50/50)
  CHAIR_RENTAL,  // Aluguel fixo
  OWNER          // 100% dono
}

// Planos SaaS
type SaasPlanId = 'FREE' | 'SOLO' | 'SOLO_PRO' | 'EQUIPE' | 'STUDIO' | 'ENTERPRISE';
```

---

## 🎨 TEMA VISUAL

```css
/* Premium Gold Theme */
--background: zinc-950 (#09090b)
--card: zinc-900 (#18181b)
--border: zinc-800 (#27272a)
--primary: amber-500 (#f59e0b)
--text: white / zinc-400
```

---

## 📁 ESTRUTURA DE MÓDULOS

```
src/modules/
├── agenda/           # Calendário e fila
├── pdv/              # Ponto de venda
├── clients/          # CRM
├── finance/          # Financeiro
├── catalog/          # Serviços/produtos
├── settings/         # Configurações
├── dashboard/        # Dashboard
├── barber-club/      # Assinaturas (BEM ESTRUTURADO ✓)
├── dynamic-pricing/  # Preços dinâmicos (BEM ESTRUTURADO ✓)
├── online-booking/   # Agendamento online
├── super-admin/      # Painel admin SaaS
└── website/          # Site público
```

---

## ⚠️ PROBLEMAS CONHECIDOS

1. **Autenticação fake** - Usar Supabase Auth
2. **Context monolítico** - Quebrar em módulos
3. **Navegação por estado** - Criar rotas reais
4. **localStorage apenas** - Conectar ao Supabase
5. **103 usos de `any`** - Tipar corretamente

---

## 🔧 STACK COMPLETA

```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@supabase/ssr": "^0.8.0",
    "@supabase/supabase-js": "^2.87.3",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.561.0",
    "next": "16.0.10",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "react-hook-form": "^7.68.0",
    "recharts": "^3.6.0",
    "zod": "^4.2.1"
  }
}
```

---

## 🌐 URLs

- **Produção:** https://barber-gold-alpha.vercel.app
- **GitHub:** https://github.com/monetizandooo-braga/barberGold
- **Supabase:** https://supabase.com/dashboard

---

## 📞 PASSOS PARA PRODUÇÃO

```
1. [ ] Executar schema-complete.sql no Supabase
2. [ ] Configurar env vars na Vercel
3. [ ] Implementar Supabase Auth
4. [ ] Conectar módulos ao banco
5. [ ] Testar fluxos principais
6. [ ] Remover dados mock
7. [ ] Lançar!
```

---

## 💡 DICA FINAL

O sistema está **100% funcional em modo demo** (localStorage). 
Para produção, o principal é:
1. Executar o SQL no Supabase
2. Trocar a autenticação fake por Supabase Auth
3. Conectar os módulos ao banco (seguir padrão de `barber-club/`)

**Estimativa para MVP real: 3-4 semanas**

---

*Guia criado em 20/12/2024 - BarberFlow v0.1.0*
