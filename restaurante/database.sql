-- ============================================================
-- Sabor & Mesa — Trattoria Moderna — banco de dados
-- Importe este arquivo inteiro num MySQL/MariaDB:
--   mysql -u root -p < database.sql
-- Atenção: isso apaga e recria o banco do zero (dados de exemplo inclusos).
-- ============================================================
DROP DATABASE IF EXISTS sabor_e_mesa;

SET NAMES utf8mb4;


CREATE DATABASE sabor_e_mesa
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;


USE sabor_e_mesa;

-- ---------- Cardápio ----------
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  categoria ENUM('entradas','principais','bebidas','sobremesas') NOT NULL,
  preco DECIMAL(8,2) NOT NULL,
  descricao TEXT DEFAULT NULL,
  ingredientes VARCHAR(255) DEFAULT NULL,   -- lista separada por vírgula, ex: "Cebola,Alho,Queijo" (alimenta "Remover ingredientes" no modal do produto)
  imagem VARCHAR(255) DEFAULT NULL,
  tag VARCHAR(60) DEFAULT NULL,             -- selo pequeno, ex: "Vegano", "Picante", "Sem glúten"
  destaque TINYINT(1) NOT NULL DEFAULT 0,
  disponivel TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE extras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chave VARCHAR(30) NOT NULL UNIQUE,
  nome VARCHAR(100) NOT NULL,
  preco DECIMAL(8,2) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Quais extras cada produto pode receber (ex: uma taça de vinho não deve oferecer "bacon extra").
-- Se um produto não tiver nenhuma linha aqui, ele simplesmente não mostra a seção
-- "Adicionar extras" no modal de personalização do cliente.
CREATE TABLE produto_extras (
  produto_id INT NOT NULL,
  extra_id INT NOT NULL,
  PRIMARY KEY (produto_id, extra_id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
  FOREIGN KEY (extra_id) REFERENCES extras(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- Mesas ----------
CREATE TABLE mesas (
  numero INT PRIMARY KEY,
  status ENUM('livre','reservado','ocupado') NOT NULL DEFAULT 'livre'
) ENGINE=InnoDB;

-- ---------- Chamados de garçom ----------
CREATE TABLE chamados_garcom (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mesa_numero INT NOT NULL,
  status ENUM('pendente','atendido') NOT NULL DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atendido_em TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (mesa_numero) REFERENCES mesas(numero)
) ENGINE=InnoDB;

-- ---------- Pedidos ----------
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mesa_numero INT NOT NULL,
  cliente_nome VARCHAR(150) DEFAULT NULL,
  forma_pagamento VARCHAR(30) NOT NULL,      -- 'pix' | 'garcom' | 'balcao'
  status ENUM('preparando','pronto','entregue') NOT NULL DEFAULT 'preparando',
  subtotal DECIMAL(8,2) NOT NULL,
  taxa_servico DECIMAL(8,2) NOT NULL DEFAULT 0,
  total DECIMAL(8,2) NOT NULL DEFAULT 0,
  dividir_pessoas INT NOT NULL DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mesa_numero) REFERENCES mesas(numero)
) ENGINE=InnoDB;

CREATE TABLE pedido_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  preco_unitario DECIMAL(8,2) NOT NULL,
  ingredientes_removidos VARCHAR(255) DEFAULT NULL,
  observacoes VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
) ENGINE=InnoDB;

CREATE TABLE pedido_item_extras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_item_id INT NOT NULL,
  extra_id INT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  FOREIGN KEY (pedido_item_id) REFERENCES pedido_itens(id) ON DELETE CASCADE,
  FOREIGN KEY (extra_id) REFERENCES extras(id)
) ENGINE=InnoDB;

