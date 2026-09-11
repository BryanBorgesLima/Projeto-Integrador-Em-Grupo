const CART_KEY = "sm_cart";

const MESA_KEY = "sm_mesa";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function customizationKey(customization) {
  const c = customization || {};
  return JSON.stringify({
    removedIngredients: (c.removedIngredients || []).slice().sort(),
    extras: c.extras || {},
    notes: c.notes || ""
  });
}

function addToCart(productId, qty = 1, customization = {}) {
  const cart = getCart();
  const key = customizationKey(customization);
  const existing = cart.find(item => item.productId === productId && customizationKey(item) === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      productId: productId,
      qty: qty,
      removedIngredients: customization.removedIngredients || [],
      extras: customization.extras || {},
      notes: customization.notes || ""
    });
  }
  saveCart(cart);
}

function updateCartItemQty(index, qty) {
  const cart = getCart();
  if (!cart[index]) return;
  if (qty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].qty = qty;
  }
  saveCart(cart);
}

function removeCartItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function cartTotalItems() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function extrasTotal(extras) {
  if (!extras) return 0;
  return Object.entries(extras).reduce((sum, [id, qty]) => {
    const extra = EXTRAS.find(e => e.id === id);
    return sum + (extra ? extra.price * qty : 0);
  }, 0);
}

function lineTotal(item) {
  const product = getProduct(item.productId);
  if (!product) return 0;
  return (product.price + extrasTotal(item.extras)) * item.qty;
}

function cartSubtotal() {
  return getCart().reduce((sum, item) => sum + lineTotal(item), 0);
}

function serviceFeeAmount(subtotal) {
  return subtotal * (Number(SERVICE_FEE_PERCENT) / 100);
}

function cartGrandTotal() {
  const subtotal = cartSubtotal();
  return subtotal + serviceFeeAmount(subtotal);
}

function updateCartBadge() {
  const count = cartTotalItems();
  document.querySelectorAll("#cartBadge").forEach(el => {
    el.textContent = count;
  });
}

function customizationSummary(item) {
  const parts = [];
  if (item.removedIngredients && item.removedIngredients.length) {
    parts.push("Sem " + item.removedIngredients.join(", "));
  }
  if (item.extras) {
    Object.entries(item.extras).forEach(([chave, qty]) => {
      if (qty > 0) {
        const extra = EXTRAS.find(e => e.id === chave);
        if (extra) parts.push(`+${qty}x ${extra.name}`);
      }
    });
  }
  if (item.notes) parts.push(`Obs: ${item.notes}`);
  return parts.join(" · ");
}

function getMesaAtual() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("mesa");
  if (fromUrl && Number(fromUrl) > 0) {
    setMesaAtual(Number(fromUrl));
    return Number(fromUrl);
  }
  const stored = localStorage.getItem(MESA_KEY);
  return stored ? Number(stored) : null;
}

function setMesaAtual(numero) {
  localStorage.setItem(MESA_KEY, String(numero));
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
