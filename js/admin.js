const SECTION_TITLES = {
  mesas: "Pedidos e mesas",
  cardapio: "Cardápio",
  relatorio: "Relatório",
  config: "Configurações"
};

const PLAY_ICON_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;

let tableFilter = "todas";

let tableSearchTerm = "";

let calendarMonthOffset = 0;

let selectedReportDate = null;

document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  if (!Store.isLoggedIn()) {
    return;
  }
  loadAdminGlobals();
  const loginScreen = document.getElementById("loginScreen");
  const adminShell = document.getElementById("adminShell");
  if (loginScreen) loginScreen.style.display = "none";
  if (adminShell) adminShell.classList.add("active");
  initSidebarNav();
  initLogout();
  initMesasSection();
  initWaiterCallsWidget();
  initCardapioSection();
  initRelatorioSection();
  initConfigSection();
  initOrderPanel();
});

function loadAdminGlobals() {
  const extrasMap = Store.getProdutoExtrasMap();
  window.PRODUCTS = Store.produtosParaJs(Store.getProdutos(), extrasMap);
  window.EXTRAS_ADMIN = Store.getExtras().map(Store.toJsExtraAdmin);
  window.TABLES = Store.getMesasComPedidos();
  window.REPORTS = Store.getRelatorios();
  window.CHAMADOS = Store.getChamadosGarcom().map(Store.toJsChamado);
  window.DASHBOARD = Store.getRelatorioDashboard("30d");
  const session = Store.getSession();
  const nome = session ? session.nome : "";
  const iniciais = nome ? nome.trim().charAt(0).toUpperCase() : "?";
  document.querySelectorAll(".gestor-name").forEach(el => el.textContent = nome);
  document.querySelectorAll(".gestor-avatar, .topbar-avatar").forEach(el => el.textContent = iniciais);
  const cfg = Store.getConfiguracoes();
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };
  setVal("cfgNome", cfg.nome_restaurante);
  setVal("cfgSubtitulo", cfg.subtitulo || "");
  setVal("cfgEmail", cfg.email_contato);
  setVal("cfgHorario", cfg.horario_funcionamento);
  setVal("cfgTaxa", cfg.taxa_servico_percentual);
}

async function postJSON(url, body) {
  body = body || {};
  try {
    let data;
    if (url.endsWith("login.php")) data = await Store.login(body.email, body.senha); else if (url.endsWith("logout.php")) data = await Store.logout(); else if (url.endsWith("atualizar_mesa.php")) data = await Store.atualizarMesa(body.numero, body.status); else if (url.endsWith("atualizar_pedido.php")) data = await Store.atualizarPedido(body.pedido_id, body.status); else if (url.endsWith("atender_chamado.php")) data = await Store.atenderChamado(body.chamado_id); else if (url.endsWith("toggle_disponibilidade.php")) data = await Store.toggleDisponibilidade(body.produto_id); else if (url.endsWith("excluir_produto.php")) data = await Store.excluirProduto(body.id); else if (url.endsWith("excluir_extra.php")) data = await Store.excluirExtra(body.id); else if (url.endsWith("salvar_produto.php")) data = await Store.salvarProduto(body); else if (url.endsWith("salvar_extra.php")) data = await Store.salvarExtra(body); else if (url.endsWith("salvar_configuracoes.php")) data = await Store.salvarConfiguracoes(body); else if (url.endsWith("relatorio_dashboard.php")) data = await Store.relatorioDashboard(body.periodo); else throw new Error("Rota desconhecida: " + url);
    return data;
  } catch (err) {
    throw new Error(err && err.message || "Não foi possível completar a ação.");
  }
}

function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;
  const pwInput = document.getElementById("loginPassword");
  document.getElementById("togglePw").addEventListener("click", e => {
    pwInput.type = pwInput.type === "password" ? "text" : "password";
    e.target.textContent = pwInput.type === "password" ? "Mostrar" : "Ocultar";
  });
  document.getElementById("forgotPw").addEventListener("click", () => {
    showAdminToast("Fale com o administrador do sistema.");
  });
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginPassword").value;
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    try {
      await postJSON("../api/login.php", {
        email: email,
        senha: senha
      });
      window.location.reload();
    } catch (err) {
      showAdminToast(err.message);
      submitBtn.disabled = false;
    }
  });
}

function initLogout() {
  [ "sidebarClose", "logoutBtn", "logoutBtn2" ].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", async () => {
      try {
        await postJSON("../api/logout.php");
      } finally {
        window.location.reload();
      }
    });
  });
}

