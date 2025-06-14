
-- Limpa todas as informações de cotações, produtos, transportadoras, cadastros e audit_logs
DELETE FROM audit_logs;
DELETE FROM transportadoras;
DELETE FROM produtos;
DELETE FROM cotacoes;
DELETE FROM transportadoras_cadastros;

-- Observação: Não remove usuários das tabelas auth.users ou system_users
