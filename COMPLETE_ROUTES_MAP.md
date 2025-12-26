# 🗺️ MAPEAMENTO COMPLETO DE ROTAS - BarberGOLD

**Data:** 26/12/2025  
**Versão:** 1.0

---

## 📊 TABELA MASTER DE ROTAS

### 🌐 ROTAS PÚBLICAS (Sem Autenticação)

| URL | Arquivo | Componente | Proteção | Redireciona Para | Observações |
|-----|---------|------------|----------|------------------|-------------|
| `/` | `src/app/page.tsx` | `SaasLandingPage` | ❌ Pública | - | Landing page principal |
| `/login` | `src/app/login/page.tsx` | `LoginPage` | ❌ Pública | `/app/dashboard` (após login) | Se já autenticado → `/app/dashboard` |
| `/register` | `src/app/register/page.tsx` | `RegisterPage` | ❌ Pública | `/app/setup` (após cadastro) | Se já autenticado → `/app/dashboard` |
| `/forgot-password` | `src/app/forgot-password/page.tsx` | `ForgotPasswordPage` | ❌ Pública | - | Envia email de recuperação |
| `/reset-password` | `src/app/reset-password/page.tsx` | `ResetPasswordPage` | ❌ Pública | `/login` (após sucesso) | Requer token válido na sessão |
| `/book` | `src/app/book/page.tsx` | `OnlineBookingWizard` | ❌ Pública | - | Agendamento online para clientes |
| `/unauthorized` | `src/app/unauthorized/page.tsx` | `UnauthorizedPage` | ❌ Pública | - | Página de erro 403 |

---

### 🔒 ROTAS PROTEGIDAS (Requer Autenticação)

#### **Área Principal `/app/*`**

| URL | Arquivo | Componente | Proteção | Redireciona Para | Observações |
|-----|---------|------------|----------|------------------|-------------|
| `/app/dashboard` | `src/app/app/dashboard/page.tsx` | `Dashboard` | ✅ AuthGuard + Profile | - | Dashboard principal |
| `/app/agenda` | `src/app/app/agenda/page.tsx` | `Agenda` | ✅ AuthGuard + Profile | - | Gestão de agendamentos |
| `/app/pdv` | `src/app/app/pdv/page.tsx` | `PDV` | ✅ AuthGuard + Profile | - | Ponto de Venda |
| `/app/clients` | `src/app/app/clients/page.tsx` | `Clients` | ✅ AuthGuard + Profile | - | Gestão de clientes |
| `/app/finance` | `src/app/app/finance/page.tsx` | `Finance` | ✅ AuthGuard + Profile | - | Financeiro |
| `/app/referrals` | `src/app/app/referrals/page.tsx` | `Referrals` | ✅ AuthGuard + Profile | - | Programa de indicações |
| `/app/plan` | `src/app/app/plan/page.tsx` | `Plan` | ✅ AuthGuard + Profile | - | Gerenciar plano/assinatura |
| `/app/settings` | `src/app/app/settings/page.tsx` | `Settings` | ✅ AuthGuard + Profile | - | Configurações gerais |
| `/app/settings/password` | `src/app/app/settings/password/page.tsx` | `PasswordSettings` | ✅ AuthGuard + Profile | - | Alterar senha |

#### **Área de Setup (Configuração Inicial)**

| URL | Arquivo | Componente | Proteção | Redireciona Para | Observações |
|-----|---------|------------|----------|------------------|-------------|
| `/app/setup` | `src/app/app/setup/page.tsx` | `SetupPage` | ✅ Layout Específico | `/app/dashboard` (após setup) | Requer auth MAS não profile |
| - | `src/app/app/setup/layout.tsx` | `SetupLayout` | ✅ Server-Side | `/login` (se não auth) | Valida sessão sem profile |
| - | `src/app/app/setup/actions.ts` | `createTenantAndProfile` | ✅ Server Action | - | Cria tenant e profile |

**Lógica do Setup:**
```
1. Não autenticado → redirect('/login')
2. Autenticado + Sem profile → Permite acesso
3. Autenticado + Com profile → redirect('/app/dashboard')
```

#### **Área Super Admin (God Mode)**

