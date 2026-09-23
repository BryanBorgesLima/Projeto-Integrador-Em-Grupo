<?php
require_once __DIR__ . '/../php/functions.php';

$_SESSION = [];
session_destroy();

json_response(['sucesso' => true]);
