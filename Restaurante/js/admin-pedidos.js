// admin-pedidos.js
// Script exclusivo da página admin-pedidos.html (listar pedidos e mudar status).

// Guarda qual filtro de status está ativo no momento
let filtroAtual = "todos";

function mostrarToast(mensagem) {
  const toast = document.getElementById("toast");
  toast.textContent = mensagem;
  toast.classList.add("visivel");
  setTimeout(() => {
    toast.classList.remove("visivel");
  }, 2000);
}

// Troca o filtro selecionado e atualiza a tabela e os botões
function filtrarPedidos(status, botaoClicado) {
  filtroAtual = status;

  const botoes = document.querySelectorAll(".filtro-status");
  botoes.forEach((botao) => botao.classList.remove("ativo"));
  botaoClicado.classList.add("ativo");

  mostrarPedidos();
}

function mostrarPedidos() {
  const pedidos = obterDados("pedidos", []);

  let listaFiltrada = pedidos;
  if (filtroAtual !== "todos") {
    listaFiltrada = pedidos.filter((pedido) => pedido.status === filtroAtual);
  }

  const tabela = document.getElementById("tabela-pedidos");
  tabela.innerHTML = "";

  if (listaFiltrada.length === 0) {
    tabela.innerHTML = '<tr><td colspan="7" class="mensagem-vazio">Nenhum pedido encontrado.</td></tr>';
    return;
  }

  // Mostra os pedidos mais recentes primeiro
  listaFiltrada.slice().reverse().forEach((pedido) => {
    const descricaoItens = pedido.itens.map((item) => item.quantidade + "x " + item.nome).join(", ");
    const tipoTexto = pedido.tipo === "mesa" ? "Mesa " + pedido.mesa : "Delivery";

    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>#${pedido.id}</td>
      <td>${pedido.cliente.nome}</td>
      <td>${tipoTexto}</td>
      <td>${descricaoItens}</td>
      <td>R$ ${pedido.total.toFixed(2)}</td>
      <td><span class="badge ${pedido.status}">${pedido.status}</span></td>
      <td class="acoes">
        <select onchange="mudarStatus(${pedido.id}, this.value)">
          <option value="pendente" ${pedido.status === "pendente" ? "selected" : ""}>Pendente</option>
          <option value="preparando" ${pedido.status === "preparando" ? "selected" : ""}>Preparando</option>
          <option value="pronto" ${pedido.status === "pronto" ? "selected" : ""}>Pronto</option>
          <option value="entregue" ${pedido.status === "entregue" ? "selected" : ""}>Entregue</option>
        </select>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

// Atualiza o status de um pedido
function mudarStatus(pedidoId, novoStatus) {
  const pedidos = obterDados("pedidos", []);
  const pedido = pedidos.find((pedido) => pedido.id === pedidoId);
  pedido.status = novoStatus;
  salvarDados("pedidos", pedidos);

  // Quando um pedido feito na mesa é entregue, a mesa fica livre de novo
  if (novoStatus === "entregue" && pedido.tipo === "mesa") {
    const mesas = obterDados("mesas", []);
    const mesa = mesas.find((mesa) => mesa.numero === pedido.mesa);
    if (mesa) {
      mesa.status = "livre";
      salvarDados("mesas", mesas);
    }
  }

  mostrarPedidos();
  mostrarToast("Status do pedido atualizado!");
}

mostrarPedidos();
