-- ============================================================
-- Atualização: adiciona as imagens dos pratos num banco que JÁ existe,
-- sem apagar pedidos, mesas nem nada que você já tenha cadastrado.
-- No phpMyAdmin: selecione o banco sabor_e_mesa > aba Importar > este arquivo.
-- Só preenche itens que ainda estão sem imagem (não sobrescreve fotos que você já trocou).
-- ============================================================
USE sabor_e_mesa;

UPDATE produtos SET imagem = 'img/produtos/bruschetta-tradicional.svg' WHERE id = 1 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/arancini-siciliani.svg' WHERE id = 2 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/pao-de-alho-artesanal.svg' WHERE id = 3 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/carpaccio-di-manzo.svg' WHERE id = 4 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/spaghetti-al-pomodoro.svg' WHERE id = 5 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/lasagna-alla-bolognese.svg' WHERE id = 6 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/spaghetti-alla-carbonara.svg' WHERE id = 7 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/pizza-margherita.svg' WHERE id = 8 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/risotto-ai-funghi.svg' WHERE id = 9 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/vinho-tinto-da-casa.svg' WHERE id = 10 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/agua-com-gas.svg' WHERE id = 11 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/limonata-siciliana.svg' WHERE id = 12 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/refrigerante-lata.svg' WHERE id = 13 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/tiramisu-della-casa.svg' WHERE id = 14 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/panna-cotta.svg' WHERE id = 15 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/cannoli-siciliani.svg' WHERE id = 16 AND (imagem IS NULL OR imagem = '');
UPDATE produtos SET imagem = 'img/produtos/gelato-artesanal.svg' WHERE id = 17 AND (imagem IS NULL OR imagem = '');
