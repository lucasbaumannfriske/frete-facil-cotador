
-- Criação da tabela para cadastro das transportadoras
CREATE TABLE public.transportadoras_cadastros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users,
  nome TEXT NOT NULL,
  email1 TEXT,
  email2 TEXT,
  telefone1 TEXT,
  telefone2 TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Ativar RLS
ALTER TABLE public.transportadoras_cadastros ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir apenas ao usuário acessar suas próprias transportadoras
CREATE POLICY "Usuário vê suas transportadoras" ON public.transportadoras_cadastros
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuário insere suas transportadoras" ON public.transportadoras_cadastros
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário atualiza suas transportadoras" ON public.transportadoras_cadastros
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuário deleta (soft delete) suas transportadoras" ON public.transportadoras_cadastros
  FOR UPDATE USING (auth.uid() = user_id);

-- Índices para melhor performance
CREATE INDEX idx_transportadoras_cadastros_user_id ON public.transportadoras_cadastros(user_id);
CREATE INDEX idx_transportadoras_cadastros_nome ON public.transportadoras_cadastros(nome);
CREATE INDEX idx_transportadoras_cadastros_deleted_at ON public.transportadoras_cadastros(deleted_at);
