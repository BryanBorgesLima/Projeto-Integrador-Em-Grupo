<?php
require_once __DIR__ . '/../php/functions.php';
$config = get_configuracoes($pdo);
$mesas = get_mesas($pdo);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sobre nós · Trattoria Liedlke</title>
  <link rel="stylesheet" href="../css/style.css" />
</head>
<body data-page="sobre">
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
      </div>
    </div>
  </header>

  <div class="container">
    <div class="about-hero">
      <div>
        <h1>Sonhar nunca é demais</h1>
        <p>Nossa jornada começou em uma pequena cozinha familiar, onde a paixão pela gastronomia italiana e o desejo de servir receitas bem-feitas nos impulsionaram. Hoje mantemos o mesmo cuidado: ingredientes selecionados e pratos preparados com atenção, do jeito que a casa gosta.</p>
        <a href="mailto:<?php echo htmlspecialchars($config['email_contato']); ?>?subject=Reserva" class="btn btn-outline">Fazer uma reserva</a>
      </div>
      <div class="placeholder-img">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2"/><path d="M9 11v11"/><path d="M17 2c-1.5 0-3 1.5-3 4v3.5c0 1 .5 1.5 1.5 1.5H17"/><path d="M17 2v20"/></svg>
      </div>
    </div>

    <div class="about-section">
      <h2>Nossa equipe</h2>
      <div class="team-grid">
        <div class="team-card">
          <div class="team-avatar" aria-hidden="true">BL</div>
          <h4>Bryan Lima</h4>
          <div class="role">PHP</div>
          <p class="bio">Fez o back-end: as páginas dinâmicas, a API de pedidos e o login do painel admin.</p>
        </div>
        <div class="team-card">
          <div class="team-avatar" aria-hidden="true">PM</div>
          <h4>Pedro Melo</h4>
          <div class="role">JS</div>
          <p class="bio">Deu vida ao cardápio: carrinho, personalização dos pratos e atualização do status em tempo real.</p>
        </div>
        <div class="team-card">
          <div class="team-avatar" aria-hidden="true">JS</div>
          <h4>João Santos</h4>
          <div class="role">SQL</div>
          <p class="bio">Modelou o banco de dados: cardápio, mesas, pedidos e os relatórios de vendas.</p>
        </div>
        <div class="team-card">
          <div class="team-avatar" aria-hidden="true">KB</div>
          <h4>Kauan Beraguas</h4>
          <div class="role">HTML</div>
          <p class="bio">Estruturou as telas do site e do painel, do cardápio ao checkout.</p>
        </div>
        <div class="team-card">
          <div class="team-avatar" aria-hidden="true">RL</div>
          <h4>Roger Liedlke</h4>
          <div class="role">CSS</div>
          <p class="bio">Cuidou do visual: cores, layout e a adaptação de todas as telas para o celular.</p>
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
        <h4><?php echo htmlspecialchars($config['nome_restaurante']); ?></h4>
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

  <footer class="site-footer"><?php echo htmlspecialchars($config['nome_restaurante']); ?> · <a href="menu.php" style="color:inherit;">Cardápio</a> · <a href="../admin.html" style="color:inherit;">Acesso do funcionário</a></footer>

  <?php echo json_script('MESAS', array_map('to_js_mesa', $mesas)); ?>
  <script>if (typeof PRODUCTS === "undefined") { var PRODUCTS = []; } if (typeof EXTRAS === "undefined") { var EXTRAS = []; }</script>
  <script src="../js/data.js"></script>
  <script src="../js/cart.js"></script>
  <script src="../js/main.js"></script>
</body>
</html>
