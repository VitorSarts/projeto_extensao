CREATE DATABASE IF NOT EXISTS clube_socios;
USE clube_socios;

CREATE TABLE socios_login (
  id_socio INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  email_login VARCHAR(255) UNIQUE NOT NULL
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

USE clube_socios;

ALTER TABLE socios_login 
ADD COLUMN numero_carteirinha VARCHAR(20) UNIQUE AFTER id_socio;




USE clube_socios;

-- Apaga a tabela antiga se ela existir
DROP TABLE IF EXISTS reservas_socios;
DROP TABLE IF EXISTS socios_login;

-- Cria a tabela correta
CREATE TABLE socios_login (
  id_socio INT AUTO_INCREMENT PRIMARY KEY,
  numero_carteirinha VARCHAR(20) NOT NULL,
  nome_completo VARCHAR(255) NOT NULL,
  email_login VARCHAR(255) UNIQUE NOT NULL
);

-- Recria a tabela de reservas para manter o banco íntegro
CREATE TABLE reservas_socios (
  id_reserva_socio INT AUTO_INCREMENT PRIMARY KEY,
  id_socio INT NOT NULL,
  id_espaco INT NOT NULL, 
  data_uso DATE NOT NULL,
  valor_com_desconto DECIMAL(10,2),
  FOREIGN KEY (id_socio) REFERENCES socios_login(id_socio),
  FOREIGN KEY (id_espaco) REFERENCES gestao_espacos.espacos(id_espaco)
);

INSERT INTO socios_login (numero_carteirinha, nome_completo, email_login) VALUES
('S1IV', 'Abiqueila Coutinho Carvalho 01 ok', 'abiccantunes@gmail.com'),
('S2IV', 'Adilson Sperandio 02', 'adilson_sperandio@hotmail.com'),
('S3IV', 'Adriana Rodrigues do Nascimento 04 OK', 'adriana1772@gmail.com'),
('S4IV', 'Adriano Gomide 05', 'adriano.chu@yahoo.com.br'),
('S5IV', 'Adrielly Cristina dos Santos 06 OK', 'adriellysantos45@outlook.com.br'),
('S6IV', 'ALESSANDRA DE OLIVEIRA SOARES 07 O', 'contatoassessoriawa@gmail.com'),
('S7IV', 'Alex Antunes 08', 'erika.furlaneto.antunes@gmail.com'),
('S1133VI', 'Aline Gabrielli Pereira Cândido 11', 'gabriellialine059@gmail.com'),
('S10IV', 'Aline Ribeiro dos Santos 12 OK', 'alineguik@gmail.com'),
('S1133VI', 'Aline Rodrigues Nicolau 13 OK', 'aline.nicolau@atento.com.br'),
('S14IV', 'Andrea Regina Lima Nascimento 16 OK', 'delanascimento2006@gmail.com'),
('xtrsyduy', 'Angela dos Santos 17-A ok', 'angelavslc.santos@gmail.com'),
('S19IV', 'Antônia Mardônia Pereira Oliveira 19 OK', 'mardoniaanatonia4@gmail.com'),
('S23IV', 'Antonio Luiz de Medeiros 23', 'luizmedeiros.antonio@yahoo.com.br'),
('S24IV', 'Arlene Coutinho Carvalho 24 OK', 'nenacoutinho2307@gmail.com'),
('S25IV', 'Camila Cristina Antunes Rinaldi 25 OK', 'camilaefelix@gmail.com'),
('S26IV', 'Camila Lopes de Oliveira 26', 'camila.regis.lopes@gmail.com'),
('S28IV', 'Carla Mirella Bisan 27 ok', 'lelabisan@gmail.com'),
('S29IV', 'Carlos Eduardo Ferreira de Oliveira 28 OK', 'taniaferreira5716@gmail.com'),
('S32IV', 'Claudenice Pereira Batista 29', 'claude_nice60@hotmail.com'),
('S1234VI', 'Claudio Moreira de Azevedo Junior 31 O', 'claudiomoreira8632@yahoo.com'),
('S36IV', 'Cristiane Assis de Jesus 32', 'cristianeaj1980@gmail.com'),
('S37IV', 'CRISTIANO FRANCISCO ALVES 33 OK', 'CRISTIANOFRANCISCOALVES81@GMAIL.COM'),
('S39IV', 'Danielly Nunes da Silva 35', 'bolabololora12@gmail.com'),
('S40IV', 'Deisiane Martins de Oliveira 36 OK', 'deisiane.martins1983@gmail.com'),
('S41IV', 'Denivaldo Pereira de Lima 37 OK', 'lima76211@gmail.com'),
('S43IV', 'Eder Bezerra de Lima 38', 'ederpostiglione42@gmail.com'),
('S44IV', 'Edglê Cavalcante da Silva 40', 'cavalcanteedgle@yahoo.com.br');