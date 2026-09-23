# Sabor & Mesa — Trattoria Moderna — site + painel admin (PHP + MySQL)

Cardápio digital de mesa: o cliente escaneia o QR code da mesa, monta o pedido,
personaliza cada prato (remove ingredientes, adiciona extras, deixa observações),
divide a conta e paga por Pix, com o garçom ou no balcão — tudo pelo celular.
O painel admin gerencia mesas/pedidos em tempo real e o cardápio inteiro
(criar, editar e excluir pratos e extras do zero, não só marcar disponibilidade).

## Estrutura de pastas

```
├── index.html          → tela de boas-vindas (estática); aceita ?mesa=N vindo do QR code
├── admin.html           → redireciona para pages/admin.php
├── css/                  → estilos do site (style.css) e do admin (admin.css)
├── img/produtos/         → ilustrações dos pratos + uploads/ (fotos enviadas pelo admin)
├── js/                   → lógica do front-end (cliente e admin)
├── php/                  → conexão com o banco e funções compartilhadas
├── api/                  → endpoints que o JS chama (login, pedidos, cardápio, mesas...)
├── pages/                → páginas dinâmicas em PHP (menu, carrinho, checkout, sobre, admin)
├── database.sql          → schema + dados de exemplo (apaga e recria o banco)
└── atualizar_imagens.sql → só adiciona as imagens num banco que já existe
```

## Como rodar

1. Banco de dados. Importe o `database.sql`

2. Servidor:
   - XAMPP: coloque a pasta `restaurante` em `htdocs` e acesse
     `http://localhost/restaurante/`.

4. Login do admin (`admin.html` → `pages/admin.php`):
   - Email: `admin@saboremmesa.com (ou, charles@saboremmesa.com)`
   - Senha: `admin123`

5. Simular uma mesa via QR code: Cada mesa física teria seu próprio QR
   apontando pra `index.html?mesa=4` (troque o número). Isso guarda a mesa no
   navegador do cliente e ela acompanha o pedido até o pagamento — sem precisar
   escolher a mesa de novo no checkout. Pra testar sem QR, basta abrir
   `pages/menu.php` sem `?mesa=`: um seletor de mesa aparece automaticamente.

## Imagens dos pratos

Cada item do cardápio já vem com uma ilustração em `img/produtos/`. No banco,
o campo `imagem` guarda o caminho relativo à raiz do projeto (ex:
`img/produtos/pizza-margherita.svg`), então funciona em qualquer pasta do
servidor. Se você já tinha importado o banco antes, importe só o
`atualizar_imagens.sql` — ele preenche as imagens sem apagar pedidos nem mesas
(e não mexe em itens que já têm imagem).

Pra trocar pela foto real de um prato: admin → Cardápio → Editar → **Enviar
foto**. O arquivo vai pra `img/produtos/uploads/` (JPG, PNG, WEBP ou GIF, até
4 MB; o servidor confere se é mesmo uma imagem). Também dá pra colar um link
`https://...` no mesmo campo. Se uma imagem sumir, o cardápio mostra um ícone
neutro no lugar.

## O que é dinâmico (vem do banco)

- **Cardápio completo**: nome, categoria, preço, descrição, ingredientes
  (usados no "Remover ingredientes"), selo/tag, destaque, disponibilidade e
  imagem — tudo editável pelo admin, incluindo criar itens novos do zero.
- **Extras por produto** (ex: bacon, queijo) — cada item do cardápio tem sua
  própria lista de extras permitidos, editável no formulário do item. Uma
  bebida ou sobremesa, por exemplo, pode não ter nenhum extra associado — nesse
  caso a seção "Adicionar extras" simplesmente não aparece pro cliente.
- Mesas e status (livre / reservado / ocupado).
- Pedidos, itens (com ingredientes removidos, extras e observações por item) e
  status (preparando / pronto / entregue) — o cliente acompanha esse status em
  tempo real pela própria mesa, sem precisar de login.
- Chamados de garçom (botão "Chamar Garçom" no site do cliente, com alerta em
  tempo real no admin).
