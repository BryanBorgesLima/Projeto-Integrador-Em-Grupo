<?php
require_once __DIR__ . '/../php/functions.php';
require_login();

$body = read_json_body();
$numero = (int)($body['numero'] ?? 0);
$status = $body['status'] ?? '';

if (!$numero || !in_array($status, ['livre', 'reservado', 'ocupado'], true)) {
    json_response(['erro' => 'Dados inválidos.'], 422);
}

$stmt = $pdo->prepare("UPDATE mesas SET status = ? WHERE numero = ?");
$stmt->execute([$status, $numero]);

json_response(['sucesso' => true]);
