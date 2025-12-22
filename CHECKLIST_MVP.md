# ✅ CHECKLIST MVP - BarberFlow

**Imprima ou mantenha aberto durante validação e deploy**

---

## 📋 PRÉ-REQUISITOS

### Contas & Acesso
- [ ] Conta GitHub criada
- [ ] Conta Vercel criada
- [ ] Conta Supabase criada
- [ ] Domínio (opcional)

---

## 🧪 VALIDAÇÃO (2-3h)

### 1. Setup Supabase (30min)
- [ ] Criar projeto no Supabase
- [ ] Escolher região (South America)
- [ ] Copiar Project URL
- [ ] Copiar anon key
- [ ] Abrir SQL Editor
- [ ] Executar `schema.sql` completo
- [ ] Verificar tabelas criadas (8 tabelas)

### 2. Configurar Local (10min)
- [ ] Criar arquivo `.env.local`
- [ ] Adicionar `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Adicionar `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Adicionar `NEXT_PUBLIC_SITE_URL`
- [ ] Salvar arquivo

### 3. Criar Dados de Teste (15min)
- [ ] Executar SQL: criar tenant
- [ ] Criar usuário no Auth (Dashboard)
- [ ] Executar SQL: associar user → profile
- [ ] Verificar email confirmado

### 4. Testar Auth (15min)
- [ ] Rodar `npm run dev`
- [ ] Acessar `/app/dashboard`
- [ ] Verifica redirect → `/login`
- [ ] Fazer login com usuário teste
- [ ] Verifica redirect → `/dashboard`
- [ ] Verifica sidebar com nome
- [ ] Testar logout
- [ ] ✅ Auth funcionando!

### 5. Testar Clients (30min)
- [ ] Ir em `/app/clients`
- [ ] Criar cliente (João Silva)
- [ ] Verificar cliente na lista
- [ ] Editar notes do cliente
- [ ] Buscar cliente no input
- [ ] Refresh da página (F5)
- [ ] Cliente ainda aparece
- [ ] Abrir DevTools (F12)
- [ ] Console sem erros
- [ ] Verificar no Supabase (SQL Editor)
- [ ] ✅ Clients funcionando!

### 6. Verificar RLS (20min)
- [ ] Criar segundo tenant (SQL)
- [ ] Criar cliente para tenant 2 (SQL)
- [ ] Login como tenant 1
- [ ] Ir em `/app/clients`
- [ ] NÃO vê cliente do tenant 2
- [ ] Vê apenas clientes do tenant 1
- [ ] ✅ RLS funcionando!

### 7. Build Local (10min)
- [ ] Parar servidor (`Ctrl+C`)
- [ ] Rodar `npm run build`
- [ ] Build passa sem erros
- [ ] Ignorar warning de env vars (esperado)
- [ ] ✅ Build OK!

---

## 🚀 DEPLOY (1-2h)

### 1. Preparar GitHub (15min)
- [ ] Verificar `.gitignore` existe
- [ ] Verificar `.env.local` NÃO está commitado
- [ ] `git init` (se ainda não está)
- [ ] Criar repo no GitHub (private)
- [ ] `git remote add origin ...`
- [ ] `git add .`
- [ ] `git commit -m "feat: MVP BarberFlow"`
- [ ] `git push -u origin main`
- [ ] Verificar código no GitHub

### 2. Deploy Vercel (20min)
- [ ] Acessar vercel.com
- [ ] Login com GitHub
- [ ] Clicar "Add New... > Project"
- [ ] Importar repositório
- [ ] Selecionar `barberflow-mvp`
- [ ] Clicar "Import"
- [ ] Aguardar detecção (Next.js)

### 3. Configurar Env Vars (10min)
- [ ] Adicionar `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Adicionar `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Adicionar `NEXT_PUBLIC_SITE_URL`
- [ ] Verificar valores corretos
- [ ] **Importante:** Usar projeto de PRODUÇÃO

