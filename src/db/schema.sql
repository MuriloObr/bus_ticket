CREATE DATABASE IF NOT EXISTS bus_ticket;
USE bus_ticket;

CREATE TABLE IF NOT EXISTS Passageiro (
  id_passageiro INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  data_nascimento DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Empresa (
  id_empresa INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Onibus (
  id_onibus INT AUTO_INCREMENT PRIMARY KEY,
  placa VARCHAR(10) UNIQUE NOT NULL,
  modelo VARCHAR(100),
  capacidade INT NOT NULL,
  id_empresa INT NOT NULL,
  CONSTRAINT fk_onibus_empresa FOREIGN KEY (id_empresa) REFERENCES Empresa(id_empresa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Cidade (
  id_cidade INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  estado VARCHAR(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Rota (
  id_rota INT AUTO_INCREMENT PRIMARY KEY,
  distancia_km DECIMAL(8,2),
  tempo_estimado VARCHAR(30),
  id_cidade_origem INT NOT NULL,
  id_cidade_destino INT NOT NULL,
  CONSTRAINT fk_rota_origem FOREIGN KEY (id_cidade_origem) REFERENCES Cidade(id_cidade),
  CONSTRAINT fk_rota_destino FOREIGN KEY (id_cidade_destino) REFERENCES Cidade(id_cidade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Viagem (
  id_viagem INT AUTO_INCREMENT PRIMARY KEY,
  data_partida DATETIME NOT NULL,
  data_chegada DATETIME NOT NULL,
  valor_passagem DECIMAL(10,2) NOT NULL,
  id_rota INT NOT NULL,
  id_onibus INT NOT NULL,
  CONSTRAINT fk_viagem_rota FOREIGN KEY (id_rota) REFERENCES Rota(id_rota),
  CONSTRAINT fk_viagem_onibus FOREIGN KEY (id_onibus) REFERENCES Onibus(id_onibus)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Reserva (
  id_reserva INT AUTO_INCREMENT PRIMARY KEY,
  data_reserva DATETIME NOT NULL,
  numero_assento INT NOT NULL,
  status VARCHAR(20) NOT NULL,
  id_passageiro INT NOT NULL,
  id_viagem INT NOT NULL,
  CONSTRAINT fk_reserva_passageiro FOREIGN KEY (id_passageiro) REFERENCES Passageiro(id_passageiro),
  CONSTRAINT fk_reserva_viagem FOREIGN KEY (id_viagem) REFERENCES Viagem(id_viagem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Pagamento (
  id_pagamento INT AUTO_INCREMENT PRIMARY KEY,
  data_pagamento DATETIME NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  metodo_pagamento VARCHAR(50),
  status VARCHAR(20),
  id_reserva INT UNIQUE NOT NULL,
  CONSTRAINT fk_pagamento_reserva FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS Passagem (
  id_passagem INT AUTO_INCREMENT PRIMARY KEY,
  codigo_embarque VARCHAR(20) UNIQUE NOT NULL,
  data_emissao DATETIME NOT NULL,
  id_reserva INT UNIQUE NOT NULL,
  CONSTRAINT fk_passagem_reserva FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO Empresa (nome, cnpj, telefone, email)
VALUES
('Auto Viação Catarinense', '12.345.678/0001-10', '(48) 3271-8000', 'contato@catarinense.com.br'),
('Reunidas Transportes', '98.765.432/0001-20', '(49) 3551-1200', 'atendimento@reunidas.com.br'),
('Expresso Nordeste', '45.987.654/0001-30', '(47) 3021-5500', 'contato@expressonordeste.com.br');

INSERT INTO Onibus (placa, modelo, capacidade, id_empresa)
VALUES
('QWE1A23', 'Marcopolo Paradiso G8 1800 DD', 46, 1),
('RTY4B56', 'Comil Invictus DD', 44, 2),
('UIO7C89', 'Marcopolo Viaggio 1050', 42, 3);

INSERT INTO Cidade (nome, estado)
VALUES
('Florianópolis', 'SC'),
('Blumenau', 'SC'),
('Joinville', 'SC'),
('Chapecó', 'SC'),
('Lages', 'SC'),
('Videira', 'SC');

INSERT INTO Rota
(distancia_km, tempo_estimado, id_cidade_origem, id_cidade_destino)
VALUES
(150.50, '2h30min', 1, 2),
(130.20, '2h15min', 2, 3),
(550.80, '8h00min', 1, 4),
(280.40, '4h30min', 5, 6);

INSERT INTO Passageiro
(nome, cpf, email, telefone, data_nascimento)
VALUES
('João da Silva', '123.456.789-00', 'joao@email.com', '(49)99999-1111', '1995-03-10'),
('Maria Oliveira', '987.654.321-00', 'maria@email.com', '(49)99999-2222', '1998-07-22'),
('Carlos Souza', '741.852.963-10', 'carlos@email.com', '(49)99999-3333', '1992-11-15');

INSERT INTO Viagem
(data_partida, data_chegada, valor_passagem, id_rota, id_onibus)
VALUES
('2026-08-01 08:00:00', '2026-08-01 10:30:00', 82.90, 1, 1),
('2026-08-02 13:00:00', '2026-08-02 15:15:00', 74.50, 2, 2),
('2026-08-03 22:00:00', '2026-08-04 06:00:00', 198.00, 3, 3),
('2026-08-05 09:00:00', '2026-08-05 13:30:00', 105.90, 4, 1);

INSERT INTO Reserva
(data_reserva, numero_assento, status, id_passageiro, id_viagem)
VALUES
('2026-07-20 14:30:00', 12, 'Confirmada', 1, 1),
('2026-07-21 09:45:00', 18, 'Confirmada', 2, 2),
('2026-07-22 16:10:00', 5, 'Confirmada', 3, 3);

INSERT INTO Pagamento
(data_pagamento, valor, metodo_pagamento, status, id_reserva)
VALUES
('2026-07-20 14:35:00', 82.90, 'PIX', 'Pago', 1),
('2026-07-21 09:50:00', 74.50, 'Cartão de Crédito', 'Pago', 2),
('2026-07-22 16:15:00', 198.00, 'Cartão de Débito', 'Pago', 3);

INSERT INTO Passagem
(codigo_embarque, data_emissao, id_reserva)
VALUES
('BUS20260001', '2026-07-20 14:36:00', 1),
('BUS20260002', '2026-07-21 09:51:00', 2),
('BUS20260003', '2026-07-22 16:16:00', 3);
