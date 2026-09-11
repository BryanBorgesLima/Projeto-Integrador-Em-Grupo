const Store = function() {
  const DB_KEY = "sm_db_v1";
  const SESSION_KEY = "sm_admin_session_v1";
  function seedData() {
    return {
      produtos: [ {
        id: 1,
        nome: "Bruschetta Tradicional",
        categoria: "entradas",
        preco: 29.9,
        descricao: "Pão italiano tostado, tomates frescos, manjericão e azeite extravirgem.",
        ingredientes: "Pão,Tomate,Manjericão,Alho,Azeite",
        imagem: null,
        tag: "Vegano",
        destaque: false,
        disponivel: true
      }, {
        id: 2,
        nome: "Arancini Siciliani",
        categoria: "entradas",
        preco: 32,
        descricao: "Bolinhos de risoto crocantes recheados com ragu de carne e mozzarella, servidos com molho da casa.",
        ingredientes: "Arroz,Carne,Mozarela,Molho de tomate",
        imagem: null,
        tag: null,
        destaque: false,
        disponivel: true
      }, {
        id: 3,
        nome: "Pão de Alho Artesanal",
        categoria: "entradas",
        preco: 18,
        descricao: "Pão italiano amanteigado, assado no forno com alho fresco e ervas finas.",
        ingredientes: "Pão,Alho,Manteiga,Ervas",
        imagem: null,
        tag: "Vegetariano",
        destaque: false,
        disponivel: true
      }, {
        id: 4,
        nome: "Carpaccio di Manzo",
        categoria: "entradas",
        preco: 36,
        descricao: "Finíssimas fatias de filé mignon com rúcula, lascas de parmesão e molho de mostarda.",
        ingredientes: "Carne,Rúcula,Parmesão,Mostarda",
        imagem: null,
        tag: null,
        destaque: false,
        disponivel: true
      }, {
        id: 5,
        nome: "Spaghetti al Pomodoro",
        categoria: "principais",
        preco: 48,
        descricao: "Massa fresca artesanal, tomates italianos e manjericão fresco.",
        ingredientes: "Massa,Tomate,Manjericão,Alho,Azeite",
        imagem: null,
        tag: "Vegano",
        destaque: true,
        disponivel: true
      }, {
        id: 6,
        nome: "Lasagna alla Bolognese",
        categoria: "principais",
        preco: 52,
        descricao: "Massa fresca artesanal com molho de tomates italianos orgânicos e camadas de ragu bolonhesa e queijo.",
        ingredientes: "Massa,Carne moída,Molho de tomate,Queijo,Molho branco",
        imagem: null,
        tag: null,
        destaque: false,
        disponivel: true
      }, {
        id: 7,
        nome: "Spaghetti alla Carbonara",
        categoria: "principais",
        preco: 54.9,
        descricao: "Massa al dente envolvida em molho cremoso e aveludado, preparado no ponto perfeito com guanciale e pecorino.",
        ingredientes: "Massa,Ovo,Bacon,Queijo,Pimenta preta",
        imagem: null,
        tag: null,
        destaque: false,
        disponivel: true
      }, {
        id: 8,
        nome: "Pizza Margherita",
        categoria: "principais",
        preco: 46,
        descricao: "Molho de tomate artesanal, mozzarella fresca de búfala e folhas de manjericão.",
        ingredientes: "Massa,Molho de tomate,Mozarela de búfala,Manjericão",
        imagem: null,
        tag: "Vegetariano",
        destaque: true,
        disponivel: true
      }, {
        id: 9,
        nome: "Risotto ai Funghi",
        categoria: "principais",
        preco: 58,
        descricao: "Risoto cremoso com mix de cogumelos frescos, finalizado com parmesão e trufa.",
        ingredientes: "Arroz,Cogumelos,Parmesão,Manteiga,Cebola",
        imagem: null,
        tag: "Vegetariano",
        destaque: false,
        disponivel: true
      }, {
        id: 10,
        nome: "Vinho Tinto da Casa (taça)",
        categoria: "bebidas",
        preco: 22,
        descricao: "Seleção especial da casa, corpo médio e notas frutadas. Servido em taça de 150ml.",
        ingredientes: null,
        imagem: null,
        tag: null,
        destaque: false,
        disponivel: true
      }, {
        id: 11,
        nome: "Água com Gás",
        categoria: "bebidas",
        preco: 7,
        descricao: "Água mineral com gás, 500ml, gelada.",
        ingredientes: null,
        imagem: null,
        tag: null,
        destaque: false,
        disponivel: true
      }, {
        id: 12,
        nome: "Limonata Siciliana",
        categoria: "bebidas",
        preco: 14,
        descricao: "Limonada artesanal com raspas de limão siciliano e hortelã fresca.",
        ingredientes: "Limão,Hortelã,Açúcar",
        imagem: null,
        tag: "Vegano",
        destaque: false,
        disponivel: true
      }, {
        id: 13,
        nome: "Refrigerante Lata",
        categoria: "bebidas",
        preco: 7.5,
        descricao: "Lata gelada de 350ml, sabores variados.",
        ingredientes: null,
        imagem: null,
        tag: null,
        destaque: false,
        disponivel: true
      }, {
        id: 14,
        nome: "Tiramisù della Casa",
        categoria: "sobremesas",
        preco: 24,
        descricao: "Camadas de biscoito champagne embebido em café, creme de mascarpone e cacau em pó.",
        ingredientes: "Biscoito,Café,Mascarpone,Cacau,Ovo",
        imagem: null,
        tag: null,
        destaque: true,
        disponivel: true
      }, {
        id: 15,
        nome: "Panna Cotta",
        categoria: "sobremesas",
        preco: 19,
        descricao: "Creme italiano de baunilha com calda de frutas vermelhas.",
        ingredientes: "Creme de leite,Baunilha,Frutas vermelhas",
        imagem: null,
        tag: "Sem glúten",
        destaque: false,
        disponivel: true
      }, {
        id: 16,
        nome: "Cannoli Siciliani",
        categoria: "sobremesas",
        preco: 22,
        descricao: "Massa crocante recheada com ricota doce, gotas de chocolate e pistache.",
        ingredientes: "Massa,Ricota,Chocolate,Pistache",
        imagem: null,
        tag: null,
        destaque: false,
        disponivel: true
      }, {
        id: 17,
        nome: "Gelato Artesanal (2 bolas)",
        categoria: "sobremesas",
        preco: 18,
        descricao: "Gelato cremoso feito na casa, sabores do dia — pergunte ao garçom.",
        ingredientes: null,
        imagem: null,
        tag: "Vegetariano",
        destaque: false,
        disponivel: true
      } ],
      extras: [ {
        id: 1,
        chave: "queijo",
        nome: "Queijo extra",
        preco: 5
      }, {
        id: 2,
        chave: "bacon",
        nome: "Bacon extra",
        preco: 4
      }, {
        id: 3,
        chave: "molho",
        nome: "Molho especial",
        preco: 3
      }, {
        id: 4,
        chave: "parmesao",
        nome: "Parmesão ralado",
        preco: 4.5
      } ],
      produto_extras: [ [ 1, 1 ], [ 2, 1 ], [ 2, 3 ], [ 3, 1 ], [ 4, 4 ], [ 5, 1 ], [ 5, 3 ], [ 5, 4 ], [ 6, 1 ], [ 6, 4 ], [ 7, 1 ], [ 7, 2 ], [ 7, 4 ], [ 8, 1 ], [ 8, 2 ], [ 8, 3 ], [ 8, 4 ], [ 9, 1 ], [ 9, 4 ] ].map(([produto_id, extra_id]) => ({
        produto_id: produto_id,
        extra_id: extra_id
      })),
      mesas: [ {
        numero: 1,
        status: "ocupado"
      }, {
        numero: 2,
        status: "livre"
      }, {
        numero: 3,
        status: "reservado"
      }, {
        numero: 4,
        status: "ocupado"
      }, {
        numero: 5,
        status: "livre"
      }, {
        numero: 6,
        status: "livre"
      }, {
        numero: 7,
        status: "reservado"
      }, {
        numero: 8,
        status: "ocupado"
      }, {
        numero: 9,
        status: "livre"
      }, {
        numero: 10,
        status: "livre"
      }, {
        numero: 11,
        status: "reservado"
      }, {
        numero: 12,
        status: "livre"
      } ],
      chamados_garcom: [],
      pedidos: [ {
        id: 1,
        mesa_numero: 1,
        cliente_nome: "Bryan G Borges Lima",
        forma_pagamento: "garcom",
        status: "preparando",
        subtotal: 108,
        taxa_servico: 10.8,
        total: 118.8,
        dividir_pessoas: 2,
        criado_em: "2026-08-20 12:30:00"
      }, {
        id: 2,
        mesa_numero: 4,
        cliente_nome: "Marina Alves Costa",
        forma_pagamento: "pix",
        status: "pronto",
        subtotal: 60,
        taxa_servico: 6,
        total: 66,
        dividir_pessoas: 1,
        criado_em: "2026-08-20 12:45:00"
      }, {
        id: 3,
        mesa_numero: 8,
        cliente_nome: "João Pedro Santos",
        forma_pagamento: "balcao",
        status: "preparando",
        subtotal: 61,
        taxa_servico: 6.1,
        total: 67.1,
        dividir_pessoas: 3,
        criado_em: "2026-08-20 13:00:00"
      }, {
        id: 4,
        mesa_numero: 2,
        cliente_nome: null,
        forma_pagamento: "pix",
        status: "entregue",
        subtotal: 60,
        taxa_servico: 6,
        total: 66,
        dividir_pessoas: 1,
        criado_em: "2026-08-01 19:20:00"
      }, {
        id: 5,
        mesa_numero: 5,
        cliente_nome: null,
        forma_pagamento: "balcao",
        status: "entregue",
        subtotal: 78.9,
        taxa_servico: 7.89,
        total: 86.79,
        dividir_pessoas: 2,
        criado_em: "2026-08-02 20:05:00"
      }, {
        id: 6,
        mesa_numero: 9,
        cliente_nome: null,
        forma_pagamento: "garcom",
        status: "entregue",
        subtotal: 81.8,
        taxa_servico: 8.18,
        total: 89.98,
        dividir_pessoas: 2,
        criado_em: "2026-08-03 13:15:00"
      }, {
        id: 7,
        mesa_numero: 3,
        cliente_nome: null,
        forma_pagamento: "pix",
        status: "entregue",
        subtotal: 59.5,
        taxa_servico: 5.95,
        total: 65.45,
        dividir_pessoas: 1,
        criado_em: "2026-08-04 19:40:00"
      }, {
        id: 8,
        mesa_numero: 6,
        cliente_nome: null,
        forma_pagamento: "pix",
        status: "entregue",
        subtotal: 77,
        taxa_servico: 7.7,
        total: 84.7,
        dividir_pessoas: 1,
        criado_em: "2026-08-06 20:30:00"
      }, {
        id: 9,
        mesa_numero: 10,
        cliente_nome: null,
        forma_pagamento: "balcao",
        status: "entregue",
        subtotal: 62,
        taxa_servico: 6.2,
        total: 68.2,
        dividir_pessoas: 2,
        criado_em: "2026-08-07 12:50:00"
      }, {
        id: 10,
        mesa_numero: 1,
        cliente_nome: null,
        forma_pagamento: "garcom",
        status: "entregue",
        subtotal: 114.9,
        taxa_servico: 11.49,
        total: 126.39,
        dividir_pessoas: 3,
        criado_em: "2026-08-09 20:10:00"
      }, {
        id: 11,
        mesa_numero: 4,
        cliente_nome: null,
        forma_pagamento: "pix",
        status: "entregue",
        subtotal: 54,
        taxa_servico: 5.4,
        total: 59.4,
        dividir_pessoas: 1,
        criado_em: "2026-08-10 13:25:00"
      }, {
        id: 12,
        mesa_numero: 7,
        cliente_nome: null,
        forma_pagamento: "pix",
        status: "entregue",
        subtotal: 107,
        taxa_servico: 10.7,
        total: 117.7,
        dividir_pessoas: 4,
        criado_em: "2026-08-11 19:55:00"
      }, {
        id: 13,
        mesa_numero: 11,
        cliente_nome: null,
        forma_pagamento: "balcao",
        status: "entregue",
        subtotal: 72.9,
        taxa_servico: 7.29,
        total: 80.19,
        dividir_pessoas: 1,
        criado_em: "2026-08-13 20:15:00"
      }, {
        id: 14,
        mesa_numero: 2,
        cliente_nome: null,
        forma_pagamento: "garcom",
        status: "entregue",
        subtotal: 82,
        taxa_servico: 8.2,
        total: 90.2,
        dividir_pessoas: 2,
        criado_em: "2026-08-14 13:05:00"
      }, {
        id: 15,
        mesa_numero: 8,
        cliente_nome: null,
        forma_pagamento: "pix",
        status: "entregue",
        subtotal: 74,
        taxa_servico: 7.4,
        total: 81.4,
        dividir_pessoas: 1,
        criado_em: "2026-08-16 19:35:00"
      }, {
        id: 16,
        mesa_numero: 5,
        cliente_nome: null,
        forma_pagamento: "pix",
        status: "entregue",
        subtotal: 103.7,
        taxa_servico: 10.37,
        total: 114.07,
        dividir_pessoas: 3,
        criado_em: "2026-08-17 20:20:00"
      }, {
        id: 17,
        mesa_numero: 9,
        cliente_nome: null,
        forma_pagamento: "balcao",
        status: "entregue",
        subtotal: 72,
        taxa_servico: 7.2,
        total: 79.2,
        dividir_pessoas: 2,
        criado_em: "2026-08-18 13:10:00"
      }, {
        id: 18,
        mesa_numero: 12,
        cliente_nome: null,
        forma_pagamento: "garcom",
        status: "entregue",
        subtotal: 90.9,
        taxa_servico: 9.09,
        total: 99.99,
        dividir_pessoas: 2,
        criado_em: "2026-08-19 20:00:00"
      } ],
      pedido_itens: [ {
        id: 1,
        pedido_id: 1,
        produto_id: 7,
        quantidade: 2,
        preco_unitario: 54.9,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 2,
        pedido_id: 2,
        produto_id: 8,
        quantidade: 1,
        preco_unitario: 46,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 3,
        pedido_id: 2,
        produto_id: 11,
        quantidade: 2,
        preco_unitario: 7,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 4,
        pedido_id: 3,
        produto_id: 2,
        quantidade: 1,
        preco_unitario: 32,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 5,
        pedido_id: 3,
        produto_id: 12,
        quantidade: 1,
        preco_unitario: 14,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 6,
        pedido_id: 3,
        produto_id: 17,
        quantidade: 1,
        preco_unitario: 18,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 7,
        pedido_id: 4,
        produto_id: 8,
        quantidade: 1,
        preco_unitario: 46,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 8,
        pedido_id: 4,
        produto_id: 11,
        quantidade: 2,
        preco_unitario: 7,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 9,
        pedido_id: 5,
        produto_id: 7,
        quantidade: 1,
        preco_unitario: 54.9,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 10,
        pedido_id: 5,
        produto_id: 14,
        quantidade: 1,
        preco_unitario: 24,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 11,
        pedido_id: 6,
        produto_id: 1,
        quantidade: 2,
        preco_unitario: 29.9,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 12,
        pedido_id: 6,
        produto_id: 10,
        quantidade: 1,
        preco_unitario: 22,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 13,
        pedido_id: 7,
        produto_id: 6,
        quantidade: 1,
        preco_unitario: 52,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 14,
        pedido_id: 7,
        produto_id: 13,
        quantidade: 1,
        preco_unitario: 7.5,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 15,
        pedido_id: 8,
        produto_id: 9,
        quantidade: 1,
        preco_unitario: 58,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 16,
        pedido_id: 8,
        produto_id: 15,
        quantidade: 1,
        preco_unitario: 19,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 17,
        pedido_id: 9,
        produto_id: 5,
        quantidade: 1,
        preco_unitario: 48,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 18,
        pedido_id: 9,
        produto_id: 12,
        quantidade: 1,
        preco_unitario: 14,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 19,
        pedido_id: 10,
        produto_id: 8,
        quantidade: 1,
        preco_unitario: 46,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 20,
        pedido_id: 10,
        produto_id: 7,
        quantidade: 1,
        preco_unitario: 54.9,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 21,
        pedido_id: 10,
        produto_id: 11,
        quantidade: 2,
        preco_unitario: 7,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 22,
        pedido_id: 11,
        produto_id: 2,
        quantidade: 1,
        preco_unitario: 32,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 23,
        pedido_id: 11,
        produto_id: 16,
        quantidade: 1,
        preco_unitario: 22,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 24,
        pedido_id: 12,
        produto_id: 8,
        quantidade: 2,
        preco_unitario: 46,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 25,
        pedido_id: 12,
        produto_id: 13,
        quantidade: 2,
        preco_unitario: 7.5,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 26,
        pedido_id: 13,
        produto_id: 7,
        quantidade: 1,
        preco_unitario: 54.9,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 27,
        pedido_id: 13,
        produto_id: 17,
        quantidade: 1,
        preco_unitario: 18,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 28,
        pedido_id: 14,
        produto_id: 9,
        quantidade: 1,
        preco_unitario: 58,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 29,
        pedido_id: 14,
        produto_id: 14,
        quantidade: 1,
        preco_unitario: 24,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 30,
        pedido_id: 15,
        produto_id: 6,
        quantidade: 1,
        preco_unitario: 52,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 31,
        pedido_id: 15,
        produto_id: 10,
        quantidade: 1,
        preco_unitario: 22,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 32,
        pedido_id: 16,
        produto_id: 1,
        quantidade: 3,
        preco_unitario: 29.9,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 33,
        pedido_id: 16,
        produto_id: 12,
        quantidade: 1,
        preco_unitario: 14,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 34,
        pedido_id: 17,
        produto_id: 8,
        quantidade: 1,
        preco_unitario: 46,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 35,
        pedido_id: 17,
        produto_id: 15,
        quantidade: 1,
        preco_unitario: 19,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 36,
        pedido_id: 17,
        produto_id: 11,
        quantidade: 1,
        preco_unitario: 7,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 37,
        pedido_id: 18,
        produto_id: 7,
        quantidade: 1,
        preco_unitario: 54.9,
        ingredientes_removidos: null,
        observacoes: null
      }, {
        id: 38,
        pedido_id: 18,
        produto_id: 4,
        quantidade: 1,
        preco_unitario: 36,
        ingredientes_removidos: null,
        observacoes: null
      } ],
      pedido_item_extras: [],
      relatorios: [ {
        id: 1,
        mesa_numero: 2,
        pedido_id: 4,
        avaliacao: 4,
        data_relatorio: "2026-08-01",
        total: 66
      }, {
        id: 2,
        mesa_numero: 5,
        pedido_id: 5,
        avaliacao: 5,
        data_relatorio: "2026-08-02",
        total: 86.79
      }, {
        id: 3,
        mesa_numero: 9,
        pedido_id: 6,
        avaliacao: 4,
        data_relatorio: "2026-08-03",
        total: 89.98
      }, {
        id: 4,
        mesa_numero: 3,
        pedido_id: 7,
        avaliacao: 3,
        data_relatorio: "2026-08-04",
        total: 65.45
      }, {
        id: 5,
        mesa_numero: 6,
        pedido_id: 8,
        avaliacao: 5,
        data_relatorio: "2026-08-06",
        total: 84.7
      }, {
        id: 6,
        mesa_numero: 10,
        pedido_id: 9,
        avaliacao: 4,
        data_relatorio: "2026-08-07",
        total: 68.2
      }, {
        id: 7,
        mesa_numero: 1,
        pedido_id: 10,
        avaliacao: 5,
        data_relatorio: "2026-08-09",
        total: 126.39
      }, {
        id: 8,
        mesa_numero: 4,
        pedido_id: 11,
        avaliacao: 2,
        data_relatorio: "2026-08-10",
        total: 59.4
      }, {
        id: 9,
        mesa_numero: 7,
        pedido_id: 12,
        avaliacao: 4,
        data_relatorio: "2026-08-11",
        total: 117.7
      }, {
        id: 10,
        mesa_numero: 11,
        pedido_id: 13,
        avaliacao: 3,
        data_relatorio: "2026-08-13",
        total: 80.19
      }, {
        id: 11,
        mesa_numero: 2,
        pedido_id: 14,
        avaliacao: 5,
        data_relatorio: "2026-08-14",
        total: 90.2
      }, {
        id: 12,
        mesa_numero: 8,
        pedido_id: 15,
        avaliacao: 4,
        data_relatorio: "2026-08-16",
        total: 81.4
      }, {
        id: 13,
        mesa_numero: 5,
        pedido_id: 16,
        avaliacao: 5,
        data_relatorio: "2026-08-17",
        total: 114.07
      }, {
        id: 14,
        mesa_numero: 9,
        pedido_id: 17,
        avaliacao: 3,
        data_relatorio: "2026-08-18",
        total: 79.2
      }, {
        id: 15,
        mesa_numero: 12,
        pedido_id: 18,
        avaliacao: 4,
        data_relatorio: "2026-08-19",
        total: 99.99
      } ],
      funcionarios: [ {
        id: 1,
        nome: "Gestor",
        email: "admin@saboremmesa.com",
        senha: "admin123"
      }, {
        id: 2,
        nome: "Kauan Beraguas",
        email: "kauan@saboremmesa.com",
        senha: "1234"
      }, {
        id: 3,
        nome: "Bryan Guilherme",
        email: "bryan@saboremmesa.com",
        senha: "1234"
      }, {
        id: 4,
        nome: "João Henrique",
        email: "joao@saboremmesa.com",
        senha: "1234"
      }, {
        id: 5,
        nome: "Roger Liedlke",
        email: "roger@saboremmesa.com",
        senha: "1234"
      }, {
        id: 6,
        nome: "Pedro Henrique",
        email: "pedro@saboremmesa.com",
        senha: "1234"
      } ],
      configuracoes: {
        nome_restaurante: "Trattoria Liedlke",
        subtitulo: "Sabor em Mesa",
        email_contato: "contato@saboremmesa.com",
        horario_funcionamento: "Seg–Ter 11h–22h · Sex–Sáb 12h–23h · Dom fechado",
        taxa_servico_percentual: 10
      }
    };
  }
  let db = load();
  function load() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const fresh = seedData();
    persist(fresh);
    return fresh;
  }
  function persist(data) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (e) {}
  }
  function save() {
    persist(db);
  }
  function nextId(list) {
    return list.reduce((max, row) => Math.max(max, row.id), 0) + 1;
  }
  function formatDateSql(d) {
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  function toJsProduto(row, extraIds) {
    let ingredientes = [];
    if (row.ingredientes) {
      ingredientes = row.ingredientes.split(",").map(s => s.trim()).filter(s => s !== "");
    }
    return {
      id: Number(row.id),
      name: row.nome,
      category: row.categoria,
      price: Number(row.preco),
      description: row.descricao || "",
      ingredients: ingredientes,
      extraIds: (extraIds || []).slice(),
      image: row.imagem,
      tag: row.tag,
      featured: !!row.destaque,
      available: !!row.disponivel
    };
  }
  function toJsExtra(row) {
    return {
      id: row.chave,
      name: row.nome,
      price: Number(row.preco)
    };
  }
  function toJsExtraAdmin(row) {
    return {
      id: Number(row.id),
      chave: row.chave,
      name: row.nome,
      price: Number(row.preco)
    };
  }
  function toJsMesa(row) {
    return {
      numero: Number(row.numero),
      status: row.status
    };
  }
  function toJsChamado(row) {
    return {
      id: Number(row.id),
      mesa: Number(row.mesa_numero),
      status: row.status,
      criado_em: row.criado_em
    };
  }
  function toJsPedidoStatus(pedido) {
    return {
      id: Number(pedido.id),
      mesa: Number(pedido.mesa_numero),
      status: pedido.status,
      forma_pagamento: pedido.forma_pagamento,
      subtotal: Number(pedido.subtotal),
      taxa_servico: Number(pedido.taxa_servico),
      total: Number(pedido.total),
      dividir_pessoas: Number(pedido.dividir_pessoas),
      criado_em: pedido.criado_em,
      itens: (pedido.itens || []).map(it => ({
        nome: it.produto_nome,
        imagem: it.produto_imagem,
        quantidade: Number(it.quantidade),
        preco_unitario: Number(it.preco_unitario),
        ingredientes_removidos: it.ingredientes_removidos,
        observacoes: it.observacoes
      }))
    };
  }
  function getProdutos(onlyAvailable) {
    let list = db.produtos.slice();
    if (onlyAvailable) list = list.filter(p => p.disponivel);
    return list.sort((a, b) => (a.categoria + a.nome).localeCompare(b.categoria + b.nome));
  }
  function getExtras() {
    return db.extras.slice().sort((a, b) => a.id - b.id);
  }
  function getProdutoExtrasMap() {
    const map = {};
    db.produto_extras.forEach(row => {
      const extra = db.extras.find(e => e.id === row.extra_id);
      if (!extra) return;
      if (!map[row.produto_id]) map[row.produto_id] = [];
      map[row.produto_id].push(extra.chave);
    });
    return map;
  }
  function getConfiguracoes() {
    return Object.assign({}, db.configuracoes);
  }
  function getMesas() {
    return db.mesas.slice().sort((a, b) => a.numero - b.numero);
  }
  function getChamadosGarcom(onlyPendentes) {
    let list = db.chamados_garcom.slice();
    if (onlyPendentes !== false) list = list.filter(c => c.status === "pendente");
    return list.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
  }
  function produtosParaJs(produtos, extrasMap) {
    const map = extrasMap || getProdutoExtrasMap();
    return produtos.map(p => toJsProduto(p, map[p.id] || []));
  }
  function pedidoComItens(pedido) {
    const itens = db.pedido_itens.filter(it => it.pedido_id === pedido.id).map(it => {
      const produto = db.produtos.find(p => p.id === it.produto_id);
      return Object.assign({}, it, {
        produto_nome: produto ? produto.nome : "(item removido)",
        produto_imagem: produto ? produto.imagem : null
      });
    });
    return Object.assign({}, pedido, {
      itens: itens
    });
  }
  function getPedidosCompletos(filterFn) {
    let list = db.pedidos.slice();
    if (filterFn) list = list.filter(filterFn);
    list.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
    return list.map(pedidoComItens);
  }
  function getMesasComPedidos() {
    const mesas = getMesas();
    const pedidos = getPedidosCompletos(p => p.status !== "entregue");
    const pedidosPorMesa = {};
    pedidos.forEach(p => {
      pedidosPorMesa[p.mesa_numero] = p;
    });
    return mesas.map(m => Object.assign({}, m, {
      pedido: pedidosPorMesa[m.numero] || null
    }));
  }
  function getUltimoPedidoMesa(mesa) {
    const mesaRow = db.mesas.find(m => m.numero === mesa);
    if (!mesaRow || mesaRow.status !== "ocupado") return null;
    const pedidos = db.pedidos.filter(p => p.mesa_numero === mesa).sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
    if (!pedidos.length) return null;
    return pedidoComItens(pedidos[0]);
  }
  function getRelatorios() {
    return db.relatorios.slice().sort((a, b) => new Date(b.data_relatorio) - new Date(a.data_relatorio));
  }
  const PERIODOS_VALIDOS = [ "hoje", "7d", "30d", "tudo" ];
  function periodoDesde(periodo) {
    const now = new Date;
    const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    switch (periodo) {
     case "hoje":
      return startOfDay(now);

     case "7d":
      {
        const d = new Date(now);
        d.setDate(d.getDate() - 6);
        return startOfDay(d);
      }

     case "tudo":
      return new Date("2000-01-01T00:00:00");

     case "30d":
     default:
      {
        const d = new Date(now);
        d.setDate(d.getDate() - 29);
        return startOfDay(d);
      }
    }
  }
  function getRelatorioDashboard(periodoIn) {
    const periodo = PERIODOS_VALIDOS.includes(periodoIn) ? periodoIn : "30d";
    const desde = periodoDesde(periodo);
    const pedidosPeriodo = db.pedidos.filter(p => new Date(p.criado_em.replace(" ", "T")) >= desde);
    const totalPedidos = pedidosPeriodo.length;
    const faturamento = pedidosPeriodo.reduce((s, p) => s + Number(p.total), 0);
    const ticketMedio = totalPedidos ? faturamento / totalPedidos : 0;
    const avaliacoesPeriodo = db.relatorios.filter(r => new Date(r.data_relatorio) >= desde);
    const mediaAvaliacao = avaliacoesPeriodo.length ? avaliacoesPeriodo.reduce((s, r) => s + Number(r.avaliacao), 0) / avaliacoesPeriodo.length : null;
    const porDiaMap = {};
    pedidosPeriodo.forEach(p => {
      const dia = p.criado_em.slice(0, 10);
      if (!porDiaMap[dia]) porDiaMap[dia] = {
        dia: dia,
        total: 0,
        pedidos: 0
      };
      porDiaMap[dia].total += Number(p.total);
      porDiaMap[dia].pedidos += 1;
    });
    const porDia = Object.values(porDiaMap).sort((a, b) => a.dia.localeCompare(b.dia));
    const idsPeriodo = new Set(pedidosPeriodo.map(p => p.id));
    const itensPeriodo = db.pedido_itens.filter(it => idsPeriodo.has(it.pedido_id));
    const topMap = {};
    itensPeriodo.forEach(it => {
      const produto = db.produtos.find(p => p.id === it.produto_id);
      if (!produto) return;
      if (!topMap[produto.id]) topMap[produto.id] = {
        id: produto.id,
        nome: produto.nome,
        categoria: produto.categoria,
        qtd: 0,
        receita: 0
      };
      topMap[produto.id].qtd += Number(it.quantidade);
      topMap[produto.id].receita += Number(it.quantidade) * Number(it.preco_unitario);
    });
    const topProdutos = Object.values(topMap).sort((a, b) => b.qtd - a.qtd).slice(0, 8);
    const catMap = {};
    itensPeriodo.forEach(it => {
      const produto = db.produtos.find(p => p.id === it.produto_id);
      if (!produto) return;
      if (!catMap[produto.categoria]) catMap[produto.categoria] = {
        categoria: produto.categoria,
        receita: 0
      };
      catMap[produto.categoria].receita += Number(it.quantidade) * Number(it.preco_unitario);
    });
    const porCategoria = Object.values(catMap).sort((a, b) => b.receita - a.receita);
    const pagMap = {};
    pedidosPeriodo.forEach(p => {
      if (!pagMap[p.forma_pagamento]) pagMap[p.forma_pagamento] = {
        forma: p.forma_pagamento,
        qtd: 0,
        receita: 0
      };
      pagMap[p.forma_pagamento].qtd += 1;
      pagMap[p.forma_pagamento].receita += Number(p.total);
    });
    const porPagamento = Object.values(pagMap).sort((a, b) => b.qtd - a.qtd);
    return {
      periodo: periodo,
      resumo: {
        total_pedidos: totalPedidos,
        faturamento: faturamento,
        ticket_medio: ticketMedio,
        avaliacao_media: mediaAvaliacao !== null ? Math.round(mediaAvaliacao * 10) / 10 : null,
        avaliacoes_total: avaliacoesPeriodo.length
      },
      porDia: porDia,
      topProdutos: topProdutos,
      porCategoria: porCategoria,
      porPagamento: porPagamento
    };
  }
  function safeTruncate(text, maxChars) {
    return text.length > maxChars ? text.slice(0, maxChars) : text;
  }
  function normalizarIngredientes(input) {
    let partes = Array.isArray(input) ? input : String(input || "").split(",");
    partes = partes.map(p => String(p).trim()).filter(p => p !== "");
    return partes.join(",");
  }
  function apiError(message) {
    return Promise.reject({
      message: message
    });
  }
  function apiOk(data) {
    return Promise.resolve(Object.assign({
      sucesso: true
    }, data));
  }
  function isLoggedIn() {
    try {
      return !!JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    } catch (e) {
      return false;
    }
  }
  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    } catch (e) {
      return null;
    }
  }
  function login(email, senha) {
    email = (email || "").trim();
    if (!email || !senha) return apiError("Informe email e senha.");
    const func = db.funcionarios.find(f => f.email === email);
    if (!func || func.senha !== senha) return apiError("Email ou senha inválidos.");
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      id: func.id,
      nome: func.nome
    }));
    return apiOk({
      nome: func.nome
    });
  }
  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    return apiOk({});
  }
  function requireLogin() {
    if (!isLoggedIn()) throw {
      message: "Não autenticado."
    };
  }
  function chamarGarcom(mesa) {
    mesa = Number(mesa);
    if (!mesa) return apiError("Mesa inválida.");
    if (!db.mesas.find(m => m.numero === mesa)) return apiError("Mesa não encontrada.");
    const chamado = {
      id: nextId(db.chamados_garcom),
      mesa_numero: mesa,
      status: "pendente",
      criado_em: formatDateSql(new Date),
      atendido_em: null
    };
    db.chamados_garcom.push(chamado);
    save();
    return apiOk({
      chamado_id: chamado.id
    });
  }
  function atenderChamado(chamadoId) {
    try {
      requireLogin();
    } catch (e) {
      return Promise.reject(e);
    }
    const chamado = db.chamados_garcom.find(c => c.id === Number(chamadoId));
    if (chamado) {
      chamado.status = "atendido";
      chamado.atendido_em = formatDateSql(new Date);
      save();
    }
    return apiOk({});
  }
  function atualizarMesa(numero, status) {
    try {
      requireLogin();
    } catch (e) {
      return Promise.reject(e);
    }
    numero = Number(numero);
    if (!numero || ![ "livre", "reservado", "ocupado" ].includes(status)) {
      return apiError("Dados inválidos.");
    }
    const mesa = db.mesas.find(m => m.numero === numero);
    if (mesa) mesa.status = status;
    save();
    return apiOk({});
  }
  function atualizarPedido(pedidoId, status) {
    try {
      requireLogin();
    } catch (e) {
      return Promise.reject(e);
    }
    pedidoId = Number(pedidoId);
    if (!pedidoId || ![ "preparando", "pronto", "entregue" ].includes(status)) {
      return apiError("Dados inválidos.");
    }
    const pedido = db.pedidos.find(p => p.id === pedidoId);
    if (pedido) {
      pedido.status = status;
      if (status === "entregue") {
        const mesa = db.mesas.find(m => m.numero === pedido.mesa_numero);
        if (mesa) mesa.status = "livre";
      }
    }
    save();
    return apiOk({});
  }
  function pedidoMesa(mesa) {
    mesa = Number(mesa);
    if (!mesa) return apiError("Informe o número da mesa.");
    const pedido = getUltimoPedidoMesa(mesa);
    return apiOk({
      pedido: pedido ? toJsPedidoStatus(pedido) : null
    });
  }
  function criarPedido(payload) {
    const mesa = Number(payload.mesa || 0);
    const formaPagamento = String(payload.forma_pagamento || "").trim();
    const dividirPessoas = Math.max(1, Number(payload.dividir_pessoas || 1));
    const itens = Array.isArray(payload.itens) ? payload.itens : [];
    const formasValidas = [ "pix", "garcom", "balcao" ];
    if (!mesa || !formasValidas.includes(formaPagamento) || itens.length === 0) {
      return apiError("Pedido ou dados de pagamento inválidos.");
    }
    const produtosPorId = {};
    db.produtos.forEach(p => produtosPorId[p.id] = p);
    const extrasPorChave = {};
    db.extras.forEach(e => extrasPorChave[e.chave] = e);
    const extrasPermitidos = getProdutoExtrasMap();
    const taxaPercentual = Number(db.configuracoes.taxa_servico_percentual);
    let subtotal = 0;
    const itensValidados = [];
    itens.forEach(item => {
      const produtoId = Number(item.productId || 0);
      const qty = Math.max(1, Number(item.qty || 1));
      const produto = produtosPorId[produtoId];
      if (!produto) return;
      let ingredientesDisponiveis = [];
      if (produto.ingredientes) {
        ingredientesDisponiveis = produto.ingredientes.split(",").map(s => s.trim());
      }
      const removidos = [];
      if (Array.isArray(item.removedIngredients)) {
        item.removedIngredients.forEach(ing => {
          ing = String(ing || "").trim();
          if (ing !== "" && ingredientesDisponiveis.includes(ing)) removidos.push(ing);
        });
      }
      const extrasDoProduto = extrasPermitidos[produtoId] || [];
      const linhaExtras = [];
      let extraTotal = 0;
      if (item.extras && typeof item.extras === "object") {
        Object.entries(item.extras).forEach(([chave, qtdExtra]) => {
          qtdExtra = Number(qtdExtra);
          if (qtdExtra <= 0 || !extrasPorChave[chave]) return;
          if (!extrasDoProduto.includes(chave)) return;
          linhaExtras.push({
            extra_id: extrasPorChave[chave].id,
            quantidade: qtdExtra
          });
          extraTotal += extrasPorChave[chave].preco * qtdExtra;
        });
      }
      let notes = String(item.notes || "").trim();
      notes = safeTruncate(notes, 255);
      const lineTotal = (produto.preco + extraTotal) * qty;
      subtotal += lineTotal;
      itensValidados.push({
        produto_id: produtoId,
        quantidade: qty,
        preco_unitario: produto.preco,
        ingredientes_removidos: removidos.length ? removidos.join(",") : null,
        observacoes: notes !== "" ? notes : null,
        extras: linhaExtras
      });
    });
    if (itensValidados.length === 0) return apiError("Nenhum item válido no pedido.");
    const taxaServico = Math.round(subtotal * (taxaPercentual / 100) * 100) / 100;
    const total = subtotal + taxaServico;
    const pedidoId = nextId(db.pedidos);
    db.pedidos.push({
      id: pedidoId,
      mesa_numero: mesa,
      cliente_nome: null,
      forma_pagamento: formaPagamento,
      status: "preparando",
      subtotal: subtotal,
      taxa_servico: taxaServico,
      total: total,
      dividir_pessoas: dividirPessoas,
      criado_em: formatDateSql(new Date)
    });
    itensValidados.forEach(item => {
      const itemId = nextId(db.pedido_itens);
      db.pedido_itens.push({
        id: itemId,
        pedido_id: pedidoId,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        ingredientes_removidos: item.ingredientes_removidos,
        observacoes: item.observacoes
      });
      item.extras.forEach(extra => {
        db.pedido_item_extras.push({
          id: nextId(db.pedido_item_extras),
          pedido_item_id: itemId,
          extra_id: extra.extra_id,
          quantidade: extra.quantidade
        });
      });
    });
    const mesaRow = db.mesas.find(m => m.numero === mesa);
    if (mesaRow) mesaRow.status = "ocupado";
    save();
    return apiOk({
      pedido_id: pedidoId,
      total: total
    });
  }
  function relatorioDashboard(periodo) {
    try {
      requireLogin();
    } catch (e) {
      return Promise.reject(e);
    }
    if (!PERIODOS_VALIDOS.includes(periodo)) periodo = "30d";
    return apiOk({
      dashboard: getRelatorioDashboard(periodo)
    });
  }
  function salvarConfiguracoes(payload) {
    try {
      requireLogin();
    } catch (e) {
      return Promise.reject(e);
    }
    const nome = String(payload.nome_restaurante || "").trim();
    const subtitulo = String(payload.subtitulo || "").trim();
    const email = String(payload.email_contato || "").trim();
    const horario = String(payload.horario_funcionamento || "").trim();
    const taxa = Number(payload.taxa_servico_percentual);
    if (nome === "" || email === "") return apiError("Nome e email são obrigatórios.");
    if (isNaN(taxa) || taxa < 0 || taxa > 100) return apiError("Taxa de serviço deve estar entre 0 e 100.");
    db.configuracoes = {
      nome_restaurante: nome,
      subtitulo: subtitulo,
      email_contato: email,
      horario_funcionamento: horario,
      taxa_servico_percentual: taxa
    };
    save();
    return apiOk({});
  }
  function salvarExtra(payload) {
    try {
      requireLogin();
    } catch (e) {
      return Promise.reject(e);
    }
    const id = Number(payload.id || 0);
    const nome = String(payload.nome || "").trim();
    const preco = payload.preco;
    let chave = String(payload.chave || "").trim();
    if (nome === "") return apiError("Informe o nome do extra.");
    if (typeof preco !== "number" || isNaN(preco) || preco < 0) return apiError("Informe um preço válido.");
    const precoRound = Math.round(preco * 100) / 100;
    if (chave === "") {
      chave = nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      chave = chave.replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    }
    if (chave === "") chave = "extra";
    let row;
    if (id > 0) {
      row = db.extras.find(e => e.id === id);
      if (!row) return apiError("Extra não encontrado.");
      row.nome = nome;
      row.preco = precoRound;
      row.chave = chave;
    } else {
      const baseChave = chave;
      let i = 2;
      while (db.extras.find(e => e.chave === chave)) {
        chave = baseChave + "_" + i;
        i++;
      }
      row = {
        id: nextId(db.extras),
        chave: chave,
        nome: nome,
        preco: precoRound
      };
      db.extras.push(row);
    }
    save();
    return apiOk({
      extra: toJsExtraAdmin(row)
    });
  }
  function excluirExtra(id) {
    try {
      requireLogin();
    } catch (e) {
      return Promise.reject(e);
    }
    id = Number(id);
    if (!id) return apiError("id é obrigatório.");
    const emUso = db.pedido_item_extras.some(pie => pie.extra_id === id);
    if (emUso) return apiError("Esse extra já foi usado em pedidos e não pode ser excluído.");
    const idx = db.extras.findIndex(e => e.id === id);
    if (idx === -1) return apiError("Extra não encontrado.");
    db.extras.splice(idx, 1);
    db.produto_extras = db.produto_extras.filter(pe => pe.extra_id !== id);
    save();
    return apiOk({});
  }
  const CATEGORIAS_VALIDAS = [ "entradas", "principais", "bebidas", "sobremesas" ];
  function salvarProduto(payload) {
    try {
      requireLogin();
    } catch (e) {
      return Promise.reject(e);
    }
    const id = Number(payload.id || 0);
    const nome = String(payload.nome || "").trim();
    const categoria = String(payload.categoria || "").trim();
    const preco = payload.preco;
    const descricao = String(payload.descricao || "").trim();
    const ingredientes = normalizarIngredientes(payload.ingredientes || "");
    const imagem = String(payload.imagem || "").trim();
    const tag = String(payload.tag || "").trim();
    const destaque = !!payload.destaque;
    const disponivel = Object.prototype.hasOwnProperty.call(payload, "disponivel") ? !!payload.disponivel : true;
    const extraIdsRaw = Array.isArray(payload.extra_ids) ? payload.extra_ids : [];
    const extraIds = Array.from(new Set(extraIdsRaw.map(Number).filter(v => v > 0)));
    if (nome === "") return apiError("Informe o nome do item.");
    if (!CATEGORIAS_VALIDAS.includes(categoria)) return apiError("Categoria inválida.");
    if (typeof preco !== "number" || isNaN(preco) || preco < 0) return apiError("Informe um preço válido.");
    const precoRound = Math.round(preco * 100) / 100;
    let row;
    let finalId = id;
    if (id > 0) {
      row = db.produtos.find(p => p.id === id);
      if (!row) return apiError("Item não encontrado.");
      Object.assign(row, {
        nome: nome,
        categoria: categoria,
        preco: precoRound,
        descricao: descricao || null,
        ingredientes: ingredientes || null,
        imagem: imagem || null,
        tag: tag || null,
        destaque: destaque,
        disponivel: disponivel
      });
    } else {
      finalId = nextId(db.produtos);
      row = {
        id: finalId,
        nome: nome,
        categoria: categoria,
        preco: precoRound,
        descricao: descricao || null,
        ingredientes: ingredientes || null,
        imagem: imagem || null,
        tag: tag || null,
        destaque: destaque,
        disponivel: disponivel
      };
      db.produtos.push(row);
    }
    db.produto_extras = db.produto_extras.filter(pe => pe.produto_id !== finalId);
    const extraIdsValidos = extraIds.filter(eid => db.extras.find(e => e.id === eid));
    extraIdsValidos.forEach(extraId => {
      db.produto_extras.push({
        produto_id: finalId,
        extra_id: extraId
      });
    });
    save();
    const extrasDoProduto = getProdutoExtrasMap()[finalId] || [];
    return apiOk({
      produto: toJsProduto(row, extrasDoProduto)
    });
  }
  function excluirProduto(id) {
    try {
      requireLogin();
    } catch (e) {
      return Promise.reject(e);
    }
    id = Number(id);
    if (!id) return apiError("id é obrigatório.");
    const emUso = db.pedido_itens.some(pi => pi.produto_id === id);
    if (emUso) return apiError("Esse item já foi usado em pedidos e não pode ser excluído. Marque-o como indisponível em vez de excluir.");
    const idx = db.produtos.findIndex(p => p.id === id);
    if (idx === -1) return apiError("Item não encontrado.");
    db.produtos.splice(idx, 1);
    db.produto_extras = db.produto_extras.filter(pe => pe.produto_id !== id);
    save();
    return apiOk({});
  }
  function toggleDisponibilidade(produtoId) {
    try {
      requireLogin();
    } catch (e) {
      return Promise.reject(e);
    }
    produtoId = Number(produtoId);
    if (!produtoId) return apiError("produto_id é obrigatório.");
    const row = db.produtos.find(p => p.id === produtoId);
    if (row) {
      row.disponivel = !row.disponivel;
      save();
    }
    return apiOk({
      disponivel: row ? !!row.disponivel : false
    });
  }
  return {
    getProdutos: getProdutos,
    getExtras: getExtras,
    getProdutoExtrasMap: getProdutoExtrasMap,
    getConfiguracoes: getConfiguracoes,
    getMesas: getMesas,
    getChamadosGarcom: getChamadosGarcom,
    getMesasComPedidos: getMesasComPedidos,
    getPedidosCompletos: getPedidosCompletos,
    getUltimoPedidoMesa: getUltimoPedidoMesa,
    getRelatorios: getRelatorios,
    getRelatorioDashboard: getRelatorioDashboard,
    produtosParaJs: produtosParaJs,
    toJsProduto: toJsProduto,
    toJsExtra: toJsExtra,
    toJsExtraAdmin: toJsExtraAdmin,
    toJsMesa: toJsMesa,
    toJsChamado: toJsChamado,
    toJsPedidoStatus: toJsPedidoStatus,
    isLoggedIn: isLoggedIn,
    getSession: getSession,
    login: login,
    logout: logout,
    chamarGarcom: chamarGarcom,
    atenderChamado: atenderChamado,
    atualizarMesa: atualizarMesa,
    atualizarPedido: atualizarPedido,
    pedidoMesa: pedidoMesa,
    criarPedido: criarPedido,
    relatorioDashboard: relatorioDashboard,
    salvarConfiguracoes: salvarConfiguracoes,
    salvarExtra: salvarExtra,
    excluirExtra: excluirExtra,
    salvarProduto: salvarProduto,
    excluirProduto: excluirProduto,
    toggleDisponibilidade: toggleDisponibilidade
  };
}();
