<?php
// Recebe uma foto enviada pelo formulário de item do admin e salva em img/produtos/uploads/.
// Devolve o caminho relativo (ex: "img/produtos/uploads/2026...jpg"), que é o que vai pro campo "imagem" do produto.
require_once __DIR__ . '/../php/functions.php';
require_login();

const UPLOAD_MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const UPLOAD_TIPOS = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];

$arquivo = $_FILES['imagem'] ?? null;
if (!$arquivo || !isset($arquivo['error'])) {
    json_response(['erro' => 'Nenhuma imagem foi enviada.'], 400);
}

switch ($arquivo['error']) {
    case UPLOAD_ERR_OK:
        break;
    case UPLOAD_ERR_INI_SIZE:
    case UPLOAD_ERR_FORM_SIZE:
        json_response(['erro' => 'A imagem é grande demais. Envie um arquivo de até 4 MB.'], 413);
    case UPLOAD_ERR_NO_FILE:
        json_response(['erro' => 'Nenhuma imagem foi enviada.'], 400);
    default:
        json_response(['erro' => 'O envio falhou (código ' . (int)$arquivo['error'] . '). Tente de novo.'], 500);
}

if ($arquivo['size'] > UPLOAD_MAX_BYTES) {
    json_response(['erro' => 'A imagem é grande demais. Envie um arquivo de até 4 MB.'], 413);
}

// getimagesize() lê o conteúdo real do arquivo — não confia na extensão nem no tipo que o navegador informou.
$info = @getimagesize($arquivo['tmp_name']);
$mime = $info['mime'] ?? '';
if (!isset(UPLOAD_TIPOS[$mime])) {
    json_response(['erro' => 'Formato não aceito. Use JPG, PNG, WEBP ou GIF.'], 415);
}

$pastaRelativa = 'img/produtos/uploads';
$pastaAbsoluta = __DIR__ . '/../' . $pastaRelativa;
if (!is_dir($pastaAbsoluta) && !mkdir($pastaAbsoluta, 0755, true)) {
    json_response(['erro' => 'Não foi possível criar a pasta de imagens no servidor.'], 500);
}

$nomeArquivo = date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.' . UPLOAD_TIPOS[$mime];
if (!move_uploaded_file($arquivo['tmp_name'], $pastaAbsoluta . '/' . $nomeArquivo)) {
    json_response(['erro' => 'Não foi possível salvar a imagem no servidor.'], 500);
}

json_response(['sucesso' => true, 'caminho' => $pastaRelativa . '/' . $nomeArquivo]);
