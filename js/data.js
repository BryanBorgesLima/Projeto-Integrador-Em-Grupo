if (typeof PRODUCTS === "undefined") {
  var PRODUCTS = [];
}

if (typeof EXTRAS === "undefined") {
  var EXTRAS = [];
}

if (typeof SERVICE_FEE_PERCENT === "undefined") {
  var SERVICE_FEE_PERCENT = 10;
}

const CATEGORY_LABELS = {
  entradas: "Entradas",
  principais: "Principais",
  bebidas: "Bebidas",
  sobremesas: "Sobremesas"
};

const CATEGORY_ICONS = {
  entradas: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10c0 5 4 9 9 9s9-4 9-9"/><path d="M3 10h18"/><path d="M3 10c0-3 2-6 4-7"/></svg>`,
  principais: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2"/><path d="M9 11v11"/><path d="M17 2c-1.5 0-3 1.5-3 4v3.5c0 1 .5 1.5 1.5 1.5H17"/><path d="M17 2v20"/></svg>`,
  bebidas: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8l-1.5 9a2.5 2.5 0 0 1-2.5 2h0a2.5 2.5 0 0 1-2.5-2L8 3z"/><path d="M12 14v7"/><path d="M9 21h6"/></svg>`,
  sobremesas: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21v-6a8 8 0 0 1 16 0v6"/><path d="M4 21h16"/><path d="M4 15h16"/><path d="M12 7V3"/><path d="M12 3c-1 0-1.5.6-1.5 1.3S11 6 12 6s1.5-.6 1.5-1.3S13 3 12 3z"/></svg>`
};

const PAYMENT_ICONS = {
  pix: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v3M17 20h4"/></svg>`,
  garcom: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 11h20"/><path d="M7 16h.01"/></svg>`,
  balcao: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/></svg>`
};

const PAYMENT_METHODS = [ {
  id: "pix",
  title: "Pague com PIX QR Code",
  desc: "Escaneie com o app do seu banco. O pagamento é confirmado na hora.",
  showQr: true
}, {
  id: "garcom",
  title: "Pagar com o Garçom",
  desc: "Solicitar maquininha de cartão na mesa."
}, {
  id: "balcao",
  title: "Pagar no Balcão",
  desc: "Finalize e pague diretamente no caixa de saída."
} ];

function getProduct(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function getDescription(product) {
  if (product.description && product.description.trim()) return product.description;
  return `${product.name} preparado na hora com ingredientes frescos e selecionados. Sabor de verdade, direto pra sua mesa.`;
}

function formatPrice(value) {
  return "R$ " + Number(value).toFixed(2).replace(".", ",");
}

const PLACEHOLDER_ICON_SVG = `<svg width="1.6em" height="1.6em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.2"/></svg>`;

function productMediaHTML(product) {
  if (product.image) {
    return `<img src="${product.image}" alt="${product.name}" loading="lazy">`;
  }
  return PLACEHOLDER_ICON_SVG;
}
