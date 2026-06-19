// Dados simulados em memória (Banco de dados temporário)
let categorias = ["Entradas", "Pratos Principais", "Bebidas"];
let produtos = [
    { id: 1, nome: "Hambúrguer Artesanal", preco: 29.90, categoria: "Pratos Principais" },
    { id: 2, nome: "Batata Frita", preco: 15.00, categoria: "Entradas" },
    { id: 3, nome: "Refrigerante Lata", preco: 6.00, categoria: "Bebidas" }
];
let carrinho = [];
let pedidos = [];
let statusMesas = { 1: "Livre", 2: "Livre", 3: "Livre" };
let faturamentoTotal = 0;

// Alternar entre as abas Cliente e Admin
function alternarAba(aba) {
    document.getElementById('aba-cliente').classList.remove('active');
    document.getElementById('aba-admin').classList.remove('active');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    if (aba === 'cliente') {
        document.getElementById('aba-cliente').classList.add('active');
        event.target.classList.add('active');
    } else {
        document.getElementById('aba-admin').classList.add('active');
        event.target.classList.add('active');
    }
}

// Inicializar e renderizar a tela do cliente
function renderizarCardapio() {
    const grid = document.getElementById('cardapio-grid');
    grid.innerHTML = '';

    produtos.forEach(prod => {
        grid.innerHTML += `
            <div class="produto-card">
                <h4>${prod.nome}</h4>
                <p>Categoria: ${prod.categoria}</p>
                <p><strong>R$ ${prod.preco.toFixed(2)}</strong></p>
                <button onclick="adicionarAoCarrinho(${prod.id})">Adicionar</button>
            </div>
        `;
    });
    atualizarSelectCategorias();
}

// Lógica do Carrinho
function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    carrinho.push(produto);
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('itens-carrinho');
    const totalSpan = document.getElementById('total-carrinho');
    lista.innerHTML = '';
    
    let total = 0;
    carrinho.forEach((item, index) => {
        total += item.preco;
        lista.innerHTML += `<li>${item.nome} - R$ ${item.preco.toFixed(2)} <button class="btn-erro" style="padding:2px 5px; width:auto; display:inline;" onclick="removerDoCarrinho(${index})">X</button></li>`;
    });
    
    totalSpan.innerText = total.toFixed(2);
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

// Fechamento e Resumo do Pedido (Modal)
function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    
    const mesa = document.getElementById('selecionar-mesa').value;
    const modal = document.getElementById('modal-resumo');
    const corpoResumo = document.getElementById('corpo-resumo');
    
    let total = carrinho.reduce((sum, item) => sum + item.preco, 0);
    
    // Monta o resumo em texto estruturado dentro da janela modal
    corpoResumo.innerHTML = `
        <p><strong>Mesa selecionada:</strong> ${mesa}</p>
        <hr><br>
        <ul>${carrinho.map(i => `<li>${i.nome} - R$ ${i.preco.toFixed(2)}</li>`).join('')}</ul>
        <br><hr>
        <p><strong>Total do Pedido: R$ ${total.toFixed(2)}</strong></p>
    `;
    
    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-resumo').style.display = 'none';
}

// Confirmação do Pedido
function confirmarPedido() {
    const mesa = document.getElementById('selecionar-mesa').value;
    let total = carrinho.reduce((sum, item) => sum + item.preco, 0);

    const novoPedido = {
        id: pedidos.length + 1,
        mesa: mesa,
        itens: [...carrinho],
        total: total,
        status: "Pendente"
    };

    pedidos.push(novoPedido);
    statusMesas[mesa] = "Ocupada"; // Atualiza controle de mesas
    
    // Limpa carrinho e fecha modal
    carrinho = [];
    atualizarCarrinho();
    fecharModal();
    
    // Atualiza a visão administrativa em background
    atualizarAdmin();
    
    // Alerta de confirmação solicitado
    alert(`🎉 Pedido enviado com sucesso para a Mesa ${mesa}!`);
}

// ================= LÓGICA DO ADMIN =================

// Cadastrar novas Categorias
function salvarCategoria(e) {
    e.preventDefault();
    const nome = document.getElementById('cat-nome').value;
    categorias.push(nome);
    document.getElementById('form-categoria').reset();
    atualizarSelectCategorias();
    alert("Categoria cadastrada com sucesso!");
}

// Atualizar dropdowns de categoria
function atualizarSelectCategorias() {
    const select = document.getElementById('prod-categoria');
    select.innerHTML = categorias.map(c => `<option value="${c}">${c}</option>`).join('');
}

// Cadastrar novos Produtos
function salvarProduto(e) {
    e.preventDefault();
    const nome = document.getElementById('prod-nome').value;
    const preco = parseFloat(document.getElementById('prod-preco').value);
    const categoria = document.getElementById('prod-categoria').value;

    produtos.push({
        id: produtos.length + 1,
        nome: nome,
        preco: preco,
        categoria: categoria
    });

    document.getElementById('form-produto').reset();
    renderizarCardapio();
    alert("Produto cadastrado com sucesso!");
}

// Atualizar painéis, mesas e relatórios na área Admin
function atualizarAdmin() {
    // 1. Gerenciamento de Pedidos
    const listaPed = document.getElementById('lista-pedidos');
    listaPed.innerHTML = pedidos.map(p => `
        <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 5px; border-radius: 5px;">
            <p><strong>Pedido #${p.id} - Mesa ${p.mesa}</strong> (${p.status})</p>
            <p>Total: R$ ${p.total.toFixed(2)}</p>
            ${p.status === 'Pendente' ? `<button class="btn-sucesso" onclick="concluirPedido(${p.id})">Concluir/Liberar Mesa</button>` : '✅ Finalizado'}
        </div>
    `).join('');

    // 2. Controle de Mesas
    const painelMesas = document.getElementById('status-mesas');
    painelMesas.innerHTML = '';
    for (let mesa in statusMesas) {
        const classeStatus = statusMesas[mesa] === 'Livre' ? 'mesa-livre' : 'mesa-ocupada';
        painelMesas.innerHTML += `<div class="mesa-item ${classeStatus}">Mesa ${mesa}<br><small>${statusMesas[mesa]}</small></div>`;
    }

    // 3. Relatórios Básicos
    document.getElementById('faturamento-total').innerText = faturamentoTotal.toFixed(2);
    document.getElementById('qtd-pedidos').innerText = pedidos.filter(p => p.status === 'Finalizado').length;
}

// Concluir Pedido (Muda status, soma no faturamento e libera a mesa)
function concluirPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    pedido.status = "Finalizado";
    statusMesas[pedido.mesa] = "Livre";
    faturamentoTotal += pedido.total;
    
    atualizarAdmin();
}

// Inicialização Automática ao carregar a página
window.onload = function() {
    renderizarCardapio();
    atualizarAdmin();
};