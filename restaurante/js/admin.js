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
      ${
        order
          ? `<div class="order-preview">
              <strong>${order.cliente_nome || "Cliente não informado"}</strong>
              ${order.itens.length} ${order.itens.length === 1 ? "item" : "itens"} · ${formatPrice(order.subtotal)} · ${ORDER_STATUS_LABELS[order.status]}
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

function openOrderPanel(numero) {
  const table = TABLES.find((t) => t.numero === numero);
  const order = table && table.pedido;
  if (!order) return;

  document.getElementById("orderPanelTitle").textContent = `Pedido #${order.id}`;
  const body = document.getElementById("orderPanelBody");
  const itemsHTML = order.itens
    .map(
      (it) =>
        `<div class="order-item-row"><span><span class="qty">${it.quantidade}x</span>${it.produto_nome}${it.opcao ? " · " + it.opcao : ""}</span><span>${formatPrice(it.preco_unitario * it.quantidade)}</span></div>`
    )
    .join("");

  body.innerHTML = `
    <div class="order-meta">
      <div><span>Cliente</span>${order.cliente_nome || "Não informado"}</div>
      <div><span>Mesa</span>Mesa ${order.mesa_numero}</div>
      <div><span>Pagamento</span>${order.forma_pagamento}</div>
      <div><span>Status atual</span>${ORDER_STATUS_LABELS[order.status]}</div>
    </div>
    <div class="order-items-list">${itemsHTML}</div>
    <div class="order-total-row"><span>Total</span><span>${formatPrice(order.subtotal)}</span></div>
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

/* ===================== Cardápio ===================== */
function initCardapioSection() {
  const tabs = document.querySelectorAll("#section-cardapio .a-tab");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      document.getElementById("cardapioItens").style.display = target === "itens" ? "grid" : "none";
      document.getElementById("cardapioMidia").style.display = target === "midia" ? "block" : "none";
    });
  });
  document.getElementById("saveMenuBtn").addEventListener("click", () => showAdminToast("Tudo certo — as alterações já estão salvas."));
  renderMenuGrid();
  renderMediaGrid();
}

function renderMenuGrid() {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = "";
  PRODUCTS.filter((p) => !p.featured).forEach((product) => {
    const card = document.createElement("div");
    card.className = "menu-item-card";
    card.innerHTML = `
      <div class="menu-item-thumb">${productMediaHTML(product)}</div>
      <div class="menu-item-body">
        <div class="name">${product.name}</div>
        ${product.available ? `<span class="avail-tag yes">Disponível</span>` : `<span class="avail-tag no">Indisponível</span>`}
        <button data-id="${product.id}">${product.available ? "Tirar do cardápio" : "Recolocar no cardápio"}</button>
      </div>
    `;
    card.querySelector("button").addEventListener("click", async () => {
      try {
        const data = await postJSON("../api/toggle_disponibilidade.php", { produto_id: product.id });
        product.available = data.disponivel;
        renderMenuGrid();
      } catch (err) {
        showAdminToast(err.message);
      }
    });
    grid.appendChild(card);
  });
}

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
function initRelatorioSection() {
  const prevBtn = document.getElementById("calPrev");
  if (!prevBtn) return;

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
        email_contato: document.getElementById("cfgEmail").value.trim(),
        horario_funcionamento: document.getElementById("cfgHorario").value.trim(),
      });
      showAdminToast("Configurações salvas!");
    } catch (err) {
      showAdminToast(err.message);
    }
  });
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
