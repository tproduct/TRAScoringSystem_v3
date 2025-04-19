<?php

namespace controller;
require_once __DIR__ . "/BaseController.php";
require_once __DIR__ . "/../models/Order.php";
require_once __DIR__ . "/../models/Competition.php";
require_once __DIR__ . "/../error/ErrorHandler.php";

use model\Order;
use model\Competition;
use errorhandler\ErrorHandler;

class OrderController extends BaseController
{
  private $data = [];
  private $error;

  public function __construct($data)
  {
    $this->data = $data;
    $this->error = new ErrorHandler();
  }

  public function getOrders($userId, $competitionId)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    // $result = Order::getAll($userId);

    // echo json_encode(["status" => "success", "data" => $result]);
  }

  public function syncOrder($userId, $competitionId)
  {
    $this->checkUserAndCompetition($userId, $competitionId);

    $competition = Competition::getById($competitionId);
    $compType = $competition["type"];

    $result = Order::syncData($compType, $competitionId, $this->data);

    if ($result) {
      echo json_encode(["status" => "success", "data" => $result]);
    } else {
      $this->error->throwSyncOrderFailure();
    }
  }

  
}