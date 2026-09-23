<?php
require_once __DIR__ . '/../php/functions.php';
require_login();

$body = read_json_body();
$id = (int)($body['id'] ?? 0);
if (!$id) {
    json_response(['erro' => 'id é obrigatório.'], 422);
}

try {
    $stmt = $pdo->prepare("DELETE FROM produtos WHERE id = ?");
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        json_response(['erro' => 'Item não encontrado.'], 404);
    }
    json_response(['sucesso' => true]);
} catch (PDOException $e) {
    // Item já apareceu em algum pedido (chave estrangeira) — não dá pra apagar sem perder o histórico.
    if ($e->getCode() === '23000') {
        json_response(['erro' => 'Esse item já foi usado em pedidos e não pode ser excluído. Marque-o como indisponível em vez de excluir.'], 409);
    }
    json_response(['erro' => 'Não foi possível excluir o item.'], 500);
}