function initSidebarNav() {
  const buttons = document.querySelectorAll(".side-nav button");
  if (!buttons.length) return;
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const section = btn.dataset.section;
      document.querySelectorAll(".admin-section").forEach(s => s.classList.remove("active"));
      document.getElementById("section-" + section).classList.add("active");
      document.getElementById("sectionTitle").textContent = SECTION_TITLES[section];
    });
  });
}

function initMesasSection() {
  const grid = document.getElementById("tablesGrid");
  if (!grid) return;
  document.querySelectorAll("#section-mesas .a-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll("#section-mesas .a-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      tableFilter = pill.dataset.filter;
      renderTables();
    });
  });
  document.getElementById("tableSearch").addEventListener("input", e => {
    tableSearchTerm = e.target.value.trim();
    renderTables();
  });
  renderTables();
}

function statusLabel(status) {
  return {
    livre: "Livre",
    reservado: "Reservado",
    ocupado: "Ocupado"
  }[status] || status;
}

function renderTables() {
  const grid = document.getElementById("tablesGrid");
  let list = TABLES;
  if (tableFilter !== "todas") list = list.filter(t => t.status === tableFilter);
  if (tableSearchTerm) list = list.filter(t => String(t.numero).includes(tableSearchTerm));
  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML = `<p style="color:var(--a-muted);">Nenhuma mesa encontrada.</p>`;
    return;
  }
  list.forEach(table => {
    const order = table.status === "ocupado" ? table.pedido : null;
    const card = document.createElement("div");
    card.className = "table-card";
    card.innerHTML = `\n      <div class="table-card-top">\n        <strong>Mesa ${table.numero}</strong>\n        <span class="status-dot status-${table.status}">${statusLabel(table.status)}</span>\n      </div>\n      <div class="status-radios">\n        <label><input type="radio" name="status-${table.numero}" value="livre" ${table.status === "livre" ? "checked" : ""}/> Livre</label>\n        <label><input type="radio" name="status-${table.numero}" value="reservado" ${table.status === "reservado" ? "checked" : ""}/> Reservado</label>\n        <label><input type="radio" name="status-${table.numero}" value="ocupado" ${table.status === "ocupado" ? "checked" : ""}/> Ocupado</label>\n      </div>\n      ${order ? `<div class="order-preview">\n              <strong>${order.cliente_nome || "Cliente não informado"}</strong>\n              ${order.itens.length} ${order.itens.length === 1 ? "item" : "itens"} · ${formatPrice(order.total || order.subtotal)} · ${ORDER_STATUS_LABELS[order.status]}\n            </div>\n            <button class="a-btn" data-open-order="${table.numero}">Ver pedido</button>` : ""}\n    `;
    card.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener("change", async () => {
        const previous = table.status;
        try {
          await postJSON("../api/atualizar_mesa.php", {
            numero: table.numero,
            status: radio.value
          });
          table.status = radio.value;
        } catch (err) {
          showAdminToast(err.message);
          table.status = previous;
        }
        renderTables();
      });
    });
    const openBtn = card.querySelector("[data-open-order]");
    if (openBtn) openBtn.addEventListener("click", () => openOrderPanel(table.numero));
    grid.appendChild(card);
  });
}

function initOrderPanel() {
  const closeBtn = document.getElementById("orderPanelClose");
  if (!closeBtn) return;
  closeBtn.addEventListener("click", closeOrderPanel);
  document.getElementById("orderOverlay").addEventListener("click", closeOrderPanel);
}

function orderItemMeta(it) {
  const parts = [];
  if (it.ingredientes_removidos) parts.push("Sem " + it.ingredientes_removidos.split(",").join(", "));
  if (it.observacoes) parts.push("Obs: " + it.observacoes);
  return parts.join(" · ");
}

