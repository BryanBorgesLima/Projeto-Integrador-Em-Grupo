<?php
require_once __DIR__ . '/../php/functions.php';
require_login();

$body = read_json_body();
$id = (int)($body['produto_id'] ?? 0);
if (!$id) {
    json_response(['erro' => 'produto_id é obrigatório.'], 422);
}

$stmt = $pdo->prepare("UPDATE produtos SET disponivel = 1 - disponivel WHERE id = ?");
$stmt->execute([$id]);

$stmt = $pdo->prepare("SELECT disponivel FROM produtos WHERE id = ?");
$stmt->execute([$id]);
$row = $stmt->fetch();

json_response(['sucesso' => true, 'disponivel' => (bool)($row['disponivel'] ?? false)]);
