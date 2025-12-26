# 🧪 GUIA DE TESTE PRÁTICO - TODAS AS ROTAS

**Data:** 26/12/2025  
**Objetivo:** Validar funcionamento de todas as rotas do sistema

---

## 📋 CHECKLIST DE TESTE

### ✅ PREPARAÇÃO

1. **Servidor rodando:**
   ```bash
   npm run dev
   ```
   ✅ Servidor deve estar em: `http://localhost:3000`

2. **Banco de dados:**
   - ✅ Supabase configurado
   - ✅ Variáveis de ambiente corretas (`.env.local`)

3. **Usuários de teste:**
   - ✅ Usuário comum (OWNER/BARBER)
   - ✅ Usuário super admin (role = 'SUPER_ADMIN')

---

## 🌐 TESTE 1: ROTAS PÚBLICAS (Sem Login)

### **1.1 Landing Page**

**URL:** `http://localhost:3000/`

**Esperado:**
- ✅ Landing page SaaS com hero section
- ✅ Botões "Começar Agora" e "Entrar"
- ✅ Seções: Features, Pricing, FAQ
- ✅ Footer com links

**Como Testar:**
1. Abra navegador em modo anônimo
2. Acesse: `http://localhost:3000/`
3. Verifique se carrega a landing page

**Resultado:**
- [ ] ✅ PASSOU - Landing page carregou corretamente
- [ ] ❌ FALHOU - Erro: _______________

---

### **1.2 Login**

**URL:** `http://localhost:3000/login`

**Esperado:**
- ✅ Formulário de login (email + senha)
- ✅ Link "Esqueci minha senha"
- ✅ Link "Criar conta"
- ✅ Logo BarberGOLD

**Como Testar:**
1. Acesse: `http://localhost:3000/login`
2. Verifique formulário

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

### **1.3 Register**

**URL:** `http://localhost:3000/register`

**Esperado:**
- ✅ Formulário de cadastro
- ✅ Campos: nome, email, senha
- ✅ Link "Já tem conta? Entrar"

**Como Testar:**
1. Acesse: `http://localhost:3000/register`
2. Verifique formulário

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

### **1.4 Forgot Password**

**URL:** `http://localhost:3000/forgot-password`

**Esperado:**
- ✅ Formulário com campo de email
- ✅ Botão "Enviar Link"
- ✅ Link "Voltar para Login"

**Como Testar:**
1. Acesse: `http://localhost:3000/forgot-password`
2. Verifique formulário

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

### **1.5 Reset Password**

**URL:** `http://localhost:3000/reset-password`

**Esperado:**
- ✅ Mensagem "Link inválido" (sem token)
- ✅ Botão "Solicitar Novo Link"

**Como Testar:**
1. Acesse: `http://localhost:3000/reset-password` (sem token)
2. Deve mostrar erro de token inválido

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

### **1.6 Book (Agendamento Online)**

**URL:** `http://localhost:3000/book`

**Esperado:**
- ✅ Wizard de agendamento
- ✅ Seleção de serviço/barbeiro/horário

**Como Testar:**
1. Acesse: `http://localhost:3000/book`
2. Verifique wizard

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

### **1.7 Unauthorized**

**URL:** `http://localhost:3000/unauthorized`

**Esperado:**
- ✅ Página de erro 403
- ✅ Mensagem "Acesso Negado"
- ✅ Botão "Ir para Dashboard"

**Como Testar:**
1. Acesse: `http://localhost:3000/unauthorized`
2. Verifique página de erro

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

## 🔒 TESTE 2: ROTAS PROTEGIDAS (Com Login)

### **PREPARAÇÃO: FAZER LOGIN**

1. Acesse: `http://localhost:3000/login`
2. Faça login com usuário comum
3. Deve redirecionar para: `/app/dashboard`

---

### **2.1 Dashboard**

**URL:** `http://localhost:3000/app/dashboard`

**Esperado:**
- ✅ Dashboard com estatísticas
- ✅ Sidebar visível
- ✅ Cards de métricas
- ✅ Gráficos

**Como Testar:**
1. Após login, verifique se está em `/app/dashboard`
2. Verifique sidebar e conteúdo

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

### **2.2 Agenda**

**URL:** `http://localhost:3000/app/agenda`

**Esperado:**
- ✅ Calendário de agendamentos
- ✅ Lista de agendamentos do dia
- ✅ Botão "Novo Agendamento"

