
-- Verificar se as tabelas foram criadas
SELECT 
    schemaname,
    tablename,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('cotacoes', 'produtos', 'transportadoras');

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('cotacoes', 'produtos', 'transportadoras');

-- Verificar se o usuário Lucas existe
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE email = 'lucasfriske@agrofarm.net.br';
