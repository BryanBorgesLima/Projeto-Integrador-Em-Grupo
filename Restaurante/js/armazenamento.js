// armazenamento.js
// O localStorage é uma "gaveta" do navegador que guarda informação como texto.
// Por isso usamos JSON.stringify para guardar arrays/objetos como texto,
// e JSON.parse para transformar esse texto de volta em array/objeto.
// Essas duas funções são as ÚNICAS do projeto que tocam direto no localStorage.

function salvarDados(chave, valor) {
  const texto = JSON.stringify(valor);
  localStorage.setItem(chave, texto);
}

function obterDados(chave, valorPadrao) {
  const texto = localStorage.getItem(chave);
  if (texto === null) {
    return valorPadrao;
  }
  return JSON.parse(texto);
}

// Na primeira vez que o site abre, o localStorage está vazio.
// Esta função preenche ele com os dados de exemplo do dados.js.
// Nas próximas visitas, como já existe valor salvo, nada é sobrescrito.
function inicializarDados() {
  if (obterDados("categorias", null) === null) {
    salvarDados("categorias", categoriasIniciais);
  }
  if (obterDados("produtos", null) === null) {
    salvarDados("produtos", produtosIniciais);
  }
  if (obterDados("mesas", null) === null) {
    salvarDados("mesas", mesasIniciais);
  }
  if (obterDados("pedidos", null) === null) {
    salvarDados("pedidos", pedidosIniciais);
  }
  if (obterDados("carrinho", null) === null) {
    salvarDados("carrinho", []);
  }
}

inicializarDados();
