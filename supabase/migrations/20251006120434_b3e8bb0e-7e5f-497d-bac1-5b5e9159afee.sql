-- Add quantidade and valor_cte columns to ctes table
ALTER TABLE ctes
ADD COLUMN quantidade DECIMAL(10,2),
ADD COLUMN valor_cte DECIMAL(10,2);