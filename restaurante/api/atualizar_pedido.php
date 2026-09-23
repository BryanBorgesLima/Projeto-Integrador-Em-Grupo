<?php
require_once __DIR__ . '/../php/functions.php';
require_login();

$body = read_json_body();
$pedidoId = (int)($body['pedido_id'] ?? 0);
$status = $body['status'] ?? '';

if (!$pedidoId || !in_array($status, ['preparando', 'pronto', 'entregue'], true)) {
    json_response(['erro' => 'Dados inválidos.'], 422);
}

$stmt = $pdo->prepare("UPDATE pedidos SET status = ? WHERE id = ?");
$stmt->execute([$status, $pedidoId]);

// Quando o pedido é entregue, a mesa volta a ficar livre.
if ($status === 'entregue') {
    $stmt = $pdo->prepare("
        UPDATE mesas m
        JOIN pedidos p ON p.mesa_numero = m.numero
        SET m.status = 'livre'
        WHERE p.id = ?
    ");
    $stmt->execute([$pedidoId]);
}

json_response(['sucesso' => true]);
