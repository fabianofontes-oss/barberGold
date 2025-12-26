# 🔧 INTEGRAÇÃO COMPLETA COM SUPABASE - BARBERGOLD

**Status:** EM ANDAMENTO  
**Objetivo:** Remover 100% dos mocks e integrar com dados reais do Supabase

---

## ✅ CONCLUÍDO

### 1. Hook `useCurrentProfile` criado
- **Arquivo:** `src/hooks/useCurrentProfile.ts`
- **Função:** Busca profile do usuário logado do Supabase (client-side)
- **Substitui:** `MOCK_STAFF[0]` no BarberContext

### 2. SUPER_ADMIN removido dos mocks
- **Commit:** `df5ffb6`
- **Arquivo:** `src/constants.ts`
- **Mudança:** Primeiro item do MOCK_STAFF agora é OWNER

### 3. Bugs críticos corrigidos
- **Commit:** `bf5c223`
- Campo `display_name` → `name`
- Tabelas `stores`/`staff` → `tenants`/`profiles`
- Função `getTenantId()` busca ID real do profile

---

## ⏳ PENDENTE - BARBERCONTEXT

**Arquivo:** `src/context/BarberContext.tsx`

### Mudanças necessárias (LINHA 199):

**ANTES:**
```typescript
const [currentUser, setCurrentUser] = useState<StaffMember>(MOCK_STAFF[0]);
```

**DEPOIS:**
```typescript
const [currentUser, setCurrentUser] = useState<StaffMember | null>(null);
const [loading, setLoading] = useState(true);
```

### Adicionar useEffect para carregar dados:

```typescript
useEffect(() => {
  async function loadUserData() {
    const supabase = createClient();
    
    // 1. Verificar sessão
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }

    // 2. Buscar profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (profile) {
      // 3. Mapear para StaffMember
      setCurrentUser({
        id: profile.id,
        name: profile.name,
        role: profile.role,
        email: profile.email,
        phone: profile.phone,
        // ... resto dos campos
      });

      // 4. Buscar tenant
      const { data: tenant } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', profile.tenant_id)
        .single();

      if (tenant) {
        setShopProfile({
          name: tenant.name,
          slug: tenant.slug,
          // ... resto
        });
      }
    }

    setLoading(false);
  }

  loadUserData();
}, []);
```

### Adicionar loading state no render:

```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <div className="text-white">Carregando...</div>
    </div>
  );
}

if (!currentUser) {
  // Redirecionar para login ou mostrar erro
  return null;
}
```

---

## ⏳ PENDENTE - MÓDULOS

### Agenda (`src/modules/agenda/`)
- [ ] Remover `MOCK_APPOINTMENTS`
- [ ] Integrar com tabela `appointments`
- [ ] Filtrar por `tenant_id`

### Clientes (`src/modules/clients/`)
- [x] Repository corrigido (usa Supabase)
- [x] Actions corrigido (busca tenant_id real)
- [ ] Verificar se componentes passam tenant_id

### Finanças (`src/modules/finance/`)
- [ ] Remover mocks de `sales` e `expenses`
- [ ] Integrar com tabelas reais
- [ ] Filtrar por `tenant_id`

### Dashboard (`src/modules/dashboard/`)
- [ ] Remover dados mockados
- [ ] Buscar estatísticas reais do banco
- [ ] Agregar dados de múltiplas tabelas

---

## 🎯 PRÓXIMOS PASSOS

1. **CRÍTICO:** Modificar BarberContext conforme especificado acima
2. **IMPORTANTE:** Integrar módulos com Supabase
3. **MANUTENÇÃO:** Limpar arquivos SQL duplicados
4. **TESTE:** Validar fluxo completo de cadastro → dashboard → CRUD

---

## 📊 PROGRESSO

- [x] Hook useCurrentProfile criado
- [x] SUPER_ADMIN removido
- [x] Bugs de campos/tabelas corrigidos
- [ ] BarberContext integrado
- [ ] Módulos integrados
- [ ] Testes completos
- [ ] Deploy final

---

**NOTA:** BarberContext é muito grande (~680 linhas). Mudanças devem ser feitas com cuidado para não quebrar funcionalidades existentes.

**RECOMENDAÇÃO:** Fazer mudanças incrementais e testar após cada alteração.