function openOrderPanel(numero) {
  const table = TABLES.find(t => t.numero === numero);
  const order = table && table.pedido;
  if (!order) return;
  document.getElementById("orderPanelTitle").textContent = `Pedido #${order.id}`;
  const body = document.getElementById("orderPanelBody");
  const itemsHTML = order.itens.map(it => {
    const meta = orderItemMeta(it);
    return `<div class="order-item-row">\n        <span>\n          <span class="qty">${it.quantidade}x</span>${it.produto_nome}\n          ${meta ? `<br><small style="color:var(--a-muted);">${meta}</small>` : ""}\n        </span>\n        <span>${formatPrice(it.preco_unitario * it.quantidade)}</span>\n      </div>`;
  }).join("");
  body.innerHTML = `\n    <div class="order-meta">\n      <div><span>Cliente</span>${order.cliente_nome || "Não informado"}</div>\n      <div><span>Mesa</span>Mesa ${order.mesa_numero}</div>\n      <div><span>Pagamento</span>${paymentLabel(order.forma_pagamento)}</div>\n      <div><span>Status atual</span>${ORDER_STATUS_LABELS[order.status]}</div>\n    </div>\n    <div class="order-items-list">${itemsHTML}</div>\n    <div class="order-total-row"><span>Total</span><span>${formatPrice(order.total || order.subtotal)}</span></div>\n    <div class="status-flow" id="statusFlow"></div>\n  `;
  const flow = document.getElementById("statusFlow");
  const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status);
  ORDER_STATUS_FLOW.forEach((status, idx) => {
    const step = document.createElement("button");
    step.type = "button";
    step.className = "status-step" + (idx <= currentIdx ? " done" : "");
    step.textContent = ORDER_STATUS_LABELS[status];
    step.addEventListener("click", async () => {
      try {
        await postJSON("../api/atualizar_pedido.php", {
          pedido_id: order.id,
          status: status
        });
        order.status = status;
        if (status === "entregue") {
          table.status = "livre";
          table.pedido = null;
          closeOrderPanel();
        } else {
          openOrderPanel(numero);
        }
        renderTables();
      } catch (err) {
        showAdminToast(err.message);
      }
    });
    flow.appendChild(step);
  });
  document.getElementById("orderOverlay").classList.add("active");
  document.getElementById("orderPanel").classList.add("active");
}

function closeOrderPanel() {
  document.getElementById("orderOverlay").classList.remove("active");
  document.getElementById("orderPanel").classList.remove("active");
}

function paymentLabel(id) {
  return {
    pix: "Pix (QR Code)",
    garcom: "Cartão com o garçom",
    balcao: "Balcão"
  }[id] || id;
}

function initWaiterCallsWidget() {
  const btn = document.getElementById("waiterCallsBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const panel = document.getElementById("waiterCallsPanel");
    panel.style.display = panel.style.display === "none" ? "flex" : "none";
  });
  renderWaiterCalls();
}

function renderWaiterCalls() {
  const btn = document.getElementById("waiterCallsBtn");
  const countEl = document.getElementById("waiterCallsCount");
  const panel = document.getElementById("waiterCallsPanel");
  if (!btn) return;
  const pendentes = CHAMADOS.filter(c => c.status === "pendente");
  if (pendentes.length === 0) {
    btn.style.display = "none";
    panel.style.display = "none";
    return;
  }
  btn.style.display = "flex";
  countEl.textContent = pendentes.length;
  panel.innerHTML = pendentes.map(c => `\n    <div class="waiter-call-row">\n      <span>🔔 Mesa ${c.mesa} pediu atendimento</span>\n      <button data-chamado="${c.id}">Atender</button>\n    </div>`).join("");
  panel.querySelectorAll("[data-chamado]").forEach(b => {
    b.addEventListener("click", async () => {
      const id = Number(b.dataset.chamado);
      try {
        await postJSON("../api/atender_chamado.php", {
          chamado_id: id
        });
        const chamado = CHAMADOS.find(c => c.id === id);
        if (chamado) chamado.status = "atendido";
        renderWaiterCalls();
        showAdminToast("Chamado marcado como atendido.");
      } catch (err) {
        showAdminToast(err.message);
      }
    });
  });
}

function initCardapioSection() {
  const tabs = document.querySelectorAll("#section-cardapio .a-tab");
  if (!tabs.length) return;
  const panels = {
    itens: document.getElementById("cardapioItens"),
    extras: document.getElementById("cardapioExtras"),
    midia: document.getElementById("cardapioMidia")
  };
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      Object.entries(panels).forEach(([key, el]) => {
        if (el) el.style.display = key === target ? "block" : "none";
      });
    });
  });
  document.getElementById("newProductBtn").addEventListener("click", () => openProductForm(null));
  document.getElementById("newExtraBtn").addEventListener("click", () => openExtraForm(null));
  renderMenuGrid();
  renderExtrasList();
  renderMediaGrid();
}

