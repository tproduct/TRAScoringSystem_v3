<?php
require_once __DIR__."/header.php";
require_once __DIR__."/config/config.php";
require_once __DIR__."/routes/Router.php";
require_once __DIR__."/helper.php";

$router = new Router();
require_once __DIR__."/routes/routes.php";

$requestMethod = $_SERVER["REQUEST_METHOD"];
$requestUri = $_GET["url"] ?? "";

$router->handleRequest($requestMethod, $requestUri);