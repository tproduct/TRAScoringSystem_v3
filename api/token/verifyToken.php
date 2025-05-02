<?php
require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . '/generateToken.php';
require_once __DIR__ . '/setToken.php';
require_once __DIR__ . "/../error/ErrorHandler.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use errorhandler\ErrorHandler;

function verifyToken($requiredRoles)
{
  $error = new ErrorHandler();

  $accessToken = $_COOKIE["access_token"] ?? null;

  if ($accessToken === null || $accessToken !== $_SESSION["accessToken"]) {
    $error->addStatusAndError("unauthorized", "message", "トークンが無効です");
    $error->throwErrors();
    exit;
  }

  try {
    $decoded = JWT::decode($accessToken, new Key($_ENV['JWT_SECRET'], "HS256"));

    //期限の確認
    if ($decoded->exp < time()) {
      $error->addStatusAndError("unauthorized", "message", "トークンの期限が切れています");
      $error->throwErrors();
    }

    // ロール確認
    if ($requiredRoles && !in_array($decoded->role,$requiredRoles)) {
      $error->addStatusAndError("unauthorized", "message", "権限がありません");
      $error->throwErrors();
      exit;
    }
  } catch (Exception $e) {
    $error->addStatusAndError("unauthorized", "message", "認証できません");
    $error->throwErrors();
    exit;
  }
}
