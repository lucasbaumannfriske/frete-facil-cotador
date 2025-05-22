
-- Drop the existing view if it exists
DROP VIEW IF EXISTS relatorio_cotacoes;

-- Create the view with correct column references
CREATE OR REPLACE VIEW relatorio_cotacoes AS
SELECT 
  c.id,
  c.cliente,
  c.fazenda,
  c.data,
  t.status,
  t.valor_total,
  t.proposta_final,
  c.user_id
FROM 
  cotacoes c
JOIN 
  transportadoras t ON t.cotacao_id = c.id;

-- Note: You can't enable RLS directly on views, 
-- you need to enable it on the underlying tables
