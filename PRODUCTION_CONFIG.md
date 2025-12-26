# 🚀 CONFIGURAÇÃO DE PRODUÇÃO - barber.gold

**Domínio Principal:** `barber.gold`  
**Data:** 26/12/2025

---

## 🌐 ESTRUTURA DE DOMÍNIOS

### **Domínio Principal (Plataforma)**
```
barber.gold          → Landing Page SaaS
www.barber.gold      → Landing Page SaaS
```

### **Subdomínios (Tenants - Barbearias)**
```
premiumgold.barber.gold    → Página de agendamento da barbearia "Premium Gold"
stylehouse.barber.gold     → Página de agendamento da barbearia "Style House"
elitecuts.barber.gold      → Página de agendamento da barbearia "Elite Cuts"
```

---

## ⚙️ MIDDLEWARE CONFIGURADO

**Arquivo:** `middleware.ts`

### **Lógica de Detecção:**

```typescript
const hostname = request.headers.get('host') || ''
const subdomain = hostname.split('.')[0]

// Domínios principais (não são tenants)
const mainDomains = ['barber', 'www']
const isMainDomain = mainDomains.includes(subdomain) || 
                     hostname === 'barber.gold' || 
                     hostname === 'www.barber.gold'
```

### **Comportamento:**

| Acesso | Detectado Como | Ação |
|--------|----------------|------|
| `barber.gold` | Domínio Principal | Renderiza Landing Page |
| `www.barber.gold` | Domínio Principal | Renderiza Landing Page |
| `premiumgold.barber.gold` | Tenant | Redireciona para `/book?tenant=premiumgold` |
| `stylehouse.barber.gold` | Tenant | Redireciona para `/book?tenant=stylehouse` |

---

## 🔧 VARIÁVEIS DE AMBIENTE

