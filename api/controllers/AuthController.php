<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/../error/ErrorHandler.php";
require_once __DIR__ .'/../token/generateToken.php';
require_once __DIR__ .'/../token/setToken.php';

use model\User;
use errorhandler\ErrorHandler;

class AuthController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  public function login()
  {
    $info = User::getByEmail($this->data["email"]);

    if (!$info || !password_verify($this->data["password"], $info['password']) ){
      $this->error->addStatusAndError("invalid", "message", "メールアドレスかパスワードが異なります");
      $this->error->throwErrors();
    }

    $monitor = User::getMonitor($info["id"]);

    $accessToken = generateAccessToken($info['id'], $info['role']);
    $refreshToken = generateRefreshToken($info['id'], $info['role']);

    //セッションにアクセストークンを格納
    $_SESSION['accessToken'] = $accessToken;

    // トークンを `HttpOnly` クッキーとして保存
    setAccessToken($accessToken);
    setRefreshToken($refreshToken);

    echo json_encode(["status" => "success", "data" => ["info" => $info, "monitor" => $monitor]]);
  }
}