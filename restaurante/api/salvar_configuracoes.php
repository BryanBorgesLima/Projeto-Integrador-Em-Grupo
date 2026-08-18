<?php
require_once __DIR__ . '/../php/functions.php';
require_login();

$body = read_json_body();
$nome = trim($body['nome_restaurante'] ?? '');
$email = trim($body['email_contato'] ?? '');
$horario = trim($body['horario_funcionamento'] ?? '');

if ($nome === '' || $email === '') {
    json_response(['erro' => 'Nome e email são obrigatórios.'], 422);
}

$stmt = $pdo->prepare("
    INSERT INTO configuracoes (id, nome_restaurante, email_contato, horario_funcionamento)
    VALUES (1, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        nome_restaurante = VALUES(nome_restaurante),
        email_contato = VALUES(email_contato),
        horario_funcionamento = VALUES(horario_funcionamento)
");
$stmt->execute([$nome, $email, $horario]);

json_response(['sucesso' => true]);
