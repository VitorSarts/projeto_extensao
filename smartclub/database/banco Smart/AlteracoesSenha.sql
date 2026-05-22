ALTER TABLE clube_socios.socios_login
ADD COLUMN senha_hash VARCHAR(255) NULL AFTER email_login;

ALTER TABLE visitantes_eventos.cadastro_completo_nao_socios
ADD COLUMN senha_hash VARCHAR(255) NULL AFTER email;

SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'clube_socios'
  AND TABLE_NAME   = 'socios_login'
  AND COLUMN_NAME  = 'senha_hash';

SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'visitantes_eventos'
  AND TABLE_NAME   = 'cadastro_completo_nao_socios'
  AND COLUMN_NAME  = 'senha_hash';