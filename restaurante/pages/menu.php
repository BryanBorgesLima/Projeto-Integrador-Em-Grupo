<?php
require_once __DIR__ . '/../php/functions.php';
$produtos = get_produtos($pdo, true); // só os disponíveis
$extras = get_extras($pdo);
$extrasMap = get_produto_extras_map($pdo);
$mesas = get_mesas($pdo);
$config = get_configuracoes($pdo);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cardápio · Trattoria Liedlke</title>
  <link rel="stylesheet" href="../css/style.css" />
</head>
<body data-page="menu">
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
        <a href="status.php" class="status-btn" id="statusBtn" style="display:none;">
          <span class="status-dot-indicator" id="statusDotIndicator"></span>
          <span class="label">Status do Pedido</span>
        </a>
        <a href="carrinho.php" class="cart-link-mobile">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
          <span class="cart-badge" id="cartBadge">0</span>
        </a>
      </div>
    </div>
  </header>

  <div class="container">
    <div class="order-shell">
      <nav class="category-nav" id="categoryNav"></nav>

      <main class="menu-main">
        <nav class="category-nav-mobile" id="categoryNavMobile"></nav>
        <h1 class="section-title" id="sectionTitle">Cardápio</h1>
        <div class="product-grid" id="productGrid"></div>
      </main>

      <aside class="order-panel" id="orderPanel">
        <div class="order-panel-top">
          <h3>Seu Pedido</h3>
          <span class="order-mesa-tag">Mesa --</span>
        </div>

        <div class="order-empty" id="orderEmpty">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
          <p>Seu pedido está vazio.<br>Toque em um prato para começar.</p>
        </div>

        <div class="order-lines" id="orderLines"></div>
        <div class="order-totals" id="orderTotals"></div>

        <a href="finalizacao.php" class="btn btn-primary btn-block" id="goToPaymentBtn">Ir para Pagamento</a>
        <a href="carrinho.php" class="view-cart-link">Ver pedido completo</a>
      </aside>
    </div>
  </div>

  <div class="mobile-order-bar" id="mobileOrderBar" onclick="window.location.href='carrinho.php'"></div>

  <footer class="site-footer"><?php echo htmlspecialchars($config['nome_restaurante']); ?> · <a href="sobre.php" style="color:inherit;">Sobre nós</a> · <a href="../admin.html" style="color:inherit;">Acesso do funcionário</a></footer>

  <?php echo json_script('PRODUCTS', produtos_para_js($produtos, $extrasMap)); ?>
  <?php echo json_script('EXTRAS', array_map('to_js_extra', $extras)); ?>
  <?php echo json_script('MESAS', array_map('to_js_mesa', $mesas)); ?>
  <script>var SERVICE_FEE_PERCENT = <?php echo (float)$config['taxa_servico_percentual']; ?>;</script>
  <script src="../js/data.js"></script>
  <script src="../js/cart.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
