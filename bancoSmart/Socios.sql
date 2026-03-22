CREATE DATABASE IF NOT EXISTS clube_socios;
USE clube_socios;

CREATE TABLE socios_login (
  id_socio INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  email_login VARCHAR(255) UNIQUE NOT NULL, 
);

CREATE TABLE reservas_socios (
  id_reserva_socio INT AUTO_INCREMENT PRIMARY KEY,
  id_socio INT NOT NULL,
  -- CHAVE ESTRANGEIRA PARA O OUTRO BANCO
  id_espaco INT NOT NULL, 
  data_uso DATE NOT NULL,
  valor_com_desconto DECIMAL(10,2),
  FOREIGN KEY (id_socio) REFERENCES socios_login(id_socio),
  FOREIGN KEY (id_espaco) REFERENCES gestao_espacos.espacos(id_espaco)
);
