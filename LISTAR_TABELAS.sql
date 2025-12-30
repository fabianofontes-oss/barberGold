-- =====================================================
-- LISTAR TODAS AS TABELAS DO SCHEMA PUBLIC
-- Cole este SQL no Supabase SQL Editor e execute
-- =====================================================

SELECT
  table_name
FROM
  information_schema.tables
WHERE
  table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY
  table_name;