-- ---------- Relatórios ----------
CREATE TABLE relatorios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mesa_numero INT DEFAULT NULL,
  pedido_id INT DEFAULT NULL,
  avaliacao TINYINT NOT NULL,
  data_relatorio DATE NOT NULL,
  total DECIMAL(8,2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------- Painel admin ----------
CREATE TABLE funcionarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE configuracoes (
  id INT PRIMARY KEY DEFAULT 1,
  nome_restaurante VARCHAR(150) NOT NULL,
  subtitulo VARCHAR(150) DEFAULT NULL,        -- ex: "Trattoria Moderna"
  email_contato VARCHAR(150) NOT NULL,
  horario_funcionamento VARCHAR(255) NOT NULL,
  taxa_servico_percentual DECIMAL(5,2) NOT NULL DEFAULT 10.00
) ENGINE=InnoDB;

-- ============================================================
-- Dados de exemplo
-- ============================================================

INSERT INTO produtos (id, nome, categoria, preco, descricao, ingredientes, tag, destaque, disponivel) VALUES
(1, 'Bruschetta Tradicional', 'entradas', 29.90, 'Pão italiano tostado, tomates frescos, manjericão e azeite extravirgem.', 'Pão,Tomate,Manjericão,Alho,Azeite', 'Vegano', 0, 1),
(2, 'Arancini Siciliani', 'entradas', 32.00, 'Bolinhos de risoto crocantes recheados com ragu de carne e mozzarella, servidos com molho da casa.', 'Arroz,Carne,Mozarela,Molho de tomate', NULL, 0, 1),
(3, 'Pão de Alho Artesanal', 'entradas', 18.00, 'Pão italiano amanteigado, assado no forno com alho fresco e ervas finas.', 'Pão,Alho,Manteiga,Ervas', 'Vegetariano', 0, 1),
(4, 'Carpaccio di Manzo', 'entradas', 36.00, 'Finíssimas fatias de filé mignon com rúcula, lascas de parmesão e molho de mostarda.', 'Carne,Rúcula,Parmesão,Mostarda', NULL, 0, 1),
(5, 'Spaghetti al Pomodoro', 'principais', 48.00, 'Massa fresca artesanal, tomates italianos e manjericão fresco.', 'Massa,Tomate,Manjericão,Alho,Azeite', 'Vegano', 1, 1),
(6, 'Lasagna alla Bolognese', 'principais', 52.00, 'Massa fresca artesanal com molho de tomates italianos orgânicos e camadas de ragu bolonhesa e queijo.', 'Massa,Carne moída,Molho de tomate,Queijo,Molho branco', NULL, 0, 1),
(7, 'Spaghetti alla Carbonara', 'principais', 54.90, 'Massa al dente envolvida em molho cremoso e aveludado, preparado no ponto perfeito com guanciale e pecorino.', 'Massa,Ovo,Bacon,Queijo,Pimenta preta', NULL, 0, 1),
(8, 'Pizza Margherita', 'principais', 46.00, 'Molho de tomate artesanal, mozzarella fresca de búfala e folhas de manjericão.', 'Massa,Molho de tomate,Mozarela de búfala,Manjericão', 'Vegetariano', 1, 1),
(9, 'Risotto ai Funghi', 'principais', 58.00, 'Risoto cremoso com mix de cogumelos frescos, finalizado com parmesão e trufa.', 'Arroz,Cogumelos,Parmesão,Manteiga,Cebola', 'Vegetariano', 0, 1),
(10, 'Vinho Tinto da Casa (taça)', 'bebidas', 22.00, 'Seleção especial da casa, corpo médio e notas frutadas. Servido em taça de 150ml.', NULL, NULL, 0, 1),
(11, 'Água com Gás', 'bebidas', 7.00, 'Água mineral com gás, 500ml, gelada.', NULL, NULL, 0, 1),
(12, 'Limonata Siciliana', 'bebidas', 14.00, 'Limonada artesanal com raspas de limão siciliano e hortelã fresca.', 'Limão,Hortelã,Açúcar', 'Vegano', 0, 1),
(13, 'Refrigerante Lata', 'bebidas', 7.50, 'Lata gelada de 350ml, sabores variados.', NULL, NULL, 0, 1),
(14, 'Tiramisù della Casa', 'sobremesas', 24.00, 'Camadas de biscoito champagne embebido em café, creme de mascarpone e cacau em pó.', 'Biscoito,Café,Mascarpone,Cacau,Ovo', NULL, 1, 1),
(15, 'Panna Cotta', 'sobremesas', 19.00, 'Creme italiano de baunilha com calda de frutas vermelhas.', 'Creme de leite,Baunilha,Frutas vermelhas', 'Sem glúten', 0, 1),
(16, 'Cannoli Siciliani', 'sobremesas', 22.00, 'Massa crocante recheada com ricota doce, gotas de chocolate e pistache.', 'Massa,Ricota,Chocolate,Pistache', NULL, 0, 1),
(17, 'Gelato Artesanal (2 bolas)', 'sobremesas', 18.00, 'Gelato cremoso feito na casa, sabores do dia — pergunte ao garçom.', NULL, 'Vegetariano', 0, 1);

-- Imagens dos pratos (ilustrações em img/produtos/). O caminho é relativo à raiz do projeto;
-- pelo admin dá pra trocar por uma foto enviada ou por uma URL externa.
UPDATE produtos SET imagem = 'img/produtos/bruschetta-tradicional.svg' WHERE id = 1;
UPDATE produtos SET imagem = 'img/produtos/arancini-siciliani.svg' WHERE id = 2;
UPDATE produtos SET imagem = 'img/produtos/pao-de-alho-artesanal.svg' WHERE id = 3;
UPDATE produtos SET imagem = 'img/produtos/carpaccio-di-manzo.svg' WHERE id = 4;
UPDATE produtos SET imagem = 'img/produtos/spaghetti-al-pomodoro.svg' WHERE id = 5;
UPDATE produtos SET imagem = 'img/produtos/lasagna-alla-bolognese.svg' WHERE id = 6;
UPDATE produtos SET imagem = 'img/produtos/spaghetti-alla-carbonara.svg' WHERE id = 7;
UPDATE produtos SET imagem = 'img/produtos/pizza-margherita.svg' WHERE id = 8;
UPDATE produtos SET imagem = 'img/produtos/risotto-ai-funghi.svg' WHERE id = 9;
UPDATE produtos SET imagem = 'img/produtos/vinho-tinto-da-casa.svg' WHERE id = 10;
UPDATE produtos SET imagem = 'img/produtos/agua-com-gas.svg' WHERE id = 11;
UPDATE produtos SET imagem = 'img/produtos/limonata-siciliana.svg' WHERE id = 12;
UPDATE produtos SET imagem = 'img/produtos/refrigerante-lata.svg' WHERE id = 13;
UPDATE produtos SET imagem = 'img/produtos/tiramisu-della-casa.svg' WHERE id = 14;
UPDATE produtos SET imagem = 'img/produtos/panna-cotta.svg' WHERE id = 15;
UPDATE produtos SET imagem = 'img/produtos/cannoli-siciliani.svg' WHERE id = 16;
UPDATE produtos SET imagem = 'img/produtos/gelato-artesanal.svg' WHERE id = 17;

INSERT INTO extras (id, chave, nome, preco) VALUES
(1, 'queijo', 'Queijo extra', 5.00),
(2, 'bacon', 'Bacon extra', 4.00),
(3, 'molho', 'Molho especial', 3.00),
(4, 'parmesao', 'Parmesão ralado', 4.50);

-- Associação produto → extras permitidos (ex: bebidas e sobremesas não oferecem "bacon extra")
INSERT INTO produto_extras (produto_id, extra_id) VALUES
(1, 1),                         -- Bruschetta: queijo
(2, 1), (2, 3),                 -- Arancini: queijo, molho
(3, 1),                         -- Pão de Alho: queijo
(4, 4),                         -- Carpaccio: parmesão
(5, 1), (5, 3), (5, 4),         -- Spaghetti al Pomodoro: queijo, molho, parmesão
(6, 1), (6, 4),                 -- Lasagna: queijo, parmesão
(7, 1), (7, 2), (7, 4),         -- Carbonara: queijo, bacon, parmesão
(8, 1), (8, 2), (8, 3), (8, 4), -- Pizza Margherita: queijo, bacon, molho, parmesão
(9, 1), (9, 4);                 -- Risotto: queijo, parmesão
-- Bebidas (10-13) e sobremesas (14-17) não têm extras associados de propósito.

INSERT INTO mesas (numero, status) VALUES
(1,'ocupado'), (2,'livre'), (3,'reservado'), (4,'ocupado'),
(5,'livre'), (6,'livre'), (7,'reservado'), (8,'ocupado'),
(9,'livre'), (10,'livre'), (11,'reservado'), (12,'livre');

INSERT INTO pedidos (id, mesa_numero, cliente_nome, forma_pagamento, status, subtotal, taxa_servico, total, dividir_pessoas, criado_em) VALUES
(1, 1, 'Bryan G Borges Lima', 'garcom', 'preparando', 108.00, 10.80, 118.80, 2, '2026-08-20 12:30:00'),
(2, 4, 'Marina Alves Costa', 'pix', 'pronto', 60.00, 6.00, 66.00, 1, '2026-08-20 12:45:00'),
(3, 8, 'João Pedro Santos', 'balcao', 'preparando', 61.00, 6.10, 67.10, 3, '2026-08-20 13:00:00'),
-- Histórico dos últimos dias, usado nos gráficos do relatório
(4, 2, NULL, 'pix', 'entregue', 60.00, 6.00, 66.00, 1, '2026-08-01 19:20:00'),
(5, 5, NULL, 'balcao', 'entregue', 78.90, 7.89, 86.79, 2, '2026-08-02 20:05:00'),
(6, 9, NULL, 'garcom', 'entregue', 81.80, 8.18, 89.98, 2, '2026-08-03 13:15:00'),
(7, 3, NULL, 'pix', 'entregue', 59.50, 5.95, 65.45, 1, '2026-08-04 19:40:00'),
(8, 6, NULL, 'pix', 'entregue', 77.00, 7.70, 84.70, 1, '2026-08-06 20:30:00'),
(9, 10, NULL, 'balcao', 'entregue', 62.00, 6.20, 68.20, 2, '2026-08-07 12:50:00'),
(10, 1, NULL, 'garcom', 'entregue', 114.90, 11.49, 126.39, 3, '2026-08-09 20:10:00'),
(11, 4, NULL, 'pix', 'entregue', 54.00, 5.40, 59.40, 1, '2026-08-10 13:25:00'),
(12, 7, NULL, 'pix', 'entregue', 107.00, 10.70, 117.70, 4, '2026-08-11 19:55:00'),
(13, 11, NULL, 'balcao', 'entregue', 72.90, 7.29, 80.19, 1, '2026-08-13 20:15:00'),
(14, 2, NULL, 'garcom', 'entregue', 82.00, 8.20, 90.20, 2, '2026-08-14 13:05:00'),
(15, 8, NULL, 'pix', 'entregue', 74.00, 7.40, 81.40, 1, '2026-08-16 19:35:00'),
(16, 5, NULL, 'pix', 'entregue', 103.70, 10.37, 114.07, 3, '2026-08-17 20:20:00'),
(17, 9, NULL, 'balcao', 'entregue', 72.00, 7.20, 79.20, 2, '2026-08-18 13:10:00'),
(18, 12, NULL, 'garcom', 'entregue', 90.90, 9.09, 99.99, 2, '2026-08-19 20:00:00');

INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario) VALUES
(1, 7, 2, 54.90),
(2, 8, 1, 46.00),
(2, 11, 2, 7.00),
(3, 2, 1, 32.00),
(3, 12, 1, 14.00),
(3, 17, 1, 18.00),
-- histórico
(4, 8, 1, 46.00), (4, 11, 2, 7.00),
(5, 7, 1, 54.90), (5, 14, 1, 24.00),
(6, 1, 2, 29.90), (6, 10, 1, 22.00),
(7, 6, 1, 52.00), (7, 13, 1, 7.50),
(8, 9, 1, 58.00), (8, 15, 1, 19.00),
(9, 5, 1, 48.00), (9, 12, 1, 14.00),
(10, 8, 1, 46.00), (10, 7, 1, 54.90), (10, 11, 2, 7.00),
(11, 2, 1, 32.00), (11, 16, 1, 22.00),
(12, 8, 2, 46.00), (12, 13, 2, 7.50),
(13, 7, 1, 54.90), (13, 17, 1, 18.00),
(14, 9, 1, 58.00), (14, 14, 1, 24.00),
(15, 6, 1, 52.00), (15, 10, 1, 22.00),
(16, 1, 3, 29.90), (16, 12, 1, 14.00),
(17, 8, 1, 46.00), (17, 15, 1, 19.00), (17, 11, 1, 7.00),
(18, 7, 1, 54.90), (18, 4, 1, 36.00);

