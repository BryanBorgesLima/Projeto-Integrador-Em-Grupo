if (typeof MESAS === "undefined") {
  var MESAS = [];
}

const CATEGORY_ORDER = [ "entradas", "principais", "bebidas", "sobremesas" ];

const SECTION_TITLES = {
  entradas: "Entradas",
  principais: "Pratos Principais",
  bebidas: "Bebidas",
  sobremesas: "Sobremesas"
};

document.addEventListener("DOMContentLoaded", () => {
  initMesaBadges();
  initWaiterButtons();
  initOrderStatusIndicator();
  const page = document.body.dataset.page;
  if (page === "menu") initMenuPage();
  if (page === "carrinho") initCartPage();
  if (page === "finalizacao") initCheckoutPage();
  if (page === "status") initStatusPage();
});

function initMesaBadges() {
  refreshMesaBadges();
  document.querySelectorAll("[data-open-mesa-modal]").forEach(btn => {
    btn.addEventListener("click", () => openMesaModal());
  });
}

function refreshMesaBadges() {
  const mesa = getMesaAtual();
  document.querySelectorAll(".mesa-badge .label").forEach(el => {
    el.textContent = mesa ? `Mesa ${String(mesa).padStart(2, "0")}` : "Selecionar mesa";
  });
}

function openMesaModal(onSelect) {
  let overlay = document.getElementById("mesaModalOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "mesaModalOverlay";
    document.body.appendChild(overlay);
  }
  const options = MESAS.length ? MESAS.map(m => m.numero) : Array.from({
    length: 12
  }, (_, i) => i + 1);
  overlay.innerHTML = `\n    <div class="mesa-modal">\n      <h2>Selecione sua mesa</h2>\n      <p>Escaneie o QR code na sua mesa ou escolha o número abaixo.</p>\n      <div class="mesa-grid">\n        ${options.map(n => `<button class="mesa-option" data-mesa="${n}">${String(n).padStart(2, "0")}</button>`).join("")}\n      </div>\n    </div>\n  `;
  overlay.classList.add("active");
  overlay.addEventListener("click", e => {
    if (e.target === overlay) overlay.classList.remove("active");
  });
  overlay.querySelectorAll("[data-mesa]").forEach(btn => {
    btn.addEventListener("click", () => {
      const numero = Number(btn.dataset.mesa);
      setMesaAtual(numero);
      refreshMesaBadges();
      overlay.classList.remove("active");
      showToast(`Mesa ${numero} selecionada`);
      if (typeof onSelect === "function") onSelect(numero);
    });
  });
}

function initWaiterButtons() {
  document.querySelectorAll("[data-call-waiter]").forEach(btn => {
    btn.addEventListener("click", () => callWaiter(btn));
  });
}

async function callWaiter(btn) {
  const mesa = getMesaAtual();
  if (!mesa) {
    openMesaModal(() => callWaiter(btn));
    return;
  }
  btn.disabled = true;
  const originalHTML = btn.innerHTML;
  btn.innerHTML = btn.innerHTML.replace(/Chamar Garçom/, "Chamando...");
  try {
    const data = await Store.chamarGarcom(mesa);
    if (!data.sucesso) throw new Error(data.erro || "Não foi possível chamar o garçom.");
    showToast("Garçom chamado! Já estamos a caminho da sua mesa.");
  } catch (err) {
    showToast(err && err.message || "Não foi possível chamar o garçom agora.");
  } finally {
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }, 2e4);
  }
}

const STATUS_LABELS_CLIENT = {
  preparando: "Preparando",
  pronto: "Pronto",
  entregue: "Entregue"
};

const STATUS_ORDER = [ "preparando", "pronto", "entregue" ];

const STATUS_MESSAGES = {
  preparando: "Seu pedido está sendo preparado com carinho pela nossa cozinha.",
  pronto: "Seu pedido está pronto! Já está a caminho da sua mesa.",
  entregue: "Pedido entregue. Bom apetite! 🍝"
};

const TRACKER_ICONS = {
  preparando: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
  pronto: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  entregue: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7 12 3 4 7l8 4 8-4Z"/><path d="M4 7v10l8 4 8-4V7"/><path d="M12 11v10"/></svg>`
};

const CHECK_ICON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