function renderMenuGrid() {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = "";
  PRODUCTS.forEach(product => {
    const card = document.createElement("div");
    card.className = "menu-item-card";
    card.innerHTML = `\n      <div class="menu-item-thumb">\n        ${product.featured ? `<span class="featured-flag">Destaque</span>` : ""}\n        ${productMediaHTML(product)}\n      </div>\n      <div class="menu-item-body">\n        <div class="name">${product.name}</div>\n        <div style="color:var(--a-muted);font-size:12px;margin-bottom:4px;">${CATEGORY_LABELS[product.category] || product.category} · ${formatPrice(product.price)}</div>\n        ${product.available ? `<span class="avail-tag yes">Disponível</span>` : `<span class="avail-tag no">Indisponível</span>`}\n        <div class="item-actions">\n          <button data-action="edit">Editar</button>\n          <button data-action="toggle">${product.available ? "Tirar do ar" : "Recolocar"}</button>\n          <button data-action="delete" class="danger">Excluir</button>\n        </div>\n      </div>\n    `;
    card.querySelector('[data-action="edit"]').addEventListener("click", () => openProductForm(product));
    card.querySelector('[data-action="toggle"]').addEventListener("click", async () => {
      try {
        const data = await postJSON("../api/toggle_disponibilidade.php", {
          produto_id: product.id
        });
        product.available = data.disponivel;
        renderMenuGrid();
      } catch (err) {
        showAdminToast(err.message);
      }
    });
    card.querySelector('[data-action="delete"]').addEventListener("click", () => deleteProduct(product));
    grid.appendChild(card);
  });
}

async function deleteProduct(product) {
  if (!confirm(`Excluir "${product.name}" do cardápio? Essa ação não pode ser desfeita.`)) return;
  try {
    await postJSON("../api/excluir_produto.php", {
      id: product.id
    });
    const idx = PRODUCTS.findIndex(p => p.id === product.id);
    if (idx !== -1) PRODUCTS.splice(idx, 1);
    renderMenuGrid();
    showAdminToast("Item excluído.");
  } catch (err) {
    showAdminToast(err.message);
  }
}

function openProductForm(product) {
  const overlay = document.getElementById("productFormOverlay");
  const isEdit = !!product;
  const p = product || {
    id: 0,
    name: "",
    category: "entradas",
    price: "",
    description: "",
    ingredients: [],
    extraIds: [],
    image: "",
    tag: "",
    featured: false,
    available: true
  };
  overlay.innerHTML = `\n    <div class="admin-form-modal">\n      <h3>${isEdit ? "Editar item do cardápio" : "Novo item do cardápio"}</h3>\n      <div class="form-error" id="productFormError"></div>\n      <form id="productForm">\n        <div class="a-field">\n          <label>Nome do prato</label>\n          <input type="text" id="pfNome" value="${escapeAttr(p.name)}" required />\n        </div>\n        <div class="field-row">\n          <div class="a-field">\n            <label>Categoria</label>\n            <select id="pfCategoria">\n              ${CATEGORY_ORDER_ADMIN.map(c => `<option value="${c}" ${c === p.category ? "selected" : ""}>${CATEGORY_LABELS[c]}</option>`).join("")}\n            </select>\n          </div>\n          <div class="a-field">\n            <label>Preço (R$)</label>\n            <input type="number" id="pfPreco" min="0" step="0.01" value="${p.price}" required />\n          </div>\n        </div>\n        <div class="a-field">\n          <label>Descrição</label>\n          <textarea id="pfDescricao" placeholder="Como o prato é preparado, ingredientes principais...">${escapeHTML(p.description || "")}</textarea>\n        </div>\n        <div class="a-field">\n          <label>Ingredientes (separados por vírgula)</label>\n          <input type="text" id="pfIngredientes" value="${escapeAttr((p.ingredients || []).join(", "))}" placeholder="Ex: Massa, Tomate, Manjericão" />\n          <div class="field-hint">Usado no botão "Remover ingredientes" que o cliente vê ao personalizar o prato.</div>\n        </div>\n        <div class="a-field">\n          <label>Extras disponíveis pra esse item</label>\n          ${EXTRAS_ADMIN.length === 0 ? `<div class="field-hint">Nenhum extra cadastrado ainda — crie extras na aba "Extras" primeiro.</div>` : `<div class="extras-checklist">\n                  ${EXTRAS_ADMIN.map(extra => `\n                    <label class="extras-checklist-item">\n                      <input type="checkbox" data-extra-id="${extra.id}" ${(p.extraIds || []).includes(extra.chave) ? "checked" : ""} />\n                      <span>${extra.name} <small>(+${formatPrice(extra.price)})</small></span>\n                    </label>`).join("")}\n                </div>`}\n          <div class="field-hint">Marque só os extras que fazem sentido pra esse prato — ex: uma bebida não precisa de "bacon extra".</div>\n        </div>\n        <div class="field-row">\n          <div class="a-field">\n            <label>Selo / tag (opcional)</label>\n            <input type="text" id="pfTag" value="${escapeAttr(p.tag || "")}" placeholder="Ex: Vegano" />\n          </div>\n          <div class="a-field">\n            <label>Imagem — URL (opcional)</label>\n            <input type="text" id="pfImagem" value="${escapeAttr(p.image || "")}" placeholder="https://..." />\n          </div>\n        </div>\n        <div class="checkbox-row">\n          <input type="checkbox" id="pfDestaque" ${p.featured ? "checked" : ""} />\n          <label for="pfDestaque">Marcar como destaque</label>\n        </div>\n        <div class="checkbox-row">\n          <input type="checkbox" id="pfDisponivel" ${p.available !== false ? "checked" : ""} />\n          <label for="pfDisponivel">Disponível no cardápio agora</label>\n        </div>\n        <div class="admin-form-actions">\n          <button type="button" class="a-btn a-btn-outline" id="pfCancelBtn">Cancelar</button>\n          <button type="submit" class="a-btn">${isEdit ? "Salvar alterações" : "Criar item"}</button>\n        </div>\n      </form>\n    </div>\n  `;
  overlay.classList.add("active");
  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.classList.remove("active");
  });
  document.getElementById("pfCancelBtn").addEventListener("click", () => overlay.classList.remove("active"));
  document.getElementById("productForm").addEventListener("submit", async e => {
    e.preventDefault();
    const errorEl = document.getElementById("productFormError");
    errorEl.classList.remove("show");
    const payload = {
      id: p.id,
      nome: document.getElementById("pfNome").value.trim(),
      categoria: document.getElementById("pfCategoria").value,
      preco: parseFloat(document.getElementById("pfPreco").value),
      descricao: document.getElementById("pfDescricao").value.trim(),
      ingredientes: document.getElementById("pfIngredientes").value,
      tag: document.getElementById("pfTag").value.trim(),
      imagem: document.getElementById("pfImagem").value.trim(),
      destaque: document.getElementById("pfDestaque").checked,
      disponivel: document.getElementById("pfDisponivel").checked,
      extra_ids: Array.from(overlay.querySelectorAll("[data-extra-id]:checked")).map(el => Number(el.dataset.extraId))
    };
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    try {
      const data = await postJSON("../api/salvar_produto.php", payload);
      const idx = PRODUCTS.findIndex(prod => prod.id === data.produto.id);
      if (idx !== -1) {
        PRODUCTS[idx] = data.produto;
      } else {
        PRODUCTS.push(data.produto);
      }
      renderMenuGrid();
      overlay.classList.remove("active");
      showAdminToast(isEdit ? "Item atualizado!" : "Item criado no cardápio!");
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.add("show");
      submitBtn.disabled = false;
    }
  });
}

