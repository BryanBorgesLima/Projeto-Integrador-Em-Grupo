// cardapio.js
// Script exclusivo da página cardapio.html.

// Guarda qual categoria está selecionada no momento.
// Começa em "todas" para mostrar o cardápio completo na primeira visita.
let categoriaSelecionada = "todas";

function atualizarContadorCarrinho() {
  const carrinho = obterDados("carrinho", []);
  let totalItens = 0;
  for (let i = 0; i < carrinho.length; i++) {
    totalItens = totalItens + carrinho[i].quantidade;
  }
  const contador = document.getElementById("contador-carrinho");
  contador.textContent = totalItens;

  // Faz o número "pulsar" rapidamente para chamar atenção
  contador.classList.remove("pulso");
  contador.offsetWidth; // truque para reiniciar a animação do zero
  contador.classList.add("pulso");
}

// Mostra um avisinho no canto da tela por 2 segundos
function mostrarToast(mensagem) {
  const toast = document.getElementById("toast");
  toast.textContent = mensagem;
  toast.classList.add("visivel");

  setTimeout(() => {
    toast.classList.remove("visivel");
  }, 2000);
}

// Cria as abas de categoria (incluindo a aba extra "Todas")
function mostrarAbasCategorias() {
  const categorias = obterDados("categorias", []);
  const container = document.getElementById("abas-categorias");
  container.innerHTML = "";

  const abaTodas = document.createElement("button");
  abaTodas.className = "aba-categoria" + (categoriaSelecionada === "todas" ? " ativa" : "");
  abaTodas.textContent = "🍽️ Todas";
  abaTodas.onclick = () => filtrarPorCategoria("todas");
  container.appendChild(abaTodas);

  categorias.forEach((categoria) => {
    const aba = document.createElement("button");
    aba.className = "aba-categoria" + (categoriaSelecionada === categoria.id ? " ativa" : "");
    aba.textContent = categoria.icone + " " + categoria.nome;
    aba.onclick = () => filtrarPorCategoria(categoria.id);
    container.appendChild(aba);
  });
}

// Troca a categoria selecionada e atualiza a tela
function filtrarPorCategoria(categoriaId) {
  categoriaSelecionada = categoriaId;
  mostrarAbasCategorias();
  mostrarProdutos();
}

// Mostra os produtos da categoria escolhida (ou todos, se for "todas")
function mostrarProdutos() {
  const produtos = obterDados("produtos", []);

  let listaFiltrada = produtos;
  if (categoriaSelecionada !== "todas") {
    listaFiltrada = produtos.filter((produto) => produto.categoriaId === categoriaSelecionada);
  }

  const grid = document.getElementById("grid-produtos");
  grid.innerHTML = "";

  if (listaFiltrada.length === 0) {
    grid.innerHTML = '<p class="mensagem-vazio">Nenhum produto encontrado nesta categoria.</p>';
    return;
  }

  listaFiltrada.forEach((produto) => {
    const card = document.createElement("div");
    card.className = "cartao-produto";
    card.innerHTML = `
      <div class="emoji-produto">${produto.emoji}</div>
      <div class="nome-produto">${produto.nome}</div>
      <div class="descricao-produto">${produto.descricao}</div>
      <div class="rodape-produto">
        <span class="preco-produto">R$ ${produto.preco.toFixed(2)}</span>
        <button class="btn btn-primario btn-pequeno" onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Adiciona um produto ao carrinho (ou aumenta a quantidade, se já estiver lá)
function adicionarAoCarrinho(produtoId) {
  const produtos = obterDados("produtos", []);
  const produto = produtos.find((item) => item.id === produtoId);

  const carrinho = obterDados("carrinho", []);
  const itemExistente = carrinho.find((item) => item.produtoId === produtoId);

  if (itemExistente) {
    itemExistente.quantidade = itemExistente.quantidade + 1;
  } else {
    carrinho.push({
      produtoId: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1,
      emoji: produto.emoji,
    });
  }

  salvarDados("carrinho", carrinho);
  atualizarContadorCarrinho();
  mostrarToast(produto.nome + " adicionado ao carrinho! 🛒");
}

mostrarAbasCategorias();
mostrarProdutos();
atualizarContadorCarrinho();
