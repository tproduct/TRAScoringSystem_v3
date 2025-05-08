<?php
require_once __DIR__ . "/../../vendor/autoload.php";
require_once __DIR__ . '/../models/Auth.php';
require_once __DIR__ . '/../lgo/Log.php';
require_once __DIR__ . '/generateToken.php';
require_once __DIR__ . '/setToken.php';

use model\Auth;
use Log;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function refreshToken()
{
  if ($_SERVER["REQUEST_METHOD"] !== "POST")
    exit;

  $refreshToken = $_COOKIE["refresh_token"] ?? null;

  if (!$refreshToken) {
    Log::auth("No refresh token");
    http_response_code(401);
    echo json_encode(["error" => "No refresh token"]);
    exit;
  }

  //検証
  $user = Auth::getByToken($refreshToken);
  $decoded = JWT::decode($refreshToken, new Key($_ENV['JWT_SECRET'], "HS256"));

  if ($user) {
    //新しいアクセストークンを発行
    $newAccessToken = generateAccessToken($user["user_id"], $decoded->role);
    setAccessToken($newAccessToken);

    //セッションにアクセストークンを格納
    $_SESSION['accessToken'] = $newAccessToken;

    echo json_encode(["access_token" => $newAccessToken]);
  } else {
    Log::auth("Invalid refresh token");
    http_response_code(401);
    echo json_encode(["error" => "Invalid refresh token"]);
  }
  exit;
}