function renderExtrasList() {
  const wrap = document.getElementById("extrasList");
  if (!wrap) return;
  wrap.innerHTML = "";
  if (EXTRAS_ADMIN.length === 0) {
    wrap.innerHTML = `<p style="color:var(--a-muted);">Nenhum extra cadastrado ainda.</p>`;
    return;
  }
  EXTRAS_ADMIN.forEach(extra => {
    const row = document.createElement("div");
    row.className = "extra-row-card";
    row.innerHTML = `\n      <div class="info">\n        <strong>${extra.name}</strong>\n        <span>+ ${formatPrice(extra.price)}</span>\n      </div>\n      <div class="actions">\n        <button data-action="edit">Editar</button>\n        <button data-action="delete" class="danger">Excluir</button>\n      </div>\n    `;
    row.querySelector('[data-action="edit"]').addEventListener("click", () => openExtraForm(extra));
    row.querySelector('[data-action="delete"]').addEventListener("click", () => deleteExtra(extra));
    wrap.appendChild(row);
  });
}

async function deleteExtra(extra) {
  if (!confirm(`Excluir o extra "${extra.name}"?`)) return;
  try {
    await postJSON("../api/excluir_extra.php", {
      id: extra.id
    });
    const idx = EXTRAS_ADMIN.findIndex(e => e.id === extra.id);
    if (idx !== -1) EXTRAS_ADMIN.splice(idx, 1);
    renderExtrasList();
    showAdminToast("Extra excluído.");
  } catch (err) {
    showAdminToast(err.message);
  }
}

