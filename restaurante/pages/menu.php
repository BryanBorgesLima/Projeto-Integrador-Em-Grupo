<?php
require_once __DIR__ . '/../php/functions.php';
$produtos = get_produtos($pdo, true); // só os disponíveis
$extras = get_extras($pdo);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Menu · Sapori di Luna</title>
  <link rel="stylesheet" href="../css/style.css" />
</head>
<body data-page="menu">
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
    <div class="hero-banner">
      <div>
        <h1>Sabor de verdade, feito na hora</h1>
        <p>Escolha seus pratos favoritos e peça em poucos toques, direto da nossa cozinha para sua mesa.</p>
      </div>
      <div class="hero-moon">
        <svg viewBox="0 0 24 24" width="84" height="84" fill="currentColor" aria-hidden="true"><path d="M12 3a9 9 0 1 0 8.94 10.06A7 7 0 0 1 12 3z"/></svg>
      </div>
    </div>

    <div class="section-head">
      <h2>Faça seu pedido aqui ⟶</h2>
      <div class="tabs">
        <button class="tab" data-category="entradas">Entradas</button>
        <button class="tab" data-category="salgados">Salgados</button>
        <button class="tab" data-category="bebidas">Bebidas</button>
        <button class="tab" data-category="sobremesas">Sobremesas</button>
      </div>
    </div>

    <div class="product-grid" id="productGrid"></div>

    <div class="featured-section">
      <div class="section-head" style="margin-top:0;">
        <h2>Mais pedidos</h2>
        <a href="#productGrid" style="font-size:13px;font-weight:700;">Ver todos →</a>
      </div>
      <p class="sub">Os pratos favoritos de quem já provou.</p>
      <div class="featured-list" id="featuredList"></div>
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
