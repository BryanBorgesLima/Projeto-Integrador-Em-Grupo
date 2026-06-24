// admin-mesas.js
// Script exclusivo da página admin-mesas.html (cadastro e controle de status das mesas).

function mostrarToast(mensagem) {
  const toast = document.getElementById("toast");
  toast.textContent = mensagem;
  toast.classList.add("visivel");
  setTimeout(() => {
    toast.classList.remove("visivel");
  }, 2000);
}

function gerarNovoId(lista) {
  let maiorId = 0;
  lista.forEach((item) => {
    if (item.id > maiorId) {
      maiorId = item.id;
    }
  });
  return maiorId + 1;
}

function mostrarMesas() {
  const mesas = obterDados("mesas", []);
  const tabela = document.getElementById("tabela-mesas");
  tabela.innerHTML = "";

  mesas.forEach((mesa) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>Mesa ${mesa.numero}</td>
      <td>${mesa.lugares} lugares</td>
      <td><span class="badge ${mesa.status}">${mesa.status}</span></td>
      <td class="acoes">
        <button class="btn btn-secundario btn-pequeno" onclick="mudarStatusMesa(${mesa.id}, 'livre')">Livre</button>
        <button class="btn btn-secundario btn-pequeno" onclick="mudarStatusMesa(${mesa.id}, 'ocupada')">Ocupada</button>
        <button class="btn btn-secundario btn-pequeno" onclick="editarMesa(${mesa.id})">Editar</button>
        <button class="btn btn-perigo btn-pequeno" onclick="excluirMesa(${mesa.id})">Excluir</button>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

// Muda rapidamente o status de uma mesa (usado pelos botões "Livre"/"Ocupada")
function mudarStatusMesa(mesaId, novoStatus) {
  const mesas = obterDados("mesas", []);
  const mesa = mesas.find((mesa) => mesa.id === mesaId);
  mesa.status = novoStatus;
  salvarDados("mesas", mesas);
  mostrarMesas();
  mostrarToast("Status da mesa atualizado!");
}

function editarMesa(mesaId) {
  const mesas = obterDados("mesas", []);
  const mesa = mesas.find((mesa) => mesa.id === mesaId);

  document.getElementById("mesa-id").value = mesa.id;
  document.getElementById("mesa-numero").value = mesa.numero;
  document.getElementById("mesa-lugares").value = mesa.lugares;
  document.getElementById("mesa-status").value = mesa.status;
  document.getElementById("titulo-formulario").textContent = "Editar Mesa";
}

function excluirMesa(mesaId) {
  if (!confirm("Tem certeza que deseja excluir esta mesa?")) {
    return;
  }
  let mesas = obterDados("mesas", []);
  mesas = mesas.filter((mesa) => mesa.id !== mesaId);
  salvarDados("mesas", mesas);
  mostrarMesas();
  mostrarToast("Mesa excluída!");
}

function limparFormulario() {
  document.getElementById("form-mesa").reset();
  document.getElementById("mesa-id").value = "";
  document.getElementById("titulo-formulario").textContent = "Nova Mesa";
}

function salvarMesa(evento) {
  evento.preventDefault();

  const mesas = obterDados("mesas", []);
  const idDigitado = document.getElementById("mesa-id").value;

  const numero = Number(document.getElementById("mesa-numero").value);
  const lugares = Number(document.getElementById("mesa-lugares").value);
  const status = document.getElementById("mesa-status").value;

  if (idDigitado === "") {
    mesas.push({ id: gerarNovoId(mesas), numero: numero, lugares: lugares, status: status });
  } else {
    const mesa = mesas.find((mesa) => mesa.id === Number(idDigitado));
    mesa.numero = numero;
    mesa.lugares = lugares;
    mesa.status = status;
  }

  salvarDados("mesas", mesas);
  limparFormulario();
  mostrarMesas();
  mostrarToast("Mesa salva com sucesso!");
}

mostrarMesas();
