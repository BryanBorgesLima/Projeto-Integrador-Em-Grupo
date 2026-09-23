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

// [produto_id => ['queijo', 'bacon', ...]] — quais extras (pela chave) cada produto pode receber.
function get_produto_extras_map(PDO $pdo): array {
    $rows = $pdo->query("
        SELECT pe.produto_id, e.chave
        FROM produto_extras pe
        JOIN extras e ON e.id = pe.extra_id
    ")->fetchAll();
    $map = [];
    foreach ($rows as $row) {
        $map[$row['produto_id']][] = $row['chave'];
    }
    return $map;
}

function get_configuracoes(PDO $pdo): array {
    $row = $pdo->query("SELECT * FROM configuracoes WHERE id = 1")->fetch();
    return $row ?: [
        'nome_restaurante' => 'Sabor & Mesa',
        'subtitulo' => 'Trattoria Moderna',
        'email_contato' => '',
        'horario_funcionamento' => '',
        'taxa_servico_percentual' => 10.00,
    ];
}

function get_mesas(PDO $pdo): array {
    return $pdo->query("SELECT * FROM mesas ORDER BY numero")->fetchAll();
}

// Chamados de garçom pendentes (usado no admin pra alertar a equipe).
function get_chamados_garcom(PDO $pdo, bool $onlyPendentes = true): array {
    $sql = "SELECT * FROM chamados_garcom" . ($onlyPendentes ? " WHERE status = 'pendente'" : "") . " ORDER BY criado_em DESC";
    return $pdo->query($sql)->fetchAll();
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

// Pedido mais recente de uma mesa (qualquer status) — base do acompanhamento do cliente.
// Só retorna algo se a mesa ainda estiver "ocupada": depois que o pedido é entregue, a mesa
// volta a ficar livre (ver api/atualizar_pedido.php) — nesse ponto o ciclo encerrou e não faz
// sentido mostrar pro próximo cliente que sentar ali um pedido antigo de quem já saiu.
function get_ultimo_pedido_mesa(PDO $pdo, int $mesa): ?array {
    $stmtMesa = $pdo->prepare("SELECT status FROM mesas WHERE numero = ?");
    $stmtMesa->execute([$mesa]);
    $mesaRow = $stmtMesa->fetch();
    if (!$mesaRow || $mesaRow['status'] !== 'ocupado') return null;

    $stmt = $pdo->prepare("SELECT * FROM pedidos WHERE mesa_numero = ? ORDER BY criado_em DESC LIMIT 1");
    $stmt->execute([$mesa]);
    $pedido = $stmt->fetch();
    if (!$pedido) return null;

    $stmt2 = $pdo->prepare("
        SELECT pi.*, pr.nome AS produto_nome, pr.imagem AS produto_imagem
        FROM pedido_itens pi
        JOIN produtos pr ON pr.id = pi.produto_id
        WHERE pi.pedido_id = ?
        ORDER BY pi.id
    ");
    $stmt2->execute([$pedido['id']]);
    $pedido['itens'] = $stmt2->fetchAll();
    return $pedido;
}

function get_relatorios(PDO $pdo, ?string $data = null): array {
    if ($data) {
        $stmt = $pdo->prepare("SELECT * FROM relatorios WHERE data_relatorio = ? ORDER BY id DESC");
        $stmt->execute([$data]);
        return $stmt->fetchAll();
    }
    return $pdo->query("SELECT * FROM relatorios ORDER BY data_relatorio DESC")->fetchAll();
}

const PERIODOS_RELATORIO_VALIDOS = ['hoje', '7d', '30d', 'tudo'];

// Data/hora inicial (inclusive) pro filtro de período do relatório.
function relatorio_periodo_desde(string $periodo): string {
    switch ($periodo) {
        case 'hoje':
            return date('Y-m-d 00:00:00');
        case '7d':
            return date('Y-m-d 00:00:00', strtotime('-6 days'));
        case 'tudo':
            return '2000-01-01 00:00:00';
        case '30d':
        default:
            return date('Y-m-d 00:00:00', strtotime('-29 days'));
    }
}

// Monta o painel completo de "Relatório → Visão geral": resumo, faturamento por dia,
// produtos mais vendidos, faturamento por categoria e formas de pagamento — tudo
// calculado a partir dos pedidos reais (não da tabela de avaliações, que é separada).
function get_relatorio_dashboard(PDO $pdo, string $periodo): array {
    if (!in_array($periodo, PERIODOS_RELATORIO_VALIDOS, true)) $periodo = '30d';
    $desde = relatorio_periodo_desde($periodo);

    $stmt = $pdo->prepare("
        SELECT COUNT(*) AS total_pedidos, COALESCE(SUM(total),0) AS faturamento, COALESCE(AVG(total),0) AS ticket_medio
        FROM pedidos WHERE criado_em >= ?
    ");
    $stmt->execute([$desde]);
    $resumo = $stmt->fetch();

    $stmt = $pdo->prepare("SELECT AVG(avaliacao) AS media, COUNT(*) AS total FROM relatorios WHERE data_relatorio >= ?");
    $stmt->execute([$desde]);
    $avaliacoes = $stmt->fetch();

    $stmt = $pdo->prepare("
        SELECT DATE(criado_em) AS dia, SUM(total) AS total, COUNT(*) AS pedidos
        FROM pedidos WHERE criado_em >= ?
        GROUP BY DATE(criado_em) ORDER BY dia
    ");
    $stmt->execute([$desde]);
    $porDia = $stmt->fetchAll();

    $stmt = $pdo->prepare("
        SELECT p.id, p.nome, p.categoria, SUM(pi.quantidade) AS qtd, SUM(pi.quantidade * pi.preco_unitario) AS receita
        FROM pedido_itens pi
        JOIN produtos p ON p.id = pi.produto_id
        JOIN pedidos pe ON pe.id = pi.pedido_id
        WHERE pe.criado_em >= ?
        GROUP BY p.id, p.nome, p.categoria
        ORDER BY qtd DESC
        LIMIT 8
    ");
    $stmt->execute([$desde]);
    $topProdutos = $stmt->fetchAll();

    $stmt = $pdo->prepare("
        SELECT p.categoria, SUM(pi.quantidade * pi.preco_unitario) AS receita
        FROM pedido_itens pi
        JOIN produtos p ON p.id = pi.produto_id
        JOIN pedidos pe ON pe.id = pi.pedido_id
        WHERE pe.criado_em >= ?
        GROUP BY p.categoria
        ORDER BY receita DESC
    ");
    $stmt->execute([$desde]);
    $porCategoria = $stmt->fetchAll();

    $stmt = $pdo->prepare("
        SELECT forma_pagamento, COUNT(*) AS qtd, SUM(total) AS receita
        FROM pedidos WHERE criado_em >= ?
        GROUP BY forma_pagamento
        ORDER BY qtd DESC
    ");
    $stmt->execute([$desde]);
    $porPagamento = $stmt->fetchAll();

    return [
        'periodo' => $periodo,
        'resumo' => [
            'total_pedidos' => (int)$resumo['total_pedidos'],
            'faturamento' => (float)$resumo['faturamento'],
            'ticket_medio' => (float)$resumo['ticket_medio'],
            'avaliacao_media' => $avaliacoes['media'] !== null ? round((float)$avaliacoes['media'], 1) : null,
            'avaliacoes_total' => (int)$avaliacoes['total'],
        ],
        'porDia' => array_map(fn($r) => ['dia' => $r['dia'], 'total' => (float)$r['total'], 'pedidos' => (int)$r['pedidos']], $porDia),
        'topProdutos' => array_map(fn($r) => ['id' => (int)$r['id'], 'nome' => $r['nome'], 'categoria' => $r['categoria'], 'qtd' => (int)$r['qtd'], 'receita' => (float)$r['receita']], $topProdutos),
        'porCategoria' => array_map(fn($r) => ['categoria' => $r['categoria'], 'receita' => (float)$r['receita']], $porCategoria),
        'porPagamento' => array_map(fn($r) => ['forma' => $r['forma_pagamento'], 'qtd' => (int)$r['qtd'], 'receita' => (float)$r['receita']], $porPagamento),
    ];
}

// Primeira letra maiúscula, sem depender da extensão mbstring estar habilitada.
function first_letter_upper(string $text): string {
    if ($text === '') return '?';
    if (function_exists('mb_strtoupper')) {
        return mb_strtoupper(mb_substr($text, 0, 1));
    }
    return strtoupper(substr($text, 0, 1));
}

// Trunca texto a um número máximo de caracteres, sem depender da extensão mbstring.
function safe_truncate(string $text, int $maxChars): string {
    if (function_exists('mb_strlen')) {
        return mb_strlen($text) > $maxChars ? mb_substr($text, 0, $maxChars) : $text;
    }
    return strlen($text) > $maxChars ? substr($text, 0, $maxChars) : $text;
}

// ---- Conversão para o formato que o front-end (data.js/main.js/admin.js) já espera ----

function to_js_produto(array $row, array $extraIds = []): array {
    $ingredientes = [];
    if (!empty($row['ingredientes'])) {
        $ingredientes = array_values(array_filter(array_map('trim', explode(',', $row['ingredientes']))));
    }
    return [
        'id' => (int)$row['id'],
        'name' => $row['nome'],
        'category' => $row['categoria'],
        'price' => (float)$row['preco'],
        'description' => $row['descricao'] ?? '',
        'ingredients' => $ingredientes,
        'extraIds' => array_values($extraIds), // chaves dos extras (ex: "queijo") permitidos pra esse produto
        'image' => $row['imagem'],
        'tag' => $row['tag'],
        'featured' => (bool)$row['destaque'],
        'available' => (bool)$row['disponivel'],
    ];
}

// Monta PRODUCTS já com os extraIds de cada item anexados — usar isso em vez de
// `array_map('to_js_produto', $produtos)` sempre que o cardápio for exibido/editado.
function produtos_para_js(array $produtos, array $extrasMap): array {
    return array_map(fn($p) => to_js_produto($p, $extrasMap[$p['id']] ?? []), $produtos);
}

function to_js_extra(array $row): array {
    return ['id' => $row['chave'], 'name' => $row['nome'], 'price' => (float)$row['preco']];
}

// Versão pro admin: inclui o id numérico real (a versão do cliente usa a "chave" como id).
function to_js_extra_admin(array $row): array {
    return ['id' => (int)$row['id'], 'chave' => $row['chave'], 'name' => $row['nome'], 'price' => (float)$row['preco']];
}

function to_js_mesa(array $row): array {
    return ['numero' => (int)$row['numero'], 'status' => $row['status']];
}

function to_js_chamado(array $row): array {
    return [
        'id' => (int)$row['id'],
        'mesa' => (int)$row['mesa_numero'],
        'status' => $row['status'],
        'criado_em' => $row['criado_em'],
    ];
}

// Formato enxuto do pedido pro cliente acompanhar o status (pages/status.php / api/pedido_mesa.php).
function to_js_pedido_status(array $pedido): array {
    return [
        'id' => (int)$pedido['id'],
        'mesa' => (int)$pedido['mesa_numero'],
        'status' => $pedido['status'],
        'forma_pagamento' => $pedido['forma_pagamento'],
        'subtotal' => (float)$pedido['subtotal'],
        'taxa_servico' => (float)$pedido['taxa_servico'],
        'total' => (float)$pedido['total'],
        'dividir_pessoas' => (int)$pedido['dividir_pessoas'],
        'criado_em' => $pedido['criado_em'],
        'itens' => array_map(function ($it) {
            return [
                'nome' => $it['produto_nome'],
                'imagem' => $it['produto_imagem'],
                'quantidade' => (int)$it['quantidade'],
                'preco_unitario' => (float)$it['preco_unitario'],
                'ingredientes_removidos' => $it['ingredientes_removidos'],
                'observacoes' => $it['observacoes'],
            ];
        }, $pedido['itens']),
    ];
}

// Gera um <script> JSON seguro (escapa < > pra não fechar a tag por acidente).
// Usa "var" (não "const") de propósito: os arquivos JS compartilhados (data.js, main.js,
// admin-data.js) têm guardas tipo `if (typeof X === "undefined") { var X = []; }` pra
// funcionar em páginas que não injetam a variável — e misturar "const" com "var" pro
// mesmo nome no escopo global é SyntaxError em JS, mesmo dentro de um "if" que nunca roda.
function json_script(string $varName, $value): string {
    $json = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG);
    return "<script>var {$varName} = {$json};</script>";
}

const CATEGORIAS_VALIDAS = ['entradas', 'principais', 'bebidas', 'sobremesas'];

// Recebe "Cebola, Alho ,, Queijo" (ou já um array) e devolve "Cebola,Alho,Queijo" pronto pra salvar.
function normalizar_ingredientes($input): string {
    if (is_array($input)) {
        $partes = $input;
    } else {
        $partes = explode(',', (string)$input);
    }
    $partes = array_map('trim', $partes);
    $partes = array_filter($partes, fn($p) => $p !== '');
    return implode(',', $partes);
}
