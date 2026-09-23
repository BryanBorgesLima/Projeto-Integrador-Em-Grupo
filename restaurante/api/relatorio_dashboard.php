<?php
require_once __DIR__ . '/../php/functions.php';
require_login();

$body = read_json_body();
$periodo = $body['periodo'] ?? '30d';
if (!in_array($periodo, PERIODOS_RELATORIO_VALIDOS, true)) {
    $periodo = '30d';
}

json_response(['sucesso' => true, 'dashboard' => get_relatorio_dashboard($pdo, $periodo)]);
