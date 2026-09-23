// TABLES, PRODUCTS, REPORTS, EXTRAS_ADMIN, CHAMADOS e DASHBOARD vêm do banco (injetados por pages/admin.php).
// Este arquivo só guarda pequenas constantes fixas usadas na renderização.
if (typeof TABLES === "undefined") { var TABLES = []; }
if (typeof REPORTS === "undefined") { var REPORTS = []; }
if (typeof EXTRAS_ADMIN === "undefined") { var EXTRAS_ADMIN = []; }
if (typeof CHAMADOS === "undefined") { var CHAMADOS = []; }
if (typeof DASHBOARD === "undefined") { var DASHBOARD = null; }

// Categorias válidas do cardápio, na ordem em que aparecem pro cliente.
const CATEGORY_ORDER_ADMIN = ["entradas", "principais", "bebidas", "sobremesas"];

const ORDER_STATUS_FLOW = ["preparando", "pronto", "entregue"];
const ORDER_STATUS_LABELS = {
  preparando: "Preparando",
  pronto: "Pronto",
  entregue: "Entregue",
};

// Tiles da galeria de mídia do cardápio (só demonstração local, sem upload real)
const MEDIA_TILES = [
  { key: "salao", label: "Fotos principais do salão", kind: "wide", section: "photo" },
  { key: "recentes", label: "Fotos recentes", kind: "row", section: "photo" },
  { key: "pratos", label: "Fotos de pratos", kind: "row", section: "photo" },
  { key: "video1", label: "Vídeo institucional.mp4", kind: "video", section: "video" },
  { key: "video2", label: "Preparo na cozinha.mp4", kind: "video", section: "video" },
];
