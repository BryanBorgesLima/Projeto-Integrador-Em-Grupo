// tema.js
// Lê e troca o tema (claro/escuro) do site, guardando a escolha no
// localStorage através do armazenamento.js, pra lembrar na próxima visita
// e em qualquer página (todas usam a mesma chave "tema").

// Aplica o tema salvo na tag <html>. Como esse script roda no fim do
// <body>, a página já apareceu no tema claro por uma fração de segundo
// antes de trocar para o escuro - é um efeito colateral aceitável de manter
// os scripts sempre no fim da página, como em todo o resto do projeto.
function aplicarTemaSalvo() {
  const tema = obterDados("tema", "claro");
  document.documentElement.setAttribute("data-tema", tema);
  atualizarIconeBotaoTema(tema);
}

// Troca entre claro e escuro, salva a escolha e atualiza o ícone do botão
function alternarTema() {
  const temaAtual = document.documentElement.getAttribute("data-tema");
  const novoTema = temaAtual === "escuro" ? "claro" : "escuro";
  document.documentElement.setAttribute("data-tema", novoTema);
  salvarDados("tema", novoTema);
  atualizarIconeBotaoTema(novoTema);
}

function atualizarIconeBotaoTema(tema) {
  const botao = document.getElementById("botao-tema");
  if (botao) {
    botao.textContent = tema === "escuro" ? "☀️" : "🌙";
  }
}

aplicarTemaSalvo();
