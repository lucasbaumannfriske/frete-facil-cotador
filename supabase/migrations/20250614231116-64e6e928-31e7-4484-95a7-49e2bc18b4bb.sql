
-- Limpa todas as cotações e informações relacionadas
DELETE FROM transportadoras;
DELETE FROM produtos;
DELETE FROM cotacoes;
DELETE FROM transportadoras_cadastros;

-- Observação: Não remove usuários das tabelas auth.users ou system_users
