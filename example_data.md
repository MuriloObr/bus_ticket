Inserção de Dados de Exemplo
Empresas
INSERT INTO Empresa (nome, cnpj, telefone, email)
VALUES
('Auto Viação Catarinense', '12.345.678/0001-10', '(48) 3271-8000', 'contato@catarinense.com.br'),
('Reunidas Transportes', '98.765.432/0001-20', '(49) 3551-1200', 'atendimento@reunidas.com.br'),
('Expresso Nordeste', '45.987.654/0001-30', '(47) 3021-5500', 'contato@expressonordeste.com.br');
Ônibus
INSERT INTO Onibus (placa, modelo, capacidade, id_empresa)
VALUES
('QWE1A23', 'Marcopolo Paradiso G8 1800 DD', 46, 1),
('RTY4B56', 'Comil Invictus DD', 44, 2),
('UIO7C89', 'Marcopolo Viaggio 1050', 42, 3);
Cidades
INSERT INTO Cidade (nome, estado)
VALUES
('Florianópolis', 'SC'),
('Blumenau', 'SC'),
('Joinville', 'SC'),
('Chapecó', 'SC'),
('Lages', 'SC'),
('Videira', 'SC');
Rotas
INSERT INTO Rota
(distancia_km, tempo_estimado, id_cidade_origem, id_cidade_destino)
VALUES
(150.50, '2h30min', 1, 2),
(130.20, '2h15min', 2, 3),
(550.80, '8h00min', 1, 4),
(280.40, '4h30min', 5, 6);
Passageiros
INSERT INTO Passageiro
(nome, cpf, email, telefone, data_nascimento)
VALUES
('João da Silva', '123.456.789-00', 'joao@email.com', '(49)99999-1111', '1995-03-10'),
('Maria Oliveira', '987.654.321-00', 'maria@email.com', '(49)99999-2222', '1998-07-22'),
('Carlos Souza', '741.852.963-10', 'carlos@email.com', '(49)99999-3333', '1992-11-15');
Viagens
INSERT INTO Viagem
(data_partida, data_chegada, valor_passagem, id_rota, id_onibus)
VALUES
('2026-08-01 08:00:00', '2026-08-01 10:30:00', 82.90, 1, 1),
('2026-08-02 13:00:00', '2026-08-02 15:15:00', 74.50, 2, 2),
('2026-08-03 22:00:00', '2026-08-04 06:00:00', 198.00, 3, 3),
('2026-08-05 09:00:00', '2026-08-05 13:30:00', 105.90, 4, 1);
Reservas
INSERT INTO Reserva
(data_reserva, numero_assento, status, id_passageiro, id_viagem)
VALUES
('2026-07-20 14:30:00', 12, 'Confirmada', 1, 1),
('2026-07-21 09:45:00', 18, 'Confirmada', 2, 2),
('2026-07-22 16:10:00', 5, 'Confirmada', 3, 3);
Pagamentos
INSERT INTO Pagamento
(data_pagamento, valor, metodo_pagamento, status, id_reserva)
VALUES
('2026-07-20 14:35:00', 82.90, 'PIX', 'Pago', 1),
('2026-07-21 09:50:00', 74.50, 'Cartão de Crédito', 'Pago', 2),
('2026-07-22 16:15:00', 198.00, 'Cartão de Débito', 'Pago', 3);
Passagens
INSERT INTO Passagem
(codigo_embarque, data_emissao, id_reserva)
VALUES
('BUS20260001', '2026-07-20 14:36:00', 1),
('BUS20260002', '2026-07-21 09:51:00', 2),
('BUS20260003', '2026-07-22 16:16:00', 3);