| URL | Arquivo | Componente | Proteção | Redireciona Para | Observações |
|-----|---------|------------|----------|------------------|-------------|
| `/app/super-admin` | `src/app/app/super-admin/page.tsx` | `SuperAdminPage` | ✅ Layout + Role Check | `/app/dashboard` (se não super admin) | Apenas role = 'SUPER_ADMIN' |
| - | `src/app/app/super-admin/layout.tsx` | `SuperAdminLayout` | ✅ Server-Side | `/login` (se não auth) | Valida role no servidor |

**Lógica do Super Admin:**
```
1. Não autenticado → redirect('/login')
2. Autenticado + role ≠ 'SUPER_ADMIN' → redirect('/app/dashboard')
3. Autenticado + role = 'SUPER_ADMIN' → Permite acesso
```

---

### 🔌 API ROUTES

| URL | Arquivo | Método | Proteção | Retorna | Observações |
|-----|---------|--------|----------|---------|-------------|
| `/api/webhooks/stripe` | `src/app/api/webhooks/stripe/route.ts` | POST | ✅ Stripe Signature | JSON | Webhook do Stripe |
| `/auth/callback` | `src/app/auth/callback/route.ts` | GET | ❌ Pública | Redirect | OAuth + Password Reset |

**Detalhes do `/auth/callback`:**

| Query Params | Ação | Redireciona Para |
|--------------|------|------------------|
| `?code=XXX` | Exchange code por sessão | `/app/dashboard` |
| `?code=XXX&type=recovery` | Exchange code + Reset password | `/reset-password` |
| `?code=XXX&next=/custom` | Exchange code + Custom redirect | `/custom` |
| Sem `code` | Erro | `/login?error=missing_code` |
| Erro no exchange | Erro | `/login?error=MESSAGE` |

---

## 🔄 FLUXOS DE NAVEGAÇÃO

### **Fluxo 1: Novo Usuário (Cadastro Completo)**

```
1. / (Landing)
   ↓ Clica "Começar Agora"
2. /register
   ↓ Preenche formulário
3. Supabase Auth cria usuário
   ↓ Middleware detecta sessão
4. /app/setup
   ↓ Preenche perfil + barbearia
5. Server Action: createTenantAndProfile()
   ↓ Cria profile + tenant no banco
6. /app/dashboard
   ✅ Usuário logado e configurado
```

### **Fluxo 2: Usuário Existente (Login)**

```
1. / (Landing)
   ↓ Clica "Entrar"
2. /login
   ↓ Digita email + senha
3. Supabase Auth valida
   ↓ Middleware detecta sessão
4. AuthGuard verifica profile
   ↓ Profile existe?
5. /app/dashboard
   ✅ Usuário logado
```

### **Fluxo 3: Recuperação de Senha**

```
1. /login
   ↓ Clica "Esqueci minha senha"
2. /forgot-password
   ↓ Digita email
3. Supabase envia email
   ↓ Usuário clica no link
4. /auth/callback?token_hash=XXX&type=recovery
   ↓ Exchange token por sessão
5. /reset-password
   ↓ Define nova senha
6. Supabase atualiza senha
   ↓ Sucesso
7. /login
   ✅ Pode fazer login com nova senha
```

### **Fluxo 4: Acesso Super Admin**

```
1. /login (com role = 'SUPER_ADMIN')
   ↓ Faz login
2. /app/dashboard
   ↓ Vê link "Super Admin" na sidebar
3. Clica no link
   ↓ Layout valida role
4. /app/super-admin
   ✅ Acessa God Mode
```

### **Fluxo 5: Cliente Externo (Agendamento Online)**

```
1. barbearia.barber.gold (subdomínio)
   ↓ Middleware detecta tenant
2. /book?tenant=barbearia
   ↓ Wizard de agendamento
3. Seleciona serviço + barbeiro + horário
   ↓ Preenche dados
4. Cria agendamento no banco
   ✅ Confirmação enviada
```

---

## 🔀 REDIRECTS AUTOMÁTICOS

### **Middleware (`middleware.ts`)**

| Condição | De | Para | Motivo |
|----------|----|----|--------|
| Não autenticado + acessa `/app/*` | `/app/*` | `/login` | Requer autenticação |
| Autenticado + acessa `/login` | `/login` | `/app/dashboard` | Já está logado |
| Autenticado + acessa `/register` | `/register` | `/app/dashboard` | Já está logado |
| Subdomínio + raiz | `/` | `/book?tenant=slug` | Redireciona para booking |

