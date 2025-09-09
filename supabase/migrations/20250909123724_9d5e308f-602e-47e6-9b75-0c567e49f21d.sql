-- Criar tabela para safras
CREATE TABLE public.safras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NULL
);

-- Criar tabela para grupos
CREATE TABLE public.grupos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL DEFAULT NULL
);

-- Habilitar RLS para safras
ALTER TABLE public.safras ENABLE ROW LEVEL SECURITY;

-- Políticas para safras
CREATE POLICY "Usuários podem ver suas próprias safras"
  ON public.safras FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias safras"
  ON public.safras FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias safras"
  ON public.safras FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias safras"
  ON public.safras FOR DELETE
  USING (auth.uid() = user_id);

-- Habilitar RLS para grupos
ALTER TABLE public.grupos ENABLE ROW LEVEL SECURITY;

-- Políticas para grupos
CREATE POLICY "Usuários podem ver seus próprios grupos"
  ON public.grupos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios grupos"
  ON public.grupos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios grupos"
  ON public.grupos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios grupos"
  ON public.grupos FOR DELETE
  USING (auth.uid() = user_id);

-- Adicionar campos safra_id e grupo_id na tabela produtos
ALTER TABLE public.produtos 
ADD COLUMN safra_id UUID REFERENCES public.safras(id),
ADD COLUMN grupo_id UUID REFERENCES public.grupos(id);

-- Função para atualizar o updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER handle_safras_updated_at
  BEFORE UPDATE ON public.safras
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_grupos_updated_at
  BEFORE UPDATE ON public.grupos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();