// admin-relatorios.js
// Script exclusivo da página admin-relatorios.html.
// Esta página é só de LEITURA: ela apenas lê os pedidos salvos e calcula números.

// Soma o total de todos os pedidos
function calcularTotalVendas(pedidos) {
  let total = 0;
  pedidos.forEach((pedido) => {
    total = total + pedido.total;
  });
  return total;
}

// Conta quantos pedidos existem em cada status (pendente, preparando, pronto, entregue)
function contarPedidosPorStatus(pedidos) {
  const contagem = { pendente: 0, preparando: 0, pronto: 0, entregue: 0 };
  pedidos.forEach((pedido) => {
    contagem[pedido.status] = contagem[pedido.status] + 1;
  });
  return contagem;
}

// Soma a quantidade vendida de cada produto, somando os itens de todos os pedidos
function calcularProdutosMaisVendidos(pedidos) {
  const quantidadePorProduto = {};

  pedidos.forEach((pedido) => {
    pedido.itens.forEach((item) => {
      if (!quantidadePorProduto[item.nome]) {
        quantidadePorProduto[item.nome] = 0;
      }
      quantidadePorProduto[item.nome] = quantidadePorProduto[item.nome] + item.quantidade;
    });
  });

  // Transforma o objeto em uma lista e ordena do mais vendido para o menos vendido
  const lista = Object.keys(quantidadePorProduto).map((nome) => {
    return { nome: nome, quantidade: quantidadePorProduto[nome] };
  });
  lista.sort((a, b) => b.quantidade - a.quantidade);

  return lista.slice(0, 5);
}

// Cria uma barra de progresso simples (rótulo + valor + barra preenchida em %)
function criarBarra(rotulo, valor, valorMaximo) {
  const porcentagem = valorMaximo === 0 ? 0 : (valor / valorMaximo) * 100;

  const barra = document.createElement("div");
  barra.className = "barra-relatorio";
  barra.innerHTML = `
    <div class="rotulo-barra">
      <span>${rotulo}</span>
      <span>${valor}</span>
    </div>
    <div class="fundo-barra">
      <div class="preenchimento-barra" style="width:${porcentagem}%"></div>
    </div>
  `;
  return barra;
}

function mostrarRelatorios() {
  const pedidos = obterDados("pedidos", []);

  const totalVendas = calcularTotalVendas(pedidos);
  const contagemStatus = contarPedidosPorStatus(pedidos);
  const maisVendidos = calcularProdutosMaisVendidos(pedidos);

  // Cartões de estatística no topo
  const grade = document.getElementById("grade-estatisticas");
  grade.innerHTML = `
    <div class="cartao-estatistica">
      <div class="valor">R$ ${totalVendas.toFixed(2)}</div>
      <div class="rotulo">Total em Vendas</div>
    </div>
    <div class="cartao-estatistica">
      <div class="valor">${pedidos.length}</div>
      <div class="rotulo">Total de Pedidos</div>
    </div>
    <div class="cartao-estatistica">
      <div class="valor">${contagemStatus.entregue}</div>
      <div class="rotulo">Pedidos Entregues</div>
    </div>
  `;

  // Barras de pedidos por status
  const barrasStatus = document.getElementById("barras-status");
  barrasStatus.innerHTML = "";
  const maiorContagemStatus = Math.max(contagemStatus.pendente, contagemStatus.preparando, contagemStatus.pronto, contagemStatus.entregue);
  barrasStatus.appendChild(criarBarra("Pendente", contagemStatus.pendente, maiorContagemStatus));
  barrasStatus.appendChild(criarBarra("Preparando", contagemStatus.preparando, maiorContagemStatus));
  barrasStatus.appendChild(criarBarra("Pronto", contagemStatus.pronto, maiorContagemStatus));
  barrasStatus.appendChild(criarBarra("Entregue", contagemStatus.entregue, maiorContagemStatus));

  // Barras de produtos mais vendidos
  const barrasProdutos = document.getElementById("barras-produtos");
  barrasProdutos.innerHTML = "";

  if (maisVendidos.length === 0) {
    barrasProdutos.innerHTML = '<p class="mensagem-vazio">Ainda não há pedidos para gerar este relatório.</p>';
    return;
  }

  const maiorQuantidade = maisVendidos[0].quantidade;
  maisVendidos.forEach((produto) => {
    barrasProdutos.appendChild(criarBarra(produto.nome, produto.quantidade, maiorQuantidade));
  });
}

mostrarRelatorios();
