# 🚀 GUIA DE DEPLOY - DIA 10

**Objetivo:** Colocar MVP em produção no Vercel

---

## 📋 PRÉ-REQUISITOS

✅ Testes de validação passando (ver `GUIA_VALIDACAO.md`)  
✅ Build local passa (`npm run build`)  
✅ Conta no GitHub (para código)  
✅ Conta no Vercel (para deploy)  
✅ Supabase configurado (produção)  

---

## 🔧 ETAPA 1: PREPARAR REPOSITÓRIO

### 1.1 Criar Repositório no GitHub

**Passos:**
1. Acessar https://github.com/new
2. Nome: `barberflow-mvp`
3. Visibilidade: Private (recomendado)
4. **NÃO** inicializar com README (já existe)
5. Clicar em "Create repository"

---

### 1.2 Adicionar .gitignore

**Arquivo:** `.gitignore` (verificar se existe)

```gitignore
# Dependências
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

---

### 1.3 Fazer Push

**Comandos:**
```bash
# Inicializar Git (se ainda não está)
git init

# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/barberflow-mvp.git

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "feat: MVP BarberFlow - Auth + Clients + Appointments + Sales"

# Push para GitHub
git branch -M main
git push -u origin main
```

---

## 🌐 ETAPA 2: DEPLOY NO VERCEL

### 2.1 Criar Projeto no Vercel

**Passos:**
1. Acessar https://vercel.com
2. Clicar em "Add New..." > "Project"
3. Importar repositório do GitHub
4. Selecionar `barberflow-mvp`
5. Clicar em "Import"

---

### 2.2 Configurar Environment Variables

**Na página de configuração do projeto:**

1. Clicar em "Environment Variables"
2. Adicionar variáveis:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://seu-projeto.supabase.co

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sua-anon-key-aqui

Name: NEXT_PUBLIC_SITE_URL
Value: https://seu-app.vercel.app
```

**Onde encontrar:**
- Supabase Dashboard > Settings > API
- Copiar "Project URL" e "anon public"

**Importante:** Use o projeto de **PRODUÇÃO** do Supabase!

---

### 2.3 Configurar Build Settings

**Framework Preset:** Next.js  
**Build Command:** `npm run build`  
**Output Directory:** `.next`  
**Install Command:** `npm install`  

**Deixar padrão (já detecta automaticamente)**

---

### 2.4 Deploy!

1. Clicar em "Deploy"
2. Aguardar build (~2-3 minutos)
3. ✅ Deploy concluído!

**URL:** https://barberflow-mvp.vercel.app

---

## 🧪 ETAPA 3: VALIDAR PRODUÇÃO

### 3.1 Testar Auth

**Passos:**
1. Acessar https://seu-app.vercel.app/app/dashboard
2. Deve redirecionar para `/login`
3. Fazer login com usuário de produção
4. Deve funcionar!

---

### 3.2 Testar Clients

**Passos:**
1. Ir em `/app/clients`
2. Criar cliente de teste
3. Verificar se aparece na lista
4. ✅ CRUD funcionando!

---

### 3.3 Verificar Console

**Passos:**
1. Abrir DevTools (F12)
2. Verificar console
3. **NÃO** deve ter erros

**Erros comuns:**
- ❌ "Failed to fetch" → Env vars erradas
- ❌ "Invalid login" → Usuário não existe
- ❌ "CORS error" → Supabase config

---

## 🔐 ETAPA 4: CONFIGURAR SUPABASE (Produção)

### 4.1 Configurar Allowed URLs

**Supabase Dashboard > Authentication > URL Configuration:**

**Site URL:**
```
https://seu-app.vercel.app
```

**Redirect URLs:**
```
https://seu-app.vercel.app/auth/callback
https://seu-app.vercel.app/**
```

---

### 4.2 Configurar Email Templates (Opcional)

**Supabase Dashboard > Authentication > Email Templates:**

Personalizar emails de:
- Confirmação de email
- Reset de senha
- Convite

---

### 4.3 Configurar RLS Policies

**Verificar se todas as policies estão ativas:**