function openExtraForm(extra) {
  const overlay = document.getElementById("extraFormOverlay");
  const isEdit = !!extra;
  const e = extra || {
    id: 0,
    name: "",
    price: ""
  };
  overlay.innerHTML = `\n    <div class="admin-form-modal" style="max-width:420px;">\n      <h3>${isEdit ? "Editar extra" : "Novo extra"}</h3>\n      <div class="form-error" id="extraFormError"></div>\n      <form id="extraForm">\n        <div class="a-field">\n          <label>Nome</label>\n          <input type="text" id="efNome" value="${escapeAttr(e.name)}" placeholder="Ex: Bacon extra" required />\n        </div>\n        <div class="a-field">\n          <label>Preço adicional (R$)</label>\n          <input type="number" id="efPreco" min="0" step="0.01" value="${e.price}" required />\n        </div>\n        <div class="admin-form-actions">\n          <button type="button" class="a-btn a-btn-outline" id="efCancelBtn">Cancelar</button>\n          <button type="submit" class="a-btn">${isEdit ? "Salvar" : "Criar extra"}</button>\n        </div>\n      </form>\n    </div>\n  `;
  overlay.classList.add("active");
  overlay.addEventListener("click", ev => {
    if (ev.target === overlay) overlay.classList.remove("active");
  });
  document.getElementById("efCancelBtn").addEventListener("click", () => overlay.classList.remove("active"));
  document.getElementById("extraForm").addEventListener("submit", async ev => {
    ev.preventDefault();
    const errorEl = document.getElementById("extraFormError");
    errorEl.classList.remove("show");
    const payload = {
      id: e.id,
      nome: document.getElementById("efNome").value.trim(),
      preco: parseFloat(document.getElementById("efPreco").value),
      chave: isEdit ? e.chave : ""
    };
    const submitBtn = ev.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    try {
      const data = await postJSON("../api/salvar_extra.php", payload);
      const idx = EXTRAS_ADMIN.findIndex(x => x.id === data.extra.id);
      if (idx !== -1) {
        EXTRAS_ADMIN[idx] = data.extra;
      } else {
        EXTRAS_ADMIN.push(data.extra);
      }
      renderExtrasList();
      overlay.classList.remove("active");
      showAdminToast(isEdit ? "Extra atualizado!" : "Extra criado!");
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.add("show");
      submitBtn.disabled = false;
    }
  });
}

function renderMediaGrid() {
  const photos = document.getElementById("mediaPhotos");
  const videos = document.getElementById("mediaVideos");
  if (!photos) return;
  photos.innerHTML = "";
  videos.innerHTML = "";
  MEDIA_TILES.forEach(tile => {
    const el = document.createElement("div");
    el.className = "media-tile" + (tile.kind === "wide" ? " wide" : tile.kind === "row" ? " row" : "");
    el.innerHTML = `\n      <div class="media-surface" id="surface-${tile.key}">\n        ${PLACEHOLDER_ICON_SVG}\n        ${tile.kind === "video" ? `<span class="play-badge">${PLAY_ICON_SVG}</span>` : ""}\n      </div>\n      <div class="media-label">${tile.label}</div>\n      <input type="file" accept="${tile.kind === "video" ? "video/*" : "image/*"}" id="input-${tile.key}" style="display:none;" />\n    `;
    el.addEventListener("click", e => {
      if (e.target.tagName === "INPUT") return;
      document.getElementById(`input-${tile.key}`).click();
    });
    el.querySelector("input").addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const surface = document.getElementById(`surface-${tile.key}`);
      surface.innerHTML = file.type.startsWith("video/") ? `<video src="${url}" muted></video><span class="play-badge">${PLAY_ICON_SVG}</span>` : `<img src="${url}" alt="${tile.label}">`;
      showAdminToast("Prévia carregada (local, não enviada a nenhum servidor).");
    });
    (tile.section === "video" ? videos : photos).appendChild(el);
  });
}

let currentPeriodo = "30d";

