<?php
require_once __DIR__ . '/../php/functions.php';
require_login();

$body = read_json_body();
$id = (int)($body['id'] ?? 0); // 0 = criar novo; >0 = editar
$nome = trim($body['nome'] ?? '');
$preco = $body['preco'] ?? null;
$chave = trim($body['chave'] ?? '');

if ($nome === '') {
    json_response(['erro' => 'Informe o nome do extra.'], 422);
}
if (!is_numeric($preco) || (float)$preco < 0) {
    json_response(['erro' => 'Informe um preço válido.'], 422);
}
$preco = round((float)$preco, 2);

// A chave é o identificador estável usado no carrinho/pedidos — gerada a partir do nome se não vier.
// Não depende da extensão mbstring (nem sempre disponível), então usamos apenas ASCII aqui;
// acentos são simplesmente descartados pelo filtro abaixo — não afeta o nome de exibição.
if ($chave === '') {
    $chave = strtolower($nome);
    $chave = preg_replace('/[^a-z0-9]+/', '_', $chave);
    $chave = trim($chave, '_');
}
if ($chave === '') $chave = 'extra';

try {
    if ($id > 0) {
        $stmt = $pdo->prepare("SELECT id FROM extras WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            json_response(['erro' => 'Extra não encontrado.'], 404);
        }
        $stmt = $pdo->prepare("UPDATE extras SET nome = ?, preco = ?, chave = ? WHERE id = ?");
        $stmt->execute([$nome, $preco, $chave, $id]);
    } else {
        // Garante chave única, adicionando sufixo se precisar.
        $baseChave = $chave;
        $i = 2;
        $stmt = $pdo->prepare("SELECT id FROM extras WHERE chave = ?");
        while (true) {
            $stmt->execute([$chave]);
            if (!$stmt->fetch()) break;
            $chave = $baseChave . '_' . $i;
            $i++;
        }
        $stmt = $pdo->prepare("INSERT INTO extras (chave, nome, preco) VALUES (?, ?, ?)");
        $stmt->execute([$chave, $nome, $preco]);
        $id = (int)$pdo->lastInsertId();
    }
} catch (PDOException $e) {
    json_response(['erro' => 'Não foi possível salvar o extra (chave já em uso?).'], 409);
}

$stmt = $pdo->prepare("SELECT * FROM extras WHERE id = ?");
$stmt->execute([$id]);
$row = $stmt->fetch();

json_response(['sucesso' => true, 'extra' => to_js_extra_admin($row)]);
