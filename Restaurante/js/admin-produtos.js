// admin-produtos.js
// Script exclusivo da página admin-produtos.html (CRUD de produtos).
// CRUD = Criar, Ler, Atualizar e Deletar (as 4 operações básicas de um cadastro).

// Mostra um avisinho no canto da tela por 2 segundos
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

// Preenche o <select> de categorias do formulário
function preencherSelectCategorias() {
  const categorias = obterDados("categorias", []);
  const select = document.getElementById("produto-categoria");
  select.innerHTML = "";

  categorias.forEach((categoria) => {
    const opcao = document.createElement("option");
    opcao.value = categoria.id;
    opcao.textContent = categoria.nome;
    select.appendChild(opcao);
  });
}

// Mostra todos os produtos cadastrados na tabela
function mostrarProdutos() {
  const produtos = obterDados("produtos", []);
  const categorias = obterDados("categorias", []);
  const tabela = document.getElementById("tabela-produtos");
  tabela.innerHTML = "";

  produtos.forEach((produto) => {
    const categoria = categorias.find((categoria) => categoria.id === produto.categoriaId);
    const nomeCategoria = categoria ? categoria.nome : "—";

    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${produto.emoji}</td>
      <td>${produto.nome}</td>
      <td>${nomeCategoria}</td>
      <td>R$ ${produto.preco.toFixed(2)}</td>
      <td>
        <span class="badge ${produto.disponivel ? "livre" : "ocupada"}">
          ${produto.disponivel ? "Sim" : "Não"}
        </span>
      </td>
      <td class="acoes">
        <button class="btn btn-secundario btn-pequeno" onclick="editarProduto(${produto.id})">Editar</button>
        <button class="btn btn-perigo btn-pequeno" onclick="excluirProduto(${produto.id})">Excluir</button>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

// Carrega os dados de um produto no formulário para edição
function editarProduto(produtoId) {
  const produtos = obterDados("produtos", []);
  const produto = produtos.find((produto) => produto.id === produtoId);

  document.getElementById("produto-id").value = produto.id;
  document.getElementById("produto-nome").value = produto.nome;
  document.getElementById("produto-categoria").value = produto.categoriaId;
  document.getElementById("produto-preco").value = produto.preco;
  document.getElementById("produto-emoji").value = produto.emoji;
  document.getElementById("produto-descricao").value = produto.descricao;
  document.getElementById("produto-disponivel").checked = produto.disponivel;
  document.getElementById("titulo-formulario").textContent = "Editar Produto";
}

// Remove um produto da lista
function excluirProduto(produtoId) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) {
    return;
  }
  let produtos = obterDados("produtos", []);
  produtos = produtos.filter((produto) => produto.id !== produtoId);
  salvarDados("produtos", produtos);
  mostrarProdutos();
  mostrarToast("Produto excluído!");
}

// Limpa o formulário e volta ao modo "Novo Produto"
function limparFormulario() {
  document.getElementById("form-produto").reset();
  document.getElementById("produto-id").value = "";
  document.getElementById("produto-disponivel").checked = true;
  document.getElementById("titulo-formulario").textContent = "Novo Produto";
}

// Salva o produto: se já tem id, atualiza; se não tem, cria um novo
function salvarProduto(evento) {
  evento.preventDefault();

  const produtos = obterDados("produtos", []);
  const idDigitado = document.getElementById("produto-id").value;

  const dadosProduto = {
    nome: document.getElementById("produto-nome").value,
    categoriaId: Number(document.getElementById("produto-categoria").value),
    preco: Number(document.getElementById("produto-preco").value),
    emoji: document.getElementById("produto-emoji").value,
    descricao: document.getElementById("produto-descricao").value,
    disponivel: document.getElementById("produto-disponivel").checked,
  };

  if (idDigitado === "") {
    // Inclusão: cria um produto novo com id gerado automaticamente
    dadosProduto.id = gerarNovoId(produtos);
    produtos.push(dadosProduto);
  } else {
    // Edição: encontra o produto pelo id e atualiza os campos
    const produto = produtos.find((produto) => produto.id === Number(idDigitado));
    produto.nome = dadosProduto.nome;
    produto.categoriaId = dadosProduto.categoriaId;
    produto.preco = dadosProduto.preco;
    produto.emoji = dadosProduto.emoji;
    produto.descricao = dadosProduto.descricao;
    produto.disponivel = dadosProduto.disponivel;
  }

  salvarDados("produtos", produtos);
  limparFormulario();
  mostrarProdutos();
  mostrarToast("Produto salvo com sucesso!");
}

preencherSelectCategorias();
mostrarProdutos();