```sql
-- Ver policies ativas
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

**Deve aparecer:**
- clients_tenant_isolation
- appointments_tenant_isolation
- sales_tenant_isolation
- etc.

**Se não aparecer:** Executar `schema.sql` novamente.

---

## 🎨 ETAPA 5: CONFIGURAR DOMÍNIO (Opcional)

### 5.1 Adicionar Domínio Customizado

**Vercel Dashboard > Seu Projeto > Settings > Domains:**

1. Clicar em "Add"
2. Digitar: `app.barberflow.com` (ou seu domínio)
3. Seguir instruções de DNS
4. Aguardar propagação (~5-10 minutos)

---

### 5.2 Configurar DNS

**No seu provedor de domínio (ex: Registro.br):**

**Tipo A:**
```
Host: app
Value: 76.76.21.21 (ou IP do Vercel)
```

**Tipo CNAME:**
```
Host: app
Value: cname.vercel-dns.com
```

**Vercel recomenda CNAME quando possível.**

---

### 5.3 Atualizar Supabase URLs

**Após domínio ativo, atualizar no Supabase:**

```
Site URL: https://app.barberflow.com
Redirect URLs: https://app.barberflow.com/**
```

---

## 📊 ETAPA 6: MONITORAMENTO

### 6.1 Configurar Vercel Analytics

**Vercel Dashboard > Analytics:**

1. Habilitar Analytics (grátis para hobby)
2. Ver métricas:
   - Page views
   - Unique visitors
   - Top pages
   - Performance

---

### 6.2 Configurar Error Tracking (Opcional)

**Opções:**
- Sentry (recomendado)
- LogRocket
- Vercel Logs (built-in)

**Vercel Logs:**
- Vercel Dashboard > Logs
- Ver erros em tempo real

---

### 6.3 Configurar Uptime Monitoring (Opcional)

**Opções:**
- UptimeRobot (grátis)
- Pingdom
- StatusCake

**Configurar:**
- URL: https://seu-app.vercel.app
- Intervalo: 5 minutos
- Alertas: Email

---

## 🔄 ETAPA 7: CI/CD AUTOMÁTICO

### 7.1 Branch Strategy

**Branches recomendadas:**
- `main` → Produção (auto-deploy)
- `develop` → Staging (preview deploy)
- `feature/*` → Features (preview deploy)

---

### 7.2 Configurar Preview Deploys

**Vercel automático:**
- Todo PR → Preview deploy
- Comentário no GitHub com URL
- ✅ Já funciona out-of-the-box!

---

### 7.3 Configurar Production Deploy

**Vercel automático:**
- Push para `main` → Deploy produção
- ✅ Já funciona!

**Workflow:**
```bash
# Desenvolver feature
git checkout -b feature/nova-feature
# ... fazer mudanças ...
git push origin feature/nova-feature

# Criar PR no GitHub
# Vercel cria preview deploy automático
# Review → Merge para main
# Vercel faz deploy em produção automático
```

---

## ✅ CHECKLIST FINAL

### Pré-Deploy
- [ ] Build local passa
- [ ] Testes de validação OK
- [ ] .env.local testado
- [ ] Schema SQL executado

### Deploy
- [ ] Repositório no GitHub
- [ ] Projeto criado no Vercel
- [ ] Env vars configuradas
- [ ] Deploy concluído sem erros

### Validação Produção
- [ ] Auth funciona
- [ ] Clients funciona
- [ ] RLS funciona
- [ ] Sem erros no console
- [ ] Performance OK (<2s)

### Configuração
- [ ] Supabase URLs atualizadas
- [ ] Email templates (opcional)
- [ ] Domínio customizado (opcional)
- [ ] Analytics habilitado

---

## 🎯 CRITÉRIOS DE SUCESSO

**MVP está em produção se:**

✅ App acessível via HTTPS  
✅ Auth funcionando  
✅ CRUD de Clients funcionando  
✅ RLS isolando tenants  
✅ Sem erros no console  
✅ Performance aceitável (<3s)  

**Se tudo OK:** 🎉 **MVP LANÇADO!**

---

## 🚨 TROUBLESHOOTING

### Erro: "Build failed"

**Causa:** Erro de TypeScript ou falta dependência

**Solução:**
1. Rodar `npm run build` localmente
2. Corrigir erros
3. Fazer push novamente

---

### Erro: "Environment variables not found"

**Causa:** Env vars não configuradas no Vercel

**Solução:**
1. Vercel Dashboard > Settings > Environment Variables
2. Adicionar variáveis
3. Fazer redeploy (Deployments > ... > Redeploy)

---

### Erro: "Failed to fetch" em produção

**Causa:** Supabase URL ou ANON_KEY errados

**Solução:**
1. Verificar env vars no Vercel
2. Verificar se URL está correta (sem barra no final)
3. Verificar se ANON_KEY está completa

---

### App lento em produção

**Causa:** Queries não otimizadas ou imagens grandes

**Solução:**
1. Verificar Network tab (F12)
2. Otimizar queries lentas
3. Adicionar indices no Supabase
4. Usar Next.js Image para imagens

---

## 📚 PRÓXIMOS PASSOS

### Curto Prazo (1-2 semanas)

- [ ] Refatorar Agenda.tsx (conectar Appointments)
- [ ] Refatorar PointOfSale.tsx (conectar Sales)
- [ ] Adicionar testes automatizados
- [ ] Melhorar loading states
- [ ] Adicionar toast notifications

### Médio Prazo (1 mês)

- [ ] Implementar WebSocket (real-time)
- [ ] Adicionar notificações push
- [ ] Implementar backup automático
- [ ] Adicionar multi-idioma
- [ ] Dashboard com gráficos

### Longo Prazo (3 meses)

- [ ] App mobile (React Native)
- [ ] Integrações (WhatsApp, Instagram)
- [ ] Marketplace de add-ons
- [ ] Sistema de parceiros
- [ ] Expansão internacional

---

## 🎓 LIÇÕES APRENDIDAS

### O que funcionou bem ✅

- Arquitetura modular (fácil de escalar)
- Zod para validação (zero bugs de tipo)
- Server Actions (sem API routes)
- Repository pattern (fácil de testar)
- Commission snapshot (preserva histórico)

### O que pode melhorar 🔧

- UI ainda usa Context (migrar gradualmente)
- Falta testes automatizados
- Falta documentação de API
- Falta monitoramento robusto

### Recomendações para próximo MVP 💡

1. Começar com testes desde o início
2. Configurar CI/CD logo no dia 1
3. Monitoramento desde o começo
4. Documentar enquanto desenvolve
5. Fazer deploys frequentes (não esperar estar "perfeito")

---

**🚀 BOA SORTE COM O LANÇAMENTO!**

**Qualquer dúvida:** Consultar documentação ou criar issue no GitHub.







