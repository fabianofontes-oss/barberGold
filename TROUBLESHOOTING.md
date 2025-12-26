# 🆘 TROUBLESHOOTING - Problemas Comuns e Soluções

---

## ❌ ERRO: "Database error saving new user"

### **Causa 1: Trigger não instalado**

**Solução:**
1. Abra Supabase SQL Editor
2. Execute o arquivo: `EXECUTE_ESTE_SQL.sql`
3. Teste cadastro novamente

### **Causa 2: Tabelas não existem**

**Como verificar:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Tabelas necessárias:**
- tenants
- profiles
- services
- products
- clients
- appointments

**Se faltarem tabelas:**
1. Execute: `supabase/schema-complete.sql`
2. Depois execute: `EXECUTE_ESTE_SQL.sql`

### **Causa 3: RLS bloqueando**

**Solução:**
- O trigger usa `SECURITY DEFINER` que ignora RLS
- Se ainda assim der erro, verifique se o trigger foi criado corretamente

---

## ❌ ERRO: "relation tenants does not exist"

**Significa:** Tabelas do banco não foram criadas

**Solução:**
1. Abra Supabase SQL Editor
2. Abra o arquivo: `supabase/schema-complete.sql`
3. Copie TODO o conteúdo
4. Cole no SQL Editor
5. Clique em RUN
6. Aguarde finalizar (pode demorar 1-2 minutos)
7. Execute o trigger novamente: `EXECUTE_ESTE_SQL.sql`

---

## ❌ ERRO: "duplicate key value violates unique constraint"

**Significa:** Já existe um usuário com esse email ou slug

**Solução 1: Usar outro email**
- Tente cadastrar com outro email

**Solução 2: Deletar usuário antigo**
```sql
-- Ver usuários
SELECT id, email FROM auth.users;

-- Deletar usuário específico
DELETE FROM auth.users WHERE email = 'seuemail@gmail.com';
```

---

## ❌ ERRO: "permission denied for table tenants"

**Significa:** Permissões do banco estão bloqueando

**Solução:**
1. Verifique se o trigger tem `SECURITY DEFINER`
2. Execute novamente: `EXECUTE_ESTE_SQL.sql`
3. Se persistir, verifique RLS:
```sql
-- Ver políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'tenants';
```

---

## ❌ ERRO: Build falhando no Vercel

**Causa comum:** Erro de TypeScript ou import

**Solução:**
1. Rode localmente: `npm run build`
2. Veja o erro específico
3. Corrija o erro
4. Faça commit e push

---

## ❌ ERRO: "useSearchParams should be wrapped in suspense"

**Já corrigido!** Se aparecer:
1. Verifique se tem `<Suspense>` no componente
2. Veja exemplo em: `src/app/reset-password/page.tsx`

---

## ❌ Landing page redireciona para /book

**Já corrigido!** O middleware foi ajustado para reconhecer `barber.gold` como domínio principal.

Se ainda acontecer:
1. Limpe cache do navegador
2. Teste em aba anônima
3. Verifique `middleware.ts` linha 15

---

## ❌ Não consigo fazer login

**Verificações:**

1. **Email confirmado?**
   - Verifique sua caixa de email
   - Ou desabilite confirmação no Supabase

2. **Senha correta?**
   - Tente recuperar senha em `/forgot-password`

3. **Usuário existe?**
```sql
SELECT id, email, confirmed_at FROM auth.users 
WHERE email = 'seuemail@gmail.com';
```

---

## ❌ Dashboard não carrega

**Verificações:**

1. **Está autenticado?**
   - Faça login novamente

2. **Profile existe?**
```sql
SELECT * FROM profiles WHERE email = 'seuemail@gmail.com';
```

3. **Tenant existe?**
```sql
SELECT * FROM tenants WHERE owner_id = (
  SELECT id FROM auth.users WHERE email = 'seuemail@gmail.com'
);
```

---

## ❌ Erro 403 - Unauthorized

**Causa:** Tentando acessar rota protegida sem permissão

**Soluções:**

1. **Para /app/super-admin:**
   - Precisa ter role = 'SUPER_ADMIN'
   - Altere no banco:
   ```sql
   UPDATE profiles SET role = 'SUPER_ADMIN' 
   WHERE email = 'seuemail@gmail.com';
   ```

2. **Para outras rotas:**
   - Faça login novamente
   - Verifique se o profile está ativo

---

## 🔍 COMO DEBUGAR

### **Ver logs do Supabase:**
1. Supabase Dashboard
2. Logs → Postgres Logs
3. Procure por erros ou NOTICE

### **Ver logs do Vercel:**
1. Vercel Dashboard
2. Seu projeto
3. Logs
4. Filtre por erros

### **Testar localmente:**
```bash
npm run dev
```

Abra: http://localhost:3000

---

## 📞 AINDA COM PROBLEMA?

**Me envie:**
1. Print da tela com o erro
2. Mensagem de erro completa
3. O que você estava tentando fazer
4. Resultado do SQL (se executou algum)

**Vou te ajudar a resolver!** 💪
