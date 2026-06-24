// dados.js
// Este arquivo só guarda os dados "de fábrica" do sistema (arrays simulados).
// Eles são usados pelo armazenamento.js apenas na primeira vez que o site abre,
// para preencher o localStorage. Depois disso, quem manda é o localStorage.

// Categorias do cardápio
const categoriasIniciais = [
  { id: 1, nome: "Entradas", icone: "🥗" },
  { id: 2, nome: "Pratos Principais", icone: "🍽️" },
  { id: 3, nome: "Pizzas", icone: "🍕" },
  { id: 4, nome: "Bebidas", icone: "🥤" },
  { id: 5, nome: "Sobremesas", icone: "🍰" },
];

// Produtos do cardápio (cada produto pertence a uma categoria pelo categoriaId)
const produtosIniciais = [
  { id: 1, nome: "Bruschetta Italiana", categoriaId: 1, preco: 18.90, descricao: "Pão italiano grelhado com tomate, manjericão e azeite.", emoji: "🍞", disponivel: true },
  { id: 2, nome: "Carpaccio de Carne", categoriaId: 1, preco: 24.50, descricao: "Finas lâminas de carne com alcaparras e parmesão.", emoji: "🥩", disponivel: true },
  { id: 3, nome: "Salada Caprese", categoriaId: 1, preco: 16.90, descricao: "Tomate, muçarela de búfala e manjericão fresco.", emoji: "🍅", disponivel: true },
  { id: 4, nome: "Filé ao Molho Madeira", categoriaId: 2, preco: 64.90, descricao: "Filé mignon grelhado ao molho madeira com legumes.", emoji: "🥩", disponivel: true },
  { id: 5, nome: "Frango à Parmegiana", categoriaId: 2, preco: 48.90, descricao: "Filé de frango empanado com molho de tomate e queijo.", emoji: "🍗", disponivel: true },
  { id: 6, nome: "Risoto de Camarão", categoriaId: 2, preco: 56.90, descricao: "Arroz cremoso com camarões frescos e ervas.", emoji: "🍤", disponivel: true },
  { id: 7, nome: "Espaguete à Carbonara", categoriaId: 2, preco: 42.90, descricao: "Massa fresca com bacon, ovos e queijo parmesão.", emoji: "🍝", disponivel: true },
  { id: 8, nome: "Pizza Margherita", categoriaId: 3, preco: 39.90, descricao: "Molho de tomate, muçarela e manjericão fresco.", emoji: "🍕", disponivel: true },
  { id: 9, nome: "Pizza Pepperoni", categoriaId: 3, preco: 44.90, descricao: "Molho de tomate, muçarela e pepperoni.", emoji: "🍕", disponivel: true },
  { id: 10, nome: "Pizza Quatro Queijos", categoriaId: 3, preco: 46.90, descricao: "Muçarela, gorgonzola, parmesão e provolone.", emoji: "🍕", disponivel: true },
  { id: 11, nome: "Coca-Cola 350ml", categoriaId: 4, preco: 7.90, descricao: "Lata bem gelada.", emoji: "🥤", disponivel: true },
  { id: 12, nome: "Suco de Laranja Natural", categoriaId: 4, preco: 9.90, descricao: "Suco natural feito na hora.", emoji: "🧃", disponivel: true },
  { id: 13, nome: "Água com Gás", categoriaId: 4, preco: 5.50, descricao: "Garrafa 500ml.", emoji: "💧", disponivel: true },
  { id: 14, nome: "Taça de Vinho Tinto", categoriaId: 4, preco: 22.00, descricao: "Vinho tinto seco da casa.", emoji: "🍷", disponivel: true },
  { id: 15, nome: "Tiramisu", categoriaId: 5, preco: 19.90, descricao: "Clássico doce italiano com café e mascarpone.", emoji: "🍰", disponivel: true },
  { id: 16, nome: "Petit Gateau", categoriaId: 5, preco: 21.90, descricao: "Bolo de chocolate quente com sorvete de creme.", emoji: "🍫", disponivel: true },
  { id: 17, nome: "Pudim de Leite", categoriaId: 5, preco: 14.90, descricao: "Pudim de leite condensado com calda de caramelo.", emoji: "🍮", disponivel: true },
];

// Mesas do restaurante (status: "livre", "ocupada" ou "reservada")
const mesasIniciais = [
  { id: 1, numero: 1, lugares: 2, status: "livre" },
  { id: 2, numero: 2, lugares: 2, status: "ocupada" },
  { id: 3, numero: 3, lugares: 4, status: "livre" },
  { id: 4, numero: 4, lugares: 4, status: "reservada" },
  { id: 5, numero: 5, lugares: 4, status: "livre" },
  { id: 6, numero: 6, lugares: 6, status: "livre" },
  { id: 7, numero: 7, lugares: 6, status: "ocupada" },
  { id: 8, numero: 8, lugares: 8, status: "livre" },
];

// Pedidos de exemplo (já cobrindo os 4 status, para os relatórios não começarem vazios)
const pedidosIniciais = [
  {
    id: 1,
    cliente: { nome: "Carlos Mendes", telefone: "(11) 98888-1234" },
    tipo: "mesa",
    mesa: 2,
    endereco: "",
    itens: [
      { produtoId: 4, nome: "Filé ao Molho Madeira", preco: 64.90, quantidade: 2, emoji: "🥩" },
      { produtoId: 11, nome: "Coca-Cola 350ml", preco: 7.90, quantidade: 2, emoji: "🥤" },
    ],
    total: 145.60,
    status: "preparando",
    dataCriacao: "2026-06-24T10:00:00.000Z",
  },
  {
    id: 2,
    cliente: { nome: "Ana Souza", telefone: "(11) 97777-5678" },
    tipo: "delivery",
    mesa: null,
    endereco: "Rua das Flores, 123 - Centro",
    itens: [
      { produtoId: 9, nome: "Pizza Pepperoni", preco: 44.90, quantidade: 1, emoji: "🍕" },
      { produtoId: 12, nome: "Suco de Laranja Natural", preco: 9.90, quantidade: 1, emoji: "🧃" },
    ],
    total: 54.80,
    status: "pendente",
    dataCriacao: "2026-06-24T11:30:00.000Z",
  },
  {
    id: 3,
    cliente: { nome: "Bruno Lima", telefone: "(11) 96666-4321" },
    tipo: "mesa",
    mesa: 7,
    endereco: "",
    itens: [
      { produtoId: 8, nome: "Pizza Margherita", preco: 39.90, quantidade: 1, emoji: "🍕" },
      { produtoId: 15, nome: "Tiramisu", preco: 19.90, quantidade: 2, emoji: "🍰" },
    ],
    total: 79.70,
    status: "pronto",
    dataCriacao: "2026-06-24T12:15:00.000Z",
  },
  {
    id: 4,
    cliente: { nome: "Fernanda Costa", telefone: "(11) 95555-9876" },
    tipo: "delivery",
    mesa: null,
    endereco: "Avenida Brasil, 500 - Jardim América",
    itens: [
      { produtoId: 6, nome: "Risoto de Camarão", preco: 56.90, quantidade: 1, emoji: "🍤" },
      { produtoId: 14, nome: "Taça de Vinho Tinto", preco: 22.00, quantidade: 1, emoji: "🍷" },
    ],
    total: 78.90,
    status: "entregue",
    dataCriacao: "2026-06-24T13:00:00.000Z",
  },
];
