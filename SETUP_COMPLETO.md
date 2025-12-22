# 🚀 SETUP COMPLETO - BarberFlow

**Última atualização:** 22/12/2025  
**Status:** ✅ PRONTO PARA USAR

---

## 🎯 INÍCIO RÁPIDO

### OPÇÃO 1: Modo Demo (FUNCIONA AGORA - SEM CONFIGURAÇÃO)

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor
npm run dev

# 3. Acessar http://localhost:3000/login

# 4. Fazer login com credenciais demo
Email: admin@barberflow.com
Senha: admin123
```

**✅ PRONTO!** O sistema está funcionando em modo demo.

---

### OPÇÃO 2: Modo Produção (COM SUPABASE REAL)

#### Passo 1: Criar Projeto Supabase (5 min)

1. Acesse https://supabase.com
2. Clique em "New Project"
3. Preencha:
   - **Name:** barberflow-production
   - **Database Password:** (anote essa senha!)
   - **Region:** South America (Brazil)
4. Clique em "Create new project"
5. Aguarde 2-3 minutos

#### Passo 2: Obter Credenciais (2 min)

1. No projeto criado, vá em **Settings** → **API**
2. Copie:
   - **Project URL** (algo como: `https://xxxxx.supabase.co`)
   - **anon public key** (chave longa começando com `eyJ...`)

#### Passo 3: Configurar Variáveis de Ambiente (2 min)

1. Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# Ou crie manualmente no VSCode/Cursor
```

2. Cole este conteúdo e substitua pelos seus valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (sua chave aqui)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_MODE=pilot
```

#### Passo 4: Executar Schema SQL (15 min)

1. No Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Abra o arquivo `supabase/schema-complete.sql` deste projeto
4. Copie TODO o conteúdo
5. Cole no editor SQL do Supabase
6. Clique em **RUN**
7. Aguarde mensagem de sucesso

**✅ Banco de dados criado!** Todas as tabelas, políticas e triggers foram criados.

#### Passo 5: Criar Usuário de Teste (5 min)

1. No Supabase, vá em **Authentication** → **Users**
2. Clique em **Add user** → **Create new user**
3. Preencha:
   - **Email:** seu-email@exemplo.com
   - **Password:** sua-senha-segura
   - **Auto Confirm User:** ✅ MARQUE ESTA OPÇÃO
4. Clique em **Create user**

**Importante:** Anote email e senha para fazer login!

#### Passo 6: Criar Profile do Usuário (SQL)

1. Volte ao **SQL Editor**
2. Execute este comando (substitua o email):

```sql
-- Buscar o ID do usuário criado
SELECT id, email FROM auth.users WHERE email = 'seu-email@exemplo.com';

-- Copie o ID e execute (substitua USER_ID_AQUI):
INSERT INTO public.profiles (id, email, name, role, tenant_id)
VALUES (
  'USER_ID_AQUI',
  'seu-email@exemplo.com',
  'Admin Principal',
  'OWNER',
  gen_random_uuid()
);
```

#### Passo 7: Testar! (5 min)

```bash
# Parar o servidor se estiver rodando (Ctrl+C)

# Iniciar novamente para carregar .env.local
npm run dev

# Acessar http://localhost:3000/login

# Fazer login com SEU email e senha criados no Supabase
```

**✅ SUCESSO!** Agora está usando banco de dados real!

---

## 🎭 DIFERENÇAS ENTRE MODOS

### Modo Demo (Sem Supabase)

**Ativa quando:**
- Variáveis de ambiente não configuradas
- `NEXT_PUBLIC_SUPABASE_URL` está vazia ou igual a "your-supabase-url"

**Características:**
- ✅ Login funciona instantaneamente
- ✅ Dados salvos no `localStorage`
- ✅ Ótimo para testar UI/UX
- ⚠️ Dados perdidos ao limpar navegador
- ⚠️ Não sincroniza entre dispositivos
- ⚠️ Não tem RLS (segurança multi-tenant)

**Credenciais Demo:**
```
Admin:    admin@barberflow.com     / admin123
Barbeiro: barbeiro@barberflow.com  / barbeiro123
Teste:    teste@barberflow.com     / teste123
```

