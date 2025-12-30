-- =====================================================
-- VERIFICAR TABELAS EXISTENTES NO SUPABASE
-- Cole este SQL no Supabase SQL Editor e execute
-- =====================================================

SELECT
  table_name,
  column_name,
  data_type
FROM
  information_schema.columns
WHERE
  table_schema = 'public'
  AND table_name IN (
    'stores',
    'tenants',
    'profiles',
    'appointments',
    'sales',
    'sale_items',
    'expenses',
    'register_closures',
    'staff_payments',
    'staff',
    'clients',
    'services',
    'products',
    'suppliers'
  )
ORDER BY
  table_name,
  ordinal_position;