**Como Testar:**
1. Clique em "Agenda" na sidebar
2. Ou acesse: `http://localhost:3000/app/agenda`

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

### **2.3 PDV**

**URL:** `http://localhost:3000/app/pdv`

**Esperado:**
- ✅ Interface de ponto de venda
- ✅ Lista de serviços/produtos
- ✅ Carrinho de compras

**Como Testar:**
1. Clique em "PDV" na sidebar
2. Ou acesse: `http://localhost:3000/app/pdv`

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

### **2.4 Clients**

**URL:** `http://localhost:3000/app/clients`

**Esperado:**
- ✅ Lista de clientes
- ✅ Botão "Novo Cliente"
- ✅ Busca/filtros

**Como Testar:**
1. Clique em "Clientes" na sidebar
2. Ou acesse: `http://localhost:3000/app/clients`

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

### **2.5 Finance**

**URL:** `http://localhost:3000/app/finance`

**Esperado:**
- ✅ Dashboard financeiro
- ✅ Receitas e despesas
- ✅ Gráficos

**Como Testar:**
1. Clique em "Financeiro" na sidebar
2. Ou acesse: `http://localhost:3000/app/finance`

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

### **2.6 Referrals**

**URL:** `http://localhost:3000/app/referrals`

**Esperado:**
- ✅ Programa de indicações
- ✅ Link de indicação
- ✅ Lista de indicados

**Como Testar:**
1. Clique em "Indicações" na sidebar
2. Ou acesse: `http://localhost:3000/app/referrals`

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

### **2.7 Plan**

**URL:** `http://localhost:3000/app/plan`

**Esperado:**
- ✅ Plano atual
- ✅ Opções de upgrade
- ✅ Histórico de pagamentos

**Como Testar:**
1. Clique em "Meu Plano" na sidebar
2. Ou acesse: `http://localhost:3000/app/plan`

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

### **2.8 Settings**

**URL:** `http://localhost:3000/app/settings`

**Esperado:**
- ✅ Configurações gerais
- ✅ Perfil da barbearia
- ✅ Configurações de notificação

**Como Testar:**
1. Clique em "Configurações" na sidebar
2. Ou acesse: `http://localhost:3000/app/settings`

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

### **2.9 Settings Password**

**URL:** `http://localhost:3000/app/settings/password`

**Esperado:**
- ✅ Formulário de alteração de senha
- ✅ Campos: senha atual, nova senha, confirmar

**Como Testar:**
1. Acesse: `http://localhost:3000/app/settings/password`

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

## 🛡️ TESTE 3: ROTA SUPER ADMIN

### **PREPARAÇÃO: LOGIN COMO SUPER ADMIN**

1. Configure usuário com `role = 'SUPER_ADMIN'` no Supabase
2. Faça login
3. Verifique se link "Super Admin" aparece na sidebar

---

### **3.1 Super Admin Dashboard**

**URL:** `http://localhost:3000/app/super-admin`

**Esperado (como SUPER_ADMIN):**
- ✅ Dashboard administrativo
- ✅ Banner "GOD MODE ATIVO"
- ✅ Estatísticas globais
- ✅ Abas: Overview, Barbearias, Faturamento, Sistema

**Como Testar:**
1. Login como super admin
2. Acesse: `http://localhost:3000/app/super-admin`

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

### **3.2 Super Admin (Usuário Comum)**

**URL:** `http://localhost:3000/app/super-admin`

**Esperado (como usuário comum):**
- ✅ Redireciona para `/app/dashboard`
- ✅ NÃO acessa a página

**Como Testar:**
1. Logout do super admin
2. Login como usuário comum
3. Tente acessar: `http://localhost:3000/app/super-admin`
4. Deve redirecionar automaticamente

**Resultado:**
- [ ] ✅ PASSOU - Redirecionou para dashboard
- [ ] ❌ FALHOU - Conseguiu acessar (ERRO DE SEGURANÇA!)

---

## 🔄 TESTE 4: REDIRECTS AUTOMÁTICOS

### **4.1 Login Quando Já Autenticado**

**Teste:**
1. Faça login
2. Tente acessar: `http://localhost:3000/login`

**Esperado:**
- ✅ Redireciona automaticamente para `/app/dashboard`

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Ficou na página de login

---

### **4.2 Register Quando Já Autenticado**

