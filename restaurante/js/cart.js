// Persistência simples do carrinho via localStorage
const CART_KEY = "ect_cart";

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

function addToCart(productId, qty = 1, extras = {}) {
  const cart = getCart();
  const extrasKey = JSON.stringify(extras);
  const existing = cart.find(
    (item) => item.productId === productId && JSON.stringify(item.extras || {}) === extrasKey
  );
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ productId, qty, extras });
  }
  saveCart(cart);
}

function updateCartItemQty(index, qty) {
  const cart = getCart();
  if (!cart[index]) return;
  cart[index].qty = Math.max(1, qty);
  saveCart(cart);
}

function updateCartItemExtra(index, extraId, qty) {
  const cart = getCart();
  if (!cart[index]) return;
  if (!cart[index].extras) cart[index].extras = {};
  cart[index].extras[extraId] = Math.max(0, qty);
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
    const extra = EXTRAS.find((e) => e.id === id);
    return sum + (extra ? extra.price * qty : 0);
  }, 0);
}

function lineTotal(item) {
  const product = getProduct(item.productId);
  if (!product) return 0;
  return product.price * item.qty + extrasTotal(item.extras);
}

function cartSubtotal() {
  return getCart().reduce((sum, item) => sum + lineTotal(item), 0);
}

function updateCartBadge() {
  document.querySelectorAll("#cartBadge").forEach((el) => {
    el.textContent = cartTotalItems();
  });
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
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
