# INSTRUÇÕES PARA APLICAÇÃO DO SCHEMA BARBEGOLD

## 📌 IMPORTANTE
Este é o schema DEFINITIVO do BarberGold para aplicação em um Supabase VAZIO.

## 🗂️ Arquivos do Schema

1. **SCHEMA_FINAL_BARBEGOLD.sql** - Parte 1: Estrutura base (extensões, funções, tabelas core)
2. **SCHEMA_FINAL_BARBEGOLD_PARTE2.sql** - Parte 2: Tabelas restantes, índices, triggers e RLS

## 📋 Como Aplicar

### Opção 1: Aplicar em Sequência (RECOMENDADO)

1. Acesse o Supabase Dashboard
2. Vá em **SQL Editor**
3. Execute **PRIMEIRO** o arquivo `SCHEMA_FINAL_BARBEGOLD.sql`
4. Execute **DEPOIS** o arquivo `SCHEMA_FINAL_BARBEGOLD_PARTE2.sql`

### Opção 2: Limpar Banco Antes (SE NECESSÁRIO)

Se você precisa limpar o banco antes, execute:

```sql
-- ATENÇÃO: Isso apagará TUDO!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;
```

Depois aplique os SQLs na ordem indicada.

## ✅ O Que Foi Incluído

### Tabelas Core
- ✅ **tenants** (com colunas Stripe: stripe_customer_id, stripe_subscription_id, subscription_status)
- ✅ **profiles** (funcionários/staff)
- ✅ **clients** 
- ✅ **services** + **service_categories** + **bundle_items**
- ✅ **products**
- ✅ **appointments**
- ✅ **sales** + **sale_items**
- ✅ **staff_services** (relacionamento staff-serviços)

### Tabelas Financeiras
- ✅ **expenses** (despesas)
- ✅ **register_closures** (fechamento de caixa)
- ✅ **commission_plans** (planos de comissão)

### Tabelas de Gestão
- ✅ **categories** (categorias genéricas)
- ✅ **suppliers** (fornecedores)
- ✅ **inventory** (inventário)
- ✅ **supply_transactions** (transações de estoque)

### Tabelas de Templates (Onboarding)
- ✅ **service_categories_template**
- ✅ **services_template**
- ✅ **bundle_items_template**

### Recursos Adicionais
- ✅ **Views de compatibilidade**: `stores` (aponta para `tenants`) e `staff` (aponta para `profiles`)
- ✅ **Colunas GENERATED**: `store_id` em todas as tabelas (compatibilidade com código legado)
- ✅ **Triggers**: Atualização automática de `updated_at`
- ✅ **Índices**: Otimização de performance
- ✅ **RLS (Row Level Security)**: Multi-tenancy completa
- ✅ **Funções Helper**: `get_user_tenant_id()`, `update_updated_at_column()`

## 🔄 Compatibilidade

### Multi-tenancy
- **Padrão**: Todas as tabelas usam `tenant_id`
- **Compatibilidade**: Coluna virtual `store_id` que aponta para `tenant_id`
- **Views**: `stores` e `staff` para código legado

### Stripe Integration
A tabela `tenants` já possui as colunas necessárias para integração com Stripe:
- `stripe_customer_id`
- `stripe_subscription_id`
- `subscription_status`

## 🚀 Próximos Passos

1. **Aplicar o Schema**: Siga as instruções acima
2. **Verificar Aplicação**: No Supabase Dashboard, verifique se todas as tabelas foram criadas
3. **Testar RLS**: Verifique se as políticas estão funcionando corretamente
4. **Popular Templates**: Adicione os templates de serviços se necessário

## ⚠️ Observações

- Este schema foi projetado para um banco **VAZIO**
- Se você tem dados existentes, faça **BACKUP** antes
- O schema padroniza em `tenant_id` mas mantém compatibilidade com `store_id`
- Todas as tabelas têm RLS habilitado para multi-tenancy

## 📞 Suporte

Se encontrar algum problema:
1. Verifique os logs no Supabase Dashboard
2. Confirme que executou os SQLs na ordem correta
3. Verifique se não há conflitos com estruturas existentes

---

**Versão**: 3.0 Final  
**Data**: 2025-01-28  
**Status**: PRONTO PARA PRODUÇÃO
