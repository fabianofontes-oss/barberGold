# 💈 BarberGold - Sistema SaaS para Gestão de Barbearias

![Status](https://img.shields.io/badge/Status-Ready_to_Launch-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-Proprietary-red)

**Sistema completo de gestão para barbearias modernas com multi-tenancy, pagamentos Stripe e UX profissional.**

---

## 🚀 Features

### ✅ Core Business
- **Multi-Tenancy:** Cada barbearia tem seu próprio tenant isolado
- **Sistema de Pagamentos:** Integração completa com Stripe
- **Feature Gating:** Limites e recursos por plano
- **6 Planos:** FREE, SOLO, SOLO PRO, TEAM, PREMIUM, ENTERPRISE

### 💼 Gestão
- **Clientes:** CRUD completo, histórico, busca, filtros
- **Agendamentos:** Agenda visual, múltiplos status, calendário
- **Vendas/PDV:** Registro de vendas, items, descontos
- **Serviços:** Catálogo de serviços com preços e duração
- **Produtos:** Controle de estoque (planos superiores)
- **Staff:** Gestão de profissionais e comissões

### 💰 Monetização
- **Stripe Checkout:** Fluxo completo de pagamento
- **Webhooks:** Sync automático de status
- **Billing Portal:** Gerenciamento de assinatura
- **Comissões:** Cálculo automático por venda

### 🎨 UX/UI
- **Design Moderno:** Interface limpa e profissional
- **Mobile-First:** 100% responsivo
- **Loading States:** Skeletons em todas as páginas
- **Empty States:** Mensagens amigáveis quando vazio
- **Error Handling:** Error boundaries e páginas 404/500
- **Toast Notifications:** Feedback visual de ações
- **Tour Guiado:** 4 tours interativos para novos usuários

### 📊 Marketing & Conversão
- **Landing Page:** Design moderno com social proof
- **Pricing Page:** 6 planos com comparação detalhada
- **FAQ:** 27 perguntas em 5 categorias
- **Depoimentos:** 5 depoimentos com carrossel
- **Páginas Institucionais:** About, Contact, Terms, Privacy

### 🔐 Segurança
- **Row Level Security:** Políticas RLS no Supabase
- **Filtros Explícitos:** tenant_id em todas as queries
- **Validação:** Zod schemas em todos os inputs
- **Server Actions:** Toda lógica no servidor
- **Environment Variables:** Secrets nunca expostos

---

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - App Router, Server Components
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Supabase** - Auth, Database, RLS, Storage
- **Stripe** - Pagamentos e assinaturas
- **Server Actions** - Data mutations
- **Zod** - Schema validation

### DevOps
- **Vercel** - Hosting e CI/CD
- **Git** - Version control
- **ESLint** - Code linting

---

## 📁 Estrutura do Projeto

```
barberGold/
├── src/
│   ├── app/                      # App Router pages
│   │   ├── (auth)/              # Auth pages (login, register)
│   │   ├── (public)/            # Public pages (marketing)
│   │   ├── app/                 # Protected app pages
│   │   ├── api/                 # API routes (webhooks)
│   │   ├── about/               # About page
│   │   ├── contact/             # Contact page
│   │   ├── faq/                 # FAQ page
│   │   ├── pricing/             # Pricing page
│   │   ├── terms/               # Terms of Service
│   │   ├── privacy/             # Privacy Policy
│   │   ├── error.tsx            # Global error page
│   │   └── not-found.tsx        # 404 page
│   │
│   ├── components/              # Reusable components
│   │   ├── error/              # Error boundaries
│   │   ├── features/           # Feature gating UI
│   │   ├── marketing/          # Marketing components
│   │   ├── onboarding/         # Tours and welcome
│   │   ├── stripe/             # Stripe components
│   │   └── ui/                 # UI primitives
│   │
│   ├── lib/                     # Core utilities
│   │   ├── auth/               # Auth helpers
│   │   ├── business-logic/     # Business rules
│   │   ├── demo/               # Demo data
│   │   ├── features/           # Feature gates
│   │   ├── stripe/             # Stripe config
│   │   ├── supabase/           # Supabase clients
│   │   ├── tenant/             # Multi-tenant helpers
│   │   └── tours/              # Tour definitions
│   │
│   └── modules/                 # Feature modules
│       ├── appointments/        # Appointments feature
│       ├── auth/               # Auth actions
│       ├── clients/            # Clients feature
│       ├── demo/               # Demo actions
│       ├── sales/              # Sales feature
│       ├── tenant/             # Tenant management
│       └── website/            # Website components
│
├── supabase/
│   └── schema-complete.sql      # Database schema
│
├── public/                       # Static assets
│
├── .env.example                  # Environment variables template
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
│
├── DEPLOY_GUIDE.md              # Deploy instructions
├── RELATORIO_FINAL.md           # Final progress report
├── STRIPE_SETUP.md              # Stripe setup guide
└── README.md                    # This file
```

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Supabase
- Conta Stripe (modo test)

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/barberGold.git
cd barberGold
```

### 2. Instale Dependências
```bash
npm install
```

### 3. Configure Variáveis de Ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Price IDs (criar no Stripe Dashboard)
STRIPE_PRICE_SOLO_MONTHLY=price_xxxxx
# ... outros price IDs

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_MODE=development
```

### 4. Configure o Banco de Dados
1. Crie um projeto no Supabase
2. Execute o SQL em `supabase/schema-complete.sql`
3. Verifique se todas as tabelas foram criadas

### 5. Execute o Servidor de Desenvolvimento
```bash
npm run dev
```

Acesse: http://localhost:3000

### 6. Teste Webhooks Localmente (Opcional)
```bash
# Terminal 1
npm run dev

# Terminal 2
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 📚 Documentação

- **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)** - Guia completo de deploy em produção
- **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** - Configuração detalhada do Stripe
- **[RELATORIO_FINAL.md](./RELATORIO_FINAL.md)** - Relatório do projeto completo

---

## 🧪 Testes

### Modo Demo
O sistema suporta modo demo quando Supabase não está configurado:
```env
NEXT_PUBLIC_APP_MODE=pilot
```

Credenciais de demo:
- **Email:** admin@demo.com
- **Senha:** demo123

### Seed Data
Popule com dados de exemplo:
1. Faça login
2. Clique em "Popular com dados de exemplo" no welcome modal
3. ✅ 10 clientes, 8 serviços, 20+ agendamentos criados

### Cartões de Teste Stripe
- **Sucesso:** 4242 4242 4242 4242
- **Falha:** 4000 0000 0000 0002
- **CVC:** Qualquer 3 dígitos
- **Data:** Qualquer data futura

---

## 🎯 Roadmap

### ✅ Fase 1: MVP (Completo)
- [x] Multi-tenancy
- [x] Stripe integration
- [x] Feature gating
- [x] CRUD básico
- [x] Landing page
- [x] Pricing page

### ✅ Fase 2: UX (Completo)
- [x] Tour guiado
- [x] Loading states
- [x] Empty states
- [x] Error handling
- [x] Toast notifications

### 🔄 Fase 3: Lançamento (Em Progresso)
- [ ] Testes finais
- [ ] Deploy produção
- [ ] Monitoring
- [ ] Marketing inicial

### 📅 Fase 4: Pós-Lançamento
- [ ] Google OAuth
- [ ] Integração WhatsApp
- [ ] Relatórios avançados
- [ ] Multi-unidade
- [ ] App mobile

---

## 👥 Equipe

**Desenvolvedor Principal:** [Seu Nome]  
**Design:** [Nome do Designer]  
**Produto:** [Nome do PM]

---

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

---

## 🆘 Suporte

- **Email:** contato@barber.gold
- **WhatsApp:** (11) 99999-9999
- **Documentação:** [docs.barber.gold](https://docs.barber.gold)
- **Status:** [status.barber.gold](https://status.barber.gold)

---

## 🎉 Agradecimentos

Desenvolvido com 💙 para barbeiros que querem crescer.

**BarberFlow - Transformando Barbearias em Negócios Digitais**

---

**Status do Projeto:** ✅ **80% Completo - Pronto para Lançamento!**

**Última Atualização:** Dezembro 2025
