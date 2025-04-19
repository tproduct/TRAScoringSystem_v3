<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/../error/ErrorHandler.php";

use model\User;
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

  public function createUser()
  {
    $result = User::getByEmail($this->data['email']);
    if ($result) {
      $this->error->addStatusAndError("invalid", "message", "すでに存在しているメールアドレスです[code:302]");
      $this->error->throwErrors();
    }

    $result = User::create($this->data);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      $this->error->throwPostFailure();
    }
  }

  public function updateUser($userId)
  {
    $this->checkUser($userId);

    $result = User::patch($this->data, $userId);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      $this->error->throwPatchFailure();
    }
  }

  public function deleteUser($userId)
  {
    $this->checkUser($userId);

    $result = User::del( $userId);
    if($result){
      echo json_encode(["status" => "success", "data" => null]);
    }else{
      $this->error->throwDeleteFailure();
    }
  }
}