**Arquivo:** `.env.local` (ou `.env.production`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yitrspfqpakpygfytduz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=seu_anon_key

# URLs
NEXT_PUBLIC_SITE_URL=https://barber.gold
NEXT_PUBLIC_APP_URL=https://barber.gold

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 🌍 DNS CONFIGURAÇÃO

### **Registros DNS Necessários:**

```dns
# Domínio principal
A     barber.gold          →  IP_DO_SERVIDOR
A     www.barber.gold      →  IP_DO_SERVIDOR

# Wildcard para tenants (barbearias)
A     *.barber.gold        →  IP_DO_SERVIDOR
```

### **Se usar Vercel/Netlify:**

```dns
CNAME barber.gold          →  cname.vercel-dns.com
CNAME www.barber.gold      →  cname.vercel-dns.com
CNAME *.barber.gold        →  cname.vercel-dns.com
```

---

## 📋 ROTAS EM PRODUÇÃO

### **Domínio Principal (`barber.gold`)**

| URL | Página | Descrição |
|-----|--------|-----------|
| `barber.gold/` | Landing Page | Página principal SaaS |
| `barber.gold/login` | Login | Login de usuários |
| `barber.gold/register` | Cadastro | Cadastro de novas barbearias |
| `barber.gold/app/dashboard` | Dashboard | Área administrativa |
| `barber.gold/app/super-admin` | Super Admin | Painel administrativo global |

### **Subdomínios Tenants (`*.barber.gold`)**

| URL | Página | Descrição |
|-----|--------|-----------|
| `premiumgold.barber.gold/` | Booking | Agendamento online |
| `premiumgold.barber.gold/book` | Booking | Agendamento online |

---

## 🔐 SUPABASE CONFIGURAÇÃO

### **1. Email Templates**

**Redirect URLs devem usar domínio de produção:**

```
Forgot Password:
https://barber.gold/auth/callback?type=recovery

OAuth Callback:
https://barber.gold/auth/callback
```

### **2. Authentication → URL Configuration**

**Site URL:**
```
https://barber.gold
```

**Redirect URLs:**
```
https://barber.gold/auth/callback
https://barber.gold/reset-password
https://barber.gold/app/dashboard
```

### **3. Row Level Security (RLS)**

Todas as queries devem filtrar por `tenant_id` ou `store_id`:

```sql
-- Exemplo de política RLS
CREATE POLICY "Users can only see their tenant data"
ON appointments
FOR SELECT
USING (tenant_id = auth.uid());
```

---

## 🚀 DEPLOY

### **Vercel (Recomendado)**

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Configurar domínio
vercel domains add barber.gold
```

### **Variáveis de Ambiente no Vercel:**

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add STRIPE_SECRET_KEY production
# ... adicionar todas as variáveis
```

---

## 🧪 TESTAR EM PRODUÇÃO

### **1. Domínio Principal**

```bash
# Deve carregar Landing Page
curl -I https://barber.gold/

# Deve carregar Login
curl -I https://barber.gold/login
```

### **2. Tenant (Barbearia)**

```bash
# Deve redirecionar para /book
curl -I https://premiumgold.barber.gold/

# Deve carregar página de agendamento
curl -I https://premiumgold.barber.gold/book
```

### **3. Rotas Protegidas**

```bash
# Sem autenticação - deve redirecionar para /login
curl -I https://barber.gold/app/dashboard
```

---

## 📊 MONITORAMENTO

### **Logs Importantes:**

1. **Middleware:** Verificar detecção de subdomínios
2. **Auth:** Verificar redirects após login
3. **Tenants:** Verificar carregamento de páginas de booking

### **Ferramentas:**

- Vercel Analytics
- Supabase Logs
- Sentry (para erros)

---

## 🔄 FLUXO COMPLETO

### **Usuário Acessa Landing Page:**
```
1. https://barber.gold
2. Middleware detecta: isMainDomain = true
3. Renderiza: Landing Page SaaS
```

### **Usuário Acessa Barbearia:**
```
1. https://premiumgold.barber.gold
2. Middleware detecta: isMainDomain = false, subdomain = 'premiumgold'
3. Redireciona: /book?tenant=premiumgold
4. Renderiza: Página de agendamento da Premium Gold
```

### **Usuário Faz Login:**
```
1. https://barber.gold/login
2. Preenche credenciais
3. Supabase Auth valida
4. Redireciona: /app/dashboard
5. AuthGuard valida sessão
6. Renderiza: Dashboard
```

---

## ⚠️ PROBLEMAS COMUNS

### **Problema 1: Domínio Principal Redireciona para /book**

**Causa:** Middleware não reconhece `barber.gold` como domínio principal

**Solução:** Verificar linha 15 do `middleware.ts`:
```typescript
const isMainDomain = mainDomains.includes(subdomain) || 
                     hostname === 'barber.gold' || 
                     hostname === 'www.barber.gold'
```

### **Problema 2: Tenant Não Carrega**

**Causa:** DNS não configurado ou wildcard não funciona

**Solução:**
1. Verificar DNS: `nslookup premiumgold.barber.gold`
2. Verificar wildcard: `*.barber.gold`
3. Aguardar propagação DNS (até 48h)

### **Problema 3: Redirect Loop**

**Causa:** Middleware e AuthGuard conflitando

**Solução:**
1. Verificar rotas públicas no middleware (linha 31)
2. Verificar exceção de `/app/setup` no AuthGuard

---

## ✅ CHECKLIST DE PRODUÇÃO

- [x] Middleware ajustado para `barber.gold`
- [ ] DNS configurado (A records + wildcard)
- [ ] Variáveis de ambiente configuradas
- [ ] Supabase URLs atualizadas
- [ ] Email templates atualizados
- [ ] Deploy realizado
- [ ] Domínio verificado no Vercel
- [ ] SSL/HTTPS ativo
- [ ] Testado domínio principal
- [ ] Testado subdomínios tenants
- [ ] Testado fluxo de login
- [ ] Testado fluxo de recuperação de senha

---

**Sistema configurado para produção em `barber.gold`.** 🚀
