-- ============================================================
-- Sapori di Luna — banco de dados
-- Importe este arquivo inteiro no phpMyAdmin, Adminer ou via:
--   mysql -u root -p < database.sql
-- Atenção: isso apaga e recria o banco do zero (dados de exemplo inclusos).
-- ============================================================

DROP DATABASE IF EXISTS sapori_di_luna;

CREATE DATABASE sapori_di_luna
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE sapori_di_luna;

-- ---------- Cardápio ----------
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  categoria ENUM('entradas','salgados','bebidas','sobremesas') NOT NULL,
  preco DECIMAL(8,2) NOT NULL,
  imagem VARCHAR(255) DEFAULT NULL,
  tag VARCHAR(100) DEFAULT NULL,
  destaque TINYINT(1) NOT NULL DEFAULT 0,
  disponivel TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE extras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chave VARCHAR(30) NOT NULL UNIQUE,
  nome VARCHAR(100) NOT NULL,
  preco DECIMAL(8,2) NOT NULL
) ENGINE=InnoDB;

-- ---------- Mesas ----------
CREATE TABLE mesas (
  numero INT PRIMARY KEY,
  status ENUM('livre','reservado','ocupado') NOT NULL DEFAULT 'livre'
) ENGINE=InnoDB;

-- ---------- Pedidos ----------
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mesa_numero INT NOT NULL,
  cliente_nome VARCHAR(150) DEFAULT NULL,
  forma_pagamento VARCHAR(30) NOT NULL,
  status ENUM('preparando','pronto','entregue') NOT NULL DEFAULT 'preparando',
  subtotal DECIMAL(8,2) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mesa_numero) REFERENCES mesas(numero)
) ENGINE=InnoDB;

CREATE TABLE pedido_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  preco_unitario DECIMAL(8,2) NOT NULL,
  opcao VARCHAR(50) DEFAULT NULL,
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
  email_contato VARCHAR(150) NOT NULL,
  horario_funcionamento VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

-- ============================================================
-- Dados de exemplo
-- ============================================================

INSERT INTO produtos (id, nome, categoria, preco, tag, destaque, disponivel) VALUES
(1, 'Bolinho de Bacalhau', 'entradas', 15.00, NULL, 0, 1),
(2, 'Pão de Alho', 'entradas', 12.00, NULL, 0, 1),
(3, 'Batata Frita', 'entradas', 18.00, NULL, 0, 1),
(4, 'Anéis de Cebola', 'entradas', 16.00, NULL, 0, 1),
(5, 'Coxinha', 'salgados', 9.00, NULL, 0, 1),
(6, 'Empada de Frango', 'salgados', 11.00, NULL, 0, 1),
(7, 'Kibe', 'salgados', 10.00, NULL, 0, 1),
(8, 'Taco de Carne', 'salgados', 24.00, NULL, 0, 1),
(9, 'Suco de Laranja', 'bebidas', 8.00, NULL, 0, 1),
(10, 'Refrigerante Lata', 'bebidas', 7.00, NULL, 0, 1),
(11, 'Água com Gás', 'bebidas', 6.00, NULL, 0, 1),
(12, 'Limonada', 'bebidas', 9.00, NULL, 0, 1),
(13, 'Pudim', 'sobremesas', 12.00, NULL, 0, 1),
(14, 'Brownie', 'sobremesas', 14.00, NULL, 0, 1),
(15, 'Sorvete', 'sobremesas', 10.00, NULL, 0, 1),
(16, 'Mousse de Maracujá', 'sobremesas', 13.00, NULL, 0, 1),
(17, 'Burger da Casa', 'salgados', 39.00, 'Favorito absoluto', 1, 1),
(18, 'Refrigerante Gelado', 'bebidas', 7.55, 'Sempre geladinho', 1, 1);

INSERT INTO extras (id, chave, nome, preco) VALUES
(1, 'queijo', 'Queijo extra', 2.00),
(2, 'bacon', 'Bacon', 3.00),
(3, 'molho', 'Molho especial', 1.00);

INSERT INTO mesas (numero, status) VALUES
(1,'ocupado'), (2,'livre'), (3,'reservado'), (4,'ocupado'),
(5,'livre'), (6,'livre'), (7,'reservado'), (8,'ocupado'),
(9,'livre'), (10,'livre'), (11,'reservado'), (12,'livre');

INSERT INTO pedidos (id, mesa_numero, cliente_nome, forma_pagamento, status, subtotal) VALUES
(1, 1, 'Bryan G Borges Lima', 'Cartão', 'preparando', 54.00),
(2, 4, 'Marina Alves Costa', 'Pix', 'pronto', 53.00),
(3, 8, 'João Pedro Santos', 'Dinheiro', 'preparando', 61.00);

INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario) VALUES
(1, 8, 2, 24.00),
(1, 11, 1, 6.00),
(2, 17, 1, 39.00),
(2, 10, 2, 7.00),
(3, 5, 4, 9.00),
(3, 9, 1, 8.00),
(3, 14, 1, 14.00);

-- E-mail: admin@saporidiluna.com · senha: admin123
INSERT INTO funcionarios (nome, email, senha_hash) VALUES
('Gestor Demo', 'admin@saporidiluna.com', '$2y$10$SyU8IA0GPVsHBrip4Y.yQuTUgSAu88USXVPFWQOKkAcCKjJMJz/s.');

INSERT INTO configuracoes (id, nome_restaurante, email_contato, horario_funcionamento) VALUES
(1, 'Sapori di Luna', 'contato@saporidiluna.com', 'Seg–Ter 11h–22h · Sex–Sáb 12h–23h · Dom fechado');

INSERT INTO relatorios (mesa_numero, avaliacao, data_relatorio, total) VALUES
(1, 4, '2026-08-05', 62.00),
(2, 5, '2026-08-08', 41.50),
(3, 3, '2026-08-12', 87.00),
(4, 5, '2026-08-15', 54.00),
(5, 2, '2026-08-20', 33.00),
(6, 4, '2026-08-24', 76.50);
