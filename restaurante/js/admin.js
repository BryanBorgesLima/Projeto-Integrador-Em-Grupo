// ===================== Painel Admin =====================
const SECTION_TITLES = {
  mesas: "Pedidos e mesas",
  cardapio: "Cardápio",
  relatorio: "Relatório",
  config: "Configurações",
};

const PLAY_ICON_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;

let tableFilter = "todas";
let tableSearchTerm = "";
let calendarMonthOffset = 0;
let selectedReportDate = null; // string "YYYY-MM-DD" ou null

document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initSidebarNav();
  initLogout();
  initMesasSection();
  initWaiterCallsWidget();
  initCardapioSection();
  initRelatorioSection();
  initConfigSection();
  initOrderPanel();
});

async function postJSON(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.erro || "Não foi possível completar a ação.");
  return data;
}

/* ===================== Login ===================== */
function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const pwInput = document.getElementById("loginPassword");
  document.getElementById("togglePw").addEventListener("click", (e) => {
    pwInput.type = pwInput.type === "password" ? "text" : "password";
    e.target.textContent = pwInput.type === "password" ? "Mostrar" : "Ocultar";
  });
  document.getElementById("forgotPw").addEventListener("click", () => {
    showAdminToast("Fale com o administrador do sistema.");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginPassword").value;
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    try {
      await postJSON("../api/login.php", { email, senha });
      window.location.href = "admin.php";
    } catch (err) {
      showAdminToast(err.message);
      submitBtn.disabled = false;
    }
  });
}

function initLogout() {
  ["sidebarClose", "logoutBtn", "logoutBtn2"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", async () => {
      try {
        await postJSON("../api/logout.php");
      } finally {
        window.location.href = "admin.php";
      }
    });
  });
}

/* ===================== Navegação lateral ===================== */
function initSidebarNav() {
  const buttons = document.querySelectorAll(".side-nav button");
  if (!buttons.length) return;
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const section = btn.dataset.section;
      document.querySelectorAll(".admin-section").forEach((s) => s.classList.remove("active"));
      document.getElementById("section-" + section).classList.add("active");
      document.getElementById("sectionTitle").textContent = SECTION_TITLES[section];
    });
  });
}

/* ===================== Pedidos & Mesas ===================== */
function initMesasSection() {
  const grid = document.getElementById("tablesGrid");
  if (!grid) return;

  document.querySelectorAll("#section-mesas .a-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll("#section-mesas .a-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      tableFilter = pill.dataset.filter;
      renderTables();
    });
  });
  document.getElementById("tableSearch").addEventListener("input", (e) => {
    tableSearchTerm = e.target.value.trim();
    renderTables();
  });
  renderTables();
}

function statusLabel(status) {
  return { livre: "Livre", reservado: "Reservado", ocupado: "Ocupado" }[status] || status;
}

