
-- Remove a policy antiga de SELECT (caso exista)
DROP POLICY IF EXISTS "Usuário vê suas transportadoras" ON public.transportadoras_cadastros;

-- Cria nova policy de SELECT liberando a consulta a todas as transportadoras
CREATE POLICY "Todos podem ver todas as transportadoras" 
  ON public.transportadoras_cadastros
  FOR SELECT
  USING (true);

-- As policies de INSERT, UPDATE e DELETE continuam protegendo por user_id
