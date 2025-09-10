-- Criar tabela para armazenar CTEs das cotações
CREATE TABLE public.ctes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cotacao_id UUID NOT NULL,
  transportadora_id UUID NOT NULL,
  user_id UUID NOT NULL,
  numero_cte TEXT NOT NULL,
  arquivo_url TEXT,
  arquivo_nome TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ctes ENABLE ROW LEVEL SECURITY;

-- Create policies for CTEs
CREATE POLICY "Users can view their own CTEs" 
ON public.ctes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CTEs" 
ON public.ctes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CTEs" 
ON public.ctes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CTEs" 
ON public.ctes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ctes_updated_at
BEFORE UPDATE ON public.ctes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for CTE files
INSERT INTO storage.buckets (id, name, public) VALUES ('cte-files', 'cte-files', false);

-- Create storage policies for CTE files
CREATE POLICY "Users can view their own CTE files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cte-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own CTE files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'cte-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own CTE files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'cte-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own CTE files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'cte-files' AND auth.uid()::text = (storage.foldername(name))[1]);