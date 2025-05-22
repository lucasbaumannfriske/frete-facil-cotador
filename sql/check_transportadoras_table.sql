
-- Check if the transportadoras table exists and has the proper columns
SELECT 
  column_name, 
  data_type 
FROM 
  information_schema.columns 
WHERE 
  table_name = 'transportadoras';

-- If the transportadoras table doesn't have a status column, you'll need to add it:
-- ALTER TABLE transportadoras ADD COLUMN status VARCHAR(20) DEFAULT 'pendente';

-- If you're adapting from the CotacaoSalva structure in the frontend, ensure these columns exist:
-- id, nome, prazo, valor_unitario, valor_total, status, proposta_final, cotacao_id, user_id