**Teste:**
1. Faça login
2. Tente acessar: `http://localhost:3000/register`

**Esperado:**
- ✅ Redireciona automaticamente para `/app/dashboard`

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Ficou na página de registro

---

### **4.3 Rota Protegida Sem Login**

**Teste:**
1. Logout (ou aba anônima)
2. Tente acessar: `http://localhost:3000/app/dashboard`

**Esperado:**
- ✅ Redireciona automaticamente para `/login`

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Acessou sem login (ERRO DE SEGURANÇA!)

---

### **4.4 Setup Com Profile Completo**

**Teste:**
1. Login com usuário que já tem profile
2. Tente acessar: `http://localhost:3000/app/setup`

**Esperado:**
- ✅ Redireciona automaticamente para `/app/dashboard`

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Acessou a página de setup

---

## 🔗 TESTE 5: CALLBACK E RESET PASSWORD

### **5.1 Callback OAuth**

**URL:** `http://localhost:3000/auth/callback?code=XXX`

**Esperado:**
- ✅ Processa código
- ✅ Redireciona para `/app/dashboard`

**Como Testar:**
- Difícil testar manualmente (requer OAuth flow)
- Verificar logs do servidor

---

### **5.2 Callback Reset Password**

**URL:** `http://localhost:3000/auth/callback?code=XXX&type=recovery`

**Esperado:**
- ✅ Processa código
- ✅ Redireciona para `/reset-password`

**Como Testar:**
1. Solicite reset de senha em `/forgot-password`
2. Clique no link do email
3. Deve ir para `/reset-password`

**Resultado:**
- [ ] ✅ PASSOU
- [ ] ❌ FALHOU - Erro: _______________

---

## 📊 RESUMO DOS TESTES

### **Rotas Públicas (7)**
- [ ] `/` - Landing Page
- [ ] `/login` - Login
- [ ] `/register` - Cadastro
- [ ] `/forgot-password` - Esqueci senha
- [ ] `/reset-password` - Redefinir senha
- [ ] `/book` - Agendamento online
- [ ] `/unauthorized` - Erro 403

### **Rotas Protegidas (9)**
- [ ] `/app/dashboard` - Dashboard
- [ ] `/app/agenda` - Agenda
- [ ] `/app/pdv` - PDV
- [ ] `/app/clients` - Clientes
- [ ] `/app/finance` - Financeiro
- [ ] `/app/referrals` - Indicações
- [ ] `/app/plan` - Plano
- [ ] `/app/settings` - Configurações
- [ ] `/app/settings/password` - Alterar senha

### **Rotas Admin (1)**
- [ ] `/app/super-admin` - Super Admin

### **Redirects (4)**
- [ ] Login quando autenticado → Dashboard
- [ ] Register quando autenticado → Dashboard
- [ ] Rota protegida sem login → Login
- [ ] Setup com profile → Dashboard

### **Callbacks (2)**
- [ ] OAuth callback
- [ ] Reset password callback

---

## 🎯 CRITÉRIOS DE SUCESSO

**Sistema está OK se:**
- ✅ Todas as rotas públicas carregam
- ✅ Todas as rotas protegidas exigem login
- ✅ Super admin só acessa com role correto
- ✅ Redirects funcionam automaticamente
- ✅ Sem loops de redirecionamento
- ✅ Sem erros 404 ou 500

**Sistema tem PROBLEMAS se:**
- ❌ Rotas protegidas acessíveis sem login
- ❌ Super admin acessível por usuário comum
- ❌ Loops de redirecionamento
- ❌ Páginas em branco ou erro 404
- ❌ Erros no console do navegador

---

## 📝 TEMPLATE DE RELATÓRIO

```
# RELATÓRIO DE TESTE - ROTAS

**Data:** __/__/____
**Testador:** ___________
**Navegador:** ___________

## Rotas Públicas
✅ / - OK
✅ /login - OK
❌ /register - ERRO: Não carrega

## Rotas Protegidas
✅ /app/dashboard - OK
✅ /app/agenda - OK
...

## Problemas Encontrados
1. Rota X não carrega
2. Redirect Y não funciona
3. ...

## Status Final
[ ] ✅ TODOS OS TESTES PASSARAM
[ ] ❌ ENCONTRADOS X PROBLEMAS
```

---

**Execute este guia e me envie o relatório completo!** 🧪
