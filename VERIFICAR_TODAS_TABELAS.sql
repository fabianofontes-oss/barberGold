-- Execute este SQL no Supabase para verificar o schema de TODAS as tabelas
SELECT 
    table_name,
    column_name,
    data_type
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name IN ('services', 'products', 'categories', 'commission_plans', 'suppliers', 'stores')
ORDER BY 
    table_name, ordinal_position;