async function fetchPedidoAtual() {
  const mesa = getMesaAtual();
  if (!mesa) return null;
  try {
    const data = await Store.pedidoMesa(mesa);
    return data.pedido || null;
  } catch (e) {
    return null;
  }
}

function initOrderStatusIndicator() {
  const btn = document.getElementById("statusBtn");
  if (!btn) return;
  updateStatusIndicator();
  setInterval(updateStatusIndicator, 15e3);
}

async function updateStatusIndicator() {
  const btn = document.getElementById("statusBtn");
  if (!btn) return;
  const pedido = await fetchPedidoAtual();
  if (!pedido) {
    btn.style.display = "none";
    return;
  }
  btn.style.display = "flex";
  const dot = document.getElementById("statusDotIndicator");
  if (dot) dot.className = "status-dot-indicator " + pedido.status;
}

function trackerEmptyHTML(message) {
  return `\n    <div class="tracker-empty">\n      <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>\n      <p>${message}</p>\n      <a href="menu.html" class="btn btn-primary" style="margin-top:14px;">Ver cardápio</a>\n    </div>`;
}

function initStatusPage() {
  renderStatusPage();
  setInterval(renderStatusPage, 8e3);
}

async function renderStatusPage() {
  const wrap = document.getElementById("trackerWrap");
  if (!wrap) return;
  const mesa = getMesaAtual();
  if (!mesa) {
    wrap.innerHTML = trackerEmptyHTML("Selecione sua mesa para acompanhar um pedido.");
    return;
  }
  const pedido = await fetchPedidoAtual();
  if (!pedido) {
    wrap.innerHTML = trackerEmptyHTML("Você ainda não fez nenhum pedido nessa mesa.");
    return;
  }
  const currentIdx = STATUS_ORDER.indexOf(pedido.status);
  const stepsHTML = STATUS_ORDER.map((status, idx) => {
    const isDone = idx < currentIdx;
    const isActive = idx === currentIdx;
    const stepClass = isDone ? "done" : isActive ? "active" : "";
    const lineHTML = idx > 0 ? `<div class="tracker-step-line ${idx <= currentIdx ? "done" : ""}"></div>` : "";
    return `\n      ${lineHTML}\n      <div class="tracker-step ${stepClass}">\n        <div class="tracker-step-icon">${isDone ? CHECK_ICON_SVG : TRACKER_ICONS[status]}</div>\n        <div class="tracker-step-label">${STATUS_LABELS_CLIENT[status]}</div>\n      </div>`;
  }).join("");
  const itemsHTML = pedido.itens.map(it => {
    const parts = [];
    if (it.ingredientes_removidos) parts.push("Sem " + it.ingredientes_removidos.split(",").join(", "));
    if (it.observacoes) parts.push("Obs: " + it.observacoes);
    return `\n      <div class="tracker-item-row">\n        <span>\n          <span class="qty">${it.quantidade}x</span>${it.nome}\n          ${parts.length ? `<div class="tracker-item-meta">${parts.join(" · ")}</div>` : ""}\n        </span>\n        <strong>${formatPrice(it.preco_unitario * it.quantidade)}</strong>\n      </div>`;
  }).join("");
  wrap.innerHTML = `\n    <div class="tracker-card">\n      <div class="tracker-head">\n        <h2>Pedido #${pedido.id}</h2>\n        <span class="order-mesa-tag">Mesa ${String(pedido.mesa).padStart(2, "0")}</span>\n      </div>\n      <div class="tracker-steps">${stepsHTML}</div>\n      <div class="tracker-message">${STATUS_MESSAGES[pedido.status]}</div>\n      <div class="tracker-items">${itemsHTML}</div>\n      <div class="order-totals" style="margin-top:16px;">\n        <div class="order-total-row"><span>Subtotal</span><span>${formatPrice(pedido.subtotal)}</span></div>\n        <div class="order-total-row"><span>Taxa de Serviço</span><span>${formatPrice(pedido.taxa_servico)}</span></div>\n        <div class="order-total-row grand"><span>Total</span><span>${formatPrice(pedido.total)}</span></div>\n      </div>\n    </div>\n  `;
}

let activeCategory = null;