-- E-mail: nome@saboremesa.com · senha: 1234

INSERT INTO funcionarios (nome, email, senha_hash) VALUES
('Gestor', 'admin@saboremmesa.com', '$2y$10$SyU8IA0GPVsHBrip4Y.yQuTUgSAu88USXVPFWQOKkAcCKjJMJz/s.');

INSERT INTO funcionarios (nome, email, senha_hash) VALUES
('Kauan Beraguas', 'kauan@saboremmesa.com', '$2y$10$svo4nVPK2ayItsYJwb4le.TgKrgcvF0GSwHdcw6PgZ.rAiR5wBIv.');

INSERT INTO funcionarios (nome, email, senha_hash) VALUES
('Bryan Guilherme', 'bryan@saboremmesa.com', '$2y$10$svo4nVPK2ayItsYJwb4le.TgKrgcvF0GSwHdcw6PgZ.rAiR5wBIv.');

INSERT INTO funcionarios (nome, email, senha_hash) VALUES
('João Henrique', 'joao@saboremmesa.com', '$2y$10$svo4nVPK2ayItsYJwb4le.TgKrgcvF0GSwHdcw6PgZ.rAiR5wBIv.');

INSERT INTO funcionarios (nome, email, senha_hash) VALUES
('Roger Liedlke', 'roger@saboremmesa.com', '$2y$10$svo4nVPK2ayItsYJwb4le.TgKrgcvF0GSwHdcw6PgZ.rAiR5wBIv.');

