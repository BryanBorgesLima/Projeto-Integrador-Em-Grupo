<?php
require_once __DIR__ . '/../php/functions.php';

// Aceita tanto GET (?mesa=4, usado no polling) quanto POST com corpo JSON.
$mesa = isset($_GET['mesa']) ? (int)$_GET['mesa'] : (int)(read_json_body()['mesa'] ?? 0);

if (!$mesa) {
    json_response(['erro' => 'Informe o número da mesa.'], 422);
}

$pedido = get_ultimo_pedido_mesa($pdo, $mesa);

json_response([
    'sucesso' => true,
    'pedido' => $pedido ? to_js_pedido_status($pedido) : null,
]);