function initMenuPage() {
  const mesa = getMesaAtual();
  if (!mesa) openMesaModal();
  activeCategory = CATEGORY_ORDER.find(c => PRODUCTS.some(p => p.category === c)) || CATEGORY_ORDER[0];
  renderCategoryNav();
  renderProductGrid();
  renderOrderPanel();
  renderMobileOrderBar();
  initProductModal();
  const params = new URLSearchParams(window.location.search);
  const openId = params.get("open");
  if (openId) {
    const product = getProduct(openId);
    if (product) openProductModal(product);
  }
}

function renderCategoryNav() {
  const desktopNav = document.getElementById("categoryNav");
  const mobileNav = document.getElementById("categoryNavMobile");
  const cats = CATEGORY_ORDER.filter(c => PRODUCTS.some(p => p.category === c));
  const buildButtons = withIcon => cats.map(cat => `\n      <button data-category="${cat}" class="${cat === activeCategory ? "active" : ""}">\n        ${withIcon ? CATEGORY_ICONS[cat] || "" : ""}<span>${CATEGORY_LABELS[cat]}</span>\n      </button>`).join("");
  if (desktopNav) desktopNav.innerHTML = buildButtons(true);
  if (mobileNav) mobileNav.innerHTML = buildButtons(false);
  [ desktopNav, mobileNav ].forEach(nav => {
    if (!nav) return;
    nav.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.category;
        renderCategoryNav();
        renderProductGrid();
      });
    });
  });
}

function renderProductGrid() {
  const grid = document.getElementById("productGrid");
  const titleEl = document.getElementById("sectionTitle");
  if (!grid) return;
  if (titleEl) titleEl.textContent = SECTION_TITLES[activeCategory] || "Cardápio";
  const items = PRODUCTS.filter(p => p.category === activeCategory);
  grid.innerHTML = "";
  if (items.length === 0) {
    grid.innerHTML = `<p class="empty-msg">Nenhum produto disponível nessa categoria no momento.</p>`;
    return;
  }
  items.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `\n      <div class="thumb">${productMediaHTML(product)}</div>\n      <div class="product-body">\n        <div class="product-name">${product.name}</div>\n        <div class="product-desc">${getDescription(product)}</div>\n        ${product.tag ? `<span class="tag-pill">${product.tag}</span>` : ""}\n        <div class="product-row">\n          <span class="product-price">${formatPrice(product.price)}</span>\n          <button class="add-btn" type="button">\n            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>\n            Adicionar\n          </button>\n        </div>\n      </div>\n    `;
    card.addEventListener("click", () => openProductModal(product));
    grid.appendChild(card);
  });
}

let modalState = null;

function initProductModal() {
  let overlay = document.getElementById("productModalOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "productModalOverlay";
    document.body.appendChild(overlay);
  }
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeProductModal();
  });
}

function openProductModal(product) {
  modalState = {
    product: product,
    qty: 1,
    removedIngredients: [],
    extras: {},
    notes: ""
  };
  renderProductModal();
  document.getElementById("productModalOverlay").classList.add("active");
}

function closeProductModal() {
  const overlay = document.getElementById("productModalOverlay");
  if (overlay) overlay.classList.remove("active");
  modalState = null;
}

