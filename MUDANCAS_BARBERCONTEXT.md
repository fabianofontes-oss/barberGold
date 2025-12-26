# 🔧 MUDANÇAS NO BARBERCONTEXT - PLANO DETALHADO

**Arquivo:** `src/context/BarberContext.tsx` (680 linhas)  
**Status:** AGUARDANDO APROVAÇÃO  
**Risco:** ALTO (arquivo crítico)

---

## 📊 ANÁLISE DO ARQUIVO ATUAL

**Linha 2:** Imports do React  
**Linha 4:** Imports dos MOCKS (PROBLEMA)  
**Linha 199:** `useState<StaffMember>(MOCK_STAFF[0])` (PROBLEMA)  
**Linha 220-240:** Múltiplos states com MOCKS (PROBLEMA)

---

## ✏️ MUDANÇA #1: Adicionar import do hook

**Localização:** Após linha 8

**ADICIONAR:**
```typescript
import { useCurrentProfile } from '@/hooks/useCurrentProfile';
import { createClient } from '@/lib/supabase/client';
```

---

## ✏️ MUDANÇA #2: Modificar inicialização do currentUser

**Localização:** Linha ~199

**ANTES:**
```typescript
const [currentUser, setCurrentUser] = useState<StaffMember>(MOCK_STAFF[0]);
```

**DEPOIS:**
```typescript
const [currentUser, setCurrentUser] = useState<StaffMember | null>(null);
const [loading, setLoading] = useState(true);
```

---

## ✏️ MUDANÇA #3: Adicionar useEffect para carregar dados

**Localização:** Após os useState (linha ~250)

**ADICIONAR:**
```typescript
// Carregar dados reais do Supabase
useEffect(() => {
  async function loadUserData() {
    try {
      const supabase = createClient();
      
      // 1. Verificar sessão
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.warn('⚠️ Sem sessão ativa');
        setLoading(false);
        return;
      }

      // 2. Buscar profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .single();

      if (profileError) {
        console.error('❌ Erro ao buscar profile:', profileError);
        setLoading(false);
        return;
      }

      if (profile) {
        console.log('✅ Profile carregado:', profile.name);
        
        // 3. Mapear para StaffMember
        const mappedUser: StaffMember = {
          id: profile.id,
          name: profile.name,
          role: profile.role,
          email: profile.email || '',
          phone: profile.phone || '',
          commissionModel: profile.commission_model || 'PERCENTAGE',
          serviceCommissionRate: profile.commission_rate || 50,
          productCommissionRate: profile.commission_rate || 50,
          rentalFee: 0,
          paymentFrequency: 'WEEKLY',
          workSchedule: profile.work_schedule || []
        };
        
        setCurrentUser(mappedUser);

        // 4. Buscar tenant
        const { data: tenant } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', profile.tenant_id)
          .single();

        if (tenant) {
          console.log('✅ Tenant carregado:', tenant.name);
          setShopProfile({
            name: tenant.name,
            slug: tenant.slug,
            logo: tenant.logo_url || '',
            address: tenant.address || '',
            phone: tenant.phone || '',
            whatsapp: tenant.whatsapp || '',
            instagram: tenant.instagram || '',
            operatingHours: [] // TODO: mapear do tenant.settings
          });
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setLoading(false);
    }
  }

  loadUserData();
}, []);
```

---

## ✏️ MUDANÇA #4: Adicionar loading state no render

**Localização:** Logo após o início da função de render (procurar por `return (`)

**ADICIONAR ANTES DO RETURN:**
```typescript
// Loading state
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p className="text-white">Carregando seus dados...</p>
      </div>
    </div>
  );
}

// Validação de autenticação
if (!loading && !currentUser) {
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
  return null;
}
```

---

## ✏️ MUDANÇA #5: Comentar referências a MOCKS (NÃO DELETAR)

**Localização:** Linha ~220-240

**COMENTAR estas linhas:**
```typescript
// const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
// const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
// const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
// ... etc
```

**SUBSTITUIR POR:**
```typescript
const [appointments, setAppointments] = useState<Appointment[]>([]);
const [clients, setClients] = useState<Client[]>([]);
const [staff, setStaff] = useState<StaffMember[]>([]);
// ... etc (arrays vazios)
```

---

## 🎯 RESULTADO ESPERADO

Após essas mudanças:

1. ✅ BarberContext busca dados reais do Supabase
2. ✅ Mostra loading enquanto carrega
3. ✅ Redireciona para login se não autenticado
4. ✅ Logs no console para debug
5. ✅ Mocks comentados (não deletados) para referência

---

## ⚠️ RISCOS

1. **ALTO:** Arquivo crítico - se quebrar, todo sistema para
2. **MÉDIO:** Componentes podem esperar dados mockados
3. **BAIXO:** Performance (mais queries ao Supabase)

---

## 🧪 PLANO DE TESTE

Após mudanças:

1. `npm run dev` 
2. Abrir console do navegador (F12)
3. Fazer login
4. Procurar logs: "✅ Profile carregado"
5. Verificar se dashboard carrega
6. Se quebrar: `git checkout src/context/BarberContext.tsx` (reverter)

---

## 📋 APROVAÇÃO NECESSÁRIA

**Você precisa aprovar estas mudanças antes de eu executar.**

**Opções:**

**A)** ✅ APROVAR - Execute todas as mudanças  
**B)** 🔧 MODIFICAR - Altere algo antes de executar  
**C)** ❌ CANCELAR - Não faça essas mudanças

**Responda:** A, B ou C