### **AuthGuard (`src/components/AuthGuard.tsx`)**

| Condição | De | Para | Motivo |
|----------|----|----|--------|
| Não autenticado | Qualquer `/app/*` | `/login` | Sem sessão |
| Sem profile + não está em setup | `/app/*` | `/app/setup` | Precisa configurar |

### **Layout Setup (`src/app/app/setup/layout.tsx`)**

| Condição | De | Para | Motivo |
|----------|----|----|--------|
| Não autenticado | `/app/setup` | `/login` | Sem sessão |
| Com profile completo | `/app/setup` | `/app/dashboard` | Já configurado |

### **Layout Super Admin (`src/app/app/super-admin/layout.tsx`)**

| Condição | De | Para | Motivo |
|----------|----|----|--------|
| Não autenticado | `/app/super-admin` | `/login` | Sem sessão |
| role ≠ 'SUPER_ADMIN' | `/app/super-admin` | `/app/dashboard` | Sem permissão |

---

## 🔗 LINKS NO CÓDIGO

### **Landing Page (`src/modules/website/SaasLandingPage.tsx`)**

| Link | Destino | Componente |
|------|---------|------------|
| "Começar Agora" | `/register` | HeroSection |
| "Entrar" | `/login` | Header |
| "Escolher Start" | `/register?plan=start` | PricingSection |
| "Escolher Pro" | `/register?plan=pro` | PricingSection |
| "Escolher Empire" | `/register?plan=empire` | PricingSection |
| "Termos de Uso" | `/termos` | Footer |
| "Privacidade" | `/privacidade` | Footer |

### **Login Page (`src/app/login/page.tsx`)**

| Link | Destino | Ação |
|------|---------|------|
| "Esqueci minha senha" | `/forgot-password` | Link |
| "Criar conta" | `/register` | Link |
| Botão "Entrar" | `/app/dashboard` | router.push() após login |

### **Register Page (`src/app/register/page.tsx`)**

| Link | Destino | Ação |
|------|---------|------|
| "Já tem conta? Entrar" | `/login` | Link |
| Botão "Criar Conta" | `/app/setup` | router.push() após cadastro |

### **Forgot Password (`src/app/forgot-password/page.tsx`)**

| Link | Destino | Ação |
|------|---------|------|
| "Voltar para Login" | `/login` | Link |

### **Reset Password (`src/app/reset-password/page.tsx`)**

| Link | Destino | Ação |
|------|---------|------|
| "Voltar para o Login" | `/login` | Link |
| "Solicitar Novo Link" | `/forgot-password` | Link (se token inválido) |
| Botão "Redefinir Senha" | `/login` | router.push() após sucesso |

### **Setup Page (`src/app/app/setup/page.tsx`)**

| Link | Destino | Ação |
|------|---------|------|
| Botão "Começar a Usar" | `/app/dashboard` | router.push() após setup |

### **Sidebar (`src/components/Sidebar.tsx`)**

| Link | Destino | Componente |
|------|---------|------------|
| "Dashboard" | `/app/dashboard` | NavItem |
| "Agenda" | `/app/agenda` | NavItem |
| "PDV" | `/app/pdv` | NavItem |
| "Clientes" | `/app/clients` | NavItem |
| "Financeiro" | `/app/finance` | NavItem |
| "Configurações" | `/app/settings` | NavItem |
| "Indicações" | `/app/referrals` | NavItem |
| "Meu Plano" | `/app/plan` | NavItem |
| "Super Admin" | `/app/super-admin` | NavItem (se SUPER_ADMIN) |

### **Unauthorized Page (`src/app/unauthorized/page.tsx`)**

| Link | Destino | Ação |
|------|---------|------|
| "Ir para Dashboard" | `/app/dashboard` | Link |
| "Voltar" | - | window.history.back() |

---

## 🎯 ROTAS DINÂMICAS

**Atualmente não há rotas dinâmicas `[id]` implementadas.**

Rotas futuras sugeridas:
- `/app/clients/[id]` - Detalhes do cliente
- `/app/agenda/[id]` - Detalhes do agendamento
- `/[tenant]` - Página pública da barbearia

---

## ❌ ROTAS DE ERRO

