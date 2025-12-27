-- Execute este SQL no Supabase para verificar o schema real da tabela services
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'services'
ORDER BY 
    ordinal_position;
