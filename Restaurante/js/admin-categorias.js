// admin-categorias.js
// Script exclusivo da página admin-categorias.html (CRUD de categorias).

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

function mostrarCategorias() {
  const categorias = obterDados("categorias", []);
  const tabela = document.getElementById("tabela-categorias");
  tabela.innerHTML = "";

  categorias.forEach((categoria) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${categoria.icone}</td>
      <td>${categoria.nome}</td>
      <td class="acoes">
        <button class="btn btn-secundario btn-pequeno" onclick="editarCategoria(${categoria.id})">Editar</button>
        <button class="btn btn-perigo btn-pequeno" onclick="excluirCategoria(${categoria.id})">Excluir</button>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

function editarCategoria(categoriaId) {
  const categorias = obterDados("categorias", []);
  const categoria = categorias.find((categoria) => categoria.id === categoriaId);

  document.getElementById("categoria-id").value = categoria.id;
  document.getElementById("categoria-nome").value = categoria.nome;
  document.getElementById("categoria-icone").value = categoria.icone;
  document.getElementById("titulo-formulario").textContent = "Editar Categoria";
}

function excluirCategoria(categoriaId) {
  if (!confirm("Tem certeza que deseja excluir esta categoria? Os produtos dela continuarão existindo, mas sem categoria visível.")) {
    return;
  }
  let categorias = obterDados("categorias", []);
  categorias = categorias.filter((categoria) => categoria.id !== categoriaId);
  salvarDados("categorias", categorias);
  mostrarCategorias();
  mostrarToast("Categoria excluída!");
}

function limparFormulario() {
  document.getElementById("form-categoria").reset();
  document.getElementById("categoria-id").value = "";
  document.getElementById("titulo-formulario").textContent = "Nova Categoria";
}

function salvarCategoria(evento) {
  evento.preventDefault();

  const categorias = obterDados("categorias", []);
  const idDigitado = document.getElementById("categoria-id").value;

  const nome = document.getElementById("categoria-nome").value;
  const icone = document.getElementById("categoria-icone").value;

  if (idDigitado === "") {
    categorias.push({ id: gerarNovoId(categorias), nome: nome, icone: icone });
  } else {
    const categoria = categorias.find((categoria) => categoria.id === Number(idDigitado));
    categoria.nome = nome;
    categoria.icone = icone;
  }

  salvarDados("categorias", categorias);
  limparFormulario();
  mostrarCategorias();
  mostrarToast("Categoria salva com sucesso!");
}

mostrarCategorias();
