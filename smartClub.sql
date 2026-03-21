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