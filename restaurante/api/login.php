<?php
require_once __DIR__ . '/../php/functions.php';

$body = read_json_body();
$email = trim($body['email'] ?? '');
$senha = $body['senha'] ?? '';

if ($email === '' || $senha === '') {
    json_response(['erro' => 'Informe email e senha.'], 422);
}

$stmt = $pdo->prepare("SELECT * FROM funcionarios WHERE email = ?");
$stmt->execute([$email]);
$funcionario = $stmt->fetch();

if (!$funcionario || !password_verify($senha, $funcionario['senha_hash'])) {
    json_response(['erro' => 'Email ou senha inválidos.'], 401);
}

$_SESSION['funcionario_id'] = $funcionario['id'];
$_SESSION['funcionario_nome'] = $funcionario['nome'];

json_response(['sucesso' => true, 'nome' => $funcionario['nome']]);
