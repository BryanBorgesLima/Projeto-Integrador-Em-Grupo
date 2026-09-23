<?php
require_once __DIR__ . '/../php/functions.php';
require_login();

$body = read_json_body();
$id = (int)($body['id'] ?? 0); // 0 = criar novo item; >0 = editar existente
$nome = trim($body['nome'] ?? '');
$categoria = trim($body['categoria'] ?? '');
$preco = $body['preco'] ?? null;
$descricao = trim($body['descricao'] ?? '');
$ingredientes = normalizar_ingredientes($body['ingredientes'] ?? '');
$imagem = trim($body['imagem'] ?? '');
$tag = trim($body['tag'] ?? '');
$destaque = !empty($body['destaque']) ? 1 : 0;
$disponivel = array_key_exists('disponivel', $body) ? (!empty($body['disponivel']) ? 1 : 0) : 1;
$extraIdsRaw = is_array($body['extra_ids'] ?? null) ? $body['extra_ids'] : [];
$extraIds = array_values(array_unique(array_filter(array_map('intval', $extraIdsRaw), fn($v) => $v > 0)));

if ($nome === '') {
    json_response(['erro' => 'Informe o nome do item.'], 422);
}
if (!in_array($categoria, CATEGORIAS_VALIDAS, true)) {
    json_response(['erro' => 'Categoria inválida.'], 422);
}
if (!is_numeric($preco) || (float)$preco < 0) {
    json_response(['erro' => 'Informe um preço válido.'], 422);
}
$preco = round((float)$preco, 2);
// Imagem: aceita uma URL completa (https://...) ou um arquivo dentro da pasta img/ do projeto.
if ($imagem !== '') {
    $ehUrl = (bool)preg_match('#^https?://#i', $imagem);
    $ehArquivoLocal = (bool)preg_match('#^img/[A-Za-z0-9_\-./]+\.(jpe?g|png|webp|gif|svg)$#i', $imagem) && strpos($imagem, '..') === false;
    if ((!$ehUrl && !$ehArquivoLocal) || strlen($imagem) > 255) {
        json_response(['erro' => 'Imagem inválida. Envie uma foto ou cole um link começando com https://'], 422);
    }
}

if ($id > 0) {
    // Editar item existente
    $stmt = $pdo->prepare("SELECT id FROM produtos WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        json_response(['erro' => 'Item não encontrado.'], 404);
    }
    $stmt = $pdo->prepare("
        UPDATE produtos
        SET nome = ?, categoria = ?, preco = ?, descricao = ?, ingredientes = ?, imagem = ?, tag = ?, destaque = ?, disponivel = ?
        WHERE id = ?
    ");
    $stmt->execute([
        $nome, $categoria, $preco, $descricao ?: null, $ingredientes ?: null,
        $imagem ?: null, $tag ?: null, $destaque, $disponivel, $id,
    ]);
} else {
    // Criar item novo do zero
    $stmt = $pdo->prepare("
        INSERT INTO produtos (nome, categoria, preco, descricao, ingredientes, imagem, tag, destaque, disponivel)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $nome, $categoria, $preco, $descricao ?: null, $ingredientes ?: null,
        $imagem ?: null, $tag ?: null, $destaque, $disponivel,
    ]);
    $id = (int)$pdo->lastInsertId();
}

// Sincroniza quais extras esse produto pode receber (substitui a lista inteira).
$pdo->prepare("DELETE FROM produto_extras WHERE produto_id = ?")->execute([$id]);
if ($extraIds) {
    $placeholders = implode(',', array_fill(0, count($extraIds), '?'));
    $stmtValidExtras = $pdo->prepare("SELECT id FROM extras WHERE id IN ($placeholders)");
    $stmtValidExtras->execute($extraIds);
    $extraIdsValidos = array_column($stmtValidExtras->fetchAll(), 'id');

    $stmtInsertExtra = $pdo->prepare("INSERT INTO produto_extras (produto_id, extra_id) VALUES (?, ?)");
    foreach ($extraIdsValidos as $extraId) {
        $stmtInsertExtra->execute([$id, $extraId]);
    }
}

$stmt = $pdo->prepare("SELECT * FROM produtos WHERE id = ?");
$stmt->execute([$id]);
$row = $stmt->fetch();

$extrasDoProduto = get_produto_extras_map($pdo)[$id] ?? [];
json_response(['sucesso' => true, 'produto' => to_js_produto($row, $extrasDoProduto)]);