### Modo Produção (Com Supabase)

**Ativa quando:**
- Variáveis de ambiente configuradas corretamente
- Supabase está acessível

**Características:**
- ✅ Dados persistentes no PostgreSQL
- ✅ Sincronização em tempo real
- ✅ Multi-tenant com RLS
- ✅ Autenticação robusta
- ✅ Backup automático do Supabase
- ✅ Pronto para produção

---

## 📁 ESTRUTURA DE ARQUIVOS IMPORTANTES

```
barberGold/
├── .env.local                        # ⚠️ CRIAR ESTE ARQUIVO (nunca commitar)
├── .env.example                      # 📖 Template de configuração
├── supabase/
│   └── schema-complete.sql           # 🗃️ Schema completo do banco
├── src/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # ✅ Cliente browser
│   │   │   ├── server.ts             # ✅ Cliente server
│   │   │   └── middleware.ts         # ✅ Middleware de sessão
│   │   └── business-logic/
│   │       ├── commissions.ts        # ✅ Lógica de comissões
│   │       ├── loyalty.ts            # ✅ Programa de fidelidade
│   │       └── queue.ts              # ✅ Fila inteligente
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── actions.ts            # ✅ Server Actions de auth
│   │   │   └── loginDemo.ts          # 🎭 Sistema de login demo
│   │   ├── clients/
│   │   │   ├── actions.ts            # ✅ CRUD de clientes
│   │   │   └── repository.ts         # ✅ Repositório Supabase
│   │   ├── appointments/
│   │   │   ├── actions.ts            # ✅ CRUD de agendamentos
│   │   │   └── repository.ts         # ✅ Repositório Supabase
│   │   └── sales/
│   │       ├── actions.ts            # ✅ Processamento de vendas
│   │       └── repository.ts         # ✅ Repositório Supabase
│   ├── components/
│   │   ├── AuthGuardModern.tsx       # 🔒 Proteção de rotas (suporta demo)
│   │   └── SignOutButton.tsx         # 🚪 Botão de logout
│   └── app/
│       ├── login/
│       │   └── page.tsx              # 🔑 Página de login (dual mode)
│       └── app/
│           ├── layout.tsx            # 🛡️ Layout com AuthGuard
│           ├── dashboard/            # 📊 Dashboard
│           ├── clients/              # 👥 Gestão de clientes
│           ├── agenda/               # 📅 Agendamentos
│           └── pdv/                  # 💰 Ponto de Venda
└── middleware.ts                     # 🔒 Middleware Next.js
```

---

## ⚙️ COMANDOS DISPONÍVEIS

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento (porta 3000)
npm run build            # Compila para produção
npm run start            # Inicia servidor de produção
npm run lint             # Executa ESLint
npm run type-check       # Verifica tipos TypeScript

# Atalhos PowerShell (Windows)
.\START.ps1              # Inicia dev + proteção automática
.\iniciar-protecao.ps1   # Ativa backup automático
```

---

## 🔒 SEGURANÇA

### Arquivos que NUNCA devem ser commitados:

- `.env.local` ✅ (já no .gitignore)
- `.env` ✅ (já no .gitignore)
- `node_modules/` ✅ (já no .gitignore)

### Boas Práticas:

1. **Nunca compartilhe suas chaves Supabase publicamente**
2. Use `.env.local` para desenvolvimento
3. Configure variáveis de ambiente na Vercel para produção
4. Habilite Row Level Security (RLS) no Supabase
5. Use senhas fortes para usuários

---

## 🚨 TROUBLESHOOTING

### Problema: Login não funciona

**Sintoma:** Erro "Email ou senha incorretos"

**Solução (Modo Demo):**
- Use: `admin@barberflow.com` / `admin123`
- Clique no botão laranja no topo da tela de login para preencher automaticamente

**Solução (Modo Produção):**
- Verifique se `.env.local` existe e está preenchido corretamente
- Confirme que o usuário foi criado no Supabase Auth
- Verifique se marcou "Auto Confirm User" ao criar o usuário
- Execute a query SQL para criar o profile

### Problema: Erro "Supabase não configurado"

**Sintoma:** Avisos vermelhos no terminal

**Solução:**
- Se quer usar modo demo: IGNORE, está funcionando normal
- Se quer usar Supabase: crie `.env.local` conforme Passo 3

### Problema: Build falha

**Sintoma:** `npm run build` retorna erro

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules .next
npm install
npm run build
```

