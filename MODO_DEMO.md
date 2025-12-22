# 🎭 MODO DEMO - BarberFlow

**Status:** ✅ FUNCIONANDO AGORA  
**Última atualização:** 22/12/2025

---

## 🚀 USO IMEDIATO (30 SEGUNDOS)

```bash
npm install
npm run dev
```

Acesse: **http://localhost:3000/login**

### 🔑 Credenciais Demo

**Admin/Owner:**
```
Email: admin@barberflow.com
Senha: admin123
```

**Barbeiro:**
```
Email: barbeiro@barberflow.com
Senha: barbeiro123
```

**Usuário Teste:**
```
Email: teste@barberflow.com
Senha: teste123
```

---

## 🎯 O QUE FUNCIONA NO MODO DEMO?

### ✅ Totalmente Funcional

- 🔑 **Login/Logout** - Autenticação local
- 📊 **Dashboard** - Visualização de métricas
- 👥 **Listagem de Clientes** - Interface completa
- ⚙️ **Configurações** - UI de settings
- 🎨 **UI/UX Completo** - Todos os componentes visuais
- 🔒 **Proteção de Rotas** - AuthGuard funcional
- 💫 **Loading States** - Feedback visual
- ⚠️ **Error Handling** - Tratamento de erros

### ⚠️ Limitações (Dados Mockados)

- 📅 **Agendamentos** - Dados de exemplo (não salvam)
- 💰 **Vendas** - Transações mockadas
- 📈 **Relatórios** - Dados de demonstração
- 🔄 **Sincronização** - Sem backend real
- 👤 **Multi-usuário** - Sem isolamento de dados

**Importante:** Dados do modo demo são salvos no `localStorage` e são perdidos ao limpar o navegador.

---

## 🎨 QUANDO USAR MODO DEMO?

### ✅ Use para:

1. **Desenvolvimento Frontend** - Testar UI sem backend
2. **Apresentações** - Mostrar o sistema funcionando
3. **Testes de UX** - Validar fluxos de usuário
4. **Prototipagem** - Experimentar mudanças rapidamente
5. **Onboarding de Devs** - Setup instantâneo para novos desenvolvedores
6. **Demos para Clientes** - Apresentar features sem dados reais

### ❌ NÃO use para:

1. **Produção** - Sempre use Supabase real
2. **Dados Reais** - Sem persistência confiável
3. **Multi-tenant** - Sem isolamento de dados
4. **Performance Tests** - Não reflete backend real
5. **Testes de Integração** - Precisa de backend real

---

## 🔧 COMO FUNCIONA?

### Detecção Automática

O sistema detecta modo demo automaticamente quando:

```typescript
// src/modules/auth/actions.ts
function isInDemoMode(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return !supabaseUrl || !supabaseKey || supabaseUrl === 'your-supabase-url';
}
```

### Fluxo de Autenticação

```
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │
       ├─ Supabase configurado? ──NO──→ ┌──────────────┐
       │                                 │  Demo Login  │
       │                                 └──────┬───────┘
       │                                        │
       │                                        ├─ Salva no localStorage
       │                                        └─ Redirect /app/dashboard
       │
       └─ Supabase configurado? ─YES──→ ┌──────────────┐
                                        │  Real Login  │
                                        └──────┬───────┘
                                               │
                                               ├─ Valida com Supabase
                                               └─ Redirect /app/dashboard
```

### Arquivos Envolvidos

```
src/
├── modules/auth/
│   ├── loginDemo.ts          # 🎭 Lógica do modo demo
│   └── actions.ts            # 🔀 Server Actions (dual mode)
├── components/
│   └── AuthGuardModern.tsx   # 🛡️ Proteção de rotas (suporta demo)
└── app/login/
    └── page.tsx              # 🔑 Página de login (dual mode)
```

---

## 💡 DICAS DE USO

### 1. Banner de Modo Demo

A página de login exibe um banner laranja quando em modo demo:

```
┌─────────────────────────────────────┐
│  🎭 Modo Demo Ativo                 │
│                                     │
│  Supabase não configurado.          │
│  Use estas credenciais para testar: │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Email: admin@barberflow.com │   │
│  │ Senha: admin123             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Clique acima para preencher        │
└─────────────────────────────────────┘
```

### 2. Preenchimento Automático

Clique no card laranja para preencher automaticamente:
- Email e senha são preenchidos
- Basta clicar em "Entrar"

### 3. Trocar de Usuário

```javascript
// No console do navegador (F12)
localStorage.clear();
// Recarregar a página
location.reload();
```

### 4. Verificar Modo Ativo

```javascript
// No console do navegador (F12)
const demoUser = JSON.parse(localStorage.getItem('demo_user'));
console.log('Modo Demo:', !!demoUser);
console.log('Usuário:', demoUser);
```

