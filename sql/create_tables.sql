
-- Criar tabela de cotações
CREATE TABLE IF NOT EXISTS cotacoes (
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
CREATE TABLE IF NOT EXISTS produtos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 1,
    peso TEXT,
    cotacao_id UUID REFERENCES cotacoes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de transportadoras
CREATE TABLE IF NOT EXISTS transportadoras (
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
