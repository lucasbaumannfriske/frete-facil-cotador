
-- Adicionar campo quantidade_entregue na tabela transportadoras
ALTER TABLE transportadoras 
ADD COLUMN quantidade_entregue TEXT;

-- Adicionar campo cnpj na tabela transportadoras_cadastros
ALTER TABLE transportadoras_cadastros 
ADD COLUMN cnpj TEXT;
