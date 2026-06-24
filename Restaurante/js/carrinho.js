// carrinho.js
// Script exclusivo da página carrinho.html.

function atualizarContadorCarrinho() {
  const carrinho = obterDados("carrinho", []);
  let totalItens = 0;
  for (let i = 0; i < carrinho.length; i++) {
    totalItens = totalItens + carrinho[i].quantidade;
  }
  document.getElementById("contador-carrinho").textContent = totalItens;
}

// Soma preco * quantidade de todos os itens do carrinho
function calcularTotal(carrinho) {
  let total = 0;
  for (let i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].preco * carrinho[i].quantidade;
  }
  return total;
}

// Desenha a lista de itens e o bloco de total na tela
function mostrarCarrinho() {
  const carrinho = obterDados("carrinho", []);
  const lista = document.getElementById("lista-carrinho");
  const blocoTotal = document.getElementById("bloco-total");

  if (carrinho.length === 0) {
    lista.innerHTML = '<p class="mensagem-vazio">Seu carrinho está vazio. <a href="cardapio.html">Ver cardápio</a></p>';
    blocoTotal.style.display = "none";
    return;
  }

  lista.innerHTML = "";
  carrinho.forEach((item) => {
    const linha = document.createElement("div");
    linha.className = "item-carrinho";
    linha.innerHTML = `
      <div class="emoji-produto">${item.emoji}</div>
      <div class="info-item-carrinho">
        <div class="nome-produto">${item.nome}</div>
        <div class="descricao-produto">R$ ${item.preco.toFixed(2)} cada</div>
      </div>
      <div class="controle-quantidade">
        <button onclick="diminuirQuantidade(${item.produtoId})">-</button>
        <span>${item.quantidade}</span>
        <button onclick="aumentarQuantidade(${item.produtoId})">+</button>
      </div>
      <div class="subtotal-item">R$ ${(item.preco * item.quantidade).toFixed(2)}</div>
      <button class="remover-item" onclick="removerItem(${item.produtoId})" title="Remover">🗑️</button>
    `;
    lista.appendChild(linha);
  });

  blocoTotal.style.display = "block";
  document.getElementById("valor-total").textContent = "R$ " + calcularTotal(carrinho).toFixed(2);
}

function aumentarQuantidade(produtoId) {
  const carrinho = obterDados("carrinho", []);
  const item = carrinho.find((item) => item.produtoId === produtoId);
  item.quantidade = item.quantidade + 1;
  salvarDados("carrinho", carrinho);
  mostrarCarrinho();
  atualizarContadorCarrinho();
}

function diminuirQuantidade(produtoId) {
  let carrinho = obterDados("carrinho", []);
  const item = carrinho.find((item) => item.produtoId === produtoId);
  item.quantidade = item.quantidade - 1;

  // Se a quantidade chegar a zero, o item sai do carrinho
  if (item.quantidade <= 0) {
    carrinho = carrinho.filter((item) => item.produtoId !== produtoId);
  }

  salvarDados("carrinho", carrinho);
  mostrarCarrinho();
  atualizarContadorCarrinho();
}

function removerItem(produtoId) {
  let carrinho = obterDados("carrinho", []);
  carrinho = carrinho.filter((item) => item.produtoId !== produtoId);
  salvarDados("carrinho", carrinho);
  mostrarCarrinho();
  atualizarContadorCarrinho();
}

mostrarCarrinho();
atualizarContadorCarrinho();