function renderProductModal() {
  const overlay = document.getElementById("productModalOverlay");
  const {product: product} = modalState;
  const hasIngredients = product.ingredients && product.ingredients.length > 0;
  const productExtras = EXTRAS.filter(extra => (product.extraIds || []).includes(extra.id));
  const hasExtras = productExtras.length > 0;
  overlay.innerHTML = `\n    <div class="product-modal">\n      <button class="modal-close" id="modalCloseBtn">✕</button>\n      <div class="modal-image">${productMediaHTML(product)}</div>\n      <div class="modal-body">\n        <div class="modal-head">\n          <h2>${product.name}</h2>\n          <span class="modal-price">${formatPrice(product.price)}</span>\n        </div>\n        <p class="modal-desc">${getDescription(product)}</p>\n\n        ${hasIngredients ? `<div class="modal-section">\n                <div class="modal-section-title">Remover ingredientes</div>\n                <div class="pill-row" id="ingredientPills">\n                  ${product.ingredients.map(ing => `<button type="button" class="ingredient-pill" data-ing="${ing}"><span class="label">${ing}</span></button>`).join("")}\n                </div>\n              </div>` : ""}\n\n        ${hasExtras ? `<div class="modal-section">\n                <div class="modal-section-title">Adicionar extras</div>\n                <div class="pill-row" id="extraPills">\n                  ${productExtras.map(extra => `<button type="button" class="extra-pill" data-extra="${extra.id}">${extra.name} (+${formatPrice(extra.price)})</button>`).join("")}\n                </div>\n              </div>` : ""}\n\n        <div class="modal-section">\n          <div class="modal-section-title">Observações especiais</div>\n          <textarea class="modal-textarea" id="modalNotes" placeholder="Ex: ponto da massa bem al dente..."></textarea>\n        </div>\n\n        <div class="modal-footer">\n          <div class="qty-control">\n            <button type="button" id="modalQtyMinus">−</button>\n            <span id="modalQtyValue">1</span>\n            <button type="button" id="modalQtyPlus">+</button>\n          </div>\n          <button class="btn btn-primary" id="modalConfirmBtn">Confirmar e Adicionar</button>\n        </div>\n      </div>\n    </div>\n  `;
  document.getElementById("modalCloseBtn").addEventListener("click", closeProductModal);
  overlay.querySelectorAll("[data-ing]").forEach(btn => {
    btn.addEventListener("click", () => {
      const ing = btn.dataset.ing;
      const idx = modalState.removedIngredients.indexOf(ing);
      if (idx === -1) {
        modalState.removedIngredients.push(ing);
        btn.classList.add("removed");
        btn.innerHTML = `<span class="label">${ing}</span><span class="x">✕</span>`;
      } else {
        modalState.removedIngredients.splice(idx, 1);
        btn.classList.remove("removed");
        btn.innerHTML = `<span class="label">${ing}</span>`;
      }
    });
  });
  overlay.querySelectorAll("[data-extra]").forEach(btn => {
    btn.addEventListener("click", () => {
      const chave = btn.dataset.extra;
      const active = !!modalState.extras[chave];
      if (active) {
        delete modalState.extras[chave];
        btn.classList.remove("active");
      } else {
        modalState.extras[chave] = 1;
        btn.classList.add("active");
      }
    });
  });
  document.getElementById("modalNotes").addEventListener("input", e => {
    modalState.notes = e.target.value;
  });
  document.getElementById("modalQtyMinus").addEventListener("click", () => {
    modalState.qty = Math.max(1, modalState.qty - 1);
    document.getElementById("modalQtyValue").textContent = modalState.qty;
  });
  document.getElementById("modalQtyPlus").addEventListener("click", () => {
    modalState.qty += 1;
    document.getElementById("modalQtyValue").textContent = modalState.qty;
  });
  document.getElementById("modalConfirmBtn").addEventListener("click", () => {
    addToCart(modalState.product.id, modalState.qty, {
      removedIngredients: modalState.removedIngredients,
      extras: modalState.extras,
      notes: modalState.notes.trim()
    });
    showToast(`${modalState.product.name} adicionado ao pedido`);
    closeProductModal();
    renderOrderPanel();
    renderMobileOrderBar();
  });
}

function renderOrderPanel() {
  const panel = document.getElementById("orderPanel");
  if (!panel) return;
  const cart = getCart();
  const mesa = getMesaAtual();
  document.querySelectorAll(".order-mesa-tag").forEach(el => {
    el.textContent = mesa ? `Mesa ${String(mesa).padStart(2, "0")}` : "Sem mesa";
  });
  const linesEl = document.getElementById("orderLines");
  const emptyEl = document.getElementById("orderEmpty");
  const totalsEl = document.getElementById("orderTotals");
  const goToPaymentBtn = document.getElementById("goToPaymentBtn");
  if (cart.length === 0) {
    if (linesEl) linesEl.style.display = "none";
    if (totalsEl) totalsEl.style.display = "none";
    if (emptyEl) emptyEl.style.display = "block";
    if (goToPaymentBtn) goToPaymentBtn.setAttribute("disabled", "disabled");
    return;
  }
  if (emptyEl) emptyEl.style.display = "none";
  if (linesEl) linesEl.style.display = "flex";
  if (totalsEl) totalsEl.style.display = "flex";
  if (goToPaymentBtn) goToPaymentBtn.removeAttribute("disabled");
  if (linesEl) {
    linesEl.innerHTML = cart.map((item, index) => {
      const product = getProduct(item.productId);
      if (!product) return "";
      const summary = customizationSummary(item);
      return `\n        <div class="order-line-item">\n          <div class="order-line-thumb">${productMediaHTML(product)}</div>\n          <div class="order-line-main">\n            <div class="order-line-name">${product.name}</div>\n            ${summary ? `<div class="order-line-meta">${summary}</div>` : ""}\n            <div class="order-line-bottom">\n              <div class="mini-qty">\n                <button data-action="minus" data-index="${index}">−</button>\n                <span>${item.qty}</span>\n                <button data-action="plus" data-index="${index}">+</button>\n              </div>\n              <span class="order-line-price">${formatPrice(lineTotal(item))}</span>\n            </div>\n          </div>\n        </div>`;
    }).join("");
    linesEl.querySelectorAll("[data-action]").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = Number(btn.dataset.index);
        const dir = btn.dataset.action === "plus" ? 1 : -1;
        updateCartItemQty(index, cart[index].qty + dir);
        renderOrderPanel();
        renderMobileOrderBar();
      });
    });
  }
  const subtotal = cartSubtotal();
  const fee = serviceFeeAmount(subtotal);
  if (totalsEl) {
    totalsEl.innerHTML = `\n      <div class="order-total-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>\n      <div class="order-total-row"><span>Taxa de Serviço (${SERVICE_FEE_PERCENT}%)</span><span>${formatPrice(fee)}</span></div>\n      <div class="order-total-row grand"><span>Total</span><span>${formatPrice(subtotal + fee)}</span></div>\n    `;
  }
}

