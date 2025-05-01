<?php
function setAccessToken($accessToken){
  setcookie("access_token", $accessToken, [
    "expires" => time() + 60 * 15,
    "path" => "/",
    // "domain" => "",
    "secure" => true,
    "httponly" => true,
    "samesite" => "Strict",
  ]);
}

function setRefreshToken($refreshToken){
  setcookie("refresh_token",$refreshToken, [
    'expires' => time() + 60 * 60 * 24,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Strict',
  ]);
}