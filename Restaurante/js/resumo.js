// resumo.js
// Script exclusivo da página resumo.html.

// Guarda se o cliente escolheu "mesa" ou "delivery" (mesa é o padrão inicial)
let tipoPedidoEscolhido = "mesa";

function atualizarContadorCarrinho() {
  const carrinho = obterDados("carrinho", []);
  let totalItens = 0;
  for (let i = 0; i < carrinho.length; i++) {
    totalItens = totalItens + carrinho[i].quantidade;
  }
  document.getElementById("contador-carrinho").textContent = totalItens;
}

function calcularTotal(carrinho) {
  let total = 0;
  for (let i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].preco * carrinho[i].quantidade;
  }
  return total;
}

// Mostra os itens do carrinho (somente leitura) e o total
function mostrarResumo() {
  const carrinho = obterDados("carrinho", []);
  const lista = document.getElementById("lista-itens-resumo");

  if (carrinho.length === 0) {
    lista.innerHTML = '<p class="mensagem-vazio">Seu carrinho está vazio. <a href="cardapio.html">Ver cardápio</a></p>';
    document.getElementById("form-resumo").style.display = "none";
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
        <div class="descricao-produto">${item.quantidade}x R$ ${item.preco.toFixed(2)}</div>
      </div>
      <div class="subtotal-item">R$ ${(item.preco * item.quantidade).toFixed(2)}</div>
    `;
    lista.appendChild(linha);
  });

  document.getElementById("valor-total-resumo").textContent = "R$ " + calcularTotal(carrinho).toFixed(2);
}

// Preenche o select de mesas só com as mesas que estão livres
function preencherSelectMesas() {
  const mesas = obterDados("mesas", []);
  const mesasLivres = mesas.filter((mesa) => mesa.status === "livre");

  const select = document.getElementById("campo-mesa");
  select.innerHTML = "";

  mesasLivres.forEach((mesa) => {
    const opcao = document.createElement("option");
    opcao.value = mesa.numero;
    opcao.textContent = "Mesa " + mesa.numero + " (" + mesa.lugares + " lugares)";
    select.appendChild(opcao);
  });
}

// Alterna entre os campos de "mesa" e "delivery" conforme a opção escolhida
function selecionarTipoPedido(tipo) {
  tipoPedidoEscolhido = tipo;

  document.getElementById("opcao-mesa").classList.toggle("selecionada", tipo === "mesa");
  document.getElementById("opcao-delivery").classList.toggle("selecionada", tipo === "delivery");

  document.getElementById("campos-mesa").classList.toggle("visivel", tipo === "mesa");
  document.getElementById("campos-delivery").classList.toggle("visivel", tipo === "delivery");
}

// Calcula o próximo id disponível olhando o maior id já usado
function gerarNovoId(lista) {
  let maiorId = 0;
  lista.forEach((item) => {
    if (item.id > maiorId) {
      maiorId = item.id;
    }
  });
  return maiorId + 1;
}

// Monta o pedido, salva no localStorage e segue para a confirmação
function confirmarPedido(evento) {
  evento.preventDefault();

  const carrinho = obterDados("carrinho", []);
  const nome = document.getElementById("campo-nome").value;
  const telefone = document.getElementById("campo-telefone").value;
  const endereco = document.getElementById("campo-endereco").value;

  // Validação simples: se for delivery, o endereço é obrigatório
  if (tipoPedidoEscolhido === "delivery" && endereco.trim() === "") {
    alert("Por favor, informe o endereço de entrega.");
    return;
  }

  let numeroMesa = null;
  if (tipoPedidoEscolhido === "mesa") {
    numeroMesa = Number(document.getElementById("campo-mesa").value);

    // Marca a mesa escolhida como ocupada
    const mesas = obterDados("mesas", []);
    const mesa = mesas.find((mesa) => mesa.numero === numeroMesa);
    if (mesa) {
      mesa.status = "ocupada";
      salvarDados("mesas", mesas);
    }
  }

  const pedidos = obterDados("pedidos", []);
  const novoPedido = {
    id: gerarNovoId(pedidos),
    cliente: { nome: nome, telefone: telefone },
    tipo: tipoPedidoEscolhido,
    mesa: numeroMesa,
    endereco: tipoPedidoEscolhido === "delivery" ? endereco : "",
    itens: carrinho,
    total: calcularTotal(carrinho),
    status: "pendente",
    dataCriacao: new Date().toISOString(),
  };

  pedidos.push(novoPedido);
  salvarDados("pedidos", pedidos);
  salvarDados("ultimoPedidoId", novoPedido.id);
  salvarDados("carrinho", []);

  window.location.href = "confirmacao.html";
}

mostrarResumo();
preencherSelectMesas();
atualizarContadorCarrinho();
