<?php
require_once __DIR__ . '/../php/functions.php';

$body = read_json_body();
$mesa = (int)($body['mesa'] ?? 0);
$formaPagamento = trim($body['forma_pagamento'] ?? '');
$itens = $body['itens'] ?? [];

if (!$mesa || $formaPagamento === '' || !is_array($itens) || count($itens) === 0) {
    json_response(['erro' => 'Carrinho ou dados de pagamento inválidos.'], 422);
}

// Carrega preços reais do banco — nunca confia no preço vindo do navegador.
$produtos = [];
foreach (get_produtos($pdo) as $p) {
    $produtos[$p['id']] = $p;
}
$extras = [];
foreach (get_extras($pdo) as $e) {
    $extras[$e['chave']] = $e;
}

$subtotal = 0;
$itensValidados = [];
foreach ($itens as $item) {
    $produtoId = (int)($item['productId'] ?? 0);
    $qty = max(1, (int)($item['qty'] ?? 1));
    if (!isset($produtos[$produtoId])) continue;

    $produto = $produtos[$produtoId];
    $opcao = $item['extras']['opcao'] ?? null;
    $linhaExtras = [];
    $extraTotal = 0;

    if (!empty($item['extras'])) {
        foreach ($item['extras'] as $chave => $qtdExtra) {
            if ($chave === 'opcao' || (int)$qtdExtra <= 0) continue;
            if (!isset($extras[$chave])) continue;
            $qtdExtra = (int)$qtdExtra;
            $linhaExtras[] = ['extra_id' => $extras[$chave]['id'], 'quantidade' => $qtdExtra];
            $extraTotal += $extras[$chave]['preco'] * $qtdExtra;
        }
    }

    $lineTotal = $produto['preco'] * $qty + $extraTotal;
    $subtotal += $lineTotal;

    $itensValidados[] = [
        'produto_id' => $produtoId,
        'quantidade' => $qty,
        'preco_unitario' => $produto['preco'],
        'opcao' => $opcao,
        'extras' => $linhaExtras,
    ];
}

if (count($itensValidados) === 0) {
    json_response(['erro' => 'Nenhum item válido no carrinho.'], 422);
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO pedidos (mesa_numero, forma_pagamento, status, subtotal)
        VALUES (?, ?, 'preparando', ?)
    ");
    $stmt->execute([$mesa, $formaPagamento, $subtotal]);
    $pedidoId = $pdo->lastInsertId();

    $stmtItem = $pdo->prepare("
        INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario, opcao)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmtExtra = $pdo->prepare("
        INSERT INTO pedido_item_extras (pedido_item_id, extra_id, quantidade)
        VALUES (?, ?, ?)
    ");

    foreach ($itensValidados as $item) {
        $stmtItem->execute([$pedidoId, $item['produto_id'], $item['quantidade'], $item['preco_unitario'], $item['opcao']]);
        $itemId = $pdo->lastInsertId();
        foreach ($item['extras'] as $extra) {
            $stmtExtra->execute([$itemId, $extra['extra_id'], $extra['quantidade']]);
        }
    }

    $stmt = $pdo->prepare("UPDATE mesas SET status = 'ocupado' WHERE numero = ?");
    $stmt->execute([$mesa]);

    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    json_response(['erro' => 'Não foi possível registrar o pedido.'], 500);
}

json_response(['sucesso' => true, 'pedido_id' => $pedidoId, 'total' => $subtotal]);
