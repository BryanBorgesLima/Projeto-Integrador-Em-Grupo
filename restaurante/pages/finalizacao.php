<?php
require_once __DIR__ . '/../php/functions.php';
$produtos = get_produtos($pdo);
$extras = get_extras($pdo);
$mesas = get_mesas($pdo);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Finalização · Sapori di Luna</title>
  <link rel="stylesheet" href="../css/style.css" />
</head>
<body data-page="finalizacao">
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
    <a href="carrinho.php" class="back-link">‹ Voltar</a>
    <h1 class="page-title">Finalização</h1>

    <div id="checkoutMain">
      <p style="color:var(--muted);margin-top:-16px;margin-bottom:24px;">
        Confira seu pedido e escolha a forma de pagamento e a mesa.
      </p>
      <div class="checkout-layout">
        <div class="form-card">
          <h3>Itens do pedido</h3>
          <div id="orderLines"></div>
          <div class="summary-row" style="margin-top:6px;"><span>Subtotal</span><span id="checkoutSubtotal">R$ 0,00</span></div>
          <div class="summary-row"><span>Taxa de entrega</span><span>Grátis</span></div>
          <div class="summary-row total"><span>Total geral</span><span id="checkoutTotal">R$ 0,00</span></div>
        </div>

        <form class="form-card" id="checkoutForm">
          <h3>Detalhes do pagamento</h3>
          <p class="sub">Escolha a forma de pagamento e o número da mesa.</p>
          <div class="field">
            <label>Forma de pagamento</label>
            <div class="options" id="paymentOptions"></div>
          </div>
          <div class="field">
            <label for="numeroMesa">Nº da mesa</label>
            <select id="numeroMesa">
              <option value="">Selecione a mesa</option>
              <?php foreach ($mesas as $mesa): if ($mesa['status'] !== 'livre') continue; ?>
                <option value="<?php echo (int)$mesa['numero']; ?>">Mesa <?php echo (int)$mesa['numero']; ?></option>
              <?php endforeach; ?>
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Finalizar Compra</button>
        </form>
      </div>
    </div>

    <div class="success-panel form-card" id="successPanel" style="display:none;max-width:480px;margin:20px auto;">
      <h3>Pedido realizado com sucesso!</h3>
      <p>Sua mesa: <strong class="order-table"></strong><br />Forma de pagamento: <strong class="order-payment"></strong></p>
      <p style="color:var(--muted);">Seu pedido já está sendo preparado.</p>
      <a href="menu.php" class="btn btn-green" style="margin-top:10px;">Voltar ao cardápio</a>
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
