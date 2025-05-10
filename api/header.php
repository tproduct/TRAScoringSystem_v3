<?php

$allowed_origins = [
  'http://localhost:5173',
  'https://trascoringsystemv3.tproduct.net',
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
  header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
  header("Access-Control-Allow-Credentials: true"); // 必要なら
}

// header('Access-Control-Allow-Origin: http://localhost:5173'); // 必要に応じて * を特定のドメインに変更
// header('Access-Control-Allow-Origin: https://trascoringsystemv3.tproduct.net'); // 必要に応じて * を特定のドメインに変更
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS'); // 許可するHTTPメソッド
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // 許可するヘッダー
header('Content-Type: application/json'); // レスポンスのコンテンツタイプ
header('X-FRAME-OPTIONS: SAMEORIGIN');
header('Access-Control-Allow-Credentials: true');
date_default_timezone_set("Asia/Tokyo");