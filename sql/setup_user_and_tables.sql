
-- Primeiro, vamos criar o usuário no sistema de autenticação do Supabase
-- IMPORTANTE: Execute este script no SQL Editor do Supabase

-- Inserir o usuário Lucas no sistema de autenticação
-- Verificar se o usuário já existe antes de inserir
DO $$
DECLARE
    user_exists boolean;
    new_user_id uuid;
BEGIN
    -- Verificar se o usuário já existe
    SELECT EXISTS(
        SELECT 1 FROM auth.users WHERE email = 'lucasfriske@agrofarm.net.br'
    ) INTO user_exists;
    
    -- Se não existir, criar o usuário
    IF NOT user_exists THEN
        -- Gerar um novo UUID para o usuário
        new_user_id := gen_random_uuid();
        
        -- Inserir o usuário na tabela auth.users
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            confirmation_sent_at,
            confirmation_token,
            recovery_sent_at,
            recovery_token,
            email_change_sent_at,
            email_change,
            email_change_confirm_status,
            banned_until,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            created_at,
            updated_at,
            phone,
            phone_confirmed_at,
            phone_change,
            phone_change_token,
            phone_change_sent_at,
            email_change_token_new,
            email_change_token_current,
            is_sso_user,
            deleted_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            new_user_id,
            'authenticated',
            'authenticated',
            'lucasfriske@agrofarm.net.br',
            crypt('Nexus@4202', gen_salt('bf')),
            NOW(),
            NOW(),
            '',
            null,
            '',
            null,
            '',
            0,
            null,
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Lucas Baumann Friske"}',
            false,
            NOW(),
            NOW(),
            null,
            null,
            '',
            '',
            null,
            '',
            '',
            false,
            null
        );
        
        -- Inserir na tabela auth.identities
        INSERT INTO auth.identities (
            provider_id,
            user_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at,
            email
        ) VALUES (
            new_user_id::text,
            new_user_id,
            format('{"sub": "%s", "email": "%s", "email_verified": %s, "phone_verified": %s}', 
                   new_user_id::text, 'lucasfriske@agrofarm.net.br', 'true', 'false')::jsonb,
            'email',
            NOW(),
            NOW(),
            NOW(),
            'lucasfriske@agrofarm.net.br'
        );
        
        RAISE NOTICE 'Usuário Lucas criado com sucesso com ID: %', new_user_id;
    ELSE
        RAISE NOTICE 'Usuário Lucas já existe no sistema';
    END IF;
END $$;

-- Agora vamos recriar as tabelas com as estruturas corretas

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "Users can view their own cotacoes" ON cotacoes;
DROP POLICY IF EXISTS "Users can insert their own cotacoes" ON cotacoes;
DROP POLICY IF EXISTS "Users can update their own cotacoes" ON cotacoes;
DROP POLICY IF EXISTS "Users can delete their own cotacoes" ON cotacoes;

DROP POLICY IF EXISTS "Users can view produtos of their cotacoes" ON produtos;
DROP POLICY IF EXISTS "Users can insert produtos for their cotacoes" ON produtos;
DROP POLICY IF EXISTS "Users can update produtos of their cotacoes" ON produtos;
DROP POLICY IF EXISTS "Users can delete produtos of their cotacoes" ON produtos;

DROP POLICY IF EXISTS "Users can view transportadoras of their cotacoes" ON transportadoras;
DROP POLICY IF EXISTS "Users can insert transportadoras for their cotacoes" ON transportadoras;
DROP POLICY IF EXISTS "Users can update transportadoras of their cotacoes" ON transportadoras;
DROP POLICY IF EXISTS "Users can delete transportadoras of their cotacoes" ON transportadoras;

-- Remover tabelas se existirem (em ordem devido às foreign keys)
DROP TABLE IF EXISTS transportadoras CASCADE;
DROP TABLE IF EXISTS produtos CASCADE;
DROP TABLE IF EXISTS cotacoes CASCADE;

-- Criar tabela de cotações
CREATE TABLE cotacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente TEXT NOT NULL,
    fazenda TEXT,
    data TEXT NOT NULL,
    endereco TEXT,
    cidade TEXT,
    estado TEXT,
    cep TEXT,
    origem TEXT,
    destino TEXT,
    roteiro TEXT,
    observacoes TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de produtos
CREATE TABLE produtos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 1,
    peso TEXT,
    cotacao_id UUID REFERENCES cotacoes(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de transportadoras
CREATE TABLE transportadoras (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    prazo TEXT,
    valor_unitario TEXT,
    valor_total TEXT,
    status TEXT DEFAULT 'Pendente',
    proposta_final TEXT,
    cotacao_id UUID REFERENCES cotacoes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE cotacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportadoras ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para cotacoes
CREATE POLICY "Users can view their own cotacoes" ON cotacoes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cotacoes" ON cotacoes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cotacoes" ON cotacoes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cotacoes" ON cotacoes
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas de segurança para produtos
CREATE POLICY "Users can view produtos of their cotacoes" ON produtos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM cotacoes 
            WHERE cotacoes.id = produtos.cotacao_id 
            AND cotacoes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert produtos for their cotacoes" ON produtos
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM cotacoes 
            WHERE cotacoes.id = produtos.cotacao_id 
            AND cotacoes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update produtos of their cotacoes" ON produtos
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM cotacoes 
            WHERE cotacoes.id = produtos.cotacao_id 
            AND cotacoes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete produtos of their cotacoes" ON produtos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM cotacoes 
            WHERE cotacoes.id = produtos.cotacao_id 
            AND cotacoes.user_id = auth.uid()
        )
    );

-- Políticas de segurança para transportadoras
CREATE POLICY "Users can view transportadoras of their cotacoes" ON transportadoras
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM cotacoes 
            WHERE cotacoes.id = transportadoras.cotacao_id 
            AND cotacoes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert transportadoras for their cotacoes" ON transportadoras
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM cotacoes 
            WHERE cotacoes.id = transportadoras.cotacao_id 
            AND cotacoes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update transportadoras of their cotacoes" ON transportadoras
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM cotacoes 
            WHERE cotacoes.id = transportadoras.cotacao_id 
            AND cotacoes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete transportadoras of their cotacoes" ON transportadoras
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM cotacoes 
            WHERE cotacoes.id = transportadoras.cotacao_id 
            AND cotacoes.user_id = auth.uid()
        )
    );

-- Verificar se tudo foi criado corretamente
SELECT 'Tabelas criadas:' as status;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('cotacoes', 'produtos', 'transportadoras');

SELECT 'Usuário Lucas:' as status;
SELECT id, email, created_at FROM auth.users WHERE email = 'lucasfriske@agrofarm.net.br';

SELECT 'Políticas RLS:' as status;
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
