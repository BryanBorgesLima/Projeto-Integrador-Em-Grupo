<?php
require_once __DIR__ . '/../php/functions.php';
$produtos = get_produtos($pdo);
$extras = get_extras($pdo);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Meu carrinho · Sapori di Luna</title>
  <link rel="stylesheet" href="../css/style.css" />
</head>
<body data-page="carrinho">
  <header class="site-header">
    <div class="container header-inner">
      <a href="menu.php" class="brand">
        <span class="brand-mark">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12 3a9 9 0 1 0 8.94 10.06A7 7 0 0 1 12 3z"/></svg>
        </span>
        <span class="brand-name">Sapori di Luna</span>
      </a>
      <div class="search-box">
        <input type="search" id="searchInput" placeholder="Buscar produto..." />
      </div>
      <nav class="main-nav">
        <a href="menu.php">Menu</a>
        <a href="carrinho.php" class="cart-link">Carrinho <span class="cart-badge" id="cartBadge">0</span></a>
        <a href="sobre.php">Sobre nós</a>
      </nav>
    </div>
  </header>

  <div class="container">
    <a href="menu.php" class="back-link">‹ Voltar</a>
    <h1 class="page-title">Meu carrinho</h1>

    <div id="cartEmpty" class="empty-cart" style="display:none;">
      <p>Seu carrinho está vazio.</p>
      <a href="menu.php" class="btn btn-outline">Ver cardápio</a>
    </div>

    <div class="cart-layout">
      <div id="cartList"></div>

      <div class="summary-card" id="cartSummary">
        <h3>Resumo do pedido</h3>
        <div class="summary-row"><span>Subtotal</span><span id="cartSubtotal">R$ 0,00</span></div>
        <div class="summary-row"><span>Taxa de entrega</span><span>Grátis</span></div>
        <div class="summary-row total"><span>Total geral</span><span id="cartTotal">R$ 0,00</span></div>
        <a href="finalizacao.php" class="btn btn-dark btn-block">Finalizar compra</a>
        <a href="menu.php" class="btn btn-outline btn-block" style="margin-top:10px;">Voltar à loja</a>
      </div>
    </div>
  </div>

  <footer class="site-footer">Sapori di Luna · <a href="../admin.html" style="color:inherit;">Acesso do funcionário</a></footer>

  <?php echo json_script('PRODUCTS', array_map('to_js_produto', $produtos)); ?>
  <?php echo json_script('EXTRAS', array_map('to_js_extra', $extras)); ?>
  <script src="../js/data.js"></script>
  <script src="../js/cart.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
