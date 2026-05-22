CREATE DATABASE IF NOT EXISTS visitantes_eventos;
USE visitantes_eventos;

CREATE TABLE cadastro_completo_nao_socios (
  id_nao_socio INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  endereco_completo TEXT,
  origem_cadastro VARCHAR(100), -- Ex: Anúncio Instagram
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservas_nao_socios (
  id_reserva_nao_socio INT AUTO_INCREMENT PRIMARY KEY,
  id_nao_socio INT NOT NULL,
  -- CHAVE ESTRANGEIRA PARA O OUTRO BANCO
  id_espaco INT NOT NULL,
  data_uso DATE NOT NULL,
  valor_cheio DECIMAL(10,2),
  status_pagamento ENUM('pendente', 'pago') DEFAULT 'pendente',
  FOREIGN KEY (id_nao_socio) REFERENCES cadastro_completo_nao_socios(id_nao_socio),
  FOREIGN KEY (id_espaco) REFERENCES gestao_espacos.espacos(id_espaco)
);