<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/User.php";
require_once __DIR__ . "/../error/ErrorHandler.php";

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

    if (!$info) {
      $this->error->throwUserNotFound();
    }

    $monitor = User::getMonitor($info["id"]);

    echo json_encode(["status" => "success", "data" => ["info" => $info, "monitor" => $monitor]]);
  }
}