<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/Monitor.php";
require_once __DIR__ . "/../error/ErrorHandler.php";

use model\Monitor;
use errorhandler\ErrorHandler;

class MonitorController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  public function getMonitor($monitorId)
  {
    $result = Monitor::getById($monitorId);

    if (!$result) {
      //要修正
      $this->error->throwUserNotFound();
    }

    echo json_encode(["status" => "success", "data" => $result]);
  }

  public function createMonitor($userId)
  {
    $this->checkUser($userId);
    $this->data["user_id"] = $userId;

    $result = Monitor::create($this->data);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      $this->error->throwPostFailure();
    }
  }

  public function updateMonitor($userId, $monitorId)
  {
    $this->checkUser($userId);
    $this->data["user_id"] = $userId;

    $result = Monitor::patch($this->data, $monitorId);
    if($result){
      echo json_encode(["status" => "success", "data" => $result]);
    }else{
      $this->error->throwPatchFailure();
    }
  }
}