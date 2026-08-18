// Roteamento simples: cada página é identificada por data-page no <body>
document.addEventListener("DOMContentLoaded", () => {
  initHeaderSearch();
  const page = document.body.dataset.page;
  if (page === "menu") initMenuPage();
  if (page === "produto") initProductPage();
  if (page === "carrinho") initCartPage();
  if (page === "finalizacao") initCheckoutPage();
});

function initHeaderSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) input.value = params.get("q");

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      window.location.href = "menu.php?q=" + encodeURIComponent(input.value.trim());
    }
  });
  // filtro ao vivo apenas na própria página de menu
  if (document.body.dataset.page === "menu") {
    input.addEventListener("input", () => renderProductGrid());
  }
}

/* ===================== MENU ===================== */
let activeCategory = "entradas";

function initMenuPage() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) activeCategory = null; // busca livre ignora a aba

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      activeCategory = tab.dataset.category;
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const input = document.getElementById("searchInput");
      if (input) input.value = "";
      renderProductGrid();
    });
    if (activeCategory && tab.dataset.category === activeCategory) {
      tab.classList.add("active");
    }
  });

  renderFeatured();
  renderProductGrid();
}

function renderProductGrid() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  const query = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();

  let items = PRODUCTS.filter((p) => !p.featured);
  if (query) {
    items = items.filter((p) => p.name.toLowerCase().includes(query));
  } else if (activeCategory) {
    items = items.filter((p) => p.category === activeCategory);
  }

  grid.innerHTML = "";
  if (items.length === 0) {
    grid.innerHTML = `<p class="empty-msg">Nenhum produto encontrado.</p>`;
    return;
  }

  items.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <a href="produto.php?id=${product.id}">
        <div class="thumb">${productMediaHTML(product)}</div>
      </a>
      <div class="product-body">
        <a href="produto.php?id=${product.id}" class="product-name">${product.name}</a>
        <div class="product-row">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="add-btn" title="Adicionar ao carrinho">+</button>
        </div>
      </div>
    `;
    card.querySelector(".add-btn").addEventListener("click", () => {
      addToCart(product.id, 1, {});
      showToast(`${product.name} adicionado ao carrinho`);
    });
    grid.appendChild(card);
  });
}

function renderFeatured() {
  const wrap = document.getElementById("featuredList");
  if (!wrap) return;
  const items = PRODUCTS.filter((p) => p.featured);
  wrap.innerHTML = "";
  items.forEach((product) => {
    const card = document.createElement("div");
    card.className = "featured-card";
    card.innerHTML = `
      <div class="featured-thumb">${productMediaHTML(product)}</div>
      <div class="featured-info">
        <div class="name">${product.name}</div>
        <div class="tag">${product.tag || ""}</div>
        <div class="price">${formatPrice(product.price)}</div>
      </div>
      <button class="btn btn-green btn-sm">Pedir</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      addToCart(product.id, 1, {});
      showToast(`${product.name} adicionado ao carrinho`);
    });
    wrap.appendChild(card);
  });
}

/* ===================== PRODUTO ===================== */
let selectedOption = PRODUCT_OPTIONS[0];
let currentQty = 1;

function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const product = getProduct(params.get("id")) || PRODUCTS[0];

  document.getElementById("productMedia").innerHTML = productMediaHTML(product);
  document.getElementById("productCategory").textContent = CATEGORY_LABELS[product.category];
  document.getElementById("productName").textContent = product.name;
  document.getElementById("productDesc").textContent = getDescription(product);

  const optionsWrap = document.getElementById("productOptions");
  optionsWrap.innerHTML = "";
  PRODUCT_OPTIONS.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-pill" + (opt === selectedOption ? " selected" : "");
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      selectedOption = opt;
      optionsWrap.querySelectorAll(".option-pill").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
    optionsWrap.appendChild(btn);
  });

  const priceEl = document.getElementById("productPrice");
  const qtyEl = document.getElementById("qtyValue");
  const updatePrice = () => {
    priceEl.textContent = formatPrice(product.price * currentQty);
    qtyEl.textContent = currentQty;
  };
  updatePrice();

  document.getElementById("qtyMinus").addEventListener("click", () => {
    currentQty = Math.max(1, currentQty - 1);
    updatePrice();
  });
  document.getElementById("qtyPlus").addEventListener("click", () => {
    currentQty += 1;
    updatePrice();
  });

  document.getElementById("addToCartBtn").addEventListener("click", () => {
    addToCart(product.id, currentQty, { opcao: selectedOption });
    showToast("Adicionado à sacola!");
    currentQty = 1;
    updatePrice();
  });

  renderRelated(product);
}

function renderRelated(product) {
  const wrap = document.getElementById("relatedGrid");
  if (!wrap) return;
  let related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);
  if (related.length < 4) {
    related = related.concat(PRODUCTS.filter((p) => p.id !== product.id && !related.includes(p)));
  }
  related = related.slice(0, 4);

  wrap.innerHTML = "";
  related.forEach((p) => {
    const card = document.createElement("a");
    card.href = `produto.php?id=${p.id}`;
    card.className = "product-card";
    card.innerHTML = `
      <div class="thumb">${productMediaHTML(p)}</div>
      <div class="product-body">
        <span class="product-name">${p.name}</span>
        <div class="product-row"><span class="product-price">${formatPrice(p.price)}</span></div>
      </div>
    `;
    wrap.appendChild(card);
  });
}