---

## 🔄 MIGRAÇÃO: DEMO → PRODUÇÃO

### Passo a Passo

1. **Configure Supabase** (veja `SETUP_COMPLETO.md`)
2. **Crie `.env.local`** com credenciais reais
3. **Pare o servidor** (`Ctrl+C`)
4. **Reinicie** (`npm run dev`)
5. **Teste o login** com usuário real do Supabase

### Verificação

Após configurar Supabase, o banner laranja **NÃO deve aparecer** no login.

Se ainda aparecer:
- ✅ Verifique se `.env.local` existe
- ✅ Confirme que variáveis estão preenchidas corretamente
- ✅ Reinicie o servidor

---

## 🎓 EXEMPLOS DE USO

### Cenário 1: Novo Desenvolvedor

```bash
# Dia 1 - Setup instantâneo
git clone [repo]
cd barberGold
npm install
npm run dev

# Acessar http://localhost:3000/login
# Login: admin@barberflow.com / admin123
# ✅ Pronto para desenvolver!
```

### Cenário 2: Apresentação para Cliente

```bash
# Antes da reunião
npm run dev

# Durante a apresentação
1. Mostrar login (modo demo visível)
2. Logar com admin@barberflow.com
3. Navegar pelo dashboard
4. Demonstrar features
5. Explicar que é ambiente de demo
```

### Cenário 3: Teste de Nova Feature

```bash
# Desenvolver feature nova
npm run dev

# Testar rapidamente
1. Login modo demo
2. Navegar até a feature
3. Testar interações
4. Verificar UI/UX
5. Commit quando satisfeito
```

---

## 📊 DADOS DEMO INCLUSOS

### Usuários (3)

```typescript
{
  id: 'demo-user-1',
  email: 'admin@barberflow.com',
  name: 'Admin Demo',
  role: 'OWNER',
  tenant_id: 'demo-tenant-1',
}
```

### Clientes (Mock)

Os dados de clientes são gerenciados pelo `ClientService` em modo demo.

### Agendamentos (Mock)

Agendamentos mostrados são de exemplo e não persistem.

### Vendas (Mock)

Transações exibidas são simuladas para demonstração.

---

## 🛠️ CUSTOMIZAÇÃO DO MODO DEMO

### Adicionar Novo Usuário Demo

```typescript
// src/modules/auth/loginDemo.ts
export const DEMO_USERS: DemoUser[] = [
  // Usuários existentes...
  {
    id: 'demo-user-4',
    email: 'gerente@barberflow.com',
    password: 'gerente123',
    name: 'Gerente Demo',
    role: 'ADMIN',
    tenant_id: 'demo-tenant-1',
  },
];
```

### Adicionar Dados Mock

Crie um arquivo de dados demo:

```typescript
// src/modules/demo/mockData.ts
export const DEMO_CLIENTS = [
  {
    id: 'client-1',
    name: 'João Silva',
    phone: '(11) 98765-4321',
    email: 'joao@example.com',
  },
  // Mais clientes...
];
```

---

## ⚠️ AVISOS IMPORTANTES

### 1. Segurança

- ❌ Credenciais demo são públicas
- ❌ Não usar em produção
- ❌ Dados não são criptografados
- ✅ Apenas para desenvolvimento/demo

### 2. Performance

- ⚠️ localStorage tem limite de ~5-10MB
- ⚠️ Muitos dados podem deixar lento
- ⚠️ Limpar localStorage regularmente

### 3. Compatibilidade

- ✅ Funciona em todos browsers modernos
- ⚠️ Modo privado pode ter limitações
- ⚠️ Safari pode ter restrições de localStorage

---

## 📚 DOCUMENTAÇÃO RELACIONADA

- **Setup Completo:** `SETUP_COMPLETO.md`
- **Deploy:** `GUIA_DEPLOY.md`
- **Validação:** `GUIA_VALIDACAO.md`
- **Autenticação Real:** `docs/business-logic/auth.md`

---

## ✅ CHECKLIST MODO DEMO

- [ ] `npm install` executado
- [ ] `npm run dev` funcionando
- [ ] Login com credenciais demo funciona
- [ ] Banner "Modo Demo" aparece no login
- [ ] Dashboard carrega após login
- [ ] Logout funciona
- [ ] Pode alternar entre usuários demo
- [ ] Interface está responsiva
- [ ] Loading states funcionam
- [ ] Mensagens de erro aparecem

---

**🎭 MODO DEMO ATIVADO E FUNCIONANDO!**

Ideal para desenvolvimento, apresentações e testes de UI sem necessidade de configurar backend.

**Quando estiver pronto para produção, veja:** `SETUP_COMPLETO.md`


