<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/../log/Log.php";
require_once __DIR__ . "/../error/ErrorHandler.php";

use model\User;
use Log;
use errorhandler\ErrorHandler;

class UserController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  public function getUserInfo($userId)
  {
    $result = User::getById($userId);

    if (!$result) {
      $this->error->throwUserNotFound();
    }

    echo json_encode(["status" => "success", "data" => $result]);
  }

  public function getAllUser($userId){
    $user = User::getById($userId);

    if (!$user) {
      $this->error->throwUserNotFound();
    }

    if($user["role"] !== "admin"){
      Log::auth("Invalid role[get all user]",$userId);
      $this->error->addStatusAndError("unauthorized", "message", "権限がありません");
      $this->error->throwErrors();
    }

    $result = User::getAll();

    echo json_encode($result);
  }

  public function createUser()
  {
    if ($this->data["password"] !== $this->data["confirm"]) {
      $this->error->addStatusAndError("invalid", "message", "確認用パスワードが異なります");
      $this->error->throwErrors();
    }

    if ($this->data["inviteCode"] !== "trampoline123") {
      Log::event("user","Invalid invite code");
      $this->error->addStatusAndError("invalid", "message", "招待コードが無効です");
      $this->error->throwErrors();
    }

    $result = User::getByEmail($this->data['email']);
    if ($result) {
      $this->error->addStatusAndError("invalid", "message", "すでに存在しているメールアドレスです[code:302]");
      $this->error->throwErrors();
    }

    $hashedPassword = password_hash($this->data["password"], PASSWORD_DEFAULT);
    $postData = [
      "email" => $this->data["email"],
      "name" => $this->data["name"],
      "password" => $hashedPassword,
      "organization" => empty($this->data["organization"]) ? "" : $this->data["organization"],
    ];

    $result = User::create($postData);
    if ($result) {
      Log::event("user","Create user", ["name" => $this->data["name"]]);
      echo json_encode(["status" => "success", "data" => $result]);
    } else {
      Log::event("user","create error[user]");

      $this->error->throwPostFailure();
    }
  }

  public function updateUser($userId)
  {
    $this->checkUser($userId);

    $result = User::patch($this->data, $userId);
    if ($result) {
      echo json_encode(["status" => "success", "data" => $result]);
    } else {
      Log::event("user","update error[user]", ["userId" => $userId]);

      $this->error->throwPatchFailure();
    }
  }

  public function deleteUser($userId)
  {
    $this->checkUser($userId);

    $result = User::del($userId);
    if ($result) {
      Log::event("user","Delete user", ["userId" => $userId]);
      echo json_encode(["status" => "success", "data" => null]);
    } else {
      Log::event("user","delete error[user]", ["userId" => $userId]);

      $this->error->throwDeleteFailure();
    }
  }
}