/* ===================== CARRINHO ===================== */
function initCartPage() {
  renderCart();
}

function renderCart() {
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
    const opcao = item.extras && item.extras.opcao ? item.extras.opcao : null;

    const el = document.createElement("div");
    el.className = "cart-item";
    el.innerHTML = `
      <div class="cart-thumb">${productMediaHTML(product)}</div>
      <div class="cart-item-main">
        <div class="cart-item-top">
          <div>
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-price">${formatPrice(product.price)}${opcao ? " · " + opcao : ""}</div>
          </div>
          <button class="remove-link" data-action="remove">Remover</button>
        </div>
        <div class="cart-item-actions">
          <div class="mini-qty">
            <button data-action="minus">−</button>
            <span>${item.qty}</span>
            <button data-action="plus">+</button>
          </div>
          <button class="extras-toggle" data-action="toggle-extras">Personalizar ingredientes ▾</button>
        </div>
        <div class="extras-panel" id="extras-${index}">
          ${EXTRAS.map(
            (extra) => `
            <div class="extra-row">
              <span>${extra.name} (+${formatPrice(extra.price)})</span>
              <div class="mini-qty">
                <button data-extra="${extra.id}" data-dir="-1">−</button>
                <span>${(item.extras && item.extras[extra.id]) || 0}</span>
                <button data-extra="${extra.id}" data-dir="1">+</button>
              </div>
            </div>`
          ).join("")}
        </div>
      </div>
    `;

    el.querySelector('[data-action="remove"]').addEventListener("click", () => removeCartItem(index) || renderCart());
    el.querySelector('[data-action="minus"]').addEventListener("click", () => {
      updateCartItemQty(index, item.qty - 1);
      renderCart();
    });
    el.querySelector('[data-action="plus"]').addEventListener("click", () => {
      updateCartItemQty(index, item.qty + 1);
      renderCart();
    });
    el.querySelector('[data-action="toggle-extras"]').addEventListener("click", () => {
      document.getElementById(`extras-${index}`).classList.toggle("open");
    });
    el.querySelectorAll("[data-extra]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const extraId = btn.dataset.extra;
        const dir = Number(btn.dataset.dir);
        const current = (item.extras && item.extras[extraId]) || 0;
        updateCartItemExtra(index, extraId, current + dir);
        renderCart();
        document.getElementById(`extras-${index}`).classList.add("open");
      });
    });

    list.appendChild(el);
  });

  document.getElementById("cartSubtotal").textContent = formatPrice(cartSubtotal());
  document.getElementById("cartTotal").textContent = formatPrice(cartSubtotal());
}

/* ===================== FINALIZAÇÃO ===================== */
let selectedPayment = null;

function initCheckoutPage() {
  renderCheckoutSummary();

  const paymentWrap = document.getElementById("paymentOptions");
  paymentWrap.innerHTML = "";
  PAYMENT_METHODS.forEach((method) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-pill";
    btn.textContent = method;
    btn.addEventListener("click", () => {
      selectedPayment = method;
      paymentWrap.querySelectorAll(".option-pill").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
    paymentWrap.appendChild(btn);
  });

  const tableSelect = document.getElementById("numeroMesa");

  const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cart = getCart();
    if (cart.length === 0) {
      showToast("Seu carrinho está vazio");
      return;
    }
    const mesa = tableSelect.value;
    if (!selectedPayment || !mesa) {
      showToast("Selecione a forma de pagamento e a mesa");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    try {
      const response = await fetch("../api/criar_pedido.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mesa: Number(mesa),
          forma_pagamento: selectedPayment,
          itens: cart.map((item) => ({ productId: item.productId, qty: item.qty, extras: item.extras })),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.sucesso) {
        throw new Error(data.erro || "Falha ao enviar o pedido");
      }

      document.getElementById("checkoutMain").style.display = "none";
      const success = document.getElementById("successPanel");
      success.style.display = "block";
      success.querySelector(".order-table").textContent = `Mesa ${mesa}`;
      success.querySelector(".order-payment").textContent = selectedPayment;
      clearCart();
    } catch (err) {
      showToast(err.message || "Não foi possível enviar o pedido. Tente novamente.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Finalizar Compra";
    }
  });
}

function renderCheckoutSummary() {
  const list = document.getElementById("orderLines");
  const cart = getCart();
  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = `<p class="empty-msg">Seu carrinho está vazio.</p>`;
  } else {
    list.innerHTML = cart
      .map((item) => {
        const product = getProduct(item.productId);
        if (!product) return "";
        return `
        <div class="order-line">
          <span style="display:flex;align-items:center;gap:10px;">
            <span class="order-thumb">${productMediaHTML(product)}</span>
            <span>${product.name}<br><small style="color:var(--muted)">Qtd: ${item.qty}</small></span>
          </span>
          <strong>${formatPrice(lineTotal(item))}</strong>
        </div>`;
      })
      .join("");
  }

  document.getElementById("checkoutSubtotal").textContent = formatPrice(cartSubtotal());
  document.getElementById("checkoutTotal").textContent = formatPrice(cartSubtotal());
}
