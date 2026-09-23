<?php
require_once __DIR__ . '/../php/functions.php';
require_login();

$body = read_json_body();
$id = (int)($body['chamado_id'] ?? 0);
if (!$id) {
    json_response(['erro' => 'chamado_id é obrigatório.'], 422);
}

$stmt = $pdo->prepare("UPDATE chamados_garcom SET status = 'atendido', atendido_em = NOW() WHERE id = ?");
$stmt->execute([$id]);

json_response(['sucesso' => true]);
