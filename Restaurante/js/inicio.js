// inicio.js
// Script exclusivo da página index.html (página inicial).

// Mostra a quantidade de itens do carrinho no ícone do cabeçalho
function atualizarContadorCarrinho() {
  const carrinho = obterDados("carrinho", []);
  let totalItens = 0;
  for (let i = 0; i < carrinho.length; i++) {
    totalItens = totalItens + carrinho[i].quantidade;
  }
  document.getElementById("contador-carrinho").textContent = totalItens;
}

// Escolhe alguns produtos para exibir como "Destaques da Casa"
// (aqui simplesmente pegamos os 4 primeiros produtos disponíveis)
function mostrarDestaques() {
  const produtos = obterDados("produtos", []);
  const destaques = produtos.filter((produto) => produto.disponivel).slice(0, 4);

  const grid = document.getElementById("grid-destaques");
  grid.innerHTML = "";

  destaques.forEach((produto) => {
    const card = document.createElement("div");
    card.className = "cartao-produto";
    card.innerHTML = `
      <div class="emoji-produto">${produto.emoji}</div>
      <div class="nome-produto">${produto.nome}</div>
      <div class="descricao-produto">${produto.descricao}</div>
      <div class="rodape-produto">
        <span class="preco-produto">R$ ${produto.preco.toFixed(2)}</span>
        <a href="cliente/cardapio.html" class="btn btn-primario btn-pequeno">Ver mais</a>
      </div>
    `;
    grid.appendChild(card);
  });
}

mostrarDestaques();
atualizarContadorCarrinho();
