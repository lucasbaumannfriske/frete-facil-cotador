
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
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de produtos
CREATE TABLE produtos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 1,
    peso TEXT,
    cotacao_id UUID REFERENCES cotacoes(id) ON DELETE CASCADE,
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
    cotacao_id UUID REFERENCES cotacoes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Inserir o usuário Lucas se não existir (apenas para desenvolvimento)
-- IMPORTANTE: Em produção, crie o usuário através da interface do Supabase
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
) VALUES (
    gen_random_uuid(),
    'lucasfriske@agrofarm.net.br',
    crypt('Nexus@4202', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Lucas Baumann Friske"}'
) ON CONFLICT (email) DO NOTHING;