INSERT INTO funcionarios (nome, email, senha_hash) VALUES
('Pedro Henrique', 'pedro@saboremmesa.com', '$2y$10$svo4nVPK2ayItsYJwb4le.TgKrgcvF0GSwHdcw6PgZ.rAiR5wBIv.');

INSERT INTO funcionarios (nome, email, senha_hash) VALUES
('Gestor', 'charles@saboremmesa.com', '$2y$10$SyU8IA0GPVsHBrip4Y.yQuTUgSAu88USXVPFWQOKkAcCKjJMJz/s.');

INSERT INTO configuracoes (id, nome_restaurante, subtitulo, email_contato, horario_funcionamento, taxa_servico_percentual) VALUES
(1, 'Trattoria Liedlke', 'Sabor em Mesa', 'contato@saboremmesa.com', 'Seg–Ter 11h–22h · Sex–Sáb 12h–23h · Dom fechado', 10.00);

INSERT INTO relatorios (mesa_numero, pedido_id, avaliacao, data_relatorio, total) VALUES
(2, 4, 4, '2026-08-01', 66.00),
(5, 5, 5, '2026-08-02', 86.79),
(9, 6, 4, '2026-08-03', 89.98),
(3, 7, 3, '2026-08-04', 65.45),
(6, 8, 5, '2026-08-06', 84.70),
(10, 9, 4, '2026-08-07', 68.20),
(1, 10, 5, '2026-08-09', 126.39),
(4, 11, 2, '2026-08-10', 59.40),
(7, 12, 4, '2026-08-11', 117.70),
(11, 13, 3, '2026-08-13', 80.19),
(2, 14, 5, '2026-08-14', 90.20),
(8, 15, 4, '2026-08-16', 81.40),
(5, 16, 5, '2026-08-17', 114.07),
(9, 17, 3, '2026-08-18', 79.20),
(12, 18, 4, '2026-08-19', 99.99);
