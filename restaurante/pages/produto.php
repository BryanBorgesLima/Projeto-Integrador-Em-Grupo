<?php
require_once __DIR__ . '/../php/functions.php';
$produtos = get_produtos($pdo); // inclui indisponíveis, pra não quebrar links salvos
$extras = get_extras($pdo);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Produto · Sapori di Luna</title>
  <link rel="stylesheet" href="../css/style.css" />
</head>
<body data-page="produto">
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
    <div class="breadcrumb">
      <a href="menu.php">Home</a> &nbsp;›&nbsp; <a href="menu.php">Todos os produtos</a> &nbsp;›&nbsp; Produto
    </div>

    <div class="product-detail">
      <div class="detail-image" id="productMedia"></div>

      <div class="detail-info">
        <div class="badges">
          <span class="badge">Força e energia</span>
          <span class="badge badge-alt">Destaque da semana</span>
        </div>
        <h1 id="productName">Produto</h1>
        <div class="kind" id="productCategory">categoria</div>
        <div class="rating">4,6 de 5 <span class="count">· 2000+ avaliações</span></div>
        <p class="detail-desc" id="productDesc"></p>

        <div class="options" id="productOptions"></div>

        <div class="qty-row">
          <div>
            <div class="qty-label">QUANTIDADE</div>
            <div class="qty-control">
              <button id="qtyMinus">−</button>
              <span id="qtyValue">1</span>
              <button id="qtyPlus">+</button>
            </div>
          </div>
          <div style="text-align:right;">
            <div class="qty-label">PREÇO FINAL</div>
            <div class="detail-price" id="productPrice">R$ 0,00</div>
          </div>
        </div>

        <button class="btn btn-green btn-block" id="addToCartBtn">Adicionar à sacola</button>
      </div>
    </div>

    <div class="section-head">
      <h2>Produtos relacionados</h2>
    </div>
    <div class="related-grid" id="relatedGrid"></div>
  </div>

  <footer class="site-footer">Sapori di Luna · <a href="../admin.html" style="color:inherit;">Acesso do funcionário</a></footer>

  <?php echo json_script('PRODUCTS', array_map('to_js_produto', $produtos)); ?>
  <?php echo json_script('EXTRAS', array_map('to_js_extra', $extras)); ?>
  <script src="../js/data.js"></script>
  <script src="../js/cart.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