### Problema: Página em branco após login

**Sintoma:** Login funciona mas dashboard não carrega

**Solução (Modo Demo):**
- Limpe o localStorage: Abra DevTools (F12) → Console → digite: `localStorage.clear()` → Recarregue

**Solução (Modo Produção):**
- Verifique se o profile foi criado no banco
- Execute a query SQL do Passo 6 novamente

---

## 📊 CHECKLIST FINAL

### ✅ Modo Demo (Imediato)

- [ ] `npm install` executado
- [ ] `npm run dev` funcionando
- [ ] Login com `admin@barberflow.com` / `admin123` funciona
- [ ] Dashboard carrega
- [ ] Consegue criar/editar clientes
- [ ] Banner amarelo "Modo Demo" aparece no login

### ✅ Modo Produção (Com Supabase)

- [ ] Projeto Supabase criado
- [ ] Credenciais copiadas
- [ ] `.env.local` criado e preenchido
- [ ] Schema SQL executado (sem erros)
- [ ] Usuário criado no Supabase Auth
- [ ] Profile criado via SQL
- [ ] Login com SEU email funciona
- [ ] Banner "Modo Demo" NÃO aparece no login
- [ ] Dados persistem após recarregar página

---

## 🎯 PRÓXIMOS PASSOS

Após o setup básico funcionar:

1. **Customizar Planos** → `src/domain/plans/plans.ts`
2. **Configurar Webhooks** → Para Stripe/pagamentos
3. **Deploy na Vercel** → Seguir `GUIA_DEPLOY.md`
4. **Configurar domínio** → DNS customizado
5. **Habilitar Analytics** → Google Analytics ou Plausible

---

## 📚 DOCUMENTAÇÃO ADICIONAL

- **Deploy:** `GUIA_DEPLOY.md`
- **Validação:** `GUIA_VALIDACAO.md`
- **Arquitetura:** `SISTEMA_COMPLETO.md`
- **Progresso:** `PROGRESSO_RECUPERACAO.md`
- **Schema SQL:** `supabase/schema-complete.sql`
- **Business Logic:** `docs/business-logic/`

---

## 🆘 SUPORTE

**Problemas técnicos:**
- Abra uma issue no GitHub
- Consulte a documentação do Supabase: https://supabase.com/docs
- Verifique os logs no console do navegador (F12)

**Dúvidas sobre setup:**
- Releia este documento
- Verifique `GUIA_VALIDACAO.md`
- Consulte `TROUBLESHOOTING` acima

---

## ✅ STATUS DO SISTEMA

| Módulo | Status | Modo Demo | Modo Prod |
|--------|--------|-----------|-----------|
| 🔑 Autenticação | ✅ PRONTO | ✅ | ✅ |
| 👥 Clientes | ✅ PRONTO | ✅ | ✅ |
| 📅 Agenda | ✅ PRONTO | ⚠️ Mock | ✅ |
| 💰 PDV | ✅ PRONTO | ⚠️ Mock | ✅ |
| 📊 Dashboard | ✅ PRONTO | ✅ | ✅ |
| 💳 Financeiro | ✅ PRONTO | ⚠️ Mock | ✅ |
| ⚙️ Configurações | ✅ PRONTO | ✅ | ✅ |
| 📱 Agendamento Online | ✅ PRONTO | ⚠️ Mock | ✅ |

**Legenda:**
- ✅ Totalmente funcional
- ⚠️ Dados mockados (não persistem)

---

**🎉 SISTEMA PRONTO PARA USO!**

Seja em modo demo ou produção, o BarberFlow está 100% funcional e pronto para gerenciar sua barbearia!

