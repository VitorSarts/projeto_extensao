CREATE DATABASE IF NOT EXISTS gestao_espacos;
USE gestao_espacos;

CREATE TABLE espacos (
  id_espaco INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  capacidade_maxima INT,
  preco_base DECIMAL(10,2) NOT NULL,
  descricao TEXT,
  status_ativo BOOLEAN DEFAULT TRUE
);


CREATE TABLE agenda_global (
  id_agenda INT AUTO_INCREMENT PRIMARY KEY,
  id_espaco INT NOT NULL,
  data_reservada DATE NOT NULL,
  origem_reserva ENUM('socio', 'nao_socio') NOT NULL,
  FOREIGN KEY (id_espaco) REFERENCES espacos(id_espaco),
  UNIQUE KEY unique_local_data (id_espaco, data_reservada)
);

CREATE TABLE IF NOT EXISTS fluxo_pagamentos (
  id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
  origem_cliente ENUM('socio', 'nao_socio') NOT NULL,
  id_referencia_reserva INT NOT NULL, 
  valor_pago DECIMAL(10,2) NOT NULL,
  metodo_pagamento ENUM('pix', 'cartao', 'dinheiro') NOT NULL,
  data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS tabela_precos (
  id_preco INT AUTO_INCREMENT PRIMARY KEY,
  id_espaco INT NOT NULL,
  tipo_cliente ENUM('socio', 'nao_socio') NOT NULL,
  valor_cobrado DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_espaco) REFERENCES espacos(id_espaco) ON DELETE CASCADE,
  UNIQUE KEY unique_preco_categoria (id_espaco, tipo_cliente)
);

USE gestao_espacos;

CREATE OR REPLACE VIEW painel_administrativo_master AS

SELECT 
    s.nome_completo AS cliente,
    'Sócio' AS tipo_vinculo,
    e.nome AS local_reservado,
    rs.data_uso AS data_evento,
    rs.valor_com_desconto AS valor_total,
    COALESCE(p.valor_pago, 0) AS total_pago,
    CASE 
        WHEN p.valor_pago >= rs.valor_com_desconto THEN 'Confirmado'
        ELSE 'Pendente/Parcial'
    END AS status_financeiro
FROM clube_socios.reservas_socios rs
JOIN clube_socios.socios_login s ON rs.id_socio = s.id_socio
JOIN gestao_espacos.espacos e ON rs.id_espaco = e.id_espaco
LEFT JOIN gestao_espacos.fluxo_pagamentos p 
    ON rs.id_reserva_socio = p.id_referencia_reserva AND p.origem_cliente = 'socio'

UNION ALL


SELECT 
    ns.nome_completo AS cliente,
    'Não Sócio' AS tipo_vinculo,
    e.nome AS local_reservado,
    rns.data_uso AS data_evento,
    rns.valor_cheio AS valor_total,
    COALESCE(p.valor_pago, 0) AS total_pago,
    CASE 
        WHEN p.valor_pago >= rns.valor_cheio THEN 'Confirmado'
        ELSE 'Pendente/Parcial'
    END AS status_financeiro
FROM visitantes_eventos.reservas_nao_socios rns
JOIN visitantes_eventos.cadastro_completo_nao_socios ns ON rns.id_nao_socio = ns.id_nao_socio
JOIN gestao_espacos.espacos e ON rns.id_espaco = e.id_espaco
LEFT JOIN gestao_espacos.fluxo_pagamentos p 
    ON rns.id_reserva_nao_socio = p.id_referencia_reserva AND p.origem_cliente = 'nao_socio';
    
    
    
    
    
    INSERT INTO espacos (nome, capacidade_maxima, preco_base) VALUES
('Quiosque 1', 15, 70.00),
('Quiosque 2', 15, 0.00), ('Quiosque 3', 15, 0.00), ('Quiosque 4', 15, 0.00),
('Quiosque 5', 15, 0.00), ('Quiosque 6', 15, 0.00), ('Quiosque 7', 15, 0.00),
('Quiosque 8', 15, 0.00), ('Quiosque 9', 15, 0.00), ('Quiosque 10', 15, 0.00),
('Quiosque 11', 15, 0.00), ('Quiosque 12', 15, 0.00), ('Quiosque 13', 15, 0.00),
('Quiosque 14', 15, 0.00), ('Quiosque 15', 15, 0.00), ('Quiosque 16', 15, 0.00),
('Quiosque 17', 15, 0.00), ('Quiosque 18', 15, 0.00), ('Quiosque 19', 15, 0.00),
('Casarão', 50, 600.00),
('Mini salão', 30, 200.00),
('Salão Social Dia', 100, 1200.00),
('Salão Social Noite', 100, 1400.00);


iNSERT INTO tabela_precos (id_espaco, tipo_cliente, valor_cobrado) 
SELECT id_espaco, 'socio', 70.00 FROM espacos WHERE nome = 'Quiosque 1' UNION ALL
SELECT id_espaco, 'socio', 0.00 FROM espacos WHERE nome LIKE 'Quiosque %' AND nome != 'Quiosque 1' UNION ALL
SELECT id_espaco, 'socio', 600.00 FROM espacos WHERE nome = 'Casarão' UNION ALL
SELECT id_espaco, 'socio', 200.00 FROM espacos WHERE nome = 'Mini salão' UNION ALL
SELECT id_espaco, 'socio', 1200.00 FROM espacos WHERE nome = 'Salão Social Dia' UNION ALL
SELECT id_espaco, 'socio', 1400.00 FROM espacos WHERE nome = 'Salão Social Noite';



INSERT INTO tabela_precos (id_espaco, tipo_cliente, valor_cobrado) 
SELECT id_espaco, 'nao_socio', 800.00 FROM espacos WHERE nome = 'Casarão' UNION ALL
SELECT id_espaco, 'nao_socio', 400.00 FROM espacos WHERE nome = 'Mini salão' UNION ALL
SELECT id_espaco, 'nao_socio', 1750.00 FROM espacos WHERE nome = 'Salão Social Dia' UNION ALL
SELECT id_espaco, 'nao_socio', 2000.00 FROM espacos WHERE nome = 'Salão Social Noite';


SELECT valor_cobrado FROM tabela_precos 
WHERE id_espaco = (SELECT id_espaco FROM espacos WHERE nome = 'Casarão') 
AND tipo_cliente = 'nao_socio';



USE gestao_espacos;

SELECT * FROM painel_administrativo_master;

USE gestao_espacos;

SELECT cliente, local_reservado, data_evento, valor_total, total_pago 
FROM painel_administrativo_master
WHERE status_financeiro = 'Pendente/Parcial';

USE gestao_espacos;

SELECT * FROM painel_administrativo_master
WHERE cliente LIKE '%Aline%';


SELECT id_socio, nome_completo FROM clube_socios.socios_login 
WHERE nome_completo LIKE 'Abiqueila%';

SELECT id_espaco, nome FROM gestao_espacos.espacos 
WHERE nome = 'Casarão';