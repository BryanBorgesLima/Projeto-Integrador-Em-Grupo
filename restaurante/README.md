# Sapori di Luna — site + painel admin (PHP + MySQL)

## Estrutura de pastas

```
├── index.html          → entrada do site do cliente (estático)
├── admin.html           → entrada do painel admin (redireciona para pages/admin.php)
├── css/                  → estilos do site e do admin
├── js/                   → lógica do front-end (cliente e admin)
├── php/                  → conexão com o banco e funções compartilhadas
├── api/                  → endpoints que o JS chama (login, pedidos, mesas...)
├── pages/                → páginas dinâmicas em PHP (menu, produto, carrinho, checkout, sobre, admin)
└── database.sql          → schema + dados de exemplo
```

## Como rodar

1. **Banco de dados.** Importe o `database.sql` num MySQL/MariaDB:
   ```
   mysql -u root -p < database.sql
   ```
   Isso cria o banco `sapori_di_luna` do zero (apaga se já existir) com produtos, mesas, pedidos e um usuário admin de exemplo.

2. **Credenciais.** Abra `php/config.php` e ajuste host/usuário/senha se não for `root` sem senha em `localhost`.

3. **Servidor.** Qualquer servidor com PHP 7.4+ e a extensão `pdo_mysql` funciona:
   - **XAMPP/WAMP/MAMP**: coloque a pasta inteira em `htdocs` e acesse `http://localhost/sapori-di-luna/index.html`.
   - **PHP embutido** (rápido pra testar): rode `php -S localhost:8000` na raiz do projeto e acesse `http://localhost:8000/index.html`.

4. **Login do admin** (`admin.html` → `pages/admin.php`):
   - Email: `admin@saporidiluna.com`
   - Senha: `admin123`

## O que é dinâmico (vem do banco)

- Cardápio, preços e disponibilidade dos produtos.
- Mesas e status (livre / reservado / ocupado).
- Pedidos, itens e status (preparando / pronto / entregue).
- Relatórios de vendas.
- Configurações do restaurante (nome, email, horário) — usadas também na página "Sobre nós".

Marcar um produto como indisponível no admin **some do cardápio do cliente na hora**, e finalizar uma compra no site **cria um pedido de verdade** que aparece no admin.

## Observações

- A galeria de mídia do admin (aba "Mídia") só mostra uma prévia local do arquivo escolhido — não há upload real para o servidor.
- Sem PHP/MySQL configurados, as páginas em `pages/*.php` não vão funcionar (é diferente da versão anterior, que era só HTML/JS estático).
