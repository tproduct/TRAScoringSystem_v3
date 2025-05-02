<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . "/../models/Auth.php";

use Firebase\JWT\JWT;
use model\Auth;

function generateAccessToken($userId, $role)
{
  $payload = [
    'iss' => $_ENV["JWT_ISS"], // 発行者
    'aud' => $_ENV["JWT_AUD"], // 対象者
    'iat' => time(),            // 発行日時
    'exp' => time() + 60 * 60,     // 1時間後に有効期限切れ
    'userId' => $userId,
    'role' => $role
  ];

  return JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');
}

function generateRefreshToken($userId, $role)
{
  $payload = [
    'iss' => $_ENV["JWT_ISS"],
    'aud' => $_ENV["JWT_AUD"],
    'iat' => time(),
    'exp' => time() + 604800, // 1週間後に有効期限切れ
    'userId' => $userId,
    'role' => $role
  ];

  $refreshToken = JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');

  // データベースに保存
  Auth::create([
    "user_id" => $userId,
    "token" => $refreshToken,
    "expires_at" => $expiresAt = date('Y-m-d H:i:s', $payload['exp'])
  ]);

  return $refreshToken;
}