function initRelatorioSection() {
  const rtabs = document.querySelectorAll("#section-relatorio .a-tabs .a-tab");
  if (!rtabs.length) return;
  const panels = {
    visao: document.getElementById("relatorioVisao"),
    avaliacoes: document.getElementById("relatorioAvaliacoes")
  };
  rtabs.forEach(tab => {
    tab.addEventListener("click", () => {
      rtabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.rtab;
      Object.entries(panels).forEach(([key, el]) => {
        if (el) el.style.display = key === target ? "block" : "none";
      });
    });
  });
  document.querySelectorAll("#relatorioVisao .a-pill").forEach(pill => {
    pill.addEventListener("click", async () => {
      if (pill.dataset.periodo === currentPeriodo) return;
      document.querySelectorAll("#relatorioVisao .a-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentPeriodo = pill.dataset.periodo;
      await loadDashboard(currentPeriodo);
    });
  });
  if (typeof DASHBOARD !== "undefined" && DASHBOARD) {
    renderDashboard(DASHBOARD);
  }
  const prevBtn = document.getElementById("calPrev");
  prevBtn.addEventListener("click", () => {
    calendarMonthOffset--;
    renderCalendar();
  });
  document.getElementById("calNext").addEventListener("click", () => {
    calendarMonthOffset++;
    renderCalendar();
  });
  document.getElementById("reportSearch").addEventListener("input", renderReports);
  renderCalendar();
  renderReports();
}

async function loadDashboard(periodo) {
  const container = document.getElementById("relatorioVisao");
  container.style.opacity = "0.5";
  try {
    const data = await postJSON("../api/relatorio_dashboard.php", {
      periodo: periodo
    });
    renderDashboard(data.dashboard);
  } catch (err) {
    showAdminToast(err.message);
  } finally {
    container.style.opacity = "1";
  }
}

const PERIODO_LABELS = {
  hoje: "hoje",
  "7d": "nos últimos 7 dias",
  "30d": "nos últimos 30 dias",
  tudo: "no total"
};

function renderDashboard(dashboard) {
  renderStatCards(dashboard);
  renderRevenueChart(dashboard.porDia);
  renderCategoryChart(dashboard.porCategoria);
  renderTopProducts(dashboard.topProdutos);
  renderPaymentBreakdown(dashboard.porPagamento);
}

function renderStatCards(dashboard) {
  const wrap = document.getElementById("statCards");
  const r = dashboard.resumo;
  const periodoLabel = PERIODO_LABELS[dashboard.periodo] || "";
  wrap.innerHTML = `\n    <div class="stat-card">\n      <div class="label">Faturamento</div>\n      <div class="value accent">${formatPrice(r.faturamento)}</div>\n      <div class="sub">${periodoLabel}</div>\n    </div>\n    <div class="stat-card">\n      <div class="label">Pedidos</div>\n      <div class="value">${r.total_pedidos}</div>\n      <div class="sub">${periodoLabel}</div>\n    </div>\n    <div class="stat-card">\n      <div class="label">Ticket médio</div>\n      <div class="value">${formatPrice(r.ticket_medio)}</div>\n      <div class="sub">por pedido</div>\n    </div>\n    <div class="stat-card">\n      <div class="label">Avaliação média</div>\n      <div class="value">${r.avaliacao_media !== null ? r.avaliacao_media.toFixed(1) + " / 5" : "—"}</div>\n      <div class="sub">${r.avaliacoes_total} ${r.avaliacoes_total === 1 ? "avaliação" : "avaliações"}</div>\n    </div>\n  `;
}

function renderRevenueChart(porDia) {
  const wrap = document.getElementById("revenueChart");
  if (!porDia || porDia.length === 0) {
    wrap.innerHTML = `<div class="chart-empty">Sem pedidos nesse período.</div>`;
    return;
  }
  const max = Math.max(...porDia.map(d => d.total), 1);
  wrap.innerHTML = porDia.map(d => {
    const height = Math.max(3, Math.round(d.total / max * 140));
    const dateObj = new Date(d.dia + "T00:00:00");
    const label = `${pad2(dateObj.getDate())}/${pad2(dateObj.getMonth() + 1)}`;
    return `\n        <div class="bar-col">\n          <div class="bar" style="height:${height}px;" title="${label}: ${formatPrice(d.total)} · ${d.pedidos} pedido(s)"></div>\n          <div class="bar-label">${label}</div>\n        </div>`;
  }).join("");
}

function renderCategoryChart(porCategoria) {
  const wrap = document.getElementById("categoryChart");
  if (!porCategoria || porCategoria.length === 0) {
    wrap.innerHTML = `<div class="chart-empty">Sem vendas nesse período.</div>`;
    return;
  }
  const max = Math.max(...porCategoria.map(c => c.receita), 1);
  wrap.innerHTML = porCategoria.map(c => `\n    <div class="category-row">\n      <div class="cat-top">\n        <span class="cat-name">${CATEGORY_LABELS[c.categoria] || c.categoria}</span>\n        <span class="cat-value">${formatPrice(c.receita)}</span>\n      </div>\n      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(4, Math.round(c.receita / max * 100))}%;"></div></div>\n    </div>`).join("");
}

function renderTopProducts(topProdutos) {
  const wrap = document.getElementById("topProductsList");
  if (!topProdutos || topProdutos.length === 0) {
    wrap.innerHTML = `<div class="chart-empty">Sem vendas nesse período.</div>`;
    return;
  }
  const max = Math.max(...topProdutos.map(p => p.qtd), 1);
  wrap.innerHTML = topProdutos.map((p, idx) => `\n    <div class="top-product-row">\n      <div class="top-product-rank">${idx + 1}</div>\n      <div class="top-product-info">\n        <div class="name">${p.nome}</div>\n        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(4, Math.round(p.qtd / max * 100))}%;"></div></div>\n      </div>\n      <div class="top-product-stats">${p.qtd}x<br>${formatPrice(p.receita)}</div>\n    </div>`).join("");
}

function renderPaymentBreakdown(porPagamento) {
  const wrap = document.getElementById("paymentBreakdown");
  if (!porPagamento || porPagamento.length === 0) {
    wrap.innerHTML = `<div class="chart-empty">Sem pedidos nesse período.</div>`;
    return;
  }
  const totalPedidos = porPagamento.reduce((sum, p) => sum + p.qtd, 0);
  wrap.innerHTML = porPagamento.map(p => {
    const pct = totalPedidos ? Math.round(p.qtd / totalPedidos * 100) : 0;
    return `\n      <div class="payment-breakdown-row">\n        <div class="payment-breakdown-icon">${PAYMENT_ICONS[p.forma] || ""}</div>\n        <div class="payment-breakdown-info">\n          <div class="label">${paymentLabel(p.forma)}</div>\n          <div class="desc">${p.qtd} pedido(s) · ${formatPrice(p.receita)}</div>\n        </div>\n        <div class="payment-breakdown-pct">${pct}%</div>\n      </div>`;
  }).join("");
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function renderCalendar() {
  const base = new Date;
  const viewDate = new Date(base.getFullYear(), base.getMonth() + calendarMonthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthNames = [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ];
  document.getElementById("calLabel").textContent = `${monthNames[month]} ${year}`;
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";
  [ "D", "S", "T", "Q", "Q", "S", "S" ].forEach(d => {
    const el = document.createElement("div");
    el.className = "dow";
    el.textContent = d;
    grid.appendChild(el);
  });
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = `${base.getFullYear()}-${pad2(base.getMonth() + 1)}-${pad2(base.getDate())}`;
  for (let i = 0; i < firstWeekday; i++) grid.appendChild(document.createElement("div"));
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${pad2(month + 1)}-${pad2(day)}`;
    const cell = document.createElement("div");
    cell.className = "day";
    cell.textContent = day;
    const hasReport = REPORTS.some(r => r.data_relatorio === dateStr);
    if (hasReport) cell.classList.add("has-report");
    if (dateStr === todayStr) cell.classList.add("today");
    if (dateStr === selectedReportDate) cell.classList.add("selected");
    if (hasReport) {
      cell.addEventListener("click", () => {
        selectedReportDate = selectedReportDate === dateStr ? null : dateStr;
        renderCalendar();
        renderReports();
      });
    }
    grid.appendChild(cell);
  }
}

function renderReports() {
  const grid = document.getElementById("reportsGrid");
  const term = (document.getElementById("reportSearch").value || "").trim().toLowerCase();
  let list = REPORTS;
  if (selectedReportDate) list = list.filter(r => r.data_relatorio === selectedReportDate);
  if (term) list = list.filter(r => String(r.id).includes(term) || String(r.mesa_numero).includes(term));
  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML = `<p style="color:var(--a-muted);grid-column:1/-1;">Nenhum relatório encontrado.</p>`;
    return;
  }
  list.forEach(r => {
    const card = document.createElement("div");
    card.className = "report-card";
    card.innerHTML = `\n      <div class="report-thumb">${PLACEHOLDER_ICON_SVG}<span class="m-tag">Mesa ${r.mesa_numero ?? "-"}</span></div>\n      <div class="report-body">\n        <div class="title">Pedido de relatório #${r.id}</div>\n        <div class="stars">${Number(r.avaliacao).toFixed(1)} / 5</div>\n      </div>\n    `;
    grid.appendChild(card);
  });
}

function initConfigSection() {
  const saveBtn = document.getElementById("saveConfigBtn");
  if (!saveBtn) return;
  saveBtn.addEventListener("click", async () => {
    try {
      await postJSON("../api/salvar_configuracoes.php", {
        nome_restaurante: document.getElementById("cfgNome").value.trim(),
        subtitulo: document.getElementById("cfgSubtitulo").value.trim(),
        email_contato: document.getElementById("cfgEmail").value.trim(),
        horario_funcionamento: document.getElementById("cfgHorario").value.trim(),
        taxa_servico_percentual: parseFloat(document.getElementById("cfgTaxa").value)
      });
      showAdminToast("Configurações salvas!");
    } catch (err) {
      showAdminToast(err.message);
    }
  });
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function escapeAttr(str) {
  return String(str || "").replace(/"/g, "&quot;");
}

function showAdminToast(message) {
  let toast = document.querySelector(".a-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "a-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}
