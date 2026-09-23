// Constantes e helpers compartilhados pelo site do cliente e pelo admin.
//
// PRODUCTS e EXTRAS não são fixos aqui — cada página PHP injeta os dados
// reais do banco (MySQL) num <script> antes deste arquivo ser carregado:
//   <script>const PRODUCTS = [...];</script>
//   <script>const EXTRAS = [...];</script>
//   <script>const SERVICE_FEE_PERCENT = 10;</script>
//   <script src="js/data.js"></script>
// Se por algum motivo a página não injetar nada, caímos em valores padrão.
if (typeof PRODUCTS === "undefined") { var PRODUCTS = []; }
if (typeof EXTRAS === "undefined") { var EXTRAS = []; }
if (typeof SERVICE_FEE_PERCENT === "undefined") { var SERVICE_FEE_PERCENT = 10; }

const CATEGORY_LABELS = {
  entradas: "Entradas",
  principais: "Principais",
  bebidas: "Bebidas",
  sobremesas: "Sobremesas",
};

// Ícones de linha (mesmo estilo do wireframe) usados na navegação de categorias.
const CATEGORY_ICONS = {
  entradas: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10c0 5 4 9 9 9s9-4 9-9"/><path d="M3 10h18"/><path d="M3 10c0-3 2-6 4-7"/></svg>`,
  principais: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2"/><path d="M9 11v11"/><path d="M17 2c-1.5 0-3 1.5-3 4v3.5c0 1 .5 1.5 1.5 1.5H17"/><path d="M17 2v20"/></svg>`,
  bebidas: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8l-1.5 9a2.5 2.5 0 0 1-2.5 2h0a2.5 2.5 0 0 1-2.5-2L8 3z"/><path d="M12 14v7"/><path d="M9 21h6"/></svg>`,
  sobremesas: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21v-6a8 8 0 0 1 16 0v6"/><path d="M4 21h16"/><path d="M4 15h16"/><path d="M12 7V3"/><path d="M12 3c-1 0-1.5.6-1.5 1.3S11 6 12 6s1.5-.6 1.5-1.3S13 3 12 3z"/></svg>`,
};

// Ícones usados nos cards de forma de pagamento (finalizacao.php)
const PAYMENT_ICONS = {
  pix: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v3M17 20h4"/></svg>`,
  garcom: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 11h20"/><path d="M7 16h.01"/></svg>`,
  balcao: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/></svg>`,
};

// Formas de pagamento disponíveis na finalização do pedido — combina com o wireframe de checkout.
const PAYMENT_METHODS = [
  { id: "pix", title: "Pague com PIX QR Code", desc: "Escaneie com o app do seu banco. O pagamento é confirmado na hora.", showQr: true },
  { id: "garcom", title: "Pagar com o Garçom", desc: "Solicitar maquininha de cartão na mesa." },
  { id: "balcao", title: "Pagar no Balcão", desc: "Finalize e pague diretamente no caixa de saída." },
];

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

function getDescription(product) {
  if (product.description && product.description.trim()) return product.description;
  return `${product.name} preparado na hora com ingredientes frescos e selecionados. Sabor de verdade, direto pra sua mesa.`;
}

function formatPrice(value) {
  return "R$ " + Number(value).toFixed(2).replace(".", ",");
}

// Raiz do projeto (ex: http://localhost/restaurante/), descoberta a partir do próprio
// endereço deste arquivo. Assim um caminho salvo no banco como "img/produtos/x.svg"
// funciona igual em qualquer página, esteja ela na raiz ou dentro de pages/.
const APP_ROOT = (function () {
  const src = document.currentScript && document.currentScript.src;
  return src ? src.replace(/js\/data\.js(\?.*)?$/, "") : "../";
})();

// Converte o valor do campo "imagem" num endereço utilizável pelo navegador.
// URLs completas (https://...) e caminhos absolutos (/...) passam direto.
function resolveImageSrc(path) {
  if (!path) return "";
  if (/^(https?:|data:|\/)/i.test(path)) return path;
  return APP_ROOT + path.replace(/^\.?\//, "");
}

function escapeAttrValue(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Enquanto não há foto cadastrada (ou se o arquivo sumiu), mostramos uma caixa neutra com um ícone de prato.
const PLACEHOLDER_ICON_SVG = `<svg width="1.6em" height="1.6em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.2"/></svg>`;

// Chamado pelo onerror das imagens: troca a imagem quebrada pelo ícone neutro.
window.handleImageError = function (img) {
  img.onerror = null;
  img.outerHTML = PLACEHOLDER_ICON_SVG;
};

function imageTagHTML(path, alt) {
  const src = resolveImageSrc(path);
  if (!src) return PLACEHOLDER_ICON_SVG;
  return `<img src="${escapeAttrValue(src)}" alt="${escapeAttrValue(alt)}" loading="lazy" decoding="async" onerror="handleImageError(this)">`;
}

function productMediaHTML(product) {
  return imageTagHTML(product && product.image, product ? product.name : "");
}
