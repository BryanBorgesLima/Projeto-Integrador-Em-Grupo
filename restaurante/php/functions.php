<?php
require_once __DIR__ . '/config.php';

function json_response($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

function read_json_body(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function is_logged_in(): bool {
    return !empty($_SESSION['funcionario_id']);
}

function require_login(): void {
    if (!is_logged_in()) {
        json_response(['erro' => 'Não autenticado.'], 401);
    }
}

// Busca todos os produtos. $onlyAvailable = true filtra os indisponíveis (usado no site do cliente).
function get_produtos(PDO $pdo, bool $onlyAvailable = false): array {
    $sql = "SELECT * FROM produtos" . ($onlyAvailable ? " WHERE disponivel = 1" : "") . " ORDER BY categoria, nome";
    return $pdo->query($sql)->fetchAll();
}

function get_extras(PDO $pdo): array {
    return $pdo->query("SELECT * FROM extras ORDER BY id")->fetchAll();
}

function get_configuracoes(PDO $pdo): array {
    $row = $pdo->query("SELECT * FROM configuracoes WHERE id = 1")->fetch();
    return $row ?: [
        'nome_restaurante' => 'El Churro Tacoman',
        'email_contato' => '',
        'horario_funcionamento' => '',
    ];
}

function get_mesas(PDO $pdo): array {
    return $pdo->query("SELECT * FROM mesas ORDER BY numero")->fetchAll();
}

// Mesas com o pedido ativo (se houver) já anexado, pronto para o admin renderizar.
function get_mesas_com_pedidos(PDO $pdo): array {
    $mesas = $pdo->query("SELECT * FROM mesas ORDER BY numero")->fetchAll();
    $pedidos = get_pedidos_completos($pdo, "p.status != 'entregue'");
    $pedidosPorMesa = [];
    foreach ($pedidos as $pedido) {
        $pedidosPorMesa[$pedido['mesa_numero']] = $pedido;
    }
    foreach ($mesas as &$mesa) {
        $mesa['pedido'] = $pedidosPorMesa[$mesa['numero']] ?? null;
    }
    return $mesas;
}

// Pedidos com itens (e produto associado) já montados em array aninhado.
function get_pedidos_completos(PDO $pdo, string $where = '1=1'): array {
    $pedidos = $pdo->query("SELECT p.* FROM pedidos p WHERE {$where} ORDER BY p.criado_em DESC")->fetchAll();
    if (!$pedidos) return [];

    $ids = array_column($pedidos, 'id');
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $stmt = $pdo->prepare("
        SELECT pi.*, pr.nome AS produto_nome, pr.imagem AS produto_imagem
        FROM pedido_itens pi
        JOIN produtos pr ON pr.id = pi.produto_id
        WHERE pi.pedido_id IN ($placeholders)
    ");
    $stmt->execute($ids);
    $itens = $stmt->fetchAll();

    $itensPorPedido = [];
    foreach ($itens as $item) {
        $itensPorPedido[$item['pedido_id']][] = $item;
    }
    foreach ($pedidos as &$pedido) {
        $pedido['itens'] = $itensPorPedido[$pedido['id']] ?? [];
    }
    return $pedidos;
}

function get_relatorios(PDO $pdo, ?string $data = null): array {
    if ($data) {
        $stmt = $pdo->prepare("SELECT * FROM relatorios WHERE data_relatorio = ? ORDER BY id DESC");
        $stmt->execute([$data]);
        return $stmt->fetchAll();
    }
    return $pdo->query("SELECT * FROM relatorios ORDER BY data_relatorio DESC")->fetchAll();
}

// Primeira letra maiúscula, sem depender da extensão mbstring estar habilitada.
function first_letter_upper(string $text): string {
    if ($text === '') return '?';
    if (function_exists('mb_strtoupper')) {
        return mb_strtoupper(mb_substr($text, 0, 1));
    }
    return strtoupper(substr($text, 0, 1));
}

// ---- Conversão para o formato que o front-end (data.js/main.js/admin.js) já espera ----

function to_js_produto(array $row): array {
    return [
        'id' => (int)$row['id'],
        'name' => $row['nome'],
        'category' => $row['categoria'],
        'price' => (float)$row['preco'],
        'image' => $row['imagem'],
        'tag' => $row['tag'],
        'featured' => (bool)$row['destaque'],
        'available' => (bool)$row['disponivel'],
    ];
}

function to_js_extra(array $row): array {
    return ['id' => $row['chave'], 'name' => $row['nome'], 'price' => (float)$row['preco']];
}

// Gera um <script> JSON seguro (escapa < > pra não fechar a tag por acidente)
function json_script(string $varName, $value): string {
    $json = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG);
    return "<script>const {$varName} = {$json};</script>";
}
