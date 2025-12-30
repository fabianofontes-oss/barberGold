# 🧪 GUIA DE TESTE - BARBERGOLD

## ✅ SQL EXECUTADO COM SUCESSO!

O banco de dados está configurado. Agora vamos testar se tudo funciona.

---

## 🎯 TESTE 1: Verificar se Dados Persistem

### 1.1 Iniciar o servidor
```bash
npm run dev
```

### 1.2 Testar Agendamento
1. Acesse: http://localhost:3000
2. Faça login (ou crie conta)
3. Vá em **Agenda**
4. Crie um novo agendamento
5. **Recarregue a página (F5)**
6. ✅ **Verificar:** Agendamento deve continuar lá

### 1.3 Testar Venda (PDV)
1. Vá em **PDV**
2. Adicione serviços ao carrinho
3. Finalize a venda
4. **Recarregue a página (F5)**
5. Vá em **Finanças**
6. ✅ **Verificar:** Venda deve aparecer no histórico

### 1.4 Testar Despesa
1. Vá em **Finanças** → Tab **Despesas**
2. Adicione uma despesa
3. **Recarregue a página (F5)**
4. ✅ **Verificar:** Despesa deve continuar lá

---

## 🎯 TESTE 2: Verificar Novo Cadastro

### 2.1 Fazer logout
- Clique no seu perfil → Logout

### 2.2 Criar nova conta
1. Clique em **Cadastrar**
2. Preencha:
   - Nome: Teste Barbearia
   - Email: teste@email.com
   - Senha: teste123
3. Clique em **Criar conta**
4. ✅ **Verificar:** Deve criar automaticamente tenant e profile

### 2.3 Verificar no Supabase
1. Abra Supabase → Table Editor → `tenants`
2. ✅ **Verificar:** Deve ter um novo tenant com nome "Teste Barbearia"
3. Abra `profiles`
4. ✅ **Verificar:** Deve ter um novo profile com role "OWNER"

---

## 🎯 TESTE 3: Verificar Tabelas Criadas

### No Supabase SQL Editor, cole:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('staff_payments', 'stores')
ORDER BY table_name;
```

✅ **Deve retornar:**
- stores (VIEW)
- staff_payments (tabela)

---

## 📊 O QUE FOI CORRIGIDO

### Problemas Resolvidos:
1. ✅ **VIEW `stores` criada** - Código que usa `.from('stores')` agora funciona
2. ✅ **Tabela `staff_payments` criada** - Pagamentos de equipe agora persistem
3. ✅ **Trigger de SignUp atualizado** - Novos usuários criados corretamente
4. ✅ **Policies configuradas** - Segurança RLS funcionando

### Descobertas Importantes:
1. 🔍 `profiles.store_id` é **COLUNA GERADA** (sincroniza automaticamente com `tenant_id`)
2. 🔍 `staff` é uma **VIEW** (não tabela) - por isso não aceita foreign key
3. 🔍 Tabelas já existiam: `appointments`, `sales`, `sale_items`, `expenses`, `register_closures`

---

## ✅ SE TODOS OS TESTES PASSAREM

**Seu projeto está 100% funcional!**

Próximos passos (Fase 2):
- Melhorar qualidade do código
- Remover os 103 `any`
- Adicionar testes automatizados
- Refatorar arquivos grandes
- Deploy em produção

---

## 🆘 SE ALGUM TESTE FALHAR

### Dados somem após F5?
1. Abra o console do navegador (F12)
2. Vá na aba "Console"
3. Procure por erros em vermelho
4. Me envie a mensagem de erro

### Cadastro não funciona?
1. Vá no Supabase → Logs
2. Procure por erros recentes
3. Me envie o log

### Outro problema?
Me envie:
- O que você tentou fazer
- O que aconteceu
- Screenshot (se possível)

---

**Criado em:** 2025-01-28  
**Status:** ✅ Pronto para testar