function renderMobileOrderBar() {
  const bar = document.getElementById("mobileOrderBar");
  if (!bar) return;
  const cart = getCart();
  if (cart.length === 0) {
    bar.classList.remove("has-items");
    bar.innerHTML = "";
    return;
  }
  bar.classList.add("has-items");
  bar.innerHTML = `\n    <span><span class="count">${cartTotalItems()}</span>Ver Pedido</span>\n    <span>${formatPrice(cartGrandTotal())}</span>\n  `;
}

function initCartPage() {
  renderFullCart();
}

function renderFullCart() {
  const list = document.getElementById("cartList");
  const emptyState = document.getElementById("cartEmpty");
  const summary = document.getElementById("cartSummary");
  const cart = getCart();
  if (cart.length === 0) {
    list.innerHTML = "";
    emptyState.style.display = "block";
    summary.style.display = "none";
    return;
  }
  emptyState.style.display = "none";
  summary.style.display = "block";
  list.innerHTML = "";
  cart.forEach((item, index) => {
    const product = getProduct(item.productId);
    if (!product) return;
    const summaryText = customizationSummary(item);
    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `\n      <div class="cart-thumb">${productMediaHTML(product)}</div>\n      <div class="cart-item-main">\n        <div class="cart-item-top">\n          <div>\n            <div class="cart-item-name">${product.name}</div>\n            ${summaryText ? `<div class="cart-item-meta">${summaryText}</div>` : ""}\n          </div>\n          <button class="remove-link" data-action="remove">Remover</button>\n        </div>\n        <div class="cart-item-actions">\n          <div class="mini-qty">\n            <button data-action="minus">−</button>\n            <span>${item.qty}</span>\n            <button data-action="plus">+</button>\n          </div>\n          <strong>${formatPrice(lineTotal(item))}</strong>\n        </div>\n      </div>\n    `;
    el.querySelector('[data-action="remove"]').addEventListener("click", () => {
      removeCartItem(index);
      renderFullCart();
    });
    el.querySelector('[data-action="minus"]').addEventListener("click", () => {
      updateCartItemQty(index, item.qty - 1);
      renderFullCart();
    });
    el.querySelector('[data-action="plus"]').addEventListener("click", () => {
      updateCartItemQty(index, item.qty + 1);
      renderFullCart();
    });
    list.appendChild(el);
  });
  const subtotal = cartSubtotal();
  const fee = serviceFeeAmount(subtotal);
  document.getElementById("cartSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("cartFee").textContent = formatPrice(fee);
  document.getElementById("cartTotal").textContent = formatPrice(subtotal + fee);
}

let selectedPayment = "pix";

let splitPeople = 1;

function initCheckoutPage() {
  const cart = getCart();
  const mesa = getMesaAtual();
  const mainEl = document.getElementById("checkoutMain");
  const noMesaEl = document.getElementById("noMesaWarning");
  if (!mesa) {
    if (mainEl) mainEl.style.display = "none";
    if (noMesaEl) noMesaEl.style.display = "block";
    return;
  }
  if (noMesaEl) noMesaEl.style.display = "none";
  if (cart.length === 0) {
    document.getElementById("emptyCheckout").style.display = "block";
    document.getElementById("checkoutMain").style.display = "none";
    return;
  }
  renderBillLines();
  renderSplitCard();
  renderCheckoutTotals();
  renderPaymentOptions();
  document.getElementById("splitMinus").addEventListener("click", () => {
    splitPeople = Math.max(1, splitPeople - 1);
    renderSplitCard();
  });
  document.getElementById("splitPlus").addEventListener("click", () => {
    splitPeople += 1;
    renderSplitCard();
  });
  document.getElementById("confirmOrderBtn").addEventListener("click", submitOrder);
}

function renderBillLines() {
  const wrap = document.getElementById("billLines");
  const cart = getCart();
  wrap.innerHTML = cart.map(item => {
    const product = getProduct(item.productId);
    if (!product) return "";
    const summary = customizationSummary(item);
    return `\n      <div class="bill-line">\n        <span class="name"><span class="qty">${item.qty}x</span>${product.name}${summary ? `<br><small style="color:var(--muted);font-weight:400;">${summary}</small>` : ""}</span>\n        <strong>${formatPrice(lineTotal(item))}</strong>\n      </div>`;
  }).join("");
}

function renderSplitCard() {
  const subtotal = cartSubtotal();
  const total = subtotal + serviceFeeAmount(subtotal);
  document.getElementById("splitCount").textContent = splitPeople;
  document.getElementById("splitEach").textContent = formatPrice(total / splitPeople);
}

function renderCheckoutTotals() {
  const subtotal = cartSubtotal();
  const fee = serviceFeeAmount(subtotal);
  document.getElementById("checkoutSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("checkoutFee").textContent = formatPrice(fee);
  document.getElementById("checkoutTotal").textContent = formatPrice(subtotal + fee);
}

function renderPaymentOptions() {
  const wrap = document.getElementById("paymentOptions");
  wrap.innerHTML = PAYMENT_METHODS.map(method => `\n    <div class="payment-card ${method.id === selectedPayment ? "selected" : ""}" data-payment="${method.id}">\n      <div class="payment-icon">${PAYMENT_ICONS[method.id] || ""}</div>\n      <div class="payment-info">\n        <div class="title">${method.title}</div>\n        <div class="desc">${method.desc}</div>\n      </div>\n      ${method.showQr ? `<div class="qr-mock">${"<span></span>".repeat(9)}</div>` : ""}\n    </div>`).join("");
  wrap.querySelectorAll("[data-payment]").forEach(card => {
    card.addEventListener("click", () => {
      selectedPayment = card.dataset.payment;
      renderPaymentOptions();
    });
  });
}

async function submitOrder() {
  const cart = getCart();
  const mesa = getMesaAtual();
  if (cart.length === 0) {
    showToast("Seu pedido está vazio");
    return;
  }
  if (!mesa) {
    showToast("Selecione sua mesa antes de continuar");
    openMesaModal();
    return;
  }
  const btn = document.getElementById("confirmOrderBtn");
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = "Enviando...";
  try {
    const data = await Store.criarPedido({
      mesa: mesa,
      forma_pagamento: selectedPayment,
      dividir_pessoas: splitPeople,
      itens: cart.map(item => ({
        productId: item.productId,
        qty: item.qty,
        removedIngredients: item.removedIngredients,
        extras: item.extras,
        notes: item.notes
      }))
    });
    if (!data.sucesso) {
      throw new Error(data.erro || "Falha ao enviar o pedido");
    }
    document.getElementById("checkoutMain").style.display = "none";
    const success = document.getElementById("successPanel");
    success.style.display = "block";
    success.querySelector(".order-table").textContent = `Mesa ${mesa}`;
    const paymentMethod = PAYMENT_METHODS.find(m => m.id === selectedPayment);
    success.querySelector(".order-payment").textContent = paymentMethod ? paymentMethod.title : selectedPayment;
    clearCart();
  } catch (err) {
    showToast(err.message || "Não foi possível enviar o pedido. Tente novamente.");
    btn.disabled = false;
    btn.textContent = originalText;
  }
}
