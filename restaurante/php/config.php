<?php
// Configuração de conexão com o banco de dados.
// Ajuste os 4 valores abaixo para o seu ambiente (XAMPP, hospedagem, etc).

$DB_HOST = 'localhost';
$DB_NAME = 'sapori_di_luna';
$DB_USER = 'root';
$DB_PASS = '';

try {
    $pdo = new PDO(
        "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    die('Erro ao conectar ao banco de dados. Confira php/config.php e importe o database.sql.');
}

// Sessão usada pelo login do painel admin
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
