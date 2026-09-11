Cardápio digital de mesa: o cliente escaneia o QR code da mesa, monta o pedido,
personaliza cada prato (remove ingredientes, adiciona extras, deixa observações),
divide a conta e escolhe a forma de pagamento — tudo pelo celular.
O painel admin gerencia mesas/pedidos e o cardápio inteiro (criar, editar e
excluir pratos e extras, alterar disponibilidade, ver relatórios de vendas).


├── index.html         → tela de boas-vindas; aceita ?mesa=N vindo do QR code
├── admin.html          → login + painel administrativo completo
├── css/                 → estilos do site (style.css) e do admin (admin.css)
├── js/
│   ├── store.js         → "banco de dados" simulado em localStorage (substitui PHP + MySQL)
│   ├── data.js           → constantes e helpers compartilhados (formatação, ícones)
│   ├── cart.js           → carrinho e mesa atual (persistidos em localStorage)
│   ├── admin-data.js     → constantes usadas só no painel admin
│   ├── main.js           → lógica das páginas do cliente (cardápio, carrinho, checkout, status)
│   └── admin.js          → lógica do painel admin (mesas, cardápio, relatórios, configurações)
└── pages/                → páginas do site do cliente
    ├── menu.html
    ├── carrinho.html
    ├── finalizacao.html
    ├── status.html
    ├── sobre.html
    └── produto.html      → link antigo (produto.html?id=N), redireciona para o cardápio
```

## Login do admin

Acesse pelo link "Acesso do funcionário" no rodapé do site, ou abra `admin.html`
diretamente.

| Funcionário      | Email                      | Senha     |
|------------------|-----------------------------|-----------|
| Gestor           | admin@saboremmesa.com       | admin123  |
| Kauan Beraguas   | kauan@saboremmesa.com       | 1234      |
| Bryan Guilherme  | bryan@saboremmesa.com       | 1234      |
| João Henrique    | joao@saboremmesa.com        | 1234      |
| Roger Liedlke    | roger@saboremmesa.com       | 1234      |
| Pedro Henrique   | pedro@saboremmesa.com       | 1234      |

Essas credenciais ficam em texto simples dentro de `js/store.js` (array
`funcionarios`)
Edite esse array diretamente se quiser trocar os logins.


## O que é editável pelo admin
- **Cardápio completo**: nome, categoria, preço, descrição, ingredientes
  (usados no "Remover ingredientes"), selo/tag, destaque, disponibilidade —
  criar itens novos, editar ou excluir.
- **Extras por produto** — cada item do cardápio tem sua própria lista de
  extras permitidos, editável no formulário do item.
- **Mesas e status** (livre / reservado / ocupado).
- **Pedidos** — acompanhar status (preparando / pronto / entregue); ao marcar
  como entregue, a mesa volta a ficar livre automaticamente.
- **Chamados de garçom** — aparecem em destaque no topo do painel.
- **Relatórios** — faturamento, ticket médio, produtos mais vendidos,
  faturamento por categoria e formas de pagamento, filtrável por período
  (hoje / 7 dias / 30 dias / tudo), calculado a partir dos pedidos reais.
- **Configurações** do restaurante (nome, subtítulo, email, horário, taxa de
  serviço) — refletem também na página "Sobre nós" e nos cálculos de checkout.

Editar o cardápio no admin reflete na hora no site do cliente (mesmo
navegador). Finalizar uma compra no site cria um pedido de verdade, que
aparece no admin já com taxa de serviço calculada e divisão de conta
registrada. Itens já usados em algum pedido não podem ser excluídos (o sistema
avisa e sugere marcar como indisponível), do mesmo jeito que era com o banco
de dados de verdade.

## Fluxo do pedido (cliente)

1. **Cardápio** (`pages/menu.html`) — categorias na lateral, grade de
   produtos, painel "Seu Pedido" sempre visível com o total atualizado.
2. **Personalização** — clicar num prato abre um modal pra remover
   ingredientes, adicionar extras, escrever observações e ajustar a
   quantidade antes de confirmar.
3. **Checkout** (`pages/finalizacao.html`) — resumo da conta, divisão entre
   pessoas ("Fica para cada"), taxa de serviço e escolha entre Pix (QR code),
   pagar com o garçom ou pagar no balcão.
4. **Acompanhamento** (`pages/status.html`) — depois de confirmar o pedido, o
   cliente acompanha o status em tempo real (preparando → pronto → entregue)
   direto pelo celular. O botão "Status do Pedido" aparece automaticamente no
   cabeçalho sempre que a mesa tiver um pedido em andamento.

## Observações

- A galeria de mídia do admin (aba "Mídia") só mostra uma prévia local do
  arquivo escolhido no próprio navegador — não há upload real. O campo
  "Imagem" no formulário de item aceita uma URL direta.
- A página de status do pedido não exige login — qualquer pessoa que souber
  o número da mesa pode ver o pedido dela, do mesmo jeito que não existe login
  pro cliente em nenhuma parte do fluxo de pedido. Isso é intencional (modelo
  de QR code por mesa).