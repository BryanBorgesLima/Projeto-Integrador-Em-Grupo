// Constantes e helpers compartilhados pelo site do cliente e pelo admin.
//
// PRODUCTS e EXTRAS não são mais fixos aqui — cada página PHP injeta os dados
// reais do banco (MySQL) num <script> antes deste arquivo ser carregado:
//   <script>const PRODUCTS = [...];</script>
//   <script>const EXTRAS = [...];</script>
//   <script src="js/data.js"></script>
// Se por algum motivo a página não injetar nada, caímos em listas vazias.
if (typeof PRODUCTS === "undefined") { var PRODUCTS = []; }
if (typeof EXTRAS === "undefined") { var EXTRAS = []; }

const CATEGORY_LABELS = {
  entradas: "Entradas",
  salgados: "Salgados",
  bebidas: "Bebidas",
  sobremesas: "Sobremesas",
};

// Opções genéricas de preparo, mostradas na tela de detalhe do produto
const PRODUCT_OPTIONS = ["Tradicional", "Picante"];

// Formas de pagamento disponíveis na finalização do pedido
const PAYMENT_METHODS = ["Dinheiro", "Cartão", "Pix"];

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}

function getDescription(product) {
  return `${product.name} preparado na hora com ingredientes frescos e selecionados, no estilo Sapori di Luna. Sabor de verdade, direto pra sua mesa.`;
}

function formatPrice(value) {
  return "R$ " + Number(value).toFixed(2).replace(".", ",");
}

// Enquanto não há fotos reais, mostramos uma caixa preta com um ícone simples.
// Para usar uma imagem, edite o produto no banco e preencha a coluna `imagem`.
const PLACEHOLDER_ICON_SVG = `<svg width="1.4em" height="1.4em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="9" cy="9" r="1.6"></circle><path d="M21 15l-5.2-5.2a2 2 0 0 0-2.8 0L5 18"></path></svg>`;

function productMediaHTML(product) {
  if (product.image) {
    return `<img src="${product.image}" alt="${product.name}">`;
  }
  return PLACEHOLDER_ICON_SVG;
}
