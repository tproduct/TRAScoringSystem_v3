<?php
require_once __DIR__ ."/../../vendor/autoload.php";
require_once __DIR__ .'/generateToken.php';
require_once __DIR__ .'/setToken.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function verifyToken()
{
  $accessToken = $_COOKIE["access_token"] ?? null;

  if ($accessToken === null || $accessToken !== $_SESSION["accessToken"]) {
    http_response_code(401);
    echo json_encode(["error" => "this Unauthorized"]);
    exit;
  }

  try {
    $decoded = JWT::decode($accessToken, new Key($_ENV['JWT_SECRET'], "HS256"));

    //期限の確認
    if ($decoded->exp < time()) {
      throw new Exception('Token expired');
    }

    $user = [
      "user_id" => $decoded->userId
    ];
  } catch (Exception $e) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
  }
}
