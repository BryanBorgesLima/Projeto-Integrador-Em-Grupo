<?php
require_once __DIR__ . '/../php/functions.php';

$body = read_json_body();
$mesa = (int)($body['mesa'] ?? 0);

if (!$mesa) {
    json_response(['erro' => 'Mesa inválida.'], 422);
}

$stmt = $pdo->prepare("SELECT numero FROM mesas WHERE numero = ?");
$stmt->execute([$mesa]);
if (!$stmt->fetch()) {
    json_response(['erro' => 'Mesa não encontrada.'], 404);
}

$stmt = $pdo->prepare("INSERT INTO chamados_garcom (mesa_numero, status) VALUES (?, 'pendente')");
$stmt->execute([$mesa]);

json_response(['sucesso' => true, 'chamado_id' => $pdo->lastInsertId()]);