- Relatórios de vendas com dashboard de faturamento, ticket médio, produtos
  mais vendidos, faturamento por categoria e formas de pagamento — calculado a
  partir dos pedidos reais, filtrável por período (hoje / 7 dias / 30 dias / tudo).
- Configurações do restaurante (nome, subtítulo, email, horário, taxa de
  serviço) — usadas também na página "Sobre nós" e nos cálculos de checkout.

Editar o cardápio no admin (criar, editar, excluir ou tirar do ar um item, ou
mudar quais extras ele aceita) reflete **na hora** no site do cliente.
Finalizar uma compra no site cria um pedido de verdade que aparece no admin,
já com taxa de serviço calculada e divisão de conta registrada. O backend
sempre valida no servidor se um extra pedido realmente pertence àquele produto
— não dá pra "forçar" via requisição um extra que não faz sentido pro item
(ex: bacon numa taça de vinho).

## Fluxo do pedido (cliente)

1. **Cardápio** (`pages/menu.php`) — categorias na lateral, grade de produtos,
   painel "Seu Pedido" sempre visível com o total atualizado.
2. **Personalização** — clicar num prato abre um modal pra remover ingredientes,
   adicionar extras (só os que fazem sentido pra aquele prato específico),
   escrever observações e ajustar a quantidade antes de confirmar.
3. **Checkout** (`pages/finalizacao.php`) — resumo da conta, divisão entre
   pessoas ("Fica para cada"), taxa de serviço e escolha entre Pix (QR code),
   pagar com o garçom ou pagar no balcão.
4. **Acompanhamento** (`pages/status.php`) — depois de confirmar o pedido, o
   cliente pode acompanhar o status em tempo real (preparando → pronto →
   entregue) direto pelo celular, sem precisar chamar o garçom pra perguntar.
   O botão "Status do Pedido" aparece automaticamente no cabeçalho de todas as
   páginas sempre que a mesa tiver um pedido em andamento, com uma bolinha
   colorida indicando o status atual.

## Painel admin

- **Pedidos e mesas**: grade de mesas com status, detalhe do pedido ativo e
  fluxo de status (preparando → pronto → entregue) — essa mudança de status é
  o que o cliente vê refletido na página de acompanhamento dele. Chamados de
  garçom pendentes aparecem com destaque no topo.
- **Cardápio → Itens**: criar item novo do zero, editar qualquer campo
  (nome, categoria, preço, descrição, ingredientes, selo, imagem, destaque,
  disponibilidade), escolher quais extras esse item aceita, ou excluir. Itens
  já usados em pedidos não podem ser excluídos (o sistema avisa e sugere
  marcar como indisponível).
- **Cardápio → Extras**: criar, editar e excluir os adicionais que aparecem no
  modal de personalização do cliente.
- **Cardápio → Mídia**: galeria de prévia local (as fotos dos pratos são
  enviadas pelo formulário de cada item).
- **Relatório → Visão geral**: faturamento, número de pedidos, ticket médio e
  avaliação média do período selecionado, com gráfico de faturamento por dia,
  faturamento por categoria, produtos mais vendidos e formas de pagamento mais
  usadas.
- **Relatório → Avaliações**: calendário com avaliações por dia (recurso
  original, preservado).
- **Configurações**: nome do restaurante, subtítulo, contato, horário e a
  porcentagem da taxa de serviço aplicada em todos os checkouts.

## Observações

- A galeria da aba "Mídia" do admin só mostra uma prévia local. O upload real
  de fotos fica no formulário de cada item (ver "Imagens dos pratos").
- Sem PHP/MySQL configurados, as páginas em `pages/*.php` não vão funcionar.
- Links antigos para `pages/produto.php?id=N` continuam funcionando: eles
  redirecionam para o cardápio já com o modal daquele item aberto.
- A página de status do pedido (`pages/status.php`) não exige login — qualquer
  pessoa que souber o número da mesa pode ver o pedido dela, do mesmo jeito
  que já não existe login pro cliente em nenhuma parte do fluxo de pedido.
  Isso é intencional (modelo de QR code por mesa), mas vale saber caso pense
  em adaptar o projeto pra um cenário com contas de cliente.
