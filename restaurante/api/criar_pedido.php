<?php
require_once __DIR__ . '/../php/functions.php';

$body = read_json_body();
$mesa = (int)($body['mesa'] ?? 0);
$formaPagamento = trim($body['forma_pagamento'] ?? '');
$dividirPessoas = max(1, (int)($body['dividir_pessoas'] ?? 1));
$itens = $body['itens'] ?? [];

$formasValidas = ['pix', 'garcom', 'balcao'];
if (!$mesa || !in_array($formaPagamento, $formasValidas, true) || !is_array($itens) || count($itens) === 0) {
    json_response(['erro' => 'Pedido ou dados de pagamento inválidos.'], 422);
}

// Carrega preços/ingredientes reais do banco — nunca confia em valores vindos do navegador.
$produtos = [];
foreach (get_produtos($pdo) as $p) {
    $produtos[$p['id']] = $p;
}
$extras = [];
foreach (get_extras($pdo) as $e) {
    $extras[$e['chave']] = $e;
}
$extrasPermitidosPorProduto = get_produto_extras_map($pdo); // [produto_id => ['queijo', 'bacon', ...]]
$config = get_configuracoes($pdo);
$taxaPercentual = (float)$config['taxa_servico_percentual'];

$subtotal = 0;
$itensValidados = [];
foreach ($itens as $item) {
    $produtoId = (int)($item['productId'] ?? 0);
    $qty = max(1, (int)($item['qty'] ?? 1));
    if (!isset($produtos[$produtoId])) continue;

    $produto = $produtos[$produtoId];

    // Ingredientes removidos: só aceita os que realmente pertencem ao produto.
    $ingredientesDisponiveis = [];
    if (!empty($produto['ingredientes'])) {
        $ingredientesDisponiveis = array_map('trim', explode(',', $produto['ingredientes']));
    }
    $removidos = [];
    if (!empty($item['removedIngredients']) && is_array($item['removedIngredients'])) {
        foreach ($item['removedIngredients'] as $ing) {
            $ing = trim((string)$ing);
            if ($ing !== '' && in_array($ing, $ingredientesDisponiveis, true)) {
                $removidos[] = $ing;
            }
        }
    }

    // Extras válidos — só aceita os que esse produto específico pode receber
    // (ex: um pedido de vinho não pode "colar" um bacon extra manipulando a requisição).
    $extrasDoProduto = $extrasPermitidosPorProduto[$produtoId] ?? [];
    $linhaExtras = [];
    $extraTotal = 0;
    if (!empty($item['extras']) && is_array($item['extras'])) {
        foreach ($item['extras'] as $chave => $qtdExtra) {
            $qtdExtra = (int)$qtdExtra;
            if ($qtdExtra <= 0 || !isset($extras[$chave])) continue;
            if (!in_array($chave, $extrasDoProduto, true)) continue;
            $linhaExtras[] = ['extra_id' => $extras[$chave]['id'], 'quantidade' => $qtdExtra];
            $extraTotal += $extras[$chave]['preco'] * $qtdExtra;
        }
    }

    $notes = trim((string)($item['notes'] ?? ''));
    $notes = safe_truncate($notes, 255);

    $lineTotal = ($produto['preco'] + $extraTotal) * $qty;
    $subtotal += $lineTotal;

    $itensValidados[] = [
        'produto_id' => $produtoId,
        'quantidade' => $qty,
        'preco_unitario' => $produto['preco'],
        'ingredientes_removidos' => $removidos ? implode(',', $removidos) : null,
        'observacoes' => $notes !== '' ? $notes : null,
        'extras' => $linhaExtras,
    ];
}

if (count($itensValidados) === 0) {
    json_response(['erro' => 'Nenhum item válido no pedido.'], 422);
}

$taxaServico = round($subtotal * ($taxaPercentual / 100), 2);
$total = $subtotal + $taxaServico;

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO pedidos (mesa_numero, forma_pagamento, status, subtotal, taxa_servico, total, dividir_pessoas)
        VALUES (?, ?, 'preparando', ?, ?, ?, ?)
    ");
    $stmt->execute([$mesa, $formaPagamento, $subtotal, $taxaServico, $total, $dividirPessoas]);
    $pedidoId = $pdo->lastInsertId();

    $stmtItem = $pdo->prepare("
        INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario, ingredientes_removidos, observacoes)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmtExtra = $pdo->prepare("
        INSERT INTO pedido_item_extras (pedido_item_id, extra_id, quantidade)
        VALUES (?, ?, ?)
    ");

    foreach ($itensValidados as $item) {
        $stmtItem->execute([
            $pedidoId,
            $item['produto_id'],
            $item['quantidade'],
            $item['preco_unitario'],
            $item['ingredientes_removidos'],
            $item['observacoes'],
        ]);
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

json_response(['sucesso' => true, 'pedido_id' => $pedidoId, 'total' => $total]);