function renderTables() {
  const grid = document.getElementById("tablesGrid");
  let list = TABLES;
  if (tableFilter !== "todas") list = list.filter((t) => t.status === tableFilter);
  if (tableSearchTerm) list = list.filter((t) => String(t.numero).includes(tableSearchTerm));

  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML = `<p style="color:var(--a-muted);">Nenhuma mesa encontrada.</p>`;
    return;
  }

  list.forEach((table) => {
    const order = table.status === "ocupado" ? table.pedido : null;
    const card = document.createElement("div");
    card.className = "table-card";
    card.innerHTML = `
      <div class="table-card-top">
        <strong>Mesa ${table.numero}</strong>
        <span class="status-dot status-${table.status}">${statusLabel(table.status)}</span>
      </div>
      <div class="status-radios">
        <label><input type="radio" name="status-${table.numero}" value="livre" ${table.status === "livre" ? "checked" : ""}/> Livre</label>
        <label><input type="radio" name="status-${table.numero}" value="reservado" ${table.status === "reservado" ? "checked" : ""}/> Reservado</label>
        <label><input type="radio" name="status-${table.numero}" value="ocupado" ${table.status === "ocupado" ? "checked" : ""}/> Ocupado</label>
      </div>
      ${order
        ? `<div class="order-preview">
              <strong>${order.cliente_nome || "Cliente não informado"}</strong>
              ${order.itens.length} ${order.itens.length === 1 ? "item" : "itens"} · ${formatPrice(order.total || order.subtotal)} · ${ORDER_STATUS_LABELS[order.status]}
            </div>
            <button class="a-btn" data-open-order="${table.numero}">Ver pedido</button>`
        : ""
      }
    `;
    card.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.addEventListener("change", async () => {
        const previous = table.status;
        try {
          await postJSON("../api/atualizar_mesa.php", { numero: table.numero, status: radio.value });
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

/* ===================== Painel de detalhe do pedido ===================== */
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
  const table = TABLES.find((t) => t.numero === numero);
  const order = table && table.pedido;
  if (!order) return;

  document.getElementById("orderPanelTitle").textContent = `Pedido #${order.id}`;
  const body = document.getElementById("orderPanelBody");
  const itemsHTML = order.itens
    .map((it) => {
      const meta = orderItemMeta(it);
      return `<div class="order-item-row">
        <span>
          <span class="qty">${it.quantidade}x</span>${it.produto_nome}
          ${meta ? `<br><small style="color:var(--a-muted);">${meta}</small>` : ""}
        </span>
        <span>${formatPrice(it.preco_unitario * it.quantidade)}</span>
      </div>`;
    })
    .join("");

  body.innerHTML = `
    <div class="order-meta">
      <div><span>Cliente</span>${order.cliente_nome || "Não informado"}</div>
      <div><span>Mesa</span>Mesa ${order.mesa_numero}</div>
      <div><span>Pagamento</span>${paymentLabel(order.forma_pagamento)}</div>
      <div><span>Status atual</span>${ORDER_STATUS_LABELS[order.status]}</div>
    </div>
    <div class="order-items-list">${itemsHTML}</div>
    <div class="order-total-row"><span>Total</span><span>${formatPrice(order.total || order.subtotal)}</span></div>
    <div class="status-flow" id="statusFlow"></div>
  `;

  const flow = document.getElementById("statusFlow");
  const currentIdx = ORDER_STATUS_FLOW.indexOf(order.status);
  ORDER_STATUS_FLOW.forEach((status, idx) => {
    const step = document.createElement("button");
    step.type = "button";
    step.className = "status-step" + (idx <= currentIdx ? " done" : "");
    step.textContent = ORDER_STATUS_LABELS[status];
    step.addEventListener("click", async () => {
      try {
        await postJSON("../api/atualizar_pedido.php", { pedido_id: order.id, status });
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
  return { pix: "Pix (QR Code)", garcom: "Cartão com o garçom", balcao: "Balcão" }[id] || id;
}

/* ===================== Chamados de garçom ===================== */
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

  const pendentes = CHAMADOS.filter((c) => c.status === "pendente");
  if (pendentes.length === 0) {
    btn.style.display = "none";
    panel.style.display = "none";
    return;
  }
  btn.style.display = "flex";
  countEl.textContent = pendentes.length;
  panel.innerHTML = pendentes
    .map(
      (c) => `
    <div class="waiter-call-row">
      <span>🔔 Mesa ${c.mesa} pediu atendimento</span>
      <button data-chamado="${c.id}">Atender</button>
    </div>`
    )
    .join("");
  panel.querySelectorAll("[data-chamado]").forEach((b) => {
    b.addEventListener("click", async () => {
      const id = Number(b.dataset.chamado);
      try {
        await postJSON("../api/atender_chamado.php", { chamado_id: id });
        const chamado = CHAMADOS.find((c) => c.id === id);
        if (chamado) chamado.status = "atendido";
        renderWaiterCalls();
        showAdminToast("Chamado marcado como atendido.");
      } catch (err) {
        showAdminToast(err.message);
      }
    });
  });
}

/* ===================== Cardápio: Itens / Extras / Mídia ===================== */
function initCardapioSection() {
  const tabs = document.querySelectorAll("#section-cardapio .a-tab");
  if (!tabs.length) return;

  const panels = {
    itens: document.getElementById("cardapioItens"),
    extras: document.getElementById("cardapioExtras"),
    midia: document.getElementById("cardapioMidia"),
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
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
  PRODUCTS.forEach((product) => {
    const card = document.createElement("div");
    card.className = "menu-item-card";
    card.innerHTML = `
      <div class="menu-item-thumb">
        ${product.featured ? `<span class="featured-flag">Destaque</span>` : ""}
        ${productMediaHTML(product)}
      </div>
      <div class="menu-item-body">
        <div class="name">${product.name}</div>
        <div style="color:var(--a-muted);font-size:12px;margin-bottom:4px;">${CATEGORY_LABELS[product.category] || product.category} · ${formatPrice(product.price)}</div>
        ${product.available ? `<span class="avail-tag yes">Disponível</span>` : `<span class="avail-tag no">Indisponível</span>`}
        <div class="item-actions">
          <button data-action="edit">Editar</button>
          <button data-action="toggle">${product.available ? "Tirar do ar" : "Recolocar"}</button>
          <button data-action="delete" class="danger">Excluir</button>
        </div>
      </div>
    `;
    card.querySelector('[data-action="edit"]').addEventListener("click", () => openProductForm(product));
    card.querySelector('[data-action="toggle"]').addEventListener("click", async () => {
      try {
        const data = await postJSON("../api/toggle_disponibilidade.php", { produto_id: product.id });
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
    await postJSON("../api/excluir_produto.php", { id: product.id });
    const idx = PRODUCTS.findIndex((p) => p.id === product.id);
    if (idx !== -1) PRODUCTS.splice(idx, 1);
    renderMenuGrid();
    showAdminToast("Item excluído.");
  } catch (err) {
    showAdminToast(err.message);
  }
}

/* ---- Formulário de item (criar do zero ou editar) ---- */
function openProductForm(product) {
  const overlay = document.getElementById("productFormOverlay");
  const isEdit = !!product;
  const p = product || { id: 0, name: "", category: "entradas", price: "", description: "", ingredients: [], extraIds: [], image: "", tag: "", featured: false, available: true };

  overlay.innerHTML = `
    <div class="admin-form-modal">
      <h3>${isEdit ? "Editar item do cardápio" : "Novo item do cardápio"}</h3>
      <div class="form-error" id="productFormError"></div>
      <form id="productForm">
        <div class="a-field">
          <label>Nome do prato</label>
          <input type="text" id="pfNome" value="${escapeAttr(p.name)}" required />
        </div>
        <div class="field-row">
          <div class="a-field">
            <label>Categoria</label>
            <select id="pfCategoria">
              ${CATEGORY_ORDER_ADMIN.map((c) => `<option value="${c}" ${c === p.category ? "selected" : ""}>${CATEGORY_LABELS[c]}</option>`).join("")}
            </select>
          </div>
          <div class="a-field">
            <label>Preço (R$)</label>
            <input type="number" id="pfPreco" min="0" step="0.01" value="${p.price}" required />
          </div>
        </div>
        <div class="a-field">
          <label>Descrição</label>
          <textarea id="pfDescricao" placeholder="Como o prato é preparado, ingredientes principais...">${escapeHTML(p.description || "")}</textarea>
        </div>
        <div class="a-field">
          <label>Ingredientes (separados por vírgula)</label>
          <input type="text" id="pfIngredientes" value="${escapeAttr((p.ingredients || []).join(", "))}" placeholder="Ex: Massa, Tomate, Manjericão" />
          <div class="field-hint">Usado no botão "Remover ingredientes" que o cliente vê ao personalizar o prato.</div>
        </div>
        <div class="a-field">
          <label>Extras disponíveis pra esse item</label>
          ${EXTRAS_ADMIN.length === 0
      ? `<div class="field-hint">Nenhum extra cadastrado ainda — crie extras na aba "Extras" primeiro.</div>`
      : `<div class="extras-checklist">
                  ${EXTRAS_ADMIN.map(
        (extra) => `
                    <label class="extras-checklist-item">
                      <input type="checkbox" data-extra-id="${extra.id}" ${(p.extraIds || []).includes(extra.chave) ? "checked" : ""} />
                      <span>${extra.name} <small>(+${formatPrice(extra.price)})</small></span>
                    </label>`
      ).join("")}
                </div>`
    }
          <div class="field-hint">Marque só os extras que fazem sentido pra esse prato — ex: uma bebida não precisa de "bacon extra".</div>
        </div>
        <div class="a-field">
          <label>Foto do prato</label>
          <div class="image-field">
            <div class="image-field-preview" id="pfImagemPreview">${productMediaHTML(p)}</div>
            <div class="image-field-controls">
              <div class="image-field-buttons">
                <label class="a-btn a-btn-outline image-upload-btn" for="pfImagemArquivo" tabindex="0" role="button" id="pfImagemEnviar">Enviar foto</label>
                <input type="file" id="pfImagemArquivo" accept="image/jpeg,image/png,image/webp,image/gif" hidden />
                <button type="button" class="a-btn a-btn-outline" id="pfImagemRemover" ${p.image ? "" : "hidden"}>Remover</button>
              </div>
              <input type="text" id="pfImagem" value="${escapeAttr(p.image || "")}" placeholder="Ou cole um link: https://..." />
              <div class="field-hint" id="pfImagemStatus">JPG, PNG, WEBP ou GIF de até 4 MB. Fotos na horizontal ficam melhores no cardápio.</div>
            </div>
          </div>
        </div>
        <div class="a-field">
          <label>Selo / tag (opcional)</label>
          <input type="text" id="pfTag" value="${escapeAttr(p.tag || "")}" placeholder="Ex: Vegano" />
        </div>
        <div class="checkbox-row">
          <input type="checkbox" id="pfDestaque" ${p.featured ? "checked" : ""} />
          <label for="pfDestaque">Marcar como destaque</label>
        </div>
        <div class="checkbox-row">
          <input type="checkbox" id="pfDisponivel" ${p.available !== false ? "checked" : ""} />
          <label for="pfDisponivel">Disponível no cardápio agora</label>
        </div>
        <div class="admin-form-actions">
          <button type="button" class="a-btn a-btn-outline" id="pfCancelBtn">Cancelar</button>
          <button type="submit" class="a-btn">${isEdit ? "Salvar alterações" : "Criar item"}</button>
        </div>
      </form>
    </div>
  `;
  overlay.classList.add("active");
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("active");
  });
  document.getElementById("pfCancelBtn").addEventListener("click", () => overlay.classList.remove("active"));
  initProductImageField(p.name);

  document.getElementById("productForm").addEventListener("submit", async (e) => {
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
      extra_ids: Array.from(overlay.querySelectorAll("[data-extra-id]:checked")).map((el) => Number(el.dataset.extraId)),
    };

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    try {
      const data = await postJSON("../api/salvar_produto.php", payload);
      const idx = PRODUCTS.findIndex((prod) => prod.id === data.produto.id);
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

/* ---- Campo de foto do formulário de item ---- */
function initProductImageField(productName) {
  const input = document.getElementById("pfImagem");
  const fileInput = document.getElementById("pfImagemArquivo");
  const preview = document.getElementById("pfImagemPreview");
  const status = document.getElementById("pfImagemStatus");
  const removeBtn = document.getElementById("pfImagemRemover");
  const defaultHint = status.textContent;

  const refreshPreview = () => {
    const value = input.value.trim();
    preview.innerHTML = imageTagHTML(value, productName);
    removeBtn.hidden = !value;
  };

  input.addEventListener("change", refreshPreview);
  document.getElementById("pfImagemEnviar").addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });
  removeBtn.addEventListener("click", () => {
    input.value = "";
    refreshPreview();
  });

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;
    status.textContent = "Enviando foto...";
    status.classList.remove("is-error");
    preview.classList.add("is-loading");
    try {
      const formData = new FormData();
      formData.append("imagem", file);
      const response = await fetch("../api/upload_imagem.php", { method: "POST", body: formData });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.caminho) throw new Error(data.erro || "Não foi possível enviar a foto.");
      input.value = data.caminho;
      refreshPreview();
      status.textContent = "Foto enviada. Clique em salvar para aplicar no cardápio.";
    } catch (err) {
      status.textContent = err.message;
      status.classList.add("is-error");
    } finally {
      preview.classList.remove("is-loading");
      fileInput.value = "";
      setTimeout(() => {
        if (!status.classList.contains("is-error")) status.textContent = defaultHint;
      }, 5000);
    }
  });
}

/* ---- Extras ---- */
function renderExtrasList() {
  const wrap = document.getElementById("extrasList");
  if (!wrap) return;
  wrap.innerHTML = "";
  if (EXTRAS_ADMIN.length === 0) {
    wrap.innerHTML = `<p style="color:var(--a-muted);">Nenhum extra cadastrado ainda.</p>`;
    return;
  }
  EXTRAS_ADMIN.forEach((extra) => {
    const row = document.createElement("div");
    row.className = "extra-row-card";
    row.innerHTML = `
      <div class="info">
        <strong>${extra.name}</strong>
        <span>+ ${formatPrice(extra.price)}</span>
      </div>
      <div class="actions">
        <button data-action="edit">Editar</button>
        <button data-action="delete" class="danger">Excluir</button>
      </div>
    `;
    row.querySelector('[data-action="edit"]').addEventListener("click", () => openExtraForm(extra));
    row.querySelector('[data-action="delete"]').addEventListener("click", () => deleteExtra(extra));
    wrap.appendChild(row);
  });
}

async function deleteExtra(extra) {
  if (!confirm(`Excluir o extra "${extra.name}"?`)) return;
  try {
    await postJSON("../api/excluir_extra.php", { id: extra.id });
    const idx = EXTRAS_ADMIN.findIndex((e) => e.id === extra.id);
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
  const e = extra || { id: 0, name: "", price: "" };

  overlay.innerHTML = `
    <div class="admin-form-modal" style="max-width:420px;">
      <h3>${isEdit ? "Editar extra" : "Novo extra"}</h3>
      <div class="form-error" id="extraFormError"></div>
      <form id="extraForm">
        <div class="a-field">
          <label>Nome</label>
          <input type="text" id="efNome" value="${escapeAttr(e.name)}" placeholder="Ex: Bacon extra" required />
        </div>
        <div class="a-field">
          <label>Preço adicional (R$)</label>
          <input type="number" id="efPreco" min="0" step="0.01" value="${e.price}" required />
        </div>
        <div class="admin-form-actions">
          <button type="button" class="a-btn a-btn-outline" id="efCancelBtn">Cancelar</button>
          <button type="submit" class="a-btn">${isEdit ? "Salvar" : "Criar extra"}</button>
        </div>
      </form>
    </div>
  `;
  overlay.classList.add("active");
  overlay.addEventListener("click", (ev) => {
    if (ev.target === overlay) overlay.classList.remove("active");
  });
  document.getElementById("efCancelBtn").addEventListener("click", () => overlay.classList.remove("active"));

  document.getElementById("extraForm").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const errorEl = document.getElementById("extraFormError");
    errorEl.classList.remove("show");
    const payload = {
      id: e.id,
      nome: document.getElementById("efNome").value.trim(),
      preco: parseFloat(document.getElementById("efPreco").value),
      chave: isEdit ? e.chave : "",
    };
    const submitBtn = ev.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    try {
      const data = await postJSON("../api/salvar_extra.php", payload);
      const idx = EXTRAS_ADMIN.findIndex((x) => x.id === data.extra.id);
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

/* ---- Mídia (prévia local, sem upload real) ---- */
function renderMediaGrid() {
  const photos = document.getElementById("mediaPhotos");
  const videos = document.getElementById("mediaVideos");
  if (!photos) return;
  photos.innerHTML = "";
  videos.innerHTML = "";

  MEDIA_TILES.forEach((tile) => {
    const el = document.createElement("div");
    el.className = "media-tile" + (tile.kind === "wide" ? " wide" : tile.kind === "row" ? " row" : "");
    el.innerHTML = `
      <div class="media-surface" id="surface-${tile.key}">
        ${PLACEHOLDER_ICON_SVG}
        ${tile.kind === "video" ? `<span class="play-badge">${PLAY_ICON_SVG}</span>` : ""}
      </div>
      <div class="media-label">${tile.label}</div>
      <input type="file" accept="${tile.kind === "video" ? "video/*" : "image/*"}" id="input-${tile.key}" style="display:none;" />
    `;
    el.addEventListener("click", (e) => {
      if (e.target.tagName === "INPUT") return;
      document.getElementById(`input-${tile.key}`).click();
    });
    el.querySelector("input").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      const surface = document.getElementById(`surface-${tile.key}`);
      surface.innerHTML = file.type.startsWith("video/")
        ? `<video src="${url}" muted></video><span class="play-badge">${PLAY_ICON_SVG}</span>`
        : `<img src="${url}" alt="${tile.label}">`;
      showAdminToast("Prévia carregada (local, não enviada a nenhum servidor).");
    });

    (tile.section === "video" ? videos : photos).appendChild(el);
  });
}

/* ===================== Relatório ===================== */
let currentPeriodo = "30d";

function initRelatorioSection() {
  const rtabs = document.querySelectorAll("#section-relatorio .a-tabs .a-tab");
  if (!rtabs.length) return;

  const panels = {
    visao: document.getElementById("relatorioVisao"),
    avaliacoes: document.getElementById("relatorioAvaliacoes"),
  };
  rtabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      rtabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.rtab;
      Object.entries(panels).forEach(([key, el]) => {
        if (el) el.style.display = key === target ? "block" : "none";
      });
    });
  });

  document.querySelectorAll("#relatorioVisao .a-pill").forEach((pill) => {
    pill.addEventListener("click", async () => {
      if (pill.dataset.periodo === currentPeriodo) return;
      document.querySelectorAll("#relatorioVisao .a-pill").forEach((p) => p.classList.remove("active"));
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
    const data = await postJSON("../api/relatorio_dashboard.php", { periodo });
    renderDashboard(data.dashboard);
  } catch (err) {
    showAdminToast(err.message);
  } finally {
    container.style.opacity = "1";
  }
}

const PERIODO_LABELS = { hoje: "hoje", "7d": "nos últimos 7 dias", "30d": "nos últimos 30 dias", tudo: "no total" };

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
  wrap.innerHTML = `
    <div class="stat-card">
      <div class="label">Faturamento</div>
      <div class="value accent">${formatPrice(r.faturamento)}</div>
      <div class="sub">${periodoLabel}</div>
    </div>
    <div class="stat-card">
      <div class="label">Pedidos</div>
      <div class="value">${r.total_pedidos}</div>
      <div class="sub">${periodoLabel}</div>
    </div>
    <div class="stat-card">
      <div class="label">Ticket médio</div>
      <div class="value">${formatPrice(r.ticket_medio)}</div>
      <div class="sub">por pedido</div>
    </div>
    <div class="stat-card">
      <div class="label">Avaliação média</div>
      <div class="value">${r.avaliacao_media !== null ? r.avaliacao_media.toFixed(1) + " / 5" : "—"}</div>
      <div class="sub">${r.avaliacoes_total} ${r.avaliacoes_total === 1 ? "avaliação" : "avaliações"}</div>
    </div>
  `;
}

function renderRevenueChart(porDia) {
  const wrap = document.getElementById("revenueChart");
  if (!porDia || porDia.length === 0) {
    wrap.innerHTML = `<div class="chart-empty">Sem pedidos nesse período.</div>`;
    return;
  }
  const max = Math.max(...porDia.map((d) => d.total), 1);
  wrap.innerHTML = porDia
    .map((d) => {
      const height = Math.max(3, Math.round((d.total / max) * 140));
      const dateObj = new Date(d.dia + "T00:00:00");
      const label = `${pad2(dateObj.getDate())}/${pad2(dateObj.getMonth() + 1)}`;
      return `
        <div class="bar-col">
          <div class="bar" style="height:${height}px;" title="${label}: ${formatPrice(d.total)} · ${d.pedidos} pedido(s)"></div>
          <div class="bar-label">${label}</div>
        </div>`;
    })
    .join("");
}

function renderCategoryChart(porCategoria) {
  const wrap = document.getElementById("categoryChart");
  if (!porCategoria || porCategoria.length === 0) {
    wrap.innerHTML = `<div class="chart-empty">Sem vendas nesse período.</div>`;
    return;
  }
  const max = Math.max(...porCategoria.map((c) => c.receita), 1);
  wrap.innerHTML = porCategoria
    .map(
      (c) => `
    <div class="category-row">
      <div class="cat-top">
        <span class="cat-name">${CATEGORY_LABELS[c.categoria] || c.categoria}</span>
        <span class="cat-value">${formatPrice(c.receita)}</span>
      </div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(4, Math.round((c.receita / max) * 100))}%;"></div></div>
    </div>`
    )
    .join("");
}

function renderTopProducts(topProdutos) {
  const wrap = document.getElementById("topProductsList");
  if (!topProdutos || topProdutos.length === 0) {
    wrap.innerHTML = `<div class="chart-empty">Sem vendas nesse período.</div>`;
    return;
  }
  const max = Math.max(...topProdutos.map((p) => p.qtd), 1);
  wrap.innerHTML = topProdutos
    .map(
      (p, idx) => `
    <div class="top-product-row">
      <div class="top-product-rank">${idx + 1}</div>
      <div class="top-product-info">
        <div class="name">${p.nome}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(4, Math.round((p.qtd / max) * 100))}%;"></div></div>
      </div>
      <div class="top-product-stats">${p.qtd}x<br>${formatPrice(p.receita)}</div>
    </div>`
    )
    .join("");
}

function renderPaymentBreakdown(porPagamento) {
  const wrap = document.getElementById("paymentBreakdown");
  if (!porPagamento || porPagamento.length === 0) {
    wrap.innerHTML = `<div class="chart-empty">Sem pedidos nesse período.</div>`;
    return;
  }
  const totalPedidos = porPagamento.reduce((sum, p) => sum + p.qtd, 0);
  wrap.innerHTML = porPagamento
    .map((p) => {
      const pct = totalPedidos ? Math.round((p.qtd / totalPedidos) * 100) : 0;
      return `
      <div class="payment-breakdown-row">
        <div class="payment-breakdown-icon">${PAYMENT_ICONS[p.forma] || ""}</div>
        <div class="payment-breakdown-info">
          <div class="label">${paymentLabel(p.forma)}</div>
          <div class="desc">${p.qtd} pedido(s) · ${formatPrice(p.receita)}</div>
        </div>
        <div class="payment-breakdown-pct">${pct}%</div>
      </div>`;
    })
    .join("");
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function renderCalendar() {
  const base = new Date();
  const viewDate = new Date(base.getFullYear(), base.getMonth() + calendarMonthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  document.getElementById("calLabel").textContent = `${monthNames[month]} ${year}`;

  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";
  ["D", "S", "T", "Q", "Q", "S", "S"].forEach((d) => {
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
    const hasReport = REPORTS.some((r) => r.data_relatorio === dateStr);
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
  if (selectedReportDate) list = list.filter((r) => r.data_relatorio === selectedReportDate);
  if (term) list = list.filter((r) => String(r.id).includes(term) || String(r.mesa_numero).includes(term));

  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML = `<p style="color:var(--a-muted);grid-column:1/-1;">Nenhum relatório encontrado.</p>`;
    return;
  }

  list.forEach((r) => {
    const card = document.createElement("div");
    card.className = "report-card";
    card.innerHTML = `
      <div class="report-thumb">${PLACEHOLDER_ICON_SVG}<span class="m-tag">Mesa ${r.mesa_numero ?? "-"}</span></div>
      <div class="report-body">
        <div class="title">Pedido de relatório #${r.id}</div>
        <div class="stars">${Number(r.avaliacao).toFixed(1)} / 5</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ===================== Configurações ===================== */
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
        taxa_servico_percentual: parseFloat(document.getElementById("cfgTaxa").value),
      });
      showAdminToast("Configurações salvas!");
    } catch (err) {
      showAdminToast(err.message);
    }
  });
}

/* ===================== Helpers ===================== */
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}
function escapeAttr(str) {
  return String(str || "").replace(/"/g, "&quot;");
}

/* ===================== Toast ===================== */
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
