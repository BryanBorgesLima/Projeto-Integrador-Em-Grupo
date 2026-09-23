<?php
// A seleção/personalização de produto agora acontece direto no cardápio (menu.php),
// através do modal de personalização. Esse arquivo existe só pra não quebrar links antigos:
// produto.php?id=5 → abre o cardápio já com o modal daquele item aberto.
$id = (int)($_GET['id'] ?? 0);
header('Location: menu.php' . ($id ? '?open=' . $id : ''));
exit;
