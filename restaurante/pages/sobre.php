<?php
require_once __DIR__ . '/../php/functions.php';
$config = get_configuracoes($pdo);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sobre nós · Sapori di Luna</title>
  <link rel="stylesheet" href="../css/style.css" />
</head>
<body data-page="sobre">
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
    <div class="about-hero">
      <div>
        <h1>Sonhar nunca é demais</h1>
        <p>Nossa jornada começou em uma pequena cozinha familiar, onde a paixão pela gastronomia e o desejo de servir receitas bem-feitas nos impulsionaram. Hoje mantemos o mesmo cuidado: ingredientes selecionados e pratos preparados com atenção, do jeito que a casa gosta.</p>
        <a href="mailto:<?php echo htmlspecialchars($config['email_contato']); ?>?subject=Reserva" class="btn btn-outline">Fazer uma reserva</a>
      </div>
      <div class="placeholder-img">
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="9" cy="9" r="1.6"></circle><path d="M21 15l-5.2-5.2a2 2 0 0 0-2.8 0L5 18"></path></svg>
      </div>
    </div>

    <div class="about-section">
      <h2>Nossa equipe</h2>
      <div class="team-grid">
        <div class="team-card">
          <div class="team-avatar">MF</div>
          <h4>Marco Ferreira</h4>
          <div class="role">Chef executivo</div>
          <p class="bio">Cuida do cardápio e da cozinha no dia a dia, sempre testando novas combinações antes de colocá-las na mesa dos clientes.</p>
        </div>
        <div class="team-card">
          <div class="team-avatar">BR</div>
          <h4>Bianca Rossi</h4>
          <div class="role">Atendimento e sala</div>
          <p class="bio">Responsável por receber quem chega e garantir que a experiência à mesa seja tranquila do início ao fim.</p>
        </div>
        <div class="team-card">
          <div class="team-avatar">DA</div>
          <h4>Diego Almeida</h4>
          <div class="role">Gestão e compras</div>
          <p class="bio">Cuida dos fornecedores e da qualidade dos ingredientes que chegam na cozinha todos os dias.</p>
        </div>
      </div>
    </div>

    <div class="about-section">
      <h2>Prêmios e reconhecimento</h2>
      <div class="awards-grid">
        <div class="award-card">
          <div class="star">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z"/></svg>
          </div>
          <h4>Prato do ano</h4>
          <p>Guia Sabor Local, reconhecido pela originalidade do cardápio.</p>
        </div>
        <div class="award-card">
          <div class="star">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z"/></svg>
          </div>
          <h4>Melhor atendimento</h4>
          <p>Prêmio Hospitalidade, avaliação máxima em experiência do cliente.</p>
        </div>
        <div class="award-card">
          <div class="star">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z"/></svg>
          </div>
          <h4>Selo de qualidade</h4>
          <p>Associação de Restaurantes, padrão de preparo e higiene.</p>
        </div>
        <div class="award-card">
          <div class="star">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z"/></svg>
          </div>
          <h4>Favorito da crítica</h4>
          <p>Coluna gastronômica local, destaque no último ano.</p>
        </div>
      </div>
    </div>

    <div class="about-footer">
      <div>
        <h4>Sapori di Luna</h4>
        <div class="foot-line">Rua das Estrelas, 128 · Centro</div>
        <div class="foot-line"><?php echo htmlspecialchars($config['email_contato']); ?></div>
        <div class="hours">
          <strong>Horário de funcionamento</strong><br />
          <?php echo htmlspecialchars($config['horario_funcionamento']); ?>
        </div>
      </div>
      <div class="map-box">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="9" cy="9" r="1.6"></circle><path d="M21 15l-5.2-5.2a2 2 0 0 0-2.8 0L5 18"></path></svg>
      </div>
    </div>
  </div>

  <footer class="site-footer">Sapori di Luna · <a href="../admin.html" style="color:inherit;">Acesso do funcionário</a></footer>

  <script src="../js/data.js"></script>
  <script src="../js/cart.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