| Código | Arquivo | Status |
|--------|---------|--------|
| 404 | `src/app/not-found.tsx` | ❌ Não criado |
| 500 | `src/app/error.tsx` | ❌ Não criado |
| 403 | `src/app/unauthorized/page.tsx` | ✅ Criado |

**Recomendação:** Criar páginas de erro 404 e 500.

---

## 📱 ROTAS POR LAYOUT

### **Root Layout (`src/app/layout.tsx`)**
Aplica-se a TODAS as rotas:
- Fontes globais
- Providers (AppProviders)
- Metadados da aplicação

### **App Layout (`src/app/app/layout.tsx`)**
Aplica-se a `/app/*`:
- AuthGuard (valida sessão + profile)
- AppLayoutClient (sidebar + header)
- Exceção: `/app/setup` não renderiza sidebar

### **Setup Layout (`src/app/app/setup/layout.tsx`)**
Aplica-se a `/app/setup`:
- Validação de sessão
- Permite acesso sem profile
- Sem sidebar

### **Super Admin Layout (`src/app/app/super-admin/layout.tsx`)**
Aplica-se a `/app/super-admin`:
- Validação de role = 'SUPER_ADMIN'
- Banner "GOD MODE ATIVO"
- Sem sidebar (página isolada)

---

## 🔐 MATRIZ DE PROTEÇÃO

| Rota | Middleware | AuthGuard | Layout Específico | Role Check |
|------|-----------|-----------|-------------------|------------|
| `/` | ✅ Permite | ❌ | ❌ | ❌ |
| `/login` | ✅ Redireciona se auth | ❌ | ❌ | ❌ |
| `/register` | ✅ Redireciona se auth | ❌ | ❌ | ❌ |
| `/forgot-password` | ✅ Permite | ❌ | ❌ | ❌ |
| `/reset-password` | ✅ Permite | ❌ | ❌ | ❌ |
| `/book` | ✅ Permite | ❌ | ❌ | ❌ |
| `/unauthorized` | ✅ Permite | ❌ | ❌ | ❌ |
| `/app/dashboard` | ✅ Valida sessão | ✅ Valida profile | ❌ | ❌ |
| `/app/agenda` | ✅ Valida sessão | ✅ Valida profile | ❌ | ❌ |
| `/app/pdv` | ✅ Valida sessão | ✅ Valida profile | ❌ | ❌ |
| `/app/clients` | ✅ Valida sessão | ✅ Valida profile | ❌ | ❌ |
| `/app/finance` | ✅ Valida sessão | ✅ Valida profile | ❌ | ❌ |
| `/app/referrals` | ✅ Valida sessão | ✅ Valida profile | ❌ | ❌ |
| `/app/plan` | ✅ Valida sessão | ✅ Valida profile | ❌ | ❌ |
| `/app/settings` | ✅ Valida sessão | ✅ Valida profile | ❌ | ❌ |
| `/app/settings/password` | ✅ Valida sessão | ✅ Valida profile | ❌ | ❌ |
| `/app/setup` | ✅ Valida sessão | ❌ | ✅ Sem profile OK | ❌ |
| `/app/super-admin` | ✅ Valida sessão | ❌ | ✅ Valida role | ✅ SUPER_ADMIN |
| `/auth/callback` | ✅ Permite | ❌ | ❌ | ❌ |
| `/api/webhooks/stripe` | ✅ Permite | ❌ | ❌ | ❌ |

---

## 📊 ESTATÍSTICAS

- **Total de Rotas:** 20
- **Rotas Públicas:** 7 (35%)
- **Rotas Protegidas:** 11 (55%)
- **API Routes:** 2 (10%)
- **Layouts Específicos:** 3 (setup, super-admin, app)
- **Redirects Automáticos:** 8
- **Fluxos de Navegação:** 5

---

## 🚀 PRÓXIMAS ROTAS SUGERIDAS

1. `/app/clients/[id]` - Detalhes do cliente
2. `/app/agenda/[id]` - Detalhes do agendamento
3. `/app/products` - Catálogo de produtos
4. `/app/reports` - Relatórios e analytics
5. `/app/team` - Gestão de equipe
6. `/[tenant]` - Página pública da barbearia
7. `/not-found` - Página 404 customizada
8. `/error` - Página 500 customizada

---

**Mapeamento completo e atualizado. Sistema pronto para produção.** ✅
