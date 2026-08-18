<?php
require_once __DIR__ . '/../php/functions.php';

$loggedIn = is_logged_in();
$produtos = $mesas = $relatorios = [];
$config = ['nome_restaurante' => '', 'email_contato' => '', 'horario_funcionamento' => ''];

if ($loggedIn) {
    $produtos = get_produtos($pdo);
    $mesas = get_mesas_com_pedidos($pdo);
    $relatorios = get_relatorios($pdo);
    $config = get_configuracoes($pdo);
}

$gestorNome = $_SESSION['funcionario_nome'] ?? '';
$iniciais = first_letter_upper($gestorNome);
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Painel Admin · Sapori di Luna</title>
  <link rel="stylesheet" href="../css/admin.css" />
</head>
<body>

<?php if (!$loggedIn): ?>

  <!-- ===== Login ===== -->
  <div class="admin-login" id="loginScreen">
    <div class="login-card">
      <div class="login-logo">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="9" cy="9" r="1.6"></circle><path d="M21 15l-5.2-5.2a2 2 0 0 0-2.8 0L5 18"></path></svg>
      </div>
      <h1>Acesso do funcionário</h1>
      <form id="loginForm">
        <div class="a-field">
          <label for="loginEmail">Email</label>
          <input type="email" id="loginEmail" placeholder="nome@saporidiluna.com" required />
        </div>
        <div class="a-field">
          <label for="loginPassword">Senha</label>
          <div class="password-wrap">
            <input type="password" id="loginPassword" placeholder="••••••••" required />
            <button type="button" class="toggle-pw" id="togglePw">Mostrar</button>
          </div>
        </div>
        <button type="submit" class="a-btn">Entrar</button>
      </form>
      <button class="a-link" id="forgotPw">Esqueci minha senha</button>
      <a href="../index.html" class="back-to-site">‹ Voltar ao site</a>
    </div>
  </div>

<?php else: ?>

  <!-- ===== Dashboard ===== -->
  <div class="admin-shell active" id="adminShell">
    <aside class="sidebar">
      <div class="sidebar-top">
        <span>PAINEL ADMIN</span>
        <button class="sidebar-close" id="sidebarClose" title="Sair">✕</button>
      </div>
      <div class="gestor">
        <div class="gestor-avatar"><?php echo htmlspecialchars($iniciais); ?></div>
        <div class="gestor-name"><?php echo htmlspecialchars($gestorNome); ?></div>
        <div class="gestor-underline"></div>
      </div>
      <nav class="side-nav">
        <button data-section="mesas" class="active">Pedidos e mesas</button>
        <button data-section="cardapio">Cardápio</button>
        <button data-section="relatorio">Relatório</button>
        <button data-section="config">Configurações</button>
      </nav>
    </aside>

    <main class="admin-main">
      <div class="admin-topbar">
        <h2 id="sectionTitle">Pedidos e mesas</h2>
        <div class="topbar-right">
          <div class="topbar-avatar"><?php echo htmlspecialchars($iniciais); ?></div>
          <button class="logout-link" id="logoutBtn">Sair</button>
        </div>
      </div>

      <div class="admin-content">
        <!-- Pedidos & Mesas (unificado) -->
        <section class="admin-section active" id="section-mesas">
          <div class="a-controls">
            <input type="text" class="a-search" id="tableSearch" placeholder="Número da mesa" />
            <button class="a-pill active" data-filter="todas">Todas</button>
            <button class="a-pill" data-filter="livre">Disponíveis</button>
            <button class="a-pill" data-filter="reservado">Reservadas</button>
            <button class="a-pill" data-filter="ocupado">Ocupadas</button>
          </div>
          <div class="tables-grid" id="tablesGrid"></div>
        </section>

        <!-- Cardápio -->
        <section class="admin-section" id="section-cardapio">
          <div class="a-tabs">
            <button class="a-tab active" data-tab="itens">Itens</button>
            <button class="a-tab" data-tab="midia">Mídia</button>
          </div>

          <div id="cardapioItens" class="cardapio-layout">
            <div class="menu-grid" id="menuGrid"></div>
            <div class="quick-settings">
              <h3>Configurações rápidas</h3>
              <p>As alterações de disponibilidade já salvam sozinhas no banco.</p>
              <button class="a-btn" id="saveMenuBtn">Salvar</button>
            </div>
          </div>

          <div id="cardapioMidia" style="display:none;">
            <div class="media-grid" id="mediaPhotos"></div>
            <div class="media-videos" id="mediaVideos"></div>
          </div>
        </section>

        <!-- Relatório -->
        <section class="admin-section" id="section-relatorio">
          <div class="report-layout">
            <div>
              <div class="a-controls">
                <input type="text" class="a-search" id="reportSearch" placeholder="Busca" />
              </div>
              <div class="reports-grid" id="reportsGrid"></div>
            </div>
            <div class="calendar-card">
              <div class="calendar-head">
                <button id="calPrev">‹</button>
                <span id="calLabel">Mês</span>
                <button id="calNext">›</button>
              </div>
              <div class="calendar-grid" id="calendarGrid"></div>
            </div>
          </div>
        </section>

        <!-- Configurações -->
        <section class="admin-section" id="section-config">
          <div class="settings-card">
            <div class="a-field">
              <label for="cfgNome">Nome do restaurante</label>
              <input type="text" id="cfgNome" value="<?php echo htmlspecialchars($config['nome_restaurante']); ?>" />
            </div>
            <div class="a-field">
              <label for="cfgEmail">Email de contato</label>
              <input type="email" id="cfgEmail" value="<?php echo htmlspecialchars($config['email_contato']); ?>" />
            </div>
            <div class="a-field">
              <label for="cfgHorario">Horário de funcionamento</label>
              <input type="text" id="cfgHorario" value="<?php echo htmlspecialchars($config['horario_funcionamento']); ?>" />
            </div>
            <div class="settings-actions">
              <button class="a-btn" id="saveConfigBtn" style="width:auto;">Salvar alterações</button>
              <button class="a-btn a-btn-outline" id="logoutBtn2" style="width:auto;">Sair</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>

  <!-- Painel lateral de detalhe do pedido -->
  <div class="overlay" id="orderOverlay"></div>
  <div class="order-panel" id="orderPanel">
    <div class="order-panel-head">
      <h3 id="orderPanelTitle">Pedido</h3>
      <button class="order-panel-close" id="orderPanelClose">✕</button>
    </div>
    <div class="order-panel-body" id="orderPanelBody"></div>
  </div>

  <?php echo json_script('PRODUCTS', array_map('to_js_produto', $produtos)); ?>
  <?php echo json_script('TABLES', $mesas); ?>
  <?php echo json_script('REPORTS', $relatorios); ?>

<?php endif; ?>

  <script src="../js/data.js"></script>
  <script src="../js/admin-data.js"></script>
  <script src="../js/admin.js"></script>
</body>
</html>
