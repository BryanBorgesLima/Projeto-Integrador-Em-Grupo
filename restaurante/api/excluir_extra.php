<?php
require_once __DIR__ . '/../php/functions.php';
require_login();

$body = read_json_body();
$id = (int)($body['id'] ?? 0);
if (!$id) {
    json_response(['erro' => 'id é obrigatório.'], 422);
}

try {
    $stmt = $pdo->prepare("DELETE FROM extras WHERE id = ?");
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        json_response(['erro' => 'Extra não encontrado.'], 404);
    }
    json_response(['sucesso' => true]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        json_response(['erro' => 'Esse extra já foi usado em pedidos e não pode ser excluído.'], 409);
    }
    json_response(['erro' => 'Não foi possível excluir o extra.'], 500);
}