### 4. Deploy! (5min)
- [ ] Clicar "Deploy"
- [ ] Aguardar build (~2-3min)
- [ ] Build passa sem erros
- [ ] Copiar URL (https://....vercel.app)
- [ ] ✅ Deploy concluído!

### 5. Configurar Supabase Produção (10min)
- [ ] Supabase Dashboard > Authentication > URL Configuration
- [ ] Adicionar Site URL (Vercel URL)
- [ ] Adicionar Redirect URL (com /auth/callback)
- [ ] Adicionar wildcard (/**)
- [ ] Salvar configurações

### 6. Validar Produção (20min)
- [ ] Acessar URL do Vercel
- [ ] Ir em `/app/dashboard`
- [ ] Verifica redirect → `/login`
- [ ] Fazer login
- [ ] Verifica redirect → `/dashboard`
- [ ] Ir em `/app/clients`
- [ ] Criar cliente de teste
- [ ] Verificar cliente aparece
- [ ] Refresh página (F5)
- [ ] Cliente ainda aparece
- [ ] Abrir DevTools (F12)
- [ ] Console sem erros críticos
- [ ] ✅ Produção funcionando!

### 7. Performance (10min)
- [ ] Teste de velocidade (carrega <3s?)
- [ ] Teste mobile (responsivo?)
- [ ] Teste em 3 navegadores
- [ ] ✅ Performance OK!

---

## 🎨 PÓS-DEPLOY (Opcional)

### Domínio Customizado (30min)
- [ ] Vercel > Settings > Domains
- [ ] Adicionar domínio
- [ ] Configurar DNS (CNAME)
- [ ] Aguardar propagação (~10min)
- [ ] Atualizar URLs no Supabase
- [ ] Testar domínio customizado
- [ ] ✅ Domínio ativo!

### Analytics (10min)
- [ ] Vercel > Analytics > Enable
- [ ] Configurar tracking
- [ ] Testar evento
- [ ] ✅ Analytics ativo!

### Monitoring (20min)
- [ ] Configurar UptimeRobot (grátis)
- [ ] Adicionar URL do app
- [ ] Configurar intervalo (5min)
- [ ] Adicionar email para alertas
- [ ] Testar alerta (opcional)
- [ ] ✅ Monitoring ativo!

---

## 🐛 TROUBLESHOOTING

### ❌ Build falha
- [ ] Verificar erros no log
- [ ] Rodar `npm run build` local
- [ ] Corrigir erros TypeScript
- [ ] Fazer push novamente

### ❌ Auth não funciona
- [ ] Verificar env vars no Vercel
- [ ] Verificar usuário existe no Auth
- [ ] Verificar profile criado
- [ ] Verificar redirect URLs

### ❌ Clients não carregam
- [ ] Verificar console (F12)
- [ ] Verificar Network tab
- [ ] Verificar RLS habilitado
- [ ] Verificar policies criadas
- [ ] Executar `schema.sql` novamente

### ❌ App lento
- [ ] Verificar region do Supabase
- [ ] Verificar queries (Network tab)
- [ ] Adicionar índices (se necessário)
- [ ] Otimizar imagens

---

## ✅ CRITÉRIOS DE SUCESSO

### MVP está pronto se:
- [x] Build passa local
- [x] Build passa no Vercel
- [x] Auth funciona (local + produção)
- [x] Clients CRUD funciona (local + produção)
- [x] RLS isola tenants
- [x] Console sem erros críticos
- [x] Performance <3s
- [x] Responsivo (mobile + desktop)

---

## 🎯 STATUS FINAL

### Progresso Geral
- [ ] ✅ Validação completa
- [ ] ✅ Deploy completo
- [ ] ✅ Pós-deploy (opcional)
- [ ] 🎊 **MVP LANÇADO!**

**Data de Conclusão:** ___/___/______

**URL Produção:** _________________________________

**Notas:** 
_________________________________________________
_________________________________________________
_________________________________________________

---

## 📞 SE PRECISAR DE AJUDA

### Consultar:
1. `GUIA_VALIDACAO.md` (testes)
2. `GUIA_DEPLOY.md` (deploy)
3. `RELATORIO_FINAL_COMPLETO.md` (detalhes)

### Troubleshooting:
- 12 problemas comuns cobertos nos guias
- Buscar erro específico no índice

---

**🎊 BOA SORTE COM O LANÇAMENTO!**

**Tempo estimado:** 3-5h (validação + deploy)  
**Dificuldade:** ⭐⭐⭐ (Médio)  
**Pré-requisitos:** Conhecimento básico de Git + Vercel  

**Lembre-se:** Não precisa estar perfeito para lançar! 🚀

