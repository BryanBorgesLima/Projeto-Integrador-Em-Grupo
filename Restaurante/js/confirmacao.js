// confirmacao.js
// Script exclusivo da página confirmacao.html.

function atualizarContadorCarrinho() {
  const carrinho = obterDados("carrinho", []);
  let totalItens = 0;
  for (let i = 0; i < carrinho.length; i++) {
    totalItens = totalItens + carrinho[i].quantidade;
  }
  document.getElementById("contador-carrinho").textContent = totalItens;
}

// Busca o último pedido feito (guardado em "ultimoPedidoId") e exibe os dados
function mostrarConfirmacao() {
  const ultimoPedidoId = obterDados("ultimoPedidoId", null);
  const pedidos = obterDados("pedidos", []);
  const pedido = pedidos.find((pedido) => pedido.id === ultimoPedidoId);

  const cartao = document.getElementById("cartao-confirmacao");

  if (!pedido) {
    cartao.innerHTML = `
      <div class="icone-sucesso">🍽️</div>
      <h2>Nenhum pedido recente encontrado</h2>
      <a href="cardapio.html" class="btn btn-primario" style="margin-top:1rem;">Ver Cardápio</a>
    `;
    return;
  }

  let listaItensHtml = "";
  pedido.itens.forEach((item) => {
    listaItensHtml += `<li><span>${item.quantidade}x ${item.nome}</span><span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span></li>`;
  });

  const infoEntrega = pedido.tipo === "mesa"
    ? "Retirada na Mesa " + pedido.mesa
    : "Delivery para: " + pedido.endereco;

  cartao.innerHTML = `
    <div class="icone-sucesso">✅</div>
    <h2>Pedido confirmado!</h2>
    <p>Obrigado, ${pedido.cliente.nome}. Seu pedido já está sendo preparado.</p>
    <div class="numero-pedido">Pedido #${pedido.id}</div>
    <ul class="lista-itens-confirmacao">${listaItensHtml}</ul>
    <div class="linha-total total-geral">
      <span>Total</span>
      <span>R$ ${pedido.total.toFixed(2)}</span>
    </div>
    <p style="margin-top:1rem; color:var(--cor-texto-claro);">${infoEntrega}</p>
    <a href="../index.html" class="btn btn-primario btn-grande" style="margin-top:1.5rem;">Voltar ao Início</a>
  `;
}

mostrarConfirmacao();
atualizarContadorCarrinho();
