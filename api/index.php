<?php
require_once __DIR__."/header.php";
require_once __DIR__."/config/config.php";
require_once __DIR__."/routes/Router.php";
require_once __DIR__."/helper.php";
require_once __DIR__."/token/refresh_token.php";

$router = new Router();
require_once __DIR__."/routes/routes.php";
require_once __DIR__."/routes/authRoutes.php";

$requestMethod = $_SERVER["REQUEST_METHOD"];
$requestUri = $_GET["url"] ?? "";
session_start();


if(strpos($requestUri, "refresh_token")) refreshToken();

$router->handleRequest($requestMethod, $requestUri);