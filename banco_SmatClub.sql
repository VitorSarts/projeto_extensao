CREATE DATABASE IF NOT EXISTS clube_reservas;
USE clube_reservas;


CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('socio', 'nao_socio') NOT NULL,
  status_conta BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS socios (
  id_socio INT PRIMARY KEY,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  numero_carteirinha VARCHAR(50) UNIQUE NOT NULL,
  data_adesao DATE NOT NULL,
  valor_mensalidade DECIMAL(10,2) DEFAULT 0.00,
  status_anuidade ENUM('em_dia', 'inadimplente') DEFAULT 'em_dia',
  FOREIGN KEY (id_socio) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS nao_socios (
  id_nao_socio INT PRIMARY KEY,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  origem_cadastro VARCHAR(100), -- Ex: Indicação, Evento, Site
  FOREIGN KEY (id_nao_socio) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS espacos (
  id_espaco INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  capacidade_maxima INT,
  preco_base DECIMAL(10,2) NOT NULL DEFAULT 0,
  status_ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS reservas (
  id_reserva INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_espaco INT NOT NULL,
  data_reserva DATE NOT NULL,
  status_pagamento ENUM('pendente', 'pago', 'parcial', 'cancelado') NOT NULL DEFAULT 'pendente',
  valor_total_reserva DECIMAL(10,2) NOT NULL DEFAULT 0,
  valor_pago_acumulado DECIMAL(10,2) NOT NULL DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  -- CORREÇÃO AQUI: De PROTECT para RESTRICT
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
  FOREIGN KEY (id_espaco) REFERENCES espacos(id_espaco) ON DELETE RESTRICT,
  UNIQUE KEY unique_espaco_data (id_espaco, data_reserva)
);

CREATE TABLE IF NOT EXISTS pagamentos (
  id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
  id_reserva INT NOT NULL,
  metodo ENUM('pix', 'cartao', 'dinheiro', 'transferencia') NOT NULL,
  data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  valor_transacao DECIMAL(10,2) NOT NULL,
  comprovante_ref VARCHAR(255), -- Link ou ID da transação no gateway
  FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva) ON DELETE CASCADE
);

---

CREATE INDEX idx_socios_cpf ON socios (cpf);
CREATE INDEX idx_nao_socios_cpf ON nao_socios (cpf);
CREATE INDEX idx_reservas_periodo ON reservas (data_reserva);

---

DELIMITER //

CREATE TRIGGER trg_atualiza_status_reserva
AFTER INSERT ON pagamentos
FOR EACH ROW
BEGIN
  UPDATE reservas
  SET 
    valor_pago_acumulado = valor_pago_acumulado + NEW.valor_transacao,
    status_pagamento = CASE 
      WHEN (valor_pago_acumulado + NEW.valor_transacao) >= valor_total_reserva THEN 'pago'
      WHEN (valor_pago_acumulado + NEW.valor_transacao) > 0 THEN 'parcial'
      ELSE 'pendente'
    END
  WHERE id_reserva = NEW.id_reserva;
END//

DELIMITER ;