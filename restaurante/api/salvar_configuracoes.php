<?php
require_once __DIR__ . '/../php/functions.php';
require_login();

$body = read_json_body();
$nome = trim($body['nome_restaurante'] ?? '');
$subtitulo = trim($body['subtitulo'] ?? '');
$email = trim($body['email_contato'] ?? '');
$horario = trim($body['horario_funcionamento'] ?? '');
$taxaServico = (float)($body['taxa_servico_percentual'] ?? 10);

if ($nome === '' || $email === '') {
    json_response(['erro' => 'Nome e email são obrigatórios.'], 422);
}
if ($taxaServico < 0 || $taxaServico > 100) {
    json_response(['erro' => 'Taxa de serviço deve estar entre 0 e 100.'], 422);
}

$stmt = $pdo->prepare("
    INSERT INTO configuracoes (id, nome_restaurante, subtitulo, email_contato, horario_funcionamento, taxa_servico_percentual)
    VALUES (1, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        nome_restaurante = VALUES(nome_restaurante),
        subtitulo = VALUES(subtitulo),
        email_contato = VALUES(email_contato),
        horario_funcionamento = VALUES(horario_funcionamento),
        taxa_servico_percentual = VALUES(taxa_servico_percentual)
");
$stmt->execute([$nome, $subtitulo, $email, $horario, $taxaServico]);

json_response(['sucesso' => true]);
