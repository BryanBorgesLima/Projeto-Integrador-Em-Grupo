<?php
require_once __DIR__ . '/../php/functions.php';
$mesas = get_mesas($pdo);
$config = get_configuracoes($pdo);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Status do Pedido · Trattoria Liedlke</title>
  <link rel="stylesheet" href="../css/style.css" />
</head>
<body data-page="status">
  <header class="site-header">
    <div class="container header-inner">
      <a href="menu.php" class="brand">
        <span class="brand-mark">
          <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2"/><path d="M9 11v11"/><path d="M17 2c-1.5 0-3 1.5-3 4v3.5c0 1 .5 1.5 1.5 1.5H17"/><path d="M17 2v20"/></svg>
        </span>
        <span class="brand-text">
          <span class="brand-name"><?php echo htmlspecialchars($config['nome_restaurante']); ?></span>
          <span class="brand-sub"><?php echo htmlspecialchars($config['subtitulo'] ?? 'Trattoria Moderna'); ?></span>
        </span>
      </a>
      <div class="header-actions">
        <button class="mesa-badge" data-open-mesa-modal>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          <span class="label">Mesa</span>
        </button>
        <button class="waiter-btn" data-call-waiter>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="label">Chamar Garçom</span>
        </button>
      </div>
    </div>
  </header>

  <div class="container" style="max-width:720px;">
    <a href="menu.php" class="back-link">‹ Voltar ao cardápio</a>
    <h1 class="page-title">Status do Pedido</h1>
    <div id="trackerWrap"></div>
  </div>

  <footer class="site-footer"><?php echo htmlspecialchars($config['nome_restaurante']); ?> · <a href="sobre.php" style="color:inherit;">Sobre nós</a> · <a href="../admin.html" style="color:inherit;">Acesso do funcionário</a></footer>

  <script>if (typeof PRODUCTS === "undefined") { var PRODUCTS = []; } if (typeof EXTRAS === "undefined") { var EXTRAS = []; }</script>
  <?php echo json_script('MESAS', array_map('to_js_mesa', $mesas)); ?>
  <script src="../js/data.js"></script>
  <script src="../js/cart.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
