<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/../models/Competition.php";
require_once __DIR__ . "/../error/ErrorHandler.php";
require_once __DIR__ . '/../token/generateToken.php';
require_once __DIR__ . '/../token/setToken.php';
require_once __DIR__ . '/../log/Log.php';

use model\User;
use model\Competition;
use errorhandler\ErrorHandler;
use Log;

class AuthController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  public function handleLogin($userId, $role)
  {
    $accessToken = generateAccessToken($userId, $role);
    $refreshToken = generateRefreshToken($userId, $role);

    //セッションにアクセストークンを格納
    $_SESSION['accessToken'] = $accessToken;

    // トークンを `HttpOnly` クッキーとして保存
    setAccessToken($accessToken);
    setRefreshToken($refreshToken);

    Log::auth("Login Success", $userId, ["role" => $role]);
  }

  public function userLogin()
  {
    $info = User::getAllByEmail($this->data["email"]);

    if (!$info || !password_verify($this->data["password"], $info['password'])) {
      Log::auth("User Login Failuer", null, ["email" => $this->data["email"]]);
      $this->error->addStatusAndError("invalid", "message", "メールアドレスかパスワードが異なります");
      $this->error->throwErrors();
    }

    $monitor = User::getMonitor($info["id"]);

    $this->handleLogin($info["id"], $info["role"]);

    unset($info["password"]);
    echo json_encode(["status" => "success", "data" => ["info" => $info, "monitor" => $monitor]]);
  }

  public function judgeLogin()
  {
    $competition = Competition::getById($this->data["competitionId"]);

    if (!$competition || !password_verify($this->data["password"], $competition['judge_password'])) {
      Log::auth("Judge Login Failuer", $competition['id']);
      $this->error->addStatusAndError("invalid", "message", "大会IDかパスワードが異なります");
      $this->error->throwErrors();
    }

    $this->handleLogin($competition["user_id"], "judge");

    echo json_encode(["status" => "success", "data" => ["info" => ["id" => $competition["user_id"], "role" => "judge"]]]);

  }

  public function logout($userId)
  {
    session_unset();
    session_destroy();

    setcookie('access_token', '', time() - 3600, "/");
    setcookie('refresh_token', '', time() - 3600, "/");
    Log::auth("Logout", $userId);
  